import WebhookService from '../../services/webhook.service';
import EventService from '../../services/events.service';
import { GithubActions } from '../../constants/GithubActions';

export default async (data: any) => {
  const {
    pull_request,
    repository,
    userId,
    merged
  } = data;

  if (merged) {
    console.time(`Merging Pull Request ${pull_request.id}`);
    await WebhookService.findAndUpdate(
      pull_request.id,
      GithubActions.MERGED,
      pull_request.updated_at,
      pull_request.merged_at,
      pull_request.closed_at);
    
    await EventService.updateUserEventData(
      repository.id,
      userId.toString(),
      GithubActions.MERGED,);
    console.timeEnd(`Merging Pull Request ${pull_request.id}`);
    return;
  } else {
    console.time(`Pull Request ${pull_request.id} was closed.`);
    await WebhookService.findAndUpdate(pull_request.id, GithubActions.CLOSED, pull_request.updated_at, undefined, pull_request.closed_at);
    // Update Points
    await EventService.updateUserEventData(
      repository.id,
      userId.toString(),
      GithubActions.CLOSED);
    console.timeEnd(`Pull Request ${pull_request.id} was closed.`);
  }
}