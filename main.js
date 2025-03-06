const express = require("express");
const path = require("path");
const { pref } = require("./test.js");
const { initDatabase, getAllEmpresas } = require("./database.js");
const app = express();
const PORT = process.env.PORT || 10000;

// Configurar o middleware para analisar JSON
app.use(express.json());

// Configurar o middleware para servir arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname, '/')));

// Inicializa o banco de dados
initDatabase();

// Rota principal para servir o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para buscar empresas
app.get("/empresas", async (req, res) => {
    try {
        const empresas = await getAllEmpresas();
        res.json(empresas);
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        res.status(500).json({ error: "Erro ao buscar empresas" });
    }
});

// Rota para executar `pref`
app.post("/executar-pref", async (req, res) => {
    const { cnpj } = req.body;
    try {
        await pref(cnpj);
        res.json({ success: true, cnpj });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
