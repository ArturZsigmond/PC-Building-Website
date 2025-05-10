const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const auth = require("../authMiddleware");


// Only allow admins to access
router.use(auth);

router.get("/logs", async (req, res) => {
  try {
    // Make sure only ADMINs can access this endpoint
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    const logs = await prisma.log.findMany({
      orderBy: { timestamp: "desc" },
      include: {
        user: true,
        build: true,
      },
      take: 100 // Limit to latest 100 actions
    });

    const result = logs.map(log => ({
      email: log.user.email,
      action: log.action,
      buildId: log.buildId,
      time: log.timestamp,
    }));

    res.json(result);
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
