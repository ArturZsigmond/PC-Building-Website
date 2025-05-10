const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../authMiddleware");


const prisma = new PrismaClient();
const router = express.Router();

// Optional: Only allow admins
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      include: {
        user: {
          select: { email: true },
        },
        build: {
          select: { gpu: true },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
    });

    const formatted = logs.map(log => ({
      email: log.user.email,
      action: log.action,
      buildGpu: log.build?.gpu || "N/A",
      timestamp: log.timestamp,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
