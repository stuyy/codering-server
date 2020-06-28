import User from '../database/models/User';
import OAuth2Credentials from '../database/models/OAuth2Credentials';
import { decryptToken } from '../utilities/hash';
import { UserSession } from '../models/SessionUser';

export default class UserService {
  static async getUser(nameOrId: string) {
    return User.findOne().or([{ githubId: nameOrId }, { username: nameOrId }]);
  }

  static async getGithubOAuth2Token(githubId: string): Promise<string> {
    const user = await User.findOne({ githubId });
    if (!user) throw new Error('No user found.');
    else {
      const credentials = await OAuth2Credentials.findOne({ githubId });
      if (!credentials) throw new Error('Credentials for user not found...');
      else {
        const token = decryptToken(credentials.get('githubAccessToken'));
        return token;
      }
    }
  }

  static async getUsers(userIds: string[]): Promise<UserSession[] | unknown> {
    return User.find({ githubId: { $in: userIds }});
  }

}