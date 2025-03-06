const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// Importações condicionais para lidar com possíveis erros
let pref, initDatabase, getAllEmpresas;
try {
    ({ pref } = require("./test.js"));
    ({ initDatabase, getAllEmpresas } = require("./database.js"));
} catch (error) {
    console.error("Erro ao importar módulos:", error);
}

app.use(express.json());

// Rota principal para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.status(200).send("Servidor está online!");
});

// Inicializa o banco de dados de forma segura
(async function() {
    try {
        if (typeof initDatabase === 'function') {
            await initDatabase();
            console.log("Banco de dados inicializado com sucesso");
        } else {
            console.log("Função initDatabase não encontrada");
        }
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
    }
})();

// Rota para buscar empresas
app.get("/empresas", async (req, res) => {
    try {
        if (typeof getAllEmpresas === 'function') {
            const empresas = await getAllEmpresas();
            res.json(empresas);
        } else {
            res.status(500).json({ error: "Função getAllEmpresas não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        res.status(500).json({ error: "Erro ao buscar empresas" });
    }
});

// Rota para executar `pref`
app.post("/executar-pref", async (req, res) => {
    const { cnpj } = req.body;
    try {
        if (typeof pref === 'function') {
            await pref(cnpj);
            res.json({ success: true, cnpj });
        } else {
            res.status(500).json({ error: "Função pref não encontrada" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
