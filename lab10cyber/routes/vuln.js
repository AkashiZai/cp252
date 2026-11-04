/**
 * ██████ DELIBERATELY VULNERABLE TRAINING ROUTES ██████
 *
 * EDUCATION ONLY — DO NOT DEPLOY THESE ROUTES TO ANY REAL OR INTERNET-EXPOSED SYSTEM.
 *
 * Each route intentionally implements one well-documented vulnerability class.
 * See README-VULNS.md for exploitation demos (curl commands) AND the secure fix.
 */
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

/**
 * Kill switch: set TRAINING_VULNS=off on startup to disable ALL vulnerable
 * routes. This lets you demonstrate the "fixed" application to the class.
 */
if (process.env.TRAINING_VULNS === 'off') {
  module.exports = router; // empty router -> all vuln routes 404
  console.warn('[TRAINING] Vulnerable routes are DISABLED (TRAINING_VULNS=off).');
  // Stop before the vulnerable routes below are defined.
  // (Top-level return is valid inside a CommonJS module wrapper.)
  return;
}

/* ------------------------------------------------------------------
 * VULN-1 | COMMAND INJECTION (CWE-78)
 * "Diagnostics" endpoint passes the raw query param to a shell.
 * Demo: curl "localhost:3000/api/tools/ping?host=8.8.8.8;id"
 * Demo: curl "localhost:3000/api/tools/ping?host=8.8.8.8%3Bcat%20package.json"
 * ------------------------------------------------------------------ */
router.get('/tools/ping', (req, res) => {
  const host = req.query.host || '';
  // INSECURE: untrusted input concatenated into a shell command
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
    res.type('text/plain').send(stdout || stderr || String(err));
  });
});

/* ------------------------------------------------------------------
 * VULN-2 | CODE INJECTION via eval (CWE-94)
 * Demo: curl "localhost:3000/api/tools/calc?expr=6%20%2A%207"
 * Demo (RCE): curl "localhost:3000/api/tools/calc?expr=require('child_process').execSync('ls').toString()"
 * ------------------------------------------------------------------ */
router.get('/tools/calc', (req, res) => {
  const expr = String(req.query.expr || '');
  try {
    // INSECURE: eval on user input -> arbitrary JavaScript execution
    const result = eval(expr);
    res.json({ expr, result: String(result) });
  } catch (e) {
    res.status(400).json({ expr, error: String(e) });
  }
});

/* ------------------------------------------------------------------
 * VULN-3 | PATH TRAVERSAL (CWE-22) — "report files"
 * Downloads any file the user names, with no containment check.
 * Demo: curl "localhost:3000/api/files/report?name=../../package.json"
 * ------------------------------------------------------------------ */
router.get('/files/report', (req, res) => {
  const name = String(req.query.name || 'summary.txt');
  const filesDir = path.join(__dirname, '..', 'data', 'reports');
  // INSECURE: "../" components are never checked or normalized against filesDir
  res.sendFile(path.join(filesDir, name), (err) => {
    if (err) res.status(404).send('file not found');
  });
});

/* ------------------------------------------------------------------
 * VULN-4 | REFLECTED XSS (CWE-79) — search echo
 * Demo (browser): http://localhost:3000/api/search?q=<h1>hi</h1>
 * ------------------------------------------------------------------ */
const Item = require('../models/Item');
router.get('/search', (req, res) => {
  const q = String(req.query.q || '');
  const items = Item.getAll().filter((i) =>
    String(i.name).toLowerCase().includes(q.toLowerCase())
  );
  // INSECURE: reflected into HTML without escaping
  const rows = items
    .map((i) => `<li><a href="/items/${i.id}">${i.name}</a></li>`)
    .join('');
  res.send(
    `<h1>Results for: "${q}"</h1><ul>${rows || '<li>No result</li>'}</ul>`
  );
});

/* ------------------------------------------------------------------
 * VULN-5 | STORED XSS (CWE-79)
 * Lives in views/items/show.ejs: comment text is interpolated unescaped,
 * and POST /api/items/:id/comments (routes/api.js) accepts it via curl.
 * Demo: curl -X POST localhost:3000/api/items/1/comments \
 *        -H 'Content-Type: application/json' \
 *        -d '{"comment":"<img src=x onerror=alert(1)>"}'
 *   -> http://localhost:3000/items/1 executes the payload for any visitor
 * FIX: render with the escaped tag in views/items/show.ejs.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
 * VULN-6 | NAIVE AUTH — plain-text token check (CWE-285, CWE-798)
 * "Admin panel" protected only by comparing a hard-coded secret in the
 * query string. Useful for teaching why URL-based checks fail.
 * Demo: curl "localhost:3000/api/admin?token=sup3rs3cr3t"
 * ------------------------------------------------------------------ */
router.get('/admin', (req, res) => {
  // INSECURE: secret embedded in source and compared with ==
  if (req.query.token != 'sup3rs3cr3t') {
    return res.status(401).send('Unauthorized');
  }
  res.json({ secret: 'Config values: DB_PASSWORD=fake-education-password' });
});

module.exports = router;
