--Generate a simple earnings/performance report and insert into reports:
INSERT INTO reports (report_type, total_earnings, top_product_id, total_orders, created_by)
VALUES (
  'earnings',
  (SELECT COALESCE(SUM(price*quantity),0) FROM order_items),
  (SELECT product_id FROM order_items GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 1),
  (SELECT COUNT(*) FROM orders),
  (SELECT id FROM users WHERE username='admin' LIMIT 1)
)
RETURNING *;


-- generate a category-wise earnings/performance report and insert into reports
INSERT INTO reports (report_type, total_earnings, top_product_id, total_orders, created_by)
VALUES (
  'category_performance',
  (SELECT COALESCE(SUM(oi.price * oi.quantity), 0)
   FROM order_items oi
   JOIN products p ON oi.product_id = p.id
   JOIN categories c ON p.category_id = c.id),
  (SELECT p.id
   FROM order_items oi
   JOIN products p ON oi.product_id = p.id
   JOIN categories c ON p.category_id = c.id
   GROUP BY p.id
   ORDER BY SUM(oi.quantity) DESC
   LIMIT 1),
  (SELECT COUNT(DISTINCT o.id)
   FROM orders o
   JOIN order_items oi ON o.id = oi.order_id
   JOIN products p ON oi.product_id = p.id
   JOIN categories c ON p.category_id = c.id),
  (SELECT id FROM users WHERE username='admin' LIMIT 1)
)
RETURNING *;
