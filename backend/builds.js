const express = require("express");
const prisma = require("../prisma/client");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Require authentication for all routes
router.use(auth);

// GET /api/builds - Get all builds for the logged-in user (with optional filters)
router.get("/", async (req, res) => {
  const { cpu, gpu, sort } = req.query;
  const where = { userId: req.user.userId };
  if (cpu) where.cpu = cpu;
  if (gpu) where.gpu = gpu;

  const builds = await prisma.build.findMany({
    where,
    orderBy: sort === "16GB"
      ? { ram: "asc" }
      : sort === "32GB"
      ? { ram: "desc" }
      : undefined,
  });

  res.json(builds);
});

// GET /api/builds/stats - GPU usage stats
router.get("/stats", async (req, res) => {
  const builds = await prisma.build.findMany({
    where: { userId: req.user.userId },
  });

  const stats = builds.reduce((acc, b) => {
    acc[b.gpu] = (acc[b.gpu] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

// POST /api/builds - Create a new build
router.post("/", async (req, res) => {
  const { cpu, ram, gpu, case: pcCase, price } = req.body;

  const build = await prisma.build.create({
    data: {
      cpu,
      ram,
      gpu,
      case: pcCase,
      price,
      userId: req.user.userId,
    },
  });

  await prisma.log.create({
    data: {
      action: "CREATE",
      buildId: build.id,
      userId: req.user.userId,
    },
  });

  res.status(201).json(build);
});

// PUT /api/builds/:id - Update a build
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.build.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.user.userId) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const updated = await prisma.build.update({
    where: { id },
    data: req.body,
  });

  await prisma.log.create({
    data: {
      action: "UPDATE",
      buildId: id,
      userId: req.user.userId,
    },
  });

  res.json(updated);
});

// DELETE /api/builds/:id - Delete a build
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.build.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.user.userId) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  await prisma.build.delete({ where: { id } });

  await prisma.log.create({
    data: {
      action: "DELETE",
      buildId: id,
      userId: req.user.userId,
    },
  });

  res.json({ message: "Deleted" });
});

module.exports = { router };
