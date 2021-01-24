import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CarneSurtek';

  constructor( public wsService: WebsocketService, public chatservice: ChatService) {

  }

  ngOnInit() {
    this.chatservice.getMessagesPrivate().subscribe( msg => {
      console.log(msg);
    })
  }

  
}
