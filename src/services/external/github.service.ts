import fetch from 'node-fetch';
import { GithubEndpoints } from '../../constants/Github';
import { getWebhookPayloads, getEncodedUrl } from '../../utilities/utils';
import { decryptToken, encryptToken } from '../../utilities/hash';
import OAuth2Credentials from '../../database/models/OAuth2Credentials';

/**
 * GithubService is a class that wraps external API calls to Github API
 */
export default class GithubService {
  static async postWebhooks(token: string, repository: any, githubId: string) {
    const credentials = await OAuth2Credentials.findOne({ githubId });
    if (!credentials) throw new Error('No OAuth2 Credentials record found in database.');
    const check = await this.checkAccessToken(token);
    if (check.status === 401) {
      console.log('Invalid Access Token... Refreshing token...');
      const response = await this.refreshAccessToken(githubId);
      const githubAccessToken = encryptToken(response.access_token);
      const githubRefreshToken = encryptToken(response.refresh_token);
      await credentials.update({ githubAccessToken, githubRefreshToken });
      const payloads = getWebhookPayloads(response.access_token, repository.full_name);
      return Promise.all(payloads);
    } else {
      const payloads = getWebhookPayloads(token, repository.full_name);
      return Promise.all(payloads);
    }
  }

  static async getWebhooks(token: string) {
    const response = await fetch('https://api.github.com/repos/ansonfoong/test-event/hooks', { headers: {
      Authorization: `token ${token}`
    }});
    return response.json();
  }

  static async deleteWebhooks() {
  }

  static async getWebhook() {

  }

  static checkAccessToken(token: string) {
    return fetch(GithubEndpoints.AUTH_CHECK, {
      headers: { Authorization: `token ${token}`}
    });
  }

  static async refreshAccessToken(githubId: string) {
    const credentials = await OAuth2Credentials.findOne({ githubId });
    if (!credentials) throw new Error('No OAuth2 Credentials record found in database.');
    const refresh_token = decryptToken(credentials.get('githubRefreshToken'));
    const response = await fetch(getEncodedUrl(refresh_token), {
      method: 'POST',
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();
    if (result.error) throw new Error(result.error_description);
    return result;
  }
}