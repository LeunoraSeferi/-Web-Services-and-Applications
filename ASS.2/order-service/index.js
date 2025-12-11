const express = require("express");
const app = express();

app.use(express.json());

app.get("/orders/health", (req, res) => {
  res.json({
    service: "order-service",
    status: "ok",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
