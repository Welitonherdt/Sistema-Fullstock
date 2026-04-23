package com.fullstock.report.controller;

import com.fullstock.report.dto.ReportExportResult;
import com.fullstock.report.dto.StockReportItemResponse;
import com.fullstock.report.service.ReportService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/stock")
    public ResponseEntity<List<StockReportItemResponse>> stockReport(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean criticalOnly,
        @RequestParam(required = false) Boolean includeInactive
    ) {
        return ResponseEntity.ok(reportService.stockReport(search, criticalOnly, includeInactive));
    }

    @GetMapping("/stock/export")
    public ResponseEntity<byte[]> exportStockReport(
        @RequestParam String format,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean criticalOnly,
        @RequestParam(required = false) Boolean includeInactive
    ) {
        ReportExportResult export = reportService.exportStockReport(format, search, criticalOnly, includeInactive);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
            ContentDisposition.attachment().filename(export.fileName()).build()
        );

        return ResponseEntity.ok()
            .headers(headers)
            .contentType(export.mediaType())
            .body(export.content());
    }

    @GetMapping("/critical-stock")
    public ResponseEntity<List<StockReportItemResponse>> criticalStockReport() {
        return ResponseEntity.ok(reportService.stockReport(null, true, false));
    }
}
