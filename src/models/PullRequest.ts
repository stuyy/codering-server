export interface PullRequest {
  action: string;
  number: number;
  pull_request: PullRequestData;
  repository: Repository;
}

export interface PullRequestData {
  url: string;
  id: string;
  node_id: string;
  user: PullRequestUserData;
  created_at: Date;
  updated_at: Date;
  merged_at: Date;
  closed_at: Date;
}

export interface PullRequestUserData {
  login: string;
  id: string;
  avatar_url: string;
  type: string;
}

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  private: boolean;
}
