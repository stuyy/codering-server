import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import User from '../database/models/User';

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  ENVIRONMENT,
  GH_CLIENT_DEV,
  GH_SECRET_DEV,
  GH_CB_DEV
} = process.env;

passport.serializeUser(function(user, done) {
  if (user instanceof Error) {
    return done(user, null);
  }
  done(null, user);
});

passport.deserializeUser(function(user: any, done) {
  User.findOne({ username: user.username})
  .then(user => {
    done(null, user);
  }).catch(err => done(err, null));
});

passport.use(new GithubStrategy({
  clientID: (ENVIRONMENT === 'DEVELOPMENT' ? GH_CLIENT_DEV : GITHUB_CLIENT_ID) || '',
  clientSecret: (ENVIRONMENT === 'DEVELOPMENT' ? GH_SECRET_DEV : GITHUB_CLIENT_SECRET) || '',
  callbackURL: (ENVIRONMENT === 'DEVELOPMENT' ? GH_CB_DEV : GITHUB_CALLBACK_URL) || '',
  scope: ['user'],
}, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
  console.time('Creating User');
  const { id: githubId, displayName, username, profileUrl } = profile;
  const { avatar_url: avatar } = profile._json;
  const findUser = await User.findOne({ githubId });
  if (findUser) return done(null, findUser);
  const user = new User({ githubId, displayName, username, avatar, profileUrl, roles: ['USER'] });
  const newUser = await user.save();
  console.timeEnd('Creating User');
  return done(null, newUser);
}));

