package com.fullstock.movement.controller;

import com.fullstock.common.enums.MovementType;
import com.fullstock.movement.dto.MovementRequest;
import com.fullstock.movement.dto.MovementResponse;
import com.fullstock.movement.service.MovementService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "*")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping
    public ResponseEntity<List<MovementResponse>> list(
        @RequestParam(required = false) MovementType type,
        @RequestParam(required = false) Long productId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(movementService.list(type, productId, startDate, endDate));
    }

    @PostMapping("/entry")
    public ResponseEntity<MovementResponse> entry(@Valid @RequestBody MovementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movementService.registerEntry(request));
    }

    @PostMapping("/exit")
    public ResponseEntity<MovementResponse> exit(@Valid @RequestBody MovementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movementService.registerExit(request));
    }
}
