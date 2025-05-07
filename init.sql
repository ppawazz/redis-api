CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product (name, description, price, stock)
SELECT
  'Product ' || i AS name,
  'Description for product ' || i AS description,
  round((random() * 1000 + 100)::numeric, 2) AS price,
  (random() * 100)::int + 1 AS stock
FROM generate_series(1,500) AS s(i)
ON CONFLICT DO NOTHING;