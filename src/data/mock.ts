// ============================================================================
// OMNIFY API STATS & ANALYTICS MONITORING PLATFORM
// Complete, Rich, and Ultra-Detailed Mock Dataset for API Request Metrics
// ============================================================================

export interface TopStatItem {
  id: string;
  title: string;
  value: string;
  subtext: string;
  change: string;
  isPositive: boolean;
  icon: 'requests' | 'latency' | 'success' | 'errors' | 'keys' | 'bandwidth';
  badge?: string;
}

export interface ChartDataset {
  labels: string[];
  currentPeriod: number[];
  previousPeriod: number[];
  currentTotal: string;
  trendText: string;
  peakHour: string;
  peakValue: string;
}

export interface ApiEndpointItem {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  service: string;
  totalRequests: string;
  avgLatency: number; // ms
  p95Latency: number; // ms
  successRate: number; // percentage
  status: 'healthy' | 'degraded' | 'warning';
}

export interface ApiRequestLogRow {
  id: string;
  time: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  status: number;
  ip: string;
  region: string;
  apiKeyId: string;
  duration: string;
  durationMs: number;
  payloadSize: string;
}

export interface EdgeGatewayNode {
  id: string;
  name: string;
  regionCode: string;
  location: string;
  latency: number; // ms
  uptime: number; // percentage
  requestsTotal: string;
  status: 'operational' | 'degraded' | 'maintenance';
}

export interface HttpStatusItem {
  code: string;
  label: string;
  count: string;
  percentage: number;
  color: string;
}

export interface RateLimitTierItem {
  tierName: string;
  limitRate: string;
  activeConsumers: number;
  utilizationPct: number;
  throttledCount: number;
  status: 'normal' | 'congested' | 'optimal';
}

export interface LatencyPercentiles {
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  max: number;
}

// ----------------------------------------------------------------------------
// 1. TOP STATS (High-Level Key Performance Indicators)
// ----------------------------------------------------------------------------
export const initialTopStats: TopStatItem[] = [
  {
    id: 'requests',
    title: 'Total API Requests',
    value: '48.24M',
    subtext: 'Across all endpoints (24h)',
    change: '+18.4%',
    isPositive: true,
    icon: 'requests',
  },
  {
    id: 'latency',
    title: 'Avg Response Latency',
    value: '34 ms',
    subtext: 'P95: 78ms | P99: 142ms',
    change: '-6.2ms faster',
    isPositive: true,
    icon: 'latency',
  },
  {
    id: 'success',
    title: 'Global Success Rate',
    value: '99.92%',
    subtext: '48.16M HTTP 2xx passed',
    change: '+0.04%',
    isPositive: true,
    icon: 'success',
  },
  {
    id: 'errors',
    title: '4xx / 5xx Error Rate',
    value: '0.08%',
    subtext: '38,420 failed requests',
    change: '-12.8% vs last week',
    isPositive: false,
    icon: 'errors',
  },
  {
    id: 'keys',
    title: 'Active API Keys',
    value: '3,420',
    subtext: '840 active organizations',
    change: '+142 new today',
    isPositive: true,
    icon: 'keys',
  },
];

// ----------------------------------------------------------------------------
// 2. TRAFFIC & REQUEST VOLUME CHARTS (24h Timeline & Weekly Compare)
// ----------------------------------------------------------------------------
export const mainTrafficChart: {
  thisWeek: ChartDataset;
  lastWeek: ChartDataset;
} = {
  thisWeek: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    currentPeriod: [2100, 3450, 5200, 7850, 9400, 8900, 11400, 9800],
    previousPeriod: [1800, 2900, 4400, 6700, 8100, 7800, 9600, 8400],
    currentTotal: '48.24M reqs',
    trendText: '+18.4% Growth vs last period',
    peakHour: '18:00 UTC',
    peakValue: '11,400 req/s',
  },
  lastWeek: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    currentPeriod: [1800, 2900, 4400, 6700, 8100, 7800, 9600, 8400],
    previousPeriod: [1500, 2400, 3800, 5600, 7200, 6900, 8400, 7300],
    currentTotal: '40.74M reqs',
    trendText: '+14.1% vs preceding week',
    peakHour: '18:00 UTC',
    peakValue: '9,600 req/s',
  },
};

// ----------------------------------------------------------------------------
// 3. API ENDPOINTS INGESTION & PERFORMANCE
// ----------------------------------------------------------------------------
export const initialApiEndpoints: ApiEndpointItem[] = [
  {
    id: 'ep-1',
    method: 'POST',
    path: '/v1/auth/tokens/verify',
    service: 'Authentication Gateway',
    totalRequests: '14.2M',
    avgLatency: 18,
    p95Latency: 38,
    successRate: 99.98,
    status: 'healthy',
  },
  {
    id: 'ep-2',
    method: 'POST',
    path: '/v1/ai/completions/stream',
    service: 'LLM Inference Relay',
    totalRequests: '11.8M',
    avgLatency: 142,
    p95Latency: 280,
    successRate: 99.85,
    status: 'healthy',
  },
  {
    id: 'ep-3',
    method: 'GET',
    path: '/v1/users/profile',
    service: 'User Data Service',
    totalRequests: '8.6M',
    avgLatency: 24,
    p95Latency: 48,
    successRate: 100.0,
    status: 'healthy',
  },
  {
    id: 'ep-4',
    method: 'POST',
    path: '/v1/webhooks/dispatch',
    service: 'Event Notification Engine',
    totalRequests: '5.9M',
    avgLatency: 45,
    p95Latency: 92,
    successRate: 99.91,
    status: 'healthy',
  },
  {
    id: 'ep-5',
    method: 'GET',
    path: '/v1/analytics/realtime/metrics',
    service: 'Telemetry Aggregator',
    totalRequests: '4.8M',
    avgLatency: 32,
    p95Latency: 65,
    successRate: 99.95,
    status: 'healthy',
  },
  {
    id: 'ep-6',
    method: 'POST',
    path: '/v1/files/upload/presigned',
    service: 'Storage S3 Pipeline',
    totalRequests: '2.9M',
    avgLatency: 88,
    p95Latency: 175,
    successRate: 99.72,
    status: 'degraded',
  },
];

// ----------------------------------------------------------------------------
// 4. LIVE API REQUEST STREAM LOGS
// ----------------------------------------------------------------------------
export const initialTrafficLogs: ApiRequestLogRow[] = [
  {
    id: 'req_live_8910',
    time: '22:33:48',
    method: 'POST',
    endpoint: '/v1/auth/tokens/verify',
    status: 200,
    ip: '104.28.192.44',
    region: 'US-East (Virginia)',
    apiKeyId: 'ak_live_90f7a8b',
    duration: '18ms',
    durationMs: 18,
    payloadSize: '1.2 KB',
  },
  {
    id: 'req_live_8909',
    time: '22:33:42',
    method: 'POST',
    endpoint: '/v1/ai/completions/stream',
    status: 200,
    ip: '188.166.241.80',
    region: 'AP-Southeast (Singapore)',
    apiKeyId: 'ak_live_41k9b2c',
    duration: '138ms',
    durationMs: 138,
    payloadSize: '8.4 KB',
  },
  {
    id: 'req_live_8908',
    time: '22:33:35',
    method: 'GET',
    endpoint: '/v1/users/profile',
    status: 200,
    ip: '185.190.140.22',
    region: 'EU-Central (Frankfurt)',
    apiKeyId: 'ak_live_77x0d3e',
    duration: '24ms',
    durationMs: 24,
    payloadSize: '2.8 KB',
  },
  {
    id: 'req_live_8907',
    time: '22:33:28',
    method: 'POST',
    endpoint: '/v1/webhooks/dispatch',
    status: 200,
    ip: '139.180.211.55',
    region: 'AP-Southeast (Jakarta)',
    apiKeyId: 'ak_live_38m4p9q',
    duration: '42ms',
    durationMs: 42,
    payloadSize: '4.1 KB',
  },
  {
    id: 'req_live_8906',
    time: '22:33:20',
    method: 'GET',
    endpoint: '/v1/analytics/realtime/metrics',
    status: 200,
    ip: '35.198.240.11',
    region: 'US-West (Oregon)',
    apiKeyId: 'ak_live_12v8s7x',
    duration: '31ms',
    durationMs: 31,
    payloadSize: '12.4 KB',
  },
  {
    id: 'req_live_8905',
    time: '22:33:14',
    method: 'POST',
    endpoint: '/v1/ai/completions/stream',
    status: 429,
    ip: '103.111.200.78',
    region: 'AP-South (Mumbai)',
    apiKeyId: 'ak_live_99k1z4a',
    duration: '2ms',
    durationMs: 2,
    payloadSize: '0.4 KB',
  },
  {
    id: 'req_live_8904',
    time: '22:33:05',
    method: 'POST',
    endpoint: '/v1/files/upload/presigned',
    status: 201,
    ip: '52.77.221.90',
    region: 'AP-Southeast (Singapore)',
    apiKeyId: 'ak_live_55h2m8n',
    duration: '84ms',
    durationMs: 84,
    payloadSize: '1.8 KB',
  },
];

// Helper to generate dynamic live mock request logs in browser
const RANDOM_ENDPOINTS: Array<{ method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; path: string; latMin: number; latMax: number }> = [
  { method: 'POST', path: '/v1/auth/tokens/verify', latMin: 14, latMax: 26 },
  { method: 'POST', path: '/v1/ai/completions/stream', latMin: 110, latMax: 190 },
  { method: 'GET', path: '/v1/users/profile', latMin: 18, latMax: 35 },
  { method: 'POST', path: '/v1/webhooks/dispatch', latMin: 35, latMax: 60 },
  { method: 'GET', path: '/v1/analytics/realtime/metrics', latMin: 25, latMax: 48 },
  { method: 'POST', path: '/v1/files/upload/presigned', latMin: 70, latMax: 120 },
];

