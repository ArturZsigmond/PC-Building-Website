const express = require("express");
const { PrismaClient } = require("@prisma/client"); //  Correct import
const prisma = new PrismaClient();                  //  Instantiate client

const router = express.Router();
const ACTION_LIMIT = 20;
const CHECK_INTERVAL_MS = 60_000;

async function monitorSuspiciousUsers() {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

    const actions = await prisma.log.groupBy({
      by: ["userId"],
      where: { timestamp: { gte: since } },
      _count: { _all: true },
    });

    for (const entry of actions) {
      if (entry._count._all >= ACTION_LIMIT) {
        const userId = entry.userId;

        const alreadyMonitored = await prisma.monitoredUser.findUnique({
          where: { userId },
        });

        if (!alreadyMonitored) {
          await prisma.monitoredUser.create({
            data: {
              userId,
              reason: `Excessive activity: ${entry._count._all} actions in 24h`,
            },
          });
          console.log(`Monitored user added: ${userId}`);
        }
      }
    }
  } catch (err) {
    console.error("Monitoring error:", err);
  }
}

router.get("/", async (req, res) => {
  try {
    const entries = await prisma.monitoredUser.findMany({
      include: {
        user: true,
      },
    });

    const formatted = entries.map(entry => ({
      email: entry.user.email,
      reason: entry.reason,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch monitored users", err);
    res.status(500).json({ error: "Failed to fetch monitored users" });
  }
});

setInterval(monitorSuspiciousUsers, CHECK_INTERVAL_MS);

module.exports = { router };
