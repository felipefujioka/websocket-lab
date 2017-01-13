import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { WebsocketService } from './websocket.service';

import { OrdersService } from './orders.service';

import { PubNubAngular } from 'pubnub-angular2';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    WebsocketService,
    OrdersService,
    PubNubAngular
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
