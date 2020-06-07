import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  githubId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  displayName: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  avatar: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  profileUrl: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  roles: [],
});

const User = mongoose.model('user', UserSchema);

export default User;