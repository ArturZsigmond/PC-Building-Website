const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/authMiddleware");

const prisma = new PrismaClient();
const router = express.Router();

// Protect all routes
router.use(auth);

// GET /api/builds
router.get("/", async (req, res) => {
  const { cpu, gpu, sort } = req.query;
  const where = { userId: req.user.userId };
  if (cpu) where.cpu = cpu;
  if (gpu) where.gpu = gpu;

  try {
    const builds = await prisma.build.findMany({
      where,
      orderBy:
        sort === "16GB"
          ? { ram: "asc" }
          : sort === "32GB"
          ? { ram: "desc" }
          : undefined,
    });
    res.json(builds);
  } catch (err) {
    console.error("Error fetching builds:", err);
    res.status(500).json({ error: "Failed to fetch builds." });
  }
});

// GET /api/builds/stats
router.get("/stats", async (req, res) => {
  try {
    const builds = await prisma.build.findMany({
      where: { userId: req.user.userId },
    });

    const stats = builds.reduce((acc, b) => {
      acc[b.gpu] = (acc[b.gpu] || 0) + 1;
      return acc;
    }, {});

    res.json(stats);
  } catch (err) {
    console.error("Error generating stats:", err);
    res.status(500).json({ error: "Failed to generate stats." });
  }
});

// POST /api/builds
router.post("/", async (req, res) => {
  const { cpu, ram, gpu, case: pcCase, price } = req.body;

  try {
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
    build: { connect: { id: build.id } },   // ✅ use relation correctly
    user: { connect: { id: req.user.userId } }
  },
});


    res.status(201).json(build);
  } catch (err) {
    console.error("Error creating build:", err);
    res.status(500).json({ error: "Failed to create build." });
  }
});

// PUT /api/builds/:id
router.put("/:id", async (req, res) => {
   const id = req.params.id; // ✅ ensure number

  try {
    const existing = await prisma.build.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }


await prisma.log.create({
  data: {
    action: "UPDATE",
    build: { connect: { id } },   // ✅ use relation correctly
    user: { connect: { id: req.user.userId } }
  },
});


    const updated = await prisma.build.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating build:", err);
    res.status(500).json({ error: "Failed to update build." });
  }
});

// DELETE /api/builds/:id
router.delete("/:id", async (req, res) => {
 const id = req.params.id;

  try {
    const existing = await prisma.build.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }



await prisma.log.create({
  data: {
    action: "DELETE",
    build: { connect: { id } },   // ✅ use relation correctly
    user: { connect: { id: req.user.userId } }
  },
});

    await prisma.build.delete({ where: { id } });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting build:", err);
    res.status(500).json({ error: "Failed to delete build." });
  }
});

module.exports = { router };
