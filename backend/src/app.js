require('dotenv').config();
require('express-async-errors');

// Fix para serialização de BigInt (necessário para o campo athleteId)
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const athleteRoutes = require('./routes/athletes');
const importRoutes = require('./routes/import');
const alertRoutes = require('./routes/alerts');

const app = express();

// ─── Middlewares globais ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AtletaTrack API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/athletes', athleteRoutes);
app.use('/import', importRoutes);
app.use('/alerts', alertRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`,
  });
});

// ─── Error Handler global ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

module.exports = app;