const RANDOM_REGIONS = [
  'US-East (Virginia)',
  'AP-Southeast (Singapore)',
  'EU-Central (Frankfurt)',
  'AP-Southeast (Jakarta)',
  'US-West (Oregon)',
  'EU-West (London)',
  'AP-East (Tokyo)',
];

const RANDOM_IPS = [
  '104.28.192.44',
  '188.166.241.80',
  '185.190.140.22',
  '139.180.211.55',
  '35.198.240.11',
  '52.77.221.90',
  '172.67.181.12',
];

export function generateRandomApiLog(): ApiRequestLogRow {
  const ep = RANDOM_ENDPOINTS[Math.floor(Math.random() * RANDOM_ENDPOINTS.length)];
  const region = RANDOM_REGIONS[Math.floor(Math.random() * RANDOM_REGIONS.length)];
  const ip = RANDOM_IPS[Math.floor(Math.random() * RANDOM_IPS.length)];
  const lat = Math.floor(Math.random() * (ep.latMax - ep.latMin + 1)) + ep.latMin;

  // 97% HTTP 200/201, 2% 429, 1% 400
  const rand = Math.random();
  const status = rand > 0.03 ? (ep.method === 'POST' && ep.path.includes('upload') ? 201 : 200) : (rand > 0.01 ? 429 : 400);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

  return {
    id: `req_live_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    time: timeStr,
    method: ep.method,
    endpoint: ep.path,
    status,
    ip,
    region,
    apiKeyId: `ak_live_${Math.random().toString(36).substring(2, 9)}`,
    duration: `${lat}ms`,
    durationMs: lat,
    payloadSize: `${(Math.random() * 8 + 1).toFixed(1)} KB`,
  };
}

// ----------------------------------------------------------------------------
// 5. EDGE GATEWAY REGIONAL NODES
// ----------------------------------------------------------------------------
export const initialEdgeNodes: EdgeGatewayNode[] = [
  {
    id: 'node-us-east',
    name: 'North America East Gateway',
    regionCode: 'us-east-1',
    location: 'N. Virginia, USA',
    latency: 14,
    uptime: 99.99,
    requestsTotal: '18.4M',
    status: 'operational',
  },
  {
    id: 'node-ap-southeast',
    name: 'Asia Pacific Southeast Gateway',
    regionCode: 'ap-southeast-1',
    location: 'Singapore',
    latency: 22,
    uptime: 100.0,
    requestsTotal: '14.1M',
    status: 'operational',
  },
  {
    id: 'node-eu-central',
    name: 'Europe Central Gateway',
    regionCode: 'eu-central-1',
    location: 'Frankfurt, Germany',
    latency: 18,
    uptime: 99.98,
    requestsTotal: '10.8M',
    status: 'operational',
  },
  {
    id: 'node-ap-id',
    name: 'Indonesia Regional Gateway',
    regionCode: 'ap-southeast-3',
    location: 'Jakarta, Indonesia',
    latency: 16,
    uptime: 99.95,
    requestsTotal: '4.94M',
    status: 'operational',
  },
];

// ----------------------------------------------------------------------------
// 6. HTTP STATUS DISTRIBUTION
// ----------------------------------------------------------------------------
export const httpStatusDistribution: HttpStatusItem[] = [
  { code: '200 OK', label: 'Successful Requests', count: '42.8M', percentage: 88.7, color: '#10B981' },
  { code: '201 Created', label: 'Resource Created', count: '4.2M', percentage: 8.7, color: '#34D399' },
  { code: '204 No Content', label: 'No Content', count: '1.1M', percentage: 2.3, color: '#059669' },
  { code: '400 Bad Request', label: 'Client Malformed', count: '68.4K', percentage: 0.14, color: '#F59E0B' },
  { code: '429 Rate Limit', label: 'Throttled Requests', count: '38.4K', percentage: 0.08, color: '#EF4444' },
  { code: '500 Server Error', label: 'Internal Errors', count: '4.1K', percentage: 0.01, color: '#DC2626' },
];

// ----------------------------------------------------------------------------
// 7. RATE LIMIT & QUOTA TIERS
// ----------------------------------------------------------------------------
export const initialRateLimitTiers: RateLimitTierItem[] = [
  {
    tierName: 'Enterprise Cluster Tier',
    limitRate: '25,000 req/min',
    activeConsumers: 184,
    utilizationPct: 42,
    throttledCount: 0,
    status: 'optimal',
  },
  {
    tierName: 'Pro Developer Tier',
    limitRate: '5,000 req/min',
    activeConsumers: 1420,
    utilizationPct: 68,
    throttledCount: 18,
    status: 'normal',
  },
  {
    tierName: 'Standard Starter Tier',
    limitRate: '1,000 req/min',
    activeConsumers: 1816,
    utilizationPct: 84,
    throttledCount: 142,
    status: 'congested',
  },
];

// ----------------------------------------------------------------------------
// 8. LATENCY PERCENTILES
// ----------------------------------------------------------------------------
export const initialLatencyPercentiles: LatencyPercentiles = {
  p50: 18,
  p75: 32,
  p90: 54,
  p95: 78,
  p99: 142,
  max: 380,
};
