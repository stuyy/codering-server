import { Repository, PullRequestUserData, PullRequestData, PullRequest } from '../models/PullRequest';
import { GithubIssue, GithubIssueUser, GithubIssueData } from '../models/GithubIssue';

export function buildPullRequestObject(body: any): PullRequest {

  const { pull_request, repository } = body;
  const { user } = pull_request;

  const repo: Repository = {
    repositoryId: repository.id,
    name: repository.name,
    full_name: repository.full_name,
    private: repository.private
  }

  const prUserData: PullRequestUserData = {
    login: user.login,
    githubId: user.id,
    avatar_url: user.avatar_url,
    type: user.type
  }

  const prData: PullRequestData = {
    url: pull_request.url,
    pullRequestID: pull_request.id,
    node_id: pull_request.node_id,
    user: prUserData,
    created_at: pull_request.created_at,
    updated_at: pull_request.updated_at,
    merged_at: pull_request.merged_at,
    closed_at: pull_request.closed_at
  }

  return {
    state: body.action,
    number: body.number,
    pull_request: prData,
    repository: repo
  };
}

export function buildGithubIssueObject(body: any): GithubIssue {
  
  const { action: state, issue, repository: repo } = body;
  const { user } = issue;
  
  const issueUser: GithubIssueUser = {
    login: user.login,
    githubId: user.id,
    avatar_url: user.avatar_url,
    type: user.type
  };

  const issueData: GithubIssueData = {
    htmlUrl: issue.html_url,
    apiUrl: issue.url,
    commentsUrl: issue.comments_url,
    nodeId: issue.node_id,
    number: issue.number,
    title: issue.title,
    user: issueUser,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at
  };

  const repository: Repository = {
    repositoryId: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private
  }

  return {
    state,
    issueData,
    repository,
  };
}

export function buildRepositoryObject(repo: any): Repository {
  return {
    repositoryId: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private
  }
}