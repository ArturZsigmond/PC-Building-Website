const express       = require("express");
const jwt           = require("jsonwebtoken");
const bcrypt        = require("bcrypt");
const speakeasy     = require("speakeasy");
const { PrismaClient } = require("@prisma/client");
const prisma        = new PrismaClient();

const router        = express.Router();
const JWT_SECRET    = process.env.JWT_SECRET; // ensure this is set in your env

// REGISTER (unchanged)
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const prismaRole = role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";

  await prisma.user.create({
    data: { email, password: hashed, role: prismaRole },
  });

  res.json({ message: "Registered successfully" });
});

// LOGIN with optional 2FA
router.post("/login", async (req, res) => {
  const { email, password, token } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // 1) Check email + password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 2) If 2FA is enabled on this account…
  if (user.twoFactorEnabled) {
    // 2a) No token provided → signal client to ask for it
    if (!token) {
      return res.status(206).json({ needs2fa: true });
    }
    // 2b) Verify the TOTP code
    const ok = speakeasy.totp.verify({
      secret:   user.twoFactorSecret,
      encoding: "base32",
      token,
      window:   1, // allow ±30s clock drift
    });
    if (!ok) {
      return res.status(401).json({ error: "Invalid 2FA code" });
    }
  }

  // 3) All checks passed → issue JWT
  const jwtToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token: jwtToken });
});

module.exports = router;