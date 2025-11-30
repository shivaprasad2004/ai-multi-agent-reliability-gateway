const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/associations');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./modules/auth/authRoutes');
const gatewayRoutes = require('./modules/gateway/gatewayRoutes');
const providerRoutes = require('./modules/providers/providerRoutes');
const modelRoutes = require('./modules/models/modelRoutes');
const agentRoutes = require('./modules/agents/agentRoutes');
const metricsRoutes = require('./modules/metrics/metricsRoutes');
const apiKeyRoutes = require('./modules/apiKeys/apiKeyRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/ai', gatewayRoutes);
app.use('/api/admin/providers', providerRoutes);
app.use('/api/admin/models', modelRoutes);
app.use('/api/admin/agents', agentRoutes);
app.use('/api/admin/metrics', metricsRoutes);
app.use('/api/admin/api-keys', apiKeyRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

