
const fileUpload = require('express-fileupload');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');

// ⬇️ NEW: Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // ✅ ADD THIS
const { router: buildsRoutes, builds } = require('./builds');
const statsRouter = require("./stats"); // adjust path if needed
const logsRouter = require("./routes/logs");






const app = express();
const server = http.createServer(app);

// 🔧 Middleware setup
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// API routes
app.use('/api', authRoutes);               // Auth endpoints
app.use('/api/admin', adminRoutes);        // ✅ Admin-only endpoints
app.use('/api/builds', buildsRoutes);      // PC builds


// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/stats", statsRouter.router);

// File upload route
app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded');
  }

  const uploadedFile = req.files.file;
  const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

  uploadedFile.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ filename: uploadedFile.name });
  });
});

app.get("/uploads", (req, res) => {
  const uploadDir = path.join(__dirname, "uploads");
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Could not list files" });
    res.json({ files });
  });
});


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


const { router: monitoredRouter } = require("./monitor");
app.use("/api/monitored", monitoredRouter);
app.use("/api/logs", logsRouter);



const wss = new WebSocketServer({ server });

const CPUS = ["Intel", "AMD"];
const RAMS = ["16GB", "32GB"];
const GPUS = ["RTX 5080", "RTX 5090", "GTX 690"];
const CASES = ["case1.jpg", "case2.jpg", "case3.jpg", "case4.jpg"];

const prices = {
  Intel: 565,
  AMD: 550,
  "RTX 5090": 2100,
  "RTX 5080": 1595,
  "GTX 690": 0,
  "16GB": 200,
  "32GB": 375,
  "case1.jpg": 200,
  "case2.jpg": 235,
  "case3.jpg": 185,
  "case4.jpg": 230,
};

function generateRandomBuild() {
  const cpu = CPUS[Math.floor(Math.random() * CPUS.length)];
  const ram = RAMS[Math.floor(Math.random() * RAMS.length)];
  const gpu = GPUS[Math.floor(Math.random() * GPUS.length)];
  const pcCase = CASES[Math.floor(Math.random() * CASES.length)];
  const price = prices[cpu] + prices[ram] + prices[gpu] + prices[pcCase];
  return { cpu, ram, gpu, case: pcCase, price };
}

// Broadcast builds every 5 seconds
/*setInterval(() => {
  const build = generateRandomBuild();
  builds.push(build);
  const json = JSON.stringify(build);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(json);
    }
  });
}, 5000);*/
