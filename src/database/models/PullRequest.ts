import mongoose from 'mongoose';

export const UserDataSchema = new mongoose.Schema({
  login: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  githubId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  avatar_url: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  type: {
    type: mongoose.SchemaTypes.String,
    required: true,
  }
});

const PullRequestDataSchema = new mongoose.Schema({
  url: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  pullRequestID: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  node_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  created_at: {
    type: mongoose.SchemaTypes.Date,
    required: true,
  },
  updated_at: mongoose.SchemaTypes.Date,
  closed_at: mongoose.SchemaTypes.Date,
  merged_at: mongoose.SchemaTypes.Date,
});

export const RepositorySchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  name: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  full_name: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  private: {
    type: mongoose.SchemaTypes.Boolean,
    required: true,
  },
  html_url: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  owner: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  ownerId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

const PullRequestSchema = new mongoose.Schema({
  state: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  number: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
  pullRequestData: {
    type: PullRequestDataSchema,
    required: true,
  },
  pullRequestUserData: {
    type: UserDataSchema,
    required: true,
  },
  repository: {
    type: RepositorySchema,
    required: true,
  },
});

const PullRequestModel = mongoose.model('PullRequest', PullRequestSchema);

export default PullRequestModel;