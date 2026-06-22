package com.fullstock.report.dto;

import org.springframework.http.MediaType;

public record ReportExportResult(
    byte[] content,
    String fileName,
    MediaType mediaType
) {
}
