import { Subject, Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

// import * as ReconnectingWebsocket from 'reconnecting-websocket';

import * as io from 'socket.io-client';

@Injectable()
export class WebsocketService {

  data: Subject<string>;
  orders: Subject<any>;
  socket: any;

  constructor() {
      this.data = new Subject();
      this.orders = new Subject();
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

      if(data.type == "order") {
        this.orders.next(JSON.parse(data.fields));
      }

    });

    return socket
  }

  subscribe(collection: string) {
    this.socket.emit("subscribe", collection)
  }  

}
