import { Subject, Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

import * as ReconnectingWebsocket from 'reconnecting-websocket';

@Injectable()
export class WebsocketService {

  data: Subject<string>;
  socket: WebSocket;

  constructor() {
      this.data = new Subject();
      this.socket = this.create();
  }

  create(): WebSocket {
    
    const ws = new ReconnectingWebsocket('ws://localhost:9292/example');

    ws.addEventListener('open', () => {
        this.data.next('Connected');
    });

    ws.addEventListener('close', () => {
        this.data.next('Disconnected');
    });

    ws.onmessage = (event) => {
        this.data.next(event.data);
    };

    ws.onerror = (err) => {
        if (err.code === 'EHOSTDOWN') {
            console.log('server down');
        }
    };

    return ws
}

}
