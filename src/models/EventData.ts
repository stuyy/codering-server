export interface EventData {
  repositoryId: string;
  users: Map<string, EventUser>
}

export interface EventUser {
  githubId: string;
  repositoryId: string;
  points: Points;
  contributions: Contributions;
}

export interface Points {
  comments: number;
  issues: number;
  pullRequests: number;
  merges: number;
}

export interface Contributions {
  comments: number;
  issues: number;
  pullRequests: number;
  merges: number;
}