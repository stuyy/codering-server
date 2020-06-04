export interface UserSession {
  _id: string;
  githubId: string;
  displayName?: string;
  username: string;
  avatar: string;
  profileUrl: string;
  __v?: number;
  roles: Array<string>;
}