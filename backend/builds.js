const express = require('express');
const router = express.Router();
const validateBuild = require('./validate');

let builds = [];

router.get('/', (req, res) => {
  let result = builds;
  const { cpu, gpu, sort } = req.query;
  if (cpu) result = result.filter(b => b.cpu === cpu);
  if (gpu) result = result.filter(b => b.gpu === gpu);
  if (sort === '16GB') result.sort((a, b) => a.ram.localeCompare(b.ram));
  if (sort === '32GB') result.sort((a, b) => b.ram.localeCompare(a.ram));
  res.json(result);
});

router.post('/', validateBuild, (req, res) => {
  const build = req.body;
  builds.push(build);
  res.status(201).json(build);
});

router.put('/:index', validateBuild, (req, res) => {
  const idx = parseInt(req.params.index);
  if (idx < 0 || idx >= builds.length) {
    return res.status(404).json({ error: 'Invalid index' });
  }
  builds[idx] = req.body;
  res.json(builds[idx]);
});

router.delete('/:index', (req, res) => {
  const idx = parseInt(req.params.index);
  if (idx < 0 || idx >= builds.length) {
    return res.status(404).json({ error: 'Invalid index' });
  }
  const deleted = builds.splice(idx, 1)[0];
  res.json(deleted);
});

router.get('/stats', (req, res) => {
  const stats = builds.reduce((acc, b) => {
    acc[b.gpu] = (acc[b.gpu] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

module.exports = {
  router,
  builds // 🧠 this is what WebSocket uses to push new builds into memory
};
