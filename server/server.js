const express = require('express');
const path = require('path');

const app = express();
const PORT = 9000;

// CORS ultra-permissivo - DEVE vir ANTES de tudo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), port: PORT });
});

// Carregar rotas PDF
try {
  const pdfRoutes = require('./src/routes/pdf');
  app.use('/api/pdf', pdfRoutes);
  console.log('✅ Rotas PDF carregadas');
} catch (error) {
  console.log('❌ Erro rotas:', error.message);
}

app.use('*', (req, res) => {
  console.log('❌ Rota não encontrada:', req.originalUrl);
  res.status(404).json({ error: 'Rota não encontrada: ' + req.originalUrl });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
});
