ALTER TABLE stock_movements
    ADD COLUMN IF NOT EXISTS borrower_name VARCHAR(180);
