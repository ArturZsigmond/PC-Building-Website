const prisma = require("../prisma/client");


const ACTION_LIMIT = 20; // adjust as needed
const CHECK_INTERVAL_MS = 60_000; // every 60s

async function monitorSuspiciousUsers() {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // past 24h

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

// Start periodic check
setInterval(monitorSuspiciousUsers, CHECK_INTERVAL_MS);
