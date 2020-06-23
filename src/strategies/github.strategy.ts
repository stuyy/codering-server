import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import User from '../database/models/User';
import OAuth2Credentials from '../database/models/OAuth2Credentials';
import { encryptToken } from '../utilities/hash';

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
  const { id: githubId, displayName, username, profileUrl } = profile;
  const { avatar_url: avatar } = profile._json;
  try {
    const findUser = await User.findOne({ githubId });
    if (findUser) {
      // Need to update User's OAuth2 Credentials
      console.log('Updating User Auth Tokens');
      console.time('Encrypting Tokens');
      const githubAccessToken = encryptToken(accessToken);
      const githubRefreshToken = encryptToken(refreshToken);
      console.timeEnd('Encrypting Tokens');
      await OAuth2Credentials.findOneAndUpdate({ githubId }, { githubAccessToken, githubRefreshToken })
      return done(null, findUser);
    }
    console.time('Creating New User');
    const newUser = await User.create({ githubId, displayName, username, avatar, profileUrl, roles: ['USER'] });
    console.time('Encrypting Tokens');
    const githubAccessToken = encryptToken(accessToken);
    const githubRefreshToken = encryptToken(refreshToken);
    console.timeEnd('Encrypting Tokens');
    await OAuth2Credentials.create({ githubId, githubAccessToken, githubRefreshToken });
    console.timeEnd('Creating New User');
    return done(null, newUser);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
}));