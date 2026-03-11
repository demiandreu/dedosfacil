-- Add billing fields to orders for invoice generation
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_document VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_address TEXT;
