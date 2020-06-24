import fetch from 'node-fetch';
import { WebhookRequestPayload, WebhookEvent } from '../models/Webhook';
import { CoderingAPI } from '../constants/Endpoints';
import { GithubEndpoints } from '../constants/Github';

export function getWebhookUrls() {
  return [
    getWebhookRequestBody(CoderingAPI.WEBHOOK_PR, ['pull_request']),
    getWebhookRequestBody(CoderingAPI.WEBHOOK_ISSUE, ['issues'])
  ];
}

export const getWebhookRequestBody = (
  url: string,
  events: WebhookEvent[],
): WebhookRequestPayload => ({
  config: {
    url,
    content_type: 'json',
    insecure_ssl: 0,
    secret: 'githubwarrior',
  },
  active: true,
  events
});

export function getWebhookPayloads(token: string, repositoryName: string) {
  const payloads = getWebhookUrls();
  return payloads.map(
    (payload: WebhookRequestPayload) => fetch(`${GithubEndpoints.REPOSITORY}/${repositoryName}/hooks`, {
      method: 'POST',
      headers: { Authorization: `token ${token}`},
      body: JSON.stringify(payload)
    })
  );
}

export function getEncodedUrl(refreshToken: string) {
  const { ENVIRONMENT } = process.env;
  console.log(`Environment: ${ENVIRONMENT}`);
  const clientId = ENVIRONMENT === 'DEVELOPMENT' ? process.env.GH_CLIENT_DEV : process.env.GITHUB_CLIENT_ID;
  const clientSecret = ENVIRONMENT === 'DEVELOPMENT' ? process.env.GH_SECRET_DEV : process.env.GITHUB_CLIENT_SECRET;
  return `${GithubEndpoints.REFRESH_TOKEN}?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;
}