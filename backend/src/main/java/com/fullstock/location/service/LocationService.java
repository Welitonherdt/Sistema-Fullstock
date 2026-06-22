package com.fullstock.location.service;

import com.fullstock.common.exception.BusinessException;
import com.fullstock.common.exception.ResourceNotFoundException;
import com.fullstock.location.dto.LocationRequest;
import com.fullstock.location.dto.LocationResponse;
import com.fullstock.location.dto.LocationStatusUpdateRequest;
import com.fullstock.location.entity.Location;
import com.fullstock.location.repository.LocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> list(String search, Boolean active) {
        String normalizedSearch = search == null ? null : search.trim().toLowerCase(Locale.ROOT);

        return locationRepository.findAll().stream()
            .filter(location -> active == null || active.equals(location.getActive()))
            .filter(location -> matchesSearch(location, normalizedSearch))
            .sorted(Comparator.comparing(Location::getName, String.CASE_INSENSITIVE_ORDER))
            .map(LocationResponse::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public LocationResponse getById(Long id) {
        return LocationResponse.fromEntity(findEntity(id));
    }

    @Transactional
    public LocationResponse create(LocationRequest request) {
        String normalizedCode = normalizeCode(request.code());
        if (locationRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new BusinessException("Já existe local com este código");
        }

        Location location = Location.builder()
            .code(normalizedCode)
            .name(request.name().trim())
            .description(trimNullable(request.description()))
            .active(request.active() == null || request.active())
            .build();

        return LocationResponse.fromEntity(locationRepository.save(location));
    }

    @Transactional
    public LocationResponse update(Long id, LocationRequest request) {
        Location location = findEntity(id);
        String normalizedCode = normalizeCode(request.code());

        if (locationRepository.existsByCodeIgnoreCaseAndIdNot(normalizedCode, id)) {
            throw new BusinessException("Já existe outro local com este código");
        }

        location.setCode(normalizedCode);
        location.setName(request.name().trim());
        location.setDescription(trimNullable(request.description()));
        location.setActive(request.active() == null || request.active());

        return LocationResponse.fromEntity(locationRepository.save(location));
    }

    @Transactional
    public LocationResponse updateStatus(Long id, LocationStatusUpdateRequest request) {
        Location location = findEntity(id);
        location.setActive(request.active());
        return LocationResponse.fromEntity(locationRepository.save(location));
    }

    @Transactional(readOnly = true)
    public Location findActiveEntity(Long id) {
        Location location = findEntity(id);
        if (!Boolean.TRUE.equals(location.getActive())) {
            throw new BusinessException("Local selecionado está inativo");
        }
        return location;
    }

    private Location findEntity(Long id) {
        return locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Localização não encontrada"));
    }

    private boolean matchesSearch(Location location, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }
        return safeLower(location.getCode()).contains(search)
            || safeLower(location.getName()).contains(search)
            || safeLower(location.getDescription()).contains(search);
    }

    private String normalizeCode(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private String trimNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}

