package com.fullstock.movement.service;

import com.fullstock.common.enums.MovementType;
import com.fullstock.common.exception.BusinessException;
import com.fullstock.common.exception.ResourceNotFoundException;
import com.fullstock.movement.dto.MovementRequest;
import com.fullstock.movement.dto.MovementResponse;
import com.fullstock.movement.entity.StockMovement;
import com.fullstock.movement.repository.StockMovementRepository;
import com.fullstock.product.entity.Product;
import com.fullstock.product.repository.ProductRepository;
import com.fullstock.security.AuthenticatedUser;
import com.fullstock.security.CurrentUserService;
import com.fullstock.user.entity.User;
import com.fullstock.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public MovementService(
        StockMovementRepository stockMovementRepository,
        ProductRepository productRepository,
        UserRepository userRepository,
        CurrentUserService currentUserService
    ) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<MovementResponse> list(
        MovementType type,
        Long productId,
        LocalDateTime startDate,
        LocalDateTime endDate
    ) {
        Specification<StockMovement> specification = Specification.where(null);

        if (productId != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("product").get("id"), productId));
        }
        if (type != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }
        if (startDate != null) {
            specification = specification.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("movementDate"), startDate));
        }
        if (endDate != null) {
            specification = specification.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("movementDate"), endDate));
        }

        Sort sort = Sort.by(
            Sort.Order.desc("movementDate"),
            Sort.Order.desc("id")
        );

        return stockMovementRepository.findAll(specification, sort)
            .stream()
            .map(MovementResponse::fromEntity)
            .toList();
    }

    @Transactional
    public MovementResponse registerEntry(MovementRequest request) {
        return register(MovementType.ENTRY, request);
    }

    @Transactional
    public MovementResponse registerExit(MovementRequest request) {
        return register(MovementType.EXIT, request);
    }

    @Transactional
    public MovementResponse registerLoan(MovementRequest request) {
        return register(MovementType.LOAN, request);
    }

    private MovementResponse register(MovementType type, MovementRequest request) {
        Product product = productRepository.findByIdWithLock(request.productId())
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new BusinessException("Não é possível movimentar um produto inativo");
        }

        if (request.quantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Quantidade deve ser maior que zero");
        }
        if (!isIntegerQuantity(request.quantity())) {
            throw new BusinessException("Quantidade deve ser inteira");
        }

        if (type == MovementType.LOAN && trimNullable(request.borrowerName()) == null) {
            throw new BusinessException("Nome da pessoa que pegou é obrigatório para empréstimo");
        }

        if (type == MovementType.EXIT || type == MovementType.LOAN) {
            BigDecimal balanceAfter = product.getCurrentQuantity().subtract(request.quantity());
            if (balanceAfter.compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException("Movimentação inválida: estoque ficaria negativo");
            }
            product.setCurrentQuantity(balanceAfter);
        } else {
            product.setCurrentQuantity(product.getCurrentQuantity().add(request.quantity()));
        }

        AuthenticatedUser authUser = currentUserService.getCurrentUser();
        User user = userRepository.findById(authUser.id())
            .orElseThrow(() -> new ResourceNotFoundException("Usuário autenticado não encontrado"));

        StockMovement movement = StockMovement.builder()
            .product(product)
            .type(type)
            .quantity(request.quantity())
            .movementDate(request.movementDate() == null ? LocalDateTime.now() : request.movementDate())
            .supplier(type == MovementType.ENTRY ? trimNullable(request.supplier()) : null)
            .destination(type == MovementType.EXIT ? trimNullable(request.destination()) : null)
            .borrowerName(type == MovementType.LOAN ? trimNullable(request.borrowerName()) : null)
            .notes(trimNullable(request.notes()))
            .createdBy(user)
            .build();

        productRepository.save(product);
        StockMovement saved = stockMovementRepository.save(movement);
        return MovementResponse.fromEntity(saved);
    }

    private String trimNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isIntegerQuantity(BigDecimal quantity) {
        return quantity != null && quantity.stripTrailingZeros().scale() <= 0;
    }
}
