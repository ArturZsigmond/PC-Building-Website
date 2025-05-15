const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/heavy", async (req, res) => {
  try {
    const builds = await prisma.build.groupBy({
      by: ["gpu"],
      _avg: { price: true },
      _count: { _all: true },
      orderBy: {
        _avg: { price: "desc" }
      }
    });

    res.json(builds.map(b => ({
      gpu: b.gpu,
      avgPrice: Math.round(b._avg.price),
      count: b._count._all
    })));
  } catch (err) {
    console.error("Error computing heavy stats:", err);
    res.status(500).json({ error: "Failed to compute heavy stats." });
  }
});

module.exports = { router };
