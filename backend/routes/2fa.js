// backend/routes/2fa.js
const express       = require("express");
const speakeasy     = require("speakeasy");
const qrcode        = require("qrcode");
const { PrismaClient } = require("@prisma/client");
const prisma        = new PrismaClient();
const auth          = require("../authMiddleware");

const router = express.Router();

// Protect all 2FA routes
router.use(auth);

/**
 * POST /2fa/setup
 *  - Generates a TOTP secret for the logged-in user
 *  - Stores it in the DB (but not yet “enabled”)
 *  - Returns a QR-code data URI for the user to scan
 */
router.post("/setup", async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `YourAppName (${req.user.email})`
    });

    // Save secret to user record (base32)
    await prisma.user.update({
      where: { id: req.user.id },
      data:  { twoFactorSecret: secret.base32 }
    });

    // Turn the otpauth URL into a QR code image
    const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ qrDataUrl });
  } catch (err) {
    console.error("2FA setup error:", err);
    res.status(500).json({ error: "Could not generate 2FA setup info" });
  }
});

/**
 * POST /2fa/verify
 *  - Verifies a TOTP token against the user’s stored secret
 *  - If valid, flips twoFactorEnabled → true
 */
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: "2FA not initialized" });
    }

    const verified = speakeasy.totp.verify({
      secret:   user.twoFactorSecret,
      encoding: "base32",
      token,
      window:   1
    });

    if (!verified) {
      return res.status(400).json({ error: "Invalid 2FA code" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data:  { twoFactorEnabled: true }
    });

    res.json({ success: true });
  } catch (err) {
    console.error("2FA verify error:", err);
    res.status(500).json({ error: "Could not verify 2FA code" });
  }
});

/**
 * POST /2fa/login
 *  - Alternate login endpoint that accepts email/password/token
 *  - If 2FA is enabled for the user, token is required
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, token } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    // 1) Check email/password
    if (!user || !checkPassword(password, user.password)) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 2) If 2FA is on, require token
    if (user.twoFactorEnabled) {
      if (!token) {
        return res.status(206).json({ needs2fa: true });
      }
      const pass2fa = speakeasy.totp.verify({
        secret:   user.twoFactorSecret,
        encoding: "base32",
        token,
        window:   1
      });
      if (!pass2fa) {
        return res.status(400).json({ error: "Invalid 2FA code" });
      }
    }

    // 3) Issue your JWT/session
    const jwt = generateJwtFor(user);
    res.json({ token: jwt });
  } catch (err) {
    console.error("2FA login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
