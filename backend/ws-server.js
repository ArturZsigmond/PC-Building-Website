const builds = require('./builds').builds; // access your builds array
const wss = new WebSocketServer({ server }); // attach WebSocket to same server

// generate fake builds
const CPUS = ["Intel", "AMD"];
const RAMS = ["16GB", "32GB"];
const GPUS = ["RTX 5080", "RTX 5090", "GTX 690"];
const CASES = ["case1.jpg", "case2.jpg", "case3.jpg", "case4.jpg"];

function generateRandomBuild() {
  const cpu = CPUS[Math.floor(Math.random() * CPUS.length)];
  const ram = RAMS[Math.floor(Math.random() * RAMS.length)];
  const gpu = GPUS[Math.floor(Math.random() * GPUS.length)];
  const pcCase = CASES[Math.floor(Math.random() * CASES.length)];

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

  const totalPrice = prices[cpu] + prices[ram] + prices[gpu] + prices[pcCase];
  return { cpu, ram, gpu, case: pcCase, price: totalPrice };
}

// Broadcast every few seconds
setInterval(() => {
  const build = generateRandomBuild();
  builds.push(build); // save in memory
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(build));
    }
  });
}, 5000);
