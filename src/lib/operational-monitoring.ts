export type OperationalEvent =
  | 'health.database_unavailable'
  | 'health.email_configuration_unavailable'
  | 'health.email_delivery_degraded';

/**
 * Emits an allowlisted, privacy-safe event for the deployment log sink.
 * Never pass visitor input, message content, identifiers, secrets, exception
 * messages, or stack traces to this function.
 */
export function reportOperationalError(event: OperationalEvent, error?: unknown) {
  console.error(JSON.stringify({
    level: 'error',
    event,
    errorType: error instanceof Error ? error.name : error ? 'UnknownError' : undefined,
    timestamp: new Date().toISOString(),
  }));
}
