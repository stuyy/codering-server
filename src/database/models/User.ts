import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  githubId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  displayName: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  avatar: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  profileUrl: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  roles: [],
  discordAuthed: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  discordId: {
    type: mongoose.SchemaTypes.String,
    default: null,
  },
  discordTag: {
    type: mongoose.SchemaTypes.String,
    default: null,
  }
});

const User = mongoose.model('user', UserSchema);

export default User;