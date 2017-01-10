import { Component, OnInit } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { WebsocketService } from './websocket.service';

import { Http, Headers } from '@angular/http';

import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  ws: any;
  msgs: string[] = [];
  orders: any[] = [];
  text: string;

  constructor(private websocketService: WebsocketService, private http: Http) {}

  ngOnInit() {
    this.ws = this.websocketService.socket;
    this.websocketService.data
      .subscribe(data => {
        this.msgs.push(data);
      }) ;
    this.websocketService.orders
      .subscribe(data => {
        this.orders.push(data);
      })
    this.websocketService.subscribe("orders"); 
  }

  send() {
    // this.ws.emit('message', this.text);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(  "http://localhost:4567/orders",
                     JSON.stringify({id: this.text, name: "name #{this.text}", value: Math.random() * 100}), 
                     options)
      .toPromise()
      .then(console.log)
      .catch(console.log);
  }

}
