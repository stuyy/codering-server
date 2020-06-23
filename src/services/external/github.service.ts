import fetch from 'node-fetch';

/**
 * GithubService is a class that wraps external API calls to Github API
 */
export default class GithubService {

  static async postWebhook() {

  }

  static async getWebhooks(token: string) {
    const response = await fetch('https://api.github.com/repos/ansonfoong/test-event/hooks', { headers: {
      Authorization: `token ${token}`
    }});
    return response.json();
  }

  static async getWebhook() {

  }
}