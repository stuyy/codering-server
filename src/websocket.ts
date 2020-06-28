import * as http from 'http';
import { Socket } from 'socket.io';

class WebSocket {

  private static _instance: WebSocket;
  private io: Socket | undefined;

  public getSocket(): Socket | undefined {
    return this.io;
  }

  public setSocket(server: http.Server) {
    this.io = require('socket.io')(server);
  }

  public static getInstance() {
    return this._instance || (this._instance = new this());
  }
}

export default WebSocket;