import mongoose from 'mongoose';

const DiscordUserSchema = new mongoose.Schema({
  discordId: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: null,
    unique: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  discriminator: {
    type: mongoose.Schema.Types.String,
    required: true,
  }
});

const DiscordUser = mongoose.model('discorduser', DiscordUserSchema);

export default DiscordUser;