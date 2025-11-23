CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);


INSERT INTO roles (name) VALUES
  ('admin'),
  ('advanced'),
  ('simple');

select * from users;


SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users';


select * from roles;



-- ADMIN
INSERT INTO users (username, password, role_id)
VALUES ('adminx', crypt('admin123', gen_salt('bf')), 1);

-- ADVANCED USER
INSERT INTO users (username, password, role_id)
VALUES ('advx', crypt('adv123', gen_salt('bf')), 2);

-- SIMPLE USER
INSERT INTO users (username, password, role_id)
VALUES ('simplex', crypt('simple123', gen_salt('bf')), 3);
