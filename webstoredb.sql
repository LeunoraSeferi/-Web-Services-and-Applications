CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id)
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id),
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    address TEXT
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE sizes (
    id SERIAL PRIMARY KEY,
    size VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE colors (
    id SERIAL PRIMARY KEY,
    color VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE gender (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    category_id INT REFERENCES categories(id),
    brand_id INT REFERENCES brands(id),
    size_id INT REFERENCES sizes(id),
    color_id INT REFERENCES colors(id),
    gender_id INT REFERENCES gender(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    discount_percent INT NOT NULL,
    start_date DATE,
    end_date DATE,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id),
    order_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'Pending'
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    total_earnings DECIMAL(12,2),
    top_product_id INT REFERENCES products(id),
    total_orders INT,
    created_by INT REFERENCES users(id)
);
