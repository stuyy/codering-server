import mongoose from 'mongoose';

export const PointsSchema = new mongoose.Schema({
  comments: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  },
  issues: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  },
  pullRequests: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  },
  merges: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  }
});

export const ContributionsSchema = new mongoose.Schema({
  comments: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  },
  issues: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  },
  pullRequests: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  },
  merges: {
    type: mongoose.SchemaTypes.Number,
    required: true,
    default: 0,
  }
});

/**
 * Every event is associated with EventData
 * Event Data contains the repository id (event id)
 * and a Map<githubId, EventUser> which maps every
 * githubId to an EventUser document
 */
export const EventDataSchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  users: {
    type: mongoose.SchemaTypes.Map,
    default: new Map()
  }
});
/**
 * EventUser is a document that is inside the users Map for
 * EventData
 * Every EventUser has a githubId, repositoryId, points document, and
 * contributions document.
 */
export const EventUserSchema = new mongoose.Schema({
  githubId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  repositoryId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  points: {
    type: PointsSchema,
    required: true,
  },
  contributions: {
    type: ContributionsSchema,
    required: true,
  }
});

const EventDataModel = mongoose.model('EventData', EventDataSchema);

export default EventDataModel;