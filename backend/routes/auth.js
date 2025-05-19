const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client"); // ✅ Correct import
const prisma = new PrismaClient(); // ✅ Instantiate client

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

 // Use env in production!

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const prismaRole = role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER"; // Force valid enum

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: prismaRole,
    },
  });

  res.json({ message: "Registered successfully" });
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

module.exports = router;
