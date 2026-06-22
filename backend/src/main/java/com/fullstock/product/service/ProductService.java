package com.fullstock.product.service;

import com.fullstock.common.exception.BusinessException;
import com.fullstock.common.exception.ResourceNotFoundException;
import com.fullstock.location.entity.Location;
import com.fullstock.location.service.LocationService;
import com.fullstock.product.dto.ProductRequest;
import com.fullstock.product.dto.ProductResponse;
import com.fullstock.product.dto.ProductStatusUpdateRequest;
import com.fullstock.product.entity.Product;
import com.fullstock.product.repository.ProductRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final LocationService locationService;

    public ProductService(ProductRepository productRepository, LocationService locationService) {
        this.productRepository = productRepository;
        this.locationService = locationService;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> list(String search, Boolean active, Boolean critical) {
        String normalizedSearch = search == null ? null : search.trim().toLowerCase(Locale.ROOT);

        return productRepository.findAll().stream()
            .filter(product -> matchesSearch(product, normalizedSearch))
            .filter(product -> active == null || active.equals(product.getActive()))
            .filter(product -> critical == null || critical.equals(isCritical(product)))
            .sorted(Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER))
            .map(ProductResponse::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return ProductResponse.fromEntity(findEntity(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        String normalizedCode = normalizeText(request.code());
        if (productRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new BusinessException("Já existe produto com este código");
        }
        validateQuantities(request.currentQuantity(), request.minimumQuantity());
        Location location = locationService.findActiveEntity(request.locationId());

        Product product = Product.builder()
            .code(normalizedCode)
            .name(request.name().trim())
            .description(trimNullable(request.description()))
            .category(trimNullable(request.category()))
            .location(location)
            .unitMeasure(request.unitMeasure().trim().toUpperCase(Locale.ROOT))
            .currentQuantity(request.currentQuantity())
            .minimumQuantity(request.minimumQuantity())
            .active(request.active() == null || request.active())
            .build();

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findEntity(id);
        String normalizedCode = normalizeText(request.code());

        if (productRepository.existsByCodeIgnoreCaseAndIdNot(normalizedCode, id)) {
            throw new BusinessException("Já existe outro produto com este código");
        }

        validateQuantities(request.currentQuantity(), request.minimumQuantity());
        Location location = locationService.findActiveEntity(request.locationId());

        product.setCode(normalizedCode);
        product.setName(request.name().trim());
        product.setDescription(trimNullable(request.description()));
        product.setCategory(trimNullable(request.category()));
        product.setLocation(location);
        product.setUnitMeasure(request.unitMeasure().trim().toUpperCase(Locale.ROOT));
        product.setCurrentQuantity(request.currentQuantity());
        product.setMinimumQuantity(request.minimumQuantity());
        product.setActive(request.active() == null || request.active());

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateStatus(Long id, ProductStatusUpdateRequest request) {
        Product product = findEntity(id);
        product.setActive(request.active());
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = findEntity(id);
        try {
            productRepository.delete(product);
        } catch (DataIntegrityViolationException ex) {
            throw new BusinessException("Produto possui movimentações e não pode ser removido");
        }
    }

    private Product findEntity(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private String trimNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void validateQuantities(BigDecimal current, BigDecimal minimum) {
        if (current == null || minimum == null) {
            throw new BusinessException("Quantidades são obrigatórias");
        }
        if (current.compareTo(BigDecimal.ZERO) < 0 || minimum.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Quantidades não podem ser negativas");
        }
        if (!isIntegerQuantity(current) || !isIntegerQuantity(minimum)) {
            throw new BusinessException("Quantidades devem ser inteiras");
        }
    }

    private boolean isIntegerQuantity(BigDecimal value) {
        return value != null && value.stripTrailingZeros().scale() <= 0;
    }

    private boolean isCritical(Product product) {
        if (product.getCurrentQuantity() == null || product.getMinimumQuantity() == null) {
            return false;
        }
        return product.getCurrentQuantity().compareTo(product.getMinimumQuantity()) <= 0;
    }

    private boolean matchesSearch(Product product, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }

        String code = safeLower(product.getCode());
        String name = safeLower(product.getName());
        String category = safeLower(product.getCategory());
        String locationCode = safeLower(product.getLocation().getCode());
        String locationName = safeLower(product.getLocation().getName());
        return code.contains(search)
            || name.contains(search)
            || category.contains(search)
            || locationCode.contains(search)
            || locationName.contains(search);
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}

