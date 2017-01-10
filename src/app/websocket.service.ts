import { Subject, Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

// import * as ReconnectingWebsocket from 'reconnecting-websocket';

import * as io from 'socket.io-client';

@Injectable()
export class WebsocketService {

  data: Subject<string>;
  socket: any;
  connectionUp: boolean = false;

  constructor() {
      this.data = new Subject();
      this.socket = this.create();
  }

  create(): any {
    var self = this;
    var socket = io('ws://localhost:10443');
    
    socket.on('connect', (data) => {
      this.connectionUp = true;
      self.data.next("connected");
    });

    socket.on('message', (data) => {
      self.data.next(data);
    });

    socket.on('disconnect', () => {
      this.connectionUp = false;
      self.data.next("disconnected");
    });

    return socket
  }



  subscribe(collection: string) {
    this.socket.emit("subscribe", collection)
  }  

}
