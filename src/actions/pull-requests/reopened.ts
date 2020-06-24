import WebhookService from '../../services/webhook.service';
import EventService from '../../services/events.service';
import { GithubActions } from '../../constants/Github';

export default async (data: any) => {
  const { pull_request, repository, userId } = data;
  console.time(`Pull Request ${pull_request.id} was re-opened.`);
  await WebhookService.findAndUpdate(
    pull_request.id,
    GithubActions.REOPENED,
    pull_request.updated_at);
  
  await EventService.updateUserEventData(
    repository.id,
    userId,
    GithubActions.REOPENED,
  );

  console.timeEnd(`Pull Request ${pull_request.id} was re-opened.`);
  return;
}