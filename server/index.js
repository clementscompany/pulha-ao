const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Permite requisições do frontend
app.use(bodyParser.json());

// Rota para iniciar pagamento
app.post("/api/pagar", async (req, res) => {
  try {
    const payload = req.body;

    const response = await axios.post(
      "https://pagamento.ao/payment/initiate",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Retorna a resposta da API ao frontend
    res.json(response.data);

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erro ao processar o pagamento" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
