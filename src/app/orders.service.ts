import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { WebsocketService } from './websocket.service';

import * as _ from 'lodash';

import { PubNubAngular } from 'pubnub-angular2';

import * as deepstream from 'deepstream.io-client-js';

@Injectable()
export class OrdersService {

  _orders: any[] = [];
  orders: BehaviorSubject<any[]>;
  _ordersRecords: string[] = [];
  ordersRecords: BehaviorSubject<string[]>;
  buffer: any[] = [];
  ready: boolean = false;
  sequence: number = 0;
  errors: number = 0;
  serverSize: number = 0;

  constructor(private pubnubService: PubNubAngular) { 
    let self = this;
    this.orders = new BehaviorSubject<any[]>([]);
    this.ordersRecords = new BehaviorSubject<string[]>([]);
    let ds = deepstream('localhost:6020').login();

    var driver = ds.record.getList( 'orders' );

    driver.subscribe( function( orders ){
      self._ordersRecords = orders;
      self.ordersRecords.next(self._ordersRecords)
      let records = [];
      _.each(self._ordersRecords, (recordName) => {
        records.push(ds.record.getRecord(recordName));
      });
      self.orders.next(records);
    });

  }

}
