const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret123";

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
