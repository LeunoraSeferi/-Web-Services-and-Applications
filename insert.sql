-- Roles
INSERT INTO roles (role_name) VALUES
  ('admin'), ('advanced_user'), ('simple_user')
ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (name) VALUES
  ('Shirts'), ('Pants'), ('Jackets'), ('Accessories')
ON CONFLICT DO NOTHING;

-- Brands
INSERT INTO brands (name) VALUES
  ('Nike'), ('Adidas'), ('Zara'), ('H&M')
ON CONFLICT DO NOTHING;

-- Sizes
INSERT INTO sizes (size) VALUES
  ('S'), ('M'), ('L'), ('XL')
ON CONFLICT DO NOTHING;

-- Colors
INSERT INTO colors (color) VALUES
  ('White'), ('Black'), ('Blue'), ('Red')
ON CONFLICT DO NOTHING;

-- Gender / person groups
INSERT INTO gender (type) VALUES
  ('Men'), ('Women'), ('Children'), ('Unisex')
ON CONFLICT DO NOTHING;


