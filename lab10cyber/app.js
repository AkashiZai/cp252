const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Sentry = require('@sentry/node');

const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const apiRoutes = require('./routes/api');
const vulnRoutes = require('./routes/vuln'); // TRAINING ONLY

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', itemRoutes);
app.use('/categories', categoryRoutes);
app.use('/api', apiRoutes);
app.use('/api', vulnRoutes); // TRAINING ONLY - deliberately vulnerable


if (process.env.TRAINING_VULNS !== 'off') {
  console.log('\x1b[31m%s\x1b[0m', `
  ██████  WARNING ██████
  This is a DELIBERATELY VULNERABLE application for security education.
  It must NEVER be exposed to a real network or the internet.
  Set TRAINING_VULNS=off to disable all vulnerable routes (fixed version).`);
}

// 2. STEP B: The 404 Catch-All Middleware
// (Place this after all valid routes)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); 
});

// 3. STEP A (Updated for Sentry v8): Sentry's Express Error Handler
// (Place this after the 404 middleware)
app.use(
  Sentry.expressErrorHandler({
    shouldHandleError(error) {
      // Capture both 404 and 500 errors
      if (error.status === 404 || error.status === 500) {
        return true;
      }
      return false;
    },
  })
);


const PORT = process.env.PORT || 3000;
// Guardrail: bind to loopback by default so the vulnerable app is only
// reachable from the training machine. Override with PUBLIC_BIND=1 in an
// isolated lab network only.
const BIND = process.env.PUBLIC_BIND ? '0.0.0.0' : '127.0.0.1';
app.listen(PORT, BIND, () => {
  console.log(`Server running on http://${BIND}:${PORT}`);
});
