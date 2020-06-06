import mongoose from 'mongoose';
import { PRUserDataSchema, RepositorySchema } from './PullRequest';

export const IssueDataSchema = new mongoose.Schema({
  htmlUrl: { type: mongoose.SchemaTypes.String, required: true },
  apiUrl: { type: mongoose.SchemaTypes.String, required: true },
  commentsUrl: { type: mongoose.SchemaTypes.String, required: true },
  nodeId: { type: mongoose.SchemaTypes.String, required: true },
  number: { type: mongoose.SchemaTypes.Number, required: true },
  title: { type: mongoose.SchemaTypes.String, required: true },
  user: { type: PRUserDataSchema, required: true },
  createdAt: { type: mongoose.SchemaTypes.Date, required: true },
  updatedAt: { type: mongoose.SchemaTypes.Date, required: true },
  closedAt: { type: mongoose.SchemaTypes.Date, required: false }
})

export const GithubIssueSchema = new mongoose.Schema({
  state: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  issueData: {
    type: IssueDataSchema,
    required: true,
  },
  repository: {
    type: RepositorySchema,
    required: true,
  }
});

const GithubIssueModel = mongoose.model('Issue', GithubIssueSchema);

export default GithubIssueModel;
