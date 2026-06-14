const prisma = require('../utils/prisma');
const crypto = require('../utils/crypto');

/**
 * Controller de Atletas
 * Pattern: MVC - Controller responsável por CRUD de atletas
 */

// GET /athletes
const listAthletes = async (req, res) => {
  const { page = 1, limit = 20, position, profile, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (position) where.position = { contains: position, mode: 'insensitive' };
  if (profile) where.profile = profile;

  if (search) {
    const isNumeric = /^\d+$/.test(search);
    if (isNumeric) {
      try {
        const sqlLikePattern = `%${search}%`;
        const rawResults = await prisma.$queryRawUnsafe(
          'SELECT id FROM athletes WHERE CAST("athleteId" AS TEXT) LIKE $1',
          sqlLikePattern
        );
        const matchedIds = rawResults.map(r => r.id);
        where.id = { in: matchedIds };
      } catch (err) {
        console.error('Erro na busca raw de athleteId:', err);
        where.id = { in: [] };
      }
    } else {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { group: { contains: search, mode: 'insensitive' } },
      ];
    }
  }

  const [athletes, total] = await Promise.all([
    prisma.athlete.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { athleteId: 'asc' },
      include: {
        _count: {
          select: {
            sessions: true,
            alerts: { where: { isRead: false } },
          },
        },
        sessions: {
          where: { segmentName: 'Whole Session' },
          orderBy: { startDate: 'desc' },
          take: 1,
          select: {
            distanceM: true,
            topSpeedKph: true,
            noOfSprints: true,
            highIntensityRunM: true,
            sessionLoad: true,
            startDate: true,
          },
        },
      },
    }),
    prisma.athlete.count({ where }),
  ]);

  const decryptedAthletes = athletes.map(a => ({
    ...a,
    name: crypto.decrypt(a.name)
  }));

  return res.status(200).json({
    success: true,
    data: {
      athletes: decryptedAthletes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

// GET /athletes/:id
const getAthlete = async (req, res) => {
  const { id } = req.params;
  const { limit = 30 } = req.query;

  const athlete = await prisma.athlete.findUnique({
    where: { id: Number(id) },
    include: {
      sessions: {
        where: { segmentName: 'Whole Session' },
        orderBy: { startDate: 'desc' },
        take: Number(limit),
      },
      alerts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!athlete) {
    return res.status(404).json({
      success: false,
      message: 'Atleta não encontrado',
    });
  }

  const athleteData = {
    ...athlete,
    name: crypto.decrypt(athlete.name)
  };

  return res.status(200).json({
    success: true,
    data: athleteData,
  });
};

// GET /athletes/stats/summary
const getStats = async (req, res) => {
  const [totalAthletes, totalSessions, totalAlerts, profiles] = await Promise.all([
    prisma.athlete.count(),
    prisma.session.count({ where: { segmentName: 'Whole Session' } }),
    prisma.alert.count({ where: { isRead: false } }),
    prisma.athlete.groupBy({
      by: ['profile'],
      _count: { id: true },
    }),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      totalAthletes,
      totalSessions,
      pendingAlerts: totalAlerts,
      profileDistribution: profiles,
    },
  });
};

module.exports = { listAthletes, getAthlete, getStats };
