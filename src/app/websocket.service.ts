import { Subject, Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

// import * as ReconnectingWebsocket from 'reconnecting-websocket';

import * as io from 'socket.io-client';

@Injectable()
export class WebsocketService {

  data: Subject<string>;
  update: Subject<string>;
  socket: any;

  constructor() {
      this.data = new Subject();
      this.update = new Subject();
      this.socket = this.create();
  }

  create(): any {
    var self = this;
    var socket = io('ws://localhost:10443');
    
    socket.on('connect', (data) => {
      self.data.next(data);
    });

    socket.on('message', (data) => {
      self.data.next(data);
    });

    socket.on('update', (data) => {
      self.update.next(JSON.parse(data));
    });

    // const ws = new ReconnectingWebsocket('ws://localhost:10443');

    // ws.addEventListener('open', () => {
    //     this.data.next('Connected');
    // });

    // ws.addEventListener('close', () => {
    //     this.data.next('Disconnected');
    // });

    // ws.onmessage = (event) => {
    //     this.data.next(event.data);
    // };

    // ws.onerror = (err) => {
    //     if (err.code === 'EHOSTDOWN') {
    //         console.log('server down');
    //     }
    // };

    return socket
}

}
