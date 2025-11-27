
CREATE EXTENSION IF NOT EXISTS pgcrypto;
SELECT * FROM pg_extension WHERE extname='pgcrypto';


INSERT INTO users (username, password, role_id)
VALUES (
  'admin',
  crypt('nora246!', gen_salt('bf')),
  (SELECT id FROM roles WHERE role_name='admin')
)
RETURNING id, username;


INSERT INTO users (username, password, role_id)
VALUES (
  'admin2',
  crypt('Nora123!', gen_salt('bf')),
  (SELECT id FROM roles WHERE role_name='admin')
)
RETURNING *;


SELECT * FROM users;

SELECT * FROM users;
SELECT * FROM clients;
SELECT * FROM orders;
SELECT * FROM order_items;

DELETE FROM users WHERE username='admin';


SELECT * FROM users WHERE username='admin2';
SELECT * FROM clients WHERE user_id = (SELECT id FROM users WHERE username='admin2');
SELECT * FROM orders WHERE client_id = (SELECT id FROM clients WHERE email='admin2@hotmail.com');
SELECT * FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE client_id = (SELECT id FROM clients WHERE email='admin2@hotmail.com'));

