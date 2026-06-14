const prisma = require('../utils/prisma');
const crypto = require('../utils/crypto');

/**
 * Controller de Alertas
 * Pattern: Observer — detecta anomalias e emite alertas
 */

// GET /alerts
const listAlerts = async (req, res) => {
  const { isRead, severity, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (isRead !== undefined) where.isRead = isRead === 'true';
  if (severity) where.severity = severity;

  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        athlete: {
          select: { id: true, athleteId: true, name: true, position: true, profile: true },
        },
      },
    }),
    prisma.alert.count({ where }),
  ]);

  // Descriptografia transparente do nome do atleta se ele existir
  const decryptedAlerts = alerts.map(alert => {
    if (alert.athlete) {
      return {
        ...alert,
        athlete: {
          ...alert.athlete,
          name: crypto.decrypt(alert.athlete.name),
          athleteId: alert.athlete.athleteId.toString() // Converte BigInt para string para exibição segura no JSON
        }
      };
    }
    return alert;
  });

  return res.status(200).json({
    success: true,
    data: { alerts: decryptedAlerts, total },
  });
};

// GET /alerts/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.alert.count({
      where: { isRead: false },
    });
    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('Erro ao contar alertas não lidos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao contar alertas não lidos',
      error: error.message,
    });
  }
};

// PATCH /alerts/:id/read
const markAsRead = async (req, res) => {
  const { id } = req.params;

  const alert = await prisma.alert.update({
    where: { id: Number(id) },
    data: { isRead: true },
  });

  return res.status(200).json({ success: true, data: alert });
};

module.exports = { listAlerts, getUnreadCount, markAsRead };
