import User from '../database/models/User';

export default class UserService {
  static async getUser(nameOrId: string) {
    return User.findOne().or([{ githubId: nameOrId }, { username: nameOrId }]);
  }
}