INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Nike White Tee', 'Comfort cotton tee', 25.99, 50,
  (SELECT id FROM categories WHERE name='Shirts'),
  (SELECT id FROM brands WHERE name='Nike'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='White'),
  (SELECT id FROM gender WHERE type='Men')
)
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Zara Denim Jeans', 'Slim fit jeans', 49.99, 30,
  (SELECT id FROM categories WHERE name='Pants'),
  (SELECT id FROM brands WHERE name='Zara'),
  (SELECT id FROM sizes WHERE size='L'),
  (SELECT id FROM colors WHERE color='Blue'),
  (SELECT id FROM gender WHERE type='Women')
);

INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
-- Jackets
('Adidas Windbreaker', 'Lightweight windbreaker for all weather', 79.99, 20,
  (SELECT id FROM categories WHERE name='Jackets'),
  (SELECT id FROM brands WHERE name='Adidas'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='Black'),
  (SELECT id FROM gender WHERE type='Men')
)

INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('H&M Winter Coat', 'Warm winter coat for women', 120.50, 15,
  (SELECT id FROM categories WHERE name='Jackets'),
  (SELECT id FROM brands WHERE name='H&M'),
  (SELECT id FROM sizes WHERE size='L'),
  (SELECT id FROM colors WHERE color='Red'),
  (SELECT id FROM gender WHERE type='Women')
)
-- Accessories
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Nike Cap', 'Stylish baseball cap', 19.99, 40,
  (SELECT id FROM categories WHERE name='Accessories'),
  (SELECT id FROM brands WHERE name='Nike'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='Blue'),
  (SELECT id FROM gender WHERE type='Unisex')
)

INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Adidas Socks', 'Comfortable sports socks', 9.99, 100,
  (SELECT id FROM categories WHERE name='Accessories'),
  (SELECT id FROM brands WHERE name='Adidas'),
  (SELECT id FROM sizes WHERE size='S'),
  (SELECT id FROM colors WHERE color='White'),
  (SELECT id FROM gender WHERE type='Men')
)
-- Pants
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('H&M Chinos', 'Casual slim fit chinos', 39.99, 25,
  (SELECT id FROM categories WHERE name='Pants'),
  (SELECT id FROM brands WHERE name='H&M'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='Black'),
  (SELECT id FROM gender WHERE type='Men')
)
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Zara Leggings', 'Comfortable leggings for girls', 29.99, 30,
  (SELECT id FROM categories WHERE name='Pants'),
  (SELECT id FROM brands WHERE name='Zara'),
  (SELECT id FROM sizes WHERE size='S'),
  (SELECT id FROM colors WHERE color='Blue'),
  (SELECT id FROM gender WHERE type='Children')
)
-- Shirts
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Adidas Polo Shirt', 'Classic polo shirt for men', 45.50, 35,
  (SELECT id FROM categories WHERE name='Shirts'),
  (SELECT id FROM brands WHERE name='Adidas'),
  (SELECT id FROM sizes WHERE size='L'),
  (SELECT id FROM colors WHERE color='White'),
  (SELECT id FROM gender WHERE type='Men')
)
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES
('Zara Blouse', 'Elegant blouse for women', 55.00, 20,
  (SELECT id FROM categories WHERE name='Shirts'),
  (SELECT id FROM brands WHERE name='Zara'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='Red'),
  (SELECT id FROM gender WHERE type='Women')
);


SELECT * FROM products;

SELECT * FROM products ORDER BY id;


-- Product 3
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES (
  'Puma Running Shoes',
  'Comfortable running shoes',
  59.99,
  40,
  (SELECT id FROM categories WHERE name='Shoes'),
  (SELECT id FROM brands WHERE name='Puma'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='Black'),
  (SELECT id FROM gender WHERE type='Men')
);

-- Product 4
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES (
  'H&M Winter Coat',
  'Warm winter coat',
  120.00,
  20,
  (SELECT id FROM categories WHERE name='Jackets'),
  (SELECT id FROM brands WHERE name='H&M'),
  (SELECT id FROM sizes WHERE size='L'),
  (SELECT id FROM colors WHERE color='Grey'),
  (SELECT id FROM gender WHERE type='Women')
);

-- Product 5
INSERT INTO products (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
VALUES (
  'Nike Cap',
  'Adjustable sport cap',
  15.00,
  100,
  (SELECT id FROM categories WHERE name='Accessories'),
  (SELECT id FROM brands WHERE name='Nike'),
  (SELECT id FROM sizes WHERE size='M'),
  (SELECT id FROM colors WHERE color='Blue'),
  (SELECT id FROM gender WHERE type='Unisex')
);
