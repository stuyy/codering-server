// import { Strategy as DiscordStrategy } from 'passport-discord';
// import { config } from 'dotenv';
// import User from '../database/models/User';
// import passport from 'passport';

// config();

// const {
//   DISCORD_CLIENT_ID,
//   DISCORD_CLIENT_SECRET,
//   DISCORD_CALLBACK_URL,
//   DISCORD_CB_PROD,
//   ENVIRONMENT
// } = process.env;

// let doesStrategyExist = false;

// export const setupStrategy = () => {
//   return (req: any, res: any, next: Function) => {
//     if (!doesStrategyExist) {
//       if (req.user) {
//         passport.use(new DiscordStrategy({
//           clientID: DISCORD_CLIENT_ID || '',
//           clientSecret: DISCORD_CLIENT_SECRET || '',
//           callbackURL: DISCORD_CALLBACK_URL || '',
//           scope: ['identify']
//         }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
//           const findUser = await DiscordUser.findOne({ discordId: profile.id });
//           // Search DB for Discord User, if the Discord User is not found, create it and attach it to GitHub account.
//           // If the Discord User is found, that means it has already been connected to an account.
//           if (!findUser) {
//             const user = new DiscordUser({
//               discordId: profile.id,
//               username: profile.username,
//               discriminator: profile.discriminator
//             });
//             console.log('Current Session User');
//             const sessionUser: any = req.user;
//             console.log(sessionUser);
//             const { githubId } = sessionUser;
//             const githubUser: any = await User.findOne({ githubId });
//             if (githubUser) {
//               const newUser: any = await user.save();
//               githubUser.discordId = newUser.discordId;
//               githubUser.discordTag = `${newUser.username}#${newUser.discriminator}`;
//               githubUser.save();
//               console.log('Attached Discord Data to User Document');
//               return done(null, githubUser);
//             } else console.log('Github account was not found');
//           } else {
//             return done(null, req.user);
//           }
//         }));
//         doesStrategyExist = true;
//       } else {
//         res.redirect('/auth/discord/error');
//       }
//     }
//     next();
//   }
// }