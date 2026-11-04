const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
Sentry.init({
  dsn: "https://15e93df7d82fd0c3120@o47664000.ingest.us.sentry.io/111160192xxx",
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
