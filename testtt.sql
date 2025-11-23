SELECT * FROM clients;

SELECT * FROM users WHERE username='admin';

SELECT o.id, o.client_id, c.full_name AS client_name, o.order_date, o.status
FROM orders o
JOIN clients c ON o.client_id = c.id;

SELECT oi.id, oi.order_id, p.name AS product_name, oi.quantity, oi.price, (oi.quantity * oi.price) AS total_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id;

SELECT o.id AS order_id, c.full_name AS client_name,
       SUM(oi.quantity * oi.price) AS order_total,
       o.status, o.order_date
FROM orders o
JOIN clients c ON o.client_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.full_name, o.status, o.order_date;



SELECT id, username, role_id FROM users ORDER BY id;

SELECT id, name FROM products;
select * from users;

SELECT id, name FROM categories;
SELECT id, color FROM colors;
SELECT id, name, category_id, brand_id, size_id, color_id, gender_id FROM products;

SELECT id, name, category_id, brand_id, size_id, color_id, gender_id
FROM products
WHERE category_id IS NULL
   OR brand_id IS NULL
   OR size_id IS NULL
   OR color_id IS NULL
   OR gender_id IS NULL;


-- FIX Puma Running Shoes (id 29)
UPDATE products
SET category_id = 4,     -- Accessories
    brand_id = 1,        -- Nike (or change to another)
    size_id = 2,         -- M
    color_id = 2,        -- Black
    gender_id = 1        -- Men
WHERE id = 29;

-- FIX H&M Winter Coat (id 30)
UPDATE products
SET category_id = 3,     -- Jackets
    brand_id = 4,        -- H&M
    size_id = 3,         -- L
    color_id = 3,        -- Blue
    gender_id = 2        -- Women
WHERE id = 30;

-- FIX H&M Winter Coat (id 32)
UPDATE products
SET category_id = 3,     -- Jackets
    brand_id = 4,        -- H&M
    size_id = 3,         -- L
    color_id = 4,        -- Red
    gender_id = 2        -- Women
WHERE id = 32;

-- FIX Puma Running Shoes (id 34)
UPDATE products
SET category_id = 4,     -- Accessories
    brand_id = 1,        -- Nike
    size_id = 2,         -- M
    color_id = 2,        -- Black
    gender_id = 1        -- Men
WHERE id = 34;


SELECT id, name, category_id, brand_id, size_id, color_id, gender_id 
FROM products
ORDER BY id;

SELECT id, name, category_id, brand_id, size_id, color_id, gender_id 
FROM products
WHERE category_id IS NULL
   OR brand_id IS NULL
   OR size_id IS NULL
   OR color_id IS NULL
   OR gender_id IS NULL;

   SELECT p.id, p.name, b.name AS brand
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE LOWER(b.name) = 'nike';


SELECT p.id, p.name, s.size
FROM products p
JOIN sizes s ON p.size_id = s.id
WHERE s.size = 'M';


SELECT p.id, p.name, g.type
FROM products p
JOIN gender g ON p.gender_id = g.id
WHERE LOWER(g.type) = 'men';

SELECT p.id, p.name, c.name AS category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE LOWER(c.name) = 'shirts';


SELECT p.id, p.name
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN gender g ON p.gender_id = g.id
JOIN sizes s ON p.size_id = s.id
JOIN colors c ON p.color_id = c.id
WHERE LOWER(b.name)='zara'
  AND LOWER(g.type)='women'
  AND s.size='M'
  AND LOWER(c.color)='red';



SELECT * FROM brands;
SELECT p.id, p.name, b.name 
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE LOWER(b.name) = 'nike';


SELECT * FROM products WHERE id = 2;


