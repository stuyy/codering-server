import { Repository, PullRequestUserData, PullRequestData, PullRequest } from '../models/PullRequest';

export function buildPullRequestObject(body: any): PullRequest {

  const { pull_request, repository } = body;
  const { user } = pull_request;

  const repo: Repository = {
    id: repository.id,
    name: repository.name,
    full_name: repository.full_name,
    private: repository.private
  }

  const prUserData: PullRequestUserData = {
    login: user.login,
    id: user.id,
    avatar_url: user.avatar_url,
    type: user.type
  }

  const prData: PullRequestData = {
    url: pull_request.url,
    id: pull_request.id,
    node_id: pull_request.node_id,
    user: prUserData,
    created_at: pull_request.created_at,
    updated_at: pull_request.updated_at,
    merged_at: pull_request.merged_at,
    closed_at: pull_request.closed_at
  }

  return {
    action: body.action,
    number: body.number,
    pull_request: prData,
    repository: repo
  };
}