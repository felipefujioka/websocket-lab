import { Component, OnInit } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { WebsocketService } from './websocket.service';

import { Http, Headers } from '@angular/http';

import { OrdersService } from './orders.service';

import * as io from 'socket.io-client';

import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  ws: any;
  msgs: string[] = [];
  orders: any[] = [];
  ordersRecords: string[] = [];
  text: string;
  update: string;

  constructor(public ordersService: OrdersService, private http: Http) {}

  ngOnInit() {
    this.ordersService.orders.subscribe(orders => {
      this.orders = _.sortBy(orders, (item) => {
        return +item.id;
      });
    })
    this.ordersService.ordersRecords.subscribe(ordersRecords => {
      this.ordersRecords = _.sortBy(ordersRecords, (item) => {
        let regexp = new RegExp('^orders\/(\\d*)$');
        let match = item.match(regexp);
        return +match[1];
      });
    })
  }

  remove(id: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let url = `http://localhost:4567/orders/${id}`;
    this.http.delete( url, options)
      .toPromise()
      .then(console.log)
      .catch(console.log);
  }

  send() {
    // this.ws.emit('message', this.text);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let name = `name ${this.text}`;
    this.http.post(  "http://localhost:4567/orders",
                     JSON.stringify({id: this.text, name: name, value: Math.floor(Math.random() * 100)}), 
                     options)
      .toPromise()
      .then(console.log)
      .catch(console.log);
  }

  pubnubTest() {
    this.http.get(  `http://localhost:4567/hello`)
      .toPromise()
      .then(console.log)
      .catch(console.log);
  }

  sendUpdate() {
    // this.ws.emit('message', this.text);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let name = `name updated`;
    this.http.put(  `http://localhost:4567/orders/${this.update}`,
                     JSON.stringify({id: this.update, name: name, value: Math.random() * 100}), 
                     options)
      .toPromise()
      .then(console.log)
      .catch(console.log);
  }

}
