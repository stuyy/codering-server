export interface WebhookRequestPayload {
  config: WebhookConfig;
  active: boolean;
  events: Array<WebhookEvent>;
}

export interface WebhookConfig {
  url: string;
  content_type: 'json' | 'form';
  insecure_ssl: number;
  secret: string;
}

export type WebhookEvent = 'pull_request' | 'issues' | 'push';