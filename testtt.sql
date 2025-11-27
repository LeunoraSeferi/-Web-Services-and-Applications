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

select * from products;

UPDATE products
SET image_url = '/images/adidaswindbreaker.jpg'
WHERE id = 3;

UPDATE products
SET image_url = '/images/adidaswindbreaker.jpg'
WHERE id = 13;


UPDATE products
SET image_url = '/images/hmwintercoat.jpg'
WHERE id = 4;


UPDATE products
SET image_url = '/images/hmwintercoat.jpg'
WHERE id = 14;


UPDATE products
SET image_url = '/images/hmwintercoat.jpg'
WHERE id = 22;

UPDATE products
SET image_url = '/images/hmwintercoat.jpg'
WHERE id = 30;

UPDATE products
SET image_url = '/images/hmwintercoat.jpg'
WHERE id = 32;


UPDATE products
SET image_url = '/images/nikecap.jpg'
WHERE id = 5;


UPDATE products
SET image_url = '/images/nikecap.jpg'
WHERE id = 15;


UPDATE products
SET image_url = '/images/nikecap.jpg'
WHERE id = 23;


UPDATE products
SET image_url = '/images/nikecap.jpg'
WHERE id = 31;


UPDATE products
SET image_url = '/images/nikecap.jpg'
WHERE id = 33;


UPDATE products
SET image_url = '/images/adidassocks.jpeg'
WHERE id = 6;

UPDATE products
SET image_url = '/images/adidassocks.jpeg'
WHERE id = 16;

UPDATE products
SET image_url = '/images/adidassocks.jpeg'
WHERE id = 24;

UPDATE products
SET image_url = '/images/Hmchinos.jpeg'
WHERE id = 7;

UPDATE products
SET image_url = '/images/Hmchinos.jpeg'
WHERE id = 17;

UPDATE products
SET image_url = '/images/Hmchinos.jpeg'
WHERE id = 25;

UPDATE products
SET image_url = '/images/zaraleggings.jpg'
WHERE id = 8;

UPDATE products
SET image_url = '/images/zaraleggings.jpg'
WHERE id = 18;

UPDATE products
SET image_url = '/images/zaraleggings.jpg'
WHERE id = 26;

UPDATE products
SET image_url = '/images/adidaspoloshirt.jpg'
WHERE id = 9;

UPDATE products
SET image_url = '/images/adidaspoloshirt.jpg'
WHERE id = 19;

UPDATE products
SET image_url = '/images/adidaspoloshirt.jpg'
WHERE id = 27;

UPDATE products
SET image_url = '/images/zara-blouse.jpg'
WHERE id = 10;


UPDATE products
SET image_url = '/images/zara-blouse.jpg'
WHERE id = 20;


UPDATE products
SET image_url = '/images/zara-blouse.jpg'
WHERE id = 28;


UPDATE products
SET image_url = '/images/nikewhitetee.jpg'
WHERE id = 11;


UPDATE products
SET image_url = '/images/nikewhitetee.jpg'
WHERE id = 11;


UPDATE products
SET image_url = '/images/zaradenimjeans.jpg'
WHERE id = 12;

UPDATE products
SET image_url = '/images/zaradenimjeans.jpg'
WHERE id = 21;

UPDATE products
SET image_url = '/images/zaradenimjeans.jpg'
WHERE id = 2;

UPDATE products
SET image_url = '/images/testtee.jpg'
WHERE id = 36;


UPDATE products
SET image_url = '/images/testtee.jpg'
WHERE id = 35;


UPDATE products
SET image_url = '/images/pumarunningshoes.jpg'
WHERE id = 29;

UPDATE products
SET image_url = '/images/pumarunningshoes.jpg'
WHERE id = 34;

UPDATE products
SET image_url = '/images/runningshoes.jpg'
WHERE id = 37;

UPDATE products
SET image_url = '/images/runningshoes.jpg'
WHERE id = 38;

UPDATE products
SET image_url = '/images/runningshoes.jpg'
WHERE id = 39;

UPDATE products
SET image_url = '/images/updatedtee.jpg'
WHERE id = 1;

ALTER TABLE products
RENAME COLUMN image TO image_url;

select * from products;

UPDATE products SET image_url = '/images/adidaspoloshirt.jpg' WHERE image_url LIKE '%adidaspoloshirt%';

UPDATE products SET image_url = '/images/adidassocks.jpeg' WHERE image_url LIKE '%adidassocks%';

UPDATE products SET image_url = '/images/adidaswindbreaker.jpg' WHERE image_url LIKE '%windbreaker%';

UPDATE products SET image_url = '/images/Hmchinos.jpeg' WHERE image_url LIKE '%chinos%';

UPDATE products SET image_url = '/images/hmwintercoat.jpeg' WHERE image_url LIKE '%wintercoat%';

UPDATE products SET image_url = '/images/nikecap.jpg' WHERE image_url LIKE '%nikecap%' OR image_url LIKE '%Nike Cap%';

UPDATE products SET image_url = '/images/nikewhitetee.jpg' WHERE image_url LIKE '%whitetee%';

UPDATE products SET image_url = '/images/pumarunningshoes.jpg' WHERE image_url LIKE '%puma%';

UPDATE products SET image_url = '/images/runningshoes.jpg' WHERE image_url LIKE '%runningshoes%';

UPDATE products SET image_url = '/images/testtee.jpg' WHERE image_url LIKE '%testtee%';

UPDATE products SET image_url = '/images/updatedtee.jpg' WHERE image_url LIKE '%updatedtee%';

UPDATE products SET image_url = '/images/zara-blouse.jpg' WHERE image_url LIKE '%blouse%';

UPDATE products SET image_url = '/images/zaradenimjeans.jpg' WHERE image_url LIKE '%denim%';

UPDATE products SET image_url = '/images/zaraleggings.jpg' WHERE image_url LIKE '%leggings%';

SELECT id, name, image_url FROM products;

SELECT id, name, image_url 
FROM products
ORDER BY id;

SELECT id, name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id, created_at, image_url
FROM products;


select * from clients;
