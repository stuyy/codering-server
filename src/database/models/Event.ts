import mongoose from 'mongoose';
import { RepositorySchema } from './PullRequest';
import { UserSchema } from './User';

export const EventSchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  repository: {
    type: RepositorySchema,
    required: true,
  },
  status: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  creatorId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  startDate: {
    type: mongoose.SchemaTypes.Date,
    required: true,
  },
  endDate: {
    type: mongoose.SchemaTypes.Date,
    required: true,
  },
  pullRequestPoints: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
  issuePoints: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
  commentsPoints: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
  mergedPullRequestPoints: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
  winner: {
    type: UserSchema,
    required: false,
  }
});

const EventModel = mongoose.model('event', EventSchema);

export default EventModel;