export interface PullRequest {
  state: string;
  number: number;
  pull_request: PullRequestData;
  repository: Repository;
  _id?: string;
  __v?: number;
}

export interface PullRequestData {
  url: string;
  pullRequestID: string;
  node_id: string;
  user: PullRequestUserData;
  created_at: Date;
  updated_at: Date;
  merged_at: Date;
  closed_at: Date;
}

export interface PullRequestUserData {
  login: string;
  githubId: string;
  avatar_url: string;
  type: string;
}

export interface Repository {
  repositoryId: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  owner: string;
  ownerId: string;
}
