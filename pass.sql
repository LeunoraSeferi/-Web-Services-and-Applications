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
  'Nora123!',
  (SELECT id FROM roles WHERE role_name='admin')
)
RETURNING id, username;


SELECT * FROM users;
DELETE FROM users WHERE username='admin';
