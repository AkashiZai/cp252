const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
Sentry.init({
  dsn: "I said gg 5 time"
,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
  // Enables Tracing.
  // Set to 1.0 to capture 100% of spans for tracing.
  // We recommend reducing this value in production.
  tracesSampleRate: 1.0,
  // Enables Profiling for every session.
  profileSessionSampleRate: 1.0,
  enableLogs: true,
});
