import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { WebsocketService } from './websocket.service';

import * as _ from 'lodash';

import { PubNubAngular } from 'pubnub-angular2';

@Injectable()
export class OrdersService {

  _orders: any[] = [];
  orders: BehaviorSubject<any[]>;
  buffer: any[] = [];
  ready: boolean = false;
  sequence: number = 0;
  errors: number = 0;
  serverSize: number = 0;

  constructor(private ws: WebsocketService, private pubnubService: PubNubAngular) { 
    this.orders = new BehaviorSubject<any[]>([]);
    this.ws.socket.on("update", (data) => {
      this.buffer.push(data);
      this.serverSize = data.size;
      if(this.ready) {
        while(this.buffer.length > 0) {
          let data = this.buffer.shift();
          this.applyUpdate(data);
        }
      }
    });

    this.ws.socket.on("snapshot", (data) => {
        this.applyUpdate(data);
    });

    pubnubService.init({
      publishKey: 'pub-c-ca89589b-68e4-48ee-85dd-2cc9cf01280a',
      subscribeKey: 'sub-c-6ded6650-d904-11e6-a478-02ee2ddab7fe'
    })

    this.ws.socket.on("ready", (data) => {
      this.ready = true;
      while(this.buffer.length > 0) {
        let data = this.buffer.shift();
        if(data.seq < this.sequence) {
          continue;
        }
        this.applyUpdate(data);
      }
    });

    this.ws.data.subscribe(data => {
      if(data == "disconnected") {
        this._orders = [];
        this.orders.next(this._orders)
      }else if (data == "connected") {
        this.ready = false;
        this.ws.subscribe("orders"); 
      }
    });
  }

  applyUpdate(data: any) {
    if (this.sequence != 0 && (this.sequence >= data.seq || data.seq != this.sequence + 1)) {
      this.errors++;
    }
    if(data.seq > 0){
      this.sequence = data.seq;
    }
    if(data.type == "order") {
      if(data.action == "added") {
        this._orders.push(JSON.parse(data.fields));
        this.orders.next(this._orders)
      }else if (data.action == "removed") {
        this._orders = this._orders.filter((item) => item.id != data.id);
        this.orders.next(this._orders)
      }else if (data.action == "changed") {
        this._orders = _.reject(this._orders, { id: data.id });
        this._orders.push(JSON.parse(data.fields));
        this.orders.next(this._orders);
      }
    }
  }


}
