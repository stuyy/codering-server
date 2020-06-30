export enum GithubActions {
  OPENED = 'opened',
  CLOSED = 'closed',
  REOPENED = 'reopened',
  EDITED = 'edited',
  MERGED = 'merged',
  UNKNOWN = 'unknown'
}

export enum GithubEndpoints {
  BASE_URL = 'https://api.github.com',
  REPOSITORY = 'https://api.github.com/repos',
  AUTH_CHECK = 'https://api.github.com',
  REFRESH_TOKEN = 'https://github.com/login/oauth/access_token',
}

export enum GithubEvents {
  PR = 'pull_request',
  ISSUE = 'issues',
  
}