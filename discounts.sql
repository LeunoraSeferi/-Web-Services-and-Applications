
INSERT INTO discounts (product_id, discount_percent, start_date, end_date, active)
VALUES (
  (SELECT id FROM products WHERE name='Nike White Tee' LIMIT 1),
  10,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  TRUE
)
RETURNING id;


-- Discount 10% for Adidas Windbreaker (30 days)
INSERT INTO discounts (product_id, discount_percent, start_date, end_date, active)
VALUES (
  (SELECT id FROM products WHERE name='Adidas Windbreaker' LIMIT 1),
  10,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  TRUE
)
RETURNING *;

-- Discount 15% for H&M Winter Coat (60 days)
INSERT INTO discounts (product_id, discount_percent, start_date, end_date, active)
VALUES (
  (SELECT id FROM products WHERE name='H&M Winter Coat' LIMIT 1),
  15,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  TRUE
)
RETURNING *;

-- Discount 5% for Nike Cap (15 days)
INSERT INTO discounts (product_id, discount_percent, start_date, end_date, active)
VALUES (
  (SELECT id FROM products WHERE name='Nike Cap' LIMIT 1),
  5,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '15 days',
  TRUE
)
RETURNING *;

-- Discount 20% for Zara Leggings (45 days)
INSERT INTO discounts (product_id, discount_percent, start_date, end_date, active)
VALUES (
  (SELECT id FROM products WHERE name='Zara Leggings' LIMIT 1),
  20,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '45 days',
  TRUE
)
RETURNING *;

-- Discount 12% for Adidas Polo Shirt (30 days)
INSERT INTO discounts (product_id, discount_percent, start_date, end_date, active)
VALUES (
  (SELECT id FROM products WHERE name='Adidas Polo Shirt' LIMIT 1),
  12,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  TRUE
)
RETURNING *;

SELECT * FROM products;


SELECT d.id, p.name AS product_name, d.discount_percent, d.start_date, d.end_date, d.active
FROM discounts d
JOIN products p ON d.product_id = p.id
ORDER BY d.id;

SELECT d.id, p.name AS product_name, d.discount_percent
FROM discounts d
JOIN products p ON d.product_id = p.id
WHERE d.active = TRUE AND CURRENT_DATE BETWEEN d.start_date AND d.end_date;

SELECT p.name, p.price,
       COALESCE(p.price * (1 - d.discount_percent/100.0), p.price) AS discounted_price
FROM products p
LEFT JOIN discounts d ON d.product_id = p.id
WHERE p.name='Nike White Tee';



