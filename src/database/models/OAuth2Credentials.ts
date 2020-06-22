import mongoose from 'mongoose';

export const OAuth2CredentialsSchema = new mongoose.Schema({
  githubId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  githubAccessToken: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  githubRefreshToken: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

const OAuth2Credentials = mongoose.model('OAuth2Credential', OAuth2CredentialsSchema);

export default OAuth2Credentials;