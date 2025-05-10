const express = require("express");
const prisma = require("../../prisma/client");
const auth = require("../../middleware/authMiddleware");

const router = express.Router();
router.use(auth);

// GET /api/admin/monitored-users - Admin only
router.get("/monitored-users", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const users = await prisma.monitoredUser.findMany({
    include: { user: true },
  });

  res.json(users);
});

module.exports = router;
