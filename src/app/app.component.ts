import { Component, OnInit } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { WebsocketService } from './websocket.service';

import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  ws: any;
  msgs: string[] = [];
  text: string;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.ws = this.websocketService.socket;
    this.websocketService.data
      .subscribe(data => {
        console.log(data);
        this.msgs.push(data);
      }) 
  }

  send() {
    this.ws.emit('message', this.text);
  }

}
