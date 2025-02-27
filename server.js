const express = require('express');
const cors = require('cors');
const path = require('path');
const { pref } = require('./test.js');

const app = express();
const PORT = 5500; // Usando a mesma porta do Live Server para simplicidade

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Servir arquivos estáticos da pasta atual

// Rota para disparar a automação
app.post('/api/execute-automation', async (req, res) => {
  try {
    const { empresaId } = req.body;
    if (!empresaId) {
      return res.status(400).json({ error: 'ID da empresa é obrigatório' });
    }
    
    console.log('Iniciando automação para empresa:', empresaId);
    
    // Executa a função do Playwright assincronamente
    pref(empresaId).then(() => {
      console.log('Automação completada com sucesso');
    }).catch(error => {
      console.error('Erro durante a automação:', error);
    });
    
    // Retorna sucesso imediatamente, não espera a automação terminar
    res.status(200).json({ message: 'Conectando a Profeitura de Sinop' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para verificar se o servidor está funcionando
app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}/dashboard.html`);
});