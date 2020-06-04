import mongoose from 'mongoose';

const PRUserDataSchema = new mongoose.Schema({
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

const PRDataSchema = new mongoose.Schema({
  url: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  pullRequestID: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  nodeId: mongoose.SchemaTypes.String,
  created_at: mongoose.SchemaTypes.Date,
  updated_at: mongoose.SchemaTypes.Date,
  closed_at: mongoose.SchemaTypes.Date,
  merged_at: mongoose.SchemaTypes.Date,
});

const RepositorySchema = new mongoose.Schema({
  repositoryId: mongoose.SchemaTypes.String,
  name: mongoose.SchemaTypes.String,
  fullName: mongoose.SchemaTypes.String,
  private: mongoose.SchemaTypes.Boolean
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
  pullRequestData: PRDataSchema,
  pullRequestUserData: PRUserDataSchema,
  repository: RepositorySchema,
});

const PullRequestModel = mongoose.model('PullRequest', PullRequestSchema);

export default PullRequestModel;