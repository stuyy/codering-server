import WebhookService from '../../services/webhook.service';
import EventService from '../../services/events.service';
import { GithubActions } from '../../constants/Github';

export default async (data: any) => {
  const { pull_request, repository, body, userId } = data;
  console.time(`PR ${pull_request.id} was opened.`)
  await WebhookService.handleOpenedPullRequest(body);
  await EventService.updateUserEventData(
    repository.id,
    userId.toString(),
    GithubActions.OPENED);
  console.timeEnd(`PR ${pull_request.id} was opened.`);
  return;
}