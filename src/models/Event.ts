import { UserSession } from './SessionUser';
import { Repository } from './PullRequest';

export enum EventStatus {
  OPENED = 'opened',
  CLOSED = 'closed',
  PAUSED = 'paused'
};

export interface Event {
  _id?: string;
  repositoryId?: string;
  status: EventStatus;
  creator: UserSession;
  startDate: Date;
  endDate: Date;
  pullRequestPoints: number;
  issuePoints: number;
  commentsPoints: number;
  mergedPullRequestPoints: number;
  winner?: UserSession;
}

/**
 * When event is sent to API, we need to check Event Database to see if there is an event that exists with the repositoryId. 
 * If there is no event that exists, we can create the Event.
 * 
 * Set Event Status to OPENED
 */
/**Admin -> Creates an Event
Input -> Event Name
Input -> Type or Enter the URL of Repository

GET https://api.github.com/search/repositories?q=user:{username}
And allow user to select OR:
Search for Repository -> GET https://api.github.com/search/repositories?q=+repo:{username}/{name}

We need a way to keep track of Events and Users.

 */