import { GithubActions } from '../constants/Github';
import { PullRequestUserData, Repository } from './PullRequest';

export interface GithubIssue {
  state: GithubActions;
  issueData: GithubIssueData;
  repository: Repository;
}

export interface GithubIssueData {
  htmlUrl: string;
  apiUrl: string;
  commentsUrl: string;
  nodeId: string;
  number: number;
  title: string;
  user: GithubIssueUser;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
}

export interface GithubIssueUser extends PullRequestUserData {}