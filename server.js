const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let balance = 100000;
let orders = [];

const services = [
  {
    id: 1,
    name: "Instagram Followers Demo",
    platform: "Instagram",
    rate: 15000
  },
  {
    id: 2,
    name: "Instagram Likes Demo",
    platform: "Instagram",
    rate: 20000
  },
  {
    id: 3,
    name: "TikTok Views Demo",
    platform: "TikTok",
    rate: 25000
  },
  {
    id: 4,
    name: "YouTube Subscribers Demo",
    platform: "YouTube",
    rate: 15000
  }
];

app.get("/api/services", (req, res) => {
  res.json(services);
});

app.get("/api/balance", (req, res) => {
  res.json({ balance });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/deposit", (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount < 1000) {
    return res.status(400).json({
      error: "Nominal tidak valid"
    });
  }

  balance += amount;

  res.json({
    ok: true,
    balance,
    message: "Deposit demo berhasil"
  });
});

app.post("/api/order", (req, res) => {
  const service = services.find(
    x => x.id === Number(req.body.service_id)
  );

  const quantity = Number(req.body.quantity);
  const link = String(req.body.link || "").trim();

  if (!service || !Number.isInteger(quantity) || quantity < 1 || !link) {
    return res.status(400).json({
      error: "Data order tidak valid"
    });
  }

  const total = Math.ceil(
    quantity / 1000 * service.rate
  );

  if (balance < total) {
    return res.status(400).json({
      error: "Saldo tidak cukup"
    });
  }

  balance -= total;

  const order = {
    id: "ORD" + Date.now().toString().slice(-8),
    service: service.name,
    link,
    quantity,
    total,
    status: "pending"
  };

  orders.unshift(order);

  res.json({
    ok: true,
    order,
    balance
  });
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, () => {
  console.log(`SMM Panel berjalan di port ${PORT}`);
});
