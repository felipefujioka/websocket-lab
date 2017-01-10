import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { WebsocketService } from './websocket.service';

@Injectable()
export class OrdersService {

  _orders: any[] = [];
  orders: BehaviorSubject<any[]>;

  constructor(private ws: WebsocketService) { 
    this.orders = new BehaviorSubject<any[]>([]);
    this.ws.socket.on("update", (data) => {
      if(data.type == "order") {
        if(data.action == "added") {
          this._orders.push(JSON.parse(data.fields));
          this.orders.next(this._orders)
        }else if (data.action == "removed") {
          this._orders = this._orders.filter((item) => item.id != data.id);
          this.orders.next(this._orders)
        }
      }
    })
    // this.ws.subscribe("orders"); 

    this.ws.data.subscribe(data => {
      if(data == "disconnected") {
        this._orders = [];
        this.orders.next(this._orders)
      }else if (data == "connected") {
        // if(this.connection)
        this.ws.subscribe("orders"); 
      }
    });
  }



}
