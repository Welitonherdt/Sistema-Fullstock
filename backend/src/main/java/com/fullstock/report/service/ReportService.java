package com.fullstock.report.service;

import com.fullstock.common.exception.BusinessException;
import com.fullstock.inventory.dto.InventoryItemResponse;
import com.fullstock.inventory.service.InventoryService;
import com.fullstock.report.dto.ReportExportResult;
import com.fullstock.report.dto.StockReportItemResponse;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    private static final DateTimeFormatter FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
    private static final DateTimeFormatter HUMAN_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final Color HEADER_BG = new Color(26, 61, 112);
    private static final Color HEADER_TEXT = Color.WHITE;
    private static final Color ROW_BG_ALT = new Color(244, 247, 252);
    private static final Color BORDER = new Color(214, 220, 230);

    private final InventoryService inventoryService;

    public ReportService(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    public List<StockReportItemResponse> stockReport(String search, Boolean criticalOnly, Boolean includeInactive) {
        List<InventoryItemResponse> rows = inventoryService.list(search, criticalOnly, includeInactive);
        return rows.stream().map(StockReportItemResponse::fromInventory).toList();
    }

    public ReportExportResult exportStockReport(
        String format,
        String search,
        Boolean criticalOnly,
        Boolean includeInactive
    ) {
        List<StockReportItemResponse> rows = stockReport(search, criticalOnly, includeInactive);
        String normalizedFormat = format == null ? "csv" : format.trim().toLowerCase();

        return switch (normalizedFormat) {
            case "csv" -> new ReportExportResult(
                toCsv(rows).getBytes(StandardCharsets.UTF_8),
                fileName("estoque", "csv"),
                MediaType.parseMediaType("text/csv")
            );
            case "xml" -> new ReportExportResult(
                toXml(rows).getBytes(StandardCharsets.UTF_8),
                fileName("estoque", "xml"),
                MediaType.APPLICATION_XML
            );
            case "pdf" -> new ReportExportResult(
                toPdf(rows),
                fileName("estoque", "pdf"),
                MediaType.APPLICATION_PDF
            );
            default -> throw new BusinessException("Formato inválido. Use csv, xml ou pdf.");
        };
    }

    private String fileName(String base, String ext) {
        return base + "_relatorio_" + LocalDateTime.now().format(FILE_DATE_FORMAT) + "." + ext;
    }

    private String toCsv(List<StockReportItemResponse> rows) {
        StringBuilder builder = new StringBuilder();
        builder.append("codigo,nome,categoria,local_codigo,local_nome,unidade,saldo,minimo,critico,ativo\n");

        for (StockReportItemResponse row : rows) {
            builder.append(csv(row.code())).append(',')
                .append(csv(row.name())).append(',')
                .append(csv(row.category())).append(',')
                .append(csv(row.locationCode())).append(',')
                .append(csv(row.locationName())).append(',')
                .append(csv(row.unitMeasure())).append(',')
                .append(row.currentQuantity()).append(',')
                .append(row.minimumQuantity()).append(',')
                .append(Boolean.TRUE.equals(row.critical()) ? "SIM" : "NAO").append(',')
                .append(Boolean.TRUE.equals(row.active()) ? "SIM" : "NAO")
                .append('\n');
        }
        return builder.toString();
    }

    private String toXml(List<StockReportItemResponse> rows) {
        String generatedAt = LocalDateTime.now().toString();
        StringBuilder builder = new StringBuilder();
        builder.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        builder.append("<stockReport generatedAt=\"").append(xml(generatedAt)).append("\">\n");

        for (StockReportItemResponse row : rows) {
            builder.append("  <item>\n")
                .append("    <code>").append(xml(row.code())).append("</code>\n")
                .append("    <name>").append(xml(row.name())).append("</name>\n")
                .append("    <category>").append(xml(row.category())).append("</category>\n")
                .append("    <locationCode>").append(xml(row.locationCode())).append("</locationCode>\n")
                .append("    <locationName>").append(xml(row.locationName())).append("</locationName>\n")
                .append("    <unitMeasure>").append(xml(row.unitMeasure())).append("</unitMeasure>\n")
                .append("    <currentQuantity>").append(row.currentQuantity()).append("</currentQuantity>\n")
                .append("    <minimumQuantity>").append(row.minimumQuantity()).append("</minimumQuantity>\n")
                .append("    <critical>").append(row.critical()).append("</critical>\n")
                .append("    <active>").append(row.active()).append("</active>\n")
                .append("  </item>\n");
        }
        builder.append("</stockReport>");
        return builder.toString();
    }

    private byte[] toPdf(List<StockReportItemResponse> rows) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document(com.lowagie.text.PageSize.A4.rotate(), 28f, 28f, 28f, 28f);
            PdfWriter.getInstance(document, output);

            document.open();
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(80, 88, 105));
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            Font bodyBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);

            long criticalCount = rows.stream().filter(row -> Boolean.TRUE.equals(row.critical())).count();

            document.add(new Paragraph("Relatório de Estoque - FullStock", titleFont));
            document.add(new Paragraph("Gerado em: " + LocalDateTime.now().format(HUMAN_DATE_FORMAT), subtitleFont));
            document.add(new Paragraph(" "));

            PdfPTable summary = new PdfPTable(3);
            summary.setWidthPercentage(100f);
            summary.setWidths(new float[]{2f, 2f, 2f});
            summary.addCell(buildSummaryCell("Total de itens", String.valueOf(rows.size())));
            summary.addCell(buildSummaryCell("Itens críticos", String.valueOf(criticalCount)));
            summary.addCell(buildSummaryCell("Status do relatório", rows.isEmpty() ? "Sem dados" : "Pronto para impressão"));
            document.add(summary);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100f);
            table.setWidths(new float[]{1.9f, 2.8f, 2.2f, 2.2f, 1.2f, 1.2f, 1.1f});
            table.setSpacingBefore(2f);

            addHeader(table, "Código");
            addHeader(table, "Produto");
            addHeader(table, "Categoria");
            addHeader(table, "Local");
            addHeader(table, "Saldo");
            addHeader(table, "Mínimo");
            addHeader(table, "Crítico");

            int rowIndex = 0;
            for (StockReportItemResponse row : rows) {
                boolean isAlt = rowIndex % 2 == 1;
                table.addCell(buildDataCell(safe(row.code()), bodyFont, Element.ALIGN_LEFT, isAlt));
                table.addCell(buildDataCell(safe(row.name()), bodyBoldFont, Element.ALIGN_LEFT, isAlt));
                table.addCell(buildDataCell(safe(row.category()), bodyFont, Element.ALIGN_LEFT, isAlt));
                table.addCell(buildDataCell(safe(row.locationCode()) + " - " + safe(row.locationName()), bodyFont, Element.ALIGN_LEFT, isAlt));
                table.addCell(buildDataCell(row.currentQuantity().toPlainString(), bodyFont, Element.ALIGN_CENTER, isAlt));
                table.addCell(buildDataCell(row.minimumQuantity().toPlainString(), bodyFont, Element.ALIGN_CENTER, isAlt));
                table.addCell(buildDataCell(Boolean.TRUE.equals(row.critical()) ? "SIM" : "NÃO", bodyBoldFont, Element.ALIGN_CENTER, isAlt));
                rowIndex++;
            }

            document.add(table);
            document.close();
            return output.toByteArray();
        } catch (DocumentException ex) {
            throw new IllegalStateException("Falha ao gerar PDF", ex);
        } catch (Exception ex) {
            throw new IllegalStateException("Erro ao exportar relatório", ex);
        }
    }

    private void addHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, HEADER_TEXT)));
        cell.setBackgroundColor(HEADER_BG);
        cell.setBorderColor(BORDER);
        cell.setPaddingTop(8f);
        cell.setPaddingBottom(8f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private PdfPCell buildDataCell(String text, Font font, int align, boolean alternate) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorderColor(BORDER);
        cell.setPaddingTop(7f);
        cell.setPaddingBottom(7f);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        if (alternate) {
            cell.setBackgroundColor(ROW_BG_ALT);
        }
        return cell;
    }

    private PdfPCell buildSummaryCell(String label, String value) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(75, 85, 99));
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(23, 33, 52));

        Phrase phrase = new Phrase();
        phrase.add(new Phrase(label + "\n", labelFont));
        phrase.add(new Phrase(value, valueFont));

        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorderColor(BORDER);
        cell.setBackgroundColor(new Color(248, 250, 253));
        cell.setPaddingTop(8f);
        cell.setPaddingBottom(8f);
        cell.setPaddingLeft(10f);
        cell.setPaddingRight(10f);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private String csv(String value) {
        if (value == null) {
            return "";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    private String xml(String value) {
        if (value == null) {
            return "";
        }
        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;");
    }

    private String safe(String value) {
        return value == null ? "-" : value;
    }
}
