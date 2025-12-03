import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// 👇 ESTA ROTA PRECISA EXISTIR
app.post("/api/webhook", (req, res) => {
  console.log("Webhook recebido:", req.body); // <-- É isso que deve aparecer
  res.status(200).send("ok");
});

app.listen(8081, () => {
  console.log("Servidor backend rodando em http://localhost:8081");
});
