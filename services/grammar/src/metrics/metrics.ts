import client from 'prom-client';

export const SERVICE_NAME = 'grammar';
export const HTTP_DURATION_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];

// Enable default Node.js metrics (GC, heap, event loop)
client.register.setDefaultLabels({ service_name: SERVICE_NAME });
client.collectDefaultMetrics();

export const grammarMetrics = {
  httpRequestsTotal: new client.Counter({
    name: 'grammar_http_requests_total',
    help: 'Total HTTP requests to grammar-service',
    labelNames: ['method', 'route', 'status_code'],
  }),

  httpRequestDuration: new client.Histogram({
    name: 'grammar_http_request_duration_seconds',
    help: 'HTTP request duration for grammar-service',
    labelNames: ['method', 'route', 'status_code'],
    buckets: HTTP_DURATION_BUCKETS,
  }),

  listTotal: new client.Counter({
    name: 'grammar_list_total',
    help: 'Total grammar point list requests',
    labelNames: ['language'],
  }),

  drillsGenerated: new client.Counter({
    name: 'grammar_drills_generated_total',
    help: 'Total drill questions generated',
  }),

  pointsCreated: new client.Counter({
    name: 'grammar_points_created_total',
    help: 'Total grammar points created via admin API',
  }),
};

export function getMetrics(): Promise<string> {
  return client.register.metrics();
}
