const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Sentry = require('@sentry/node');

const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const apiRoutes = require('./routes/api');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', itemRoutes);
app.use('/categories', categoryRoutes);
app.use('/api', apiRoutes);

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
