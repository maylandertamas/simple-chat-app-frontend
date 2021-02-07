import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subscription } from 'rxjs';
import { Message } from 'src/app/interfaces/message';
import { ResetService } from '../reset/reset.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

  private hubConnection: signalR.HubConnection;
  private resetServiceSubscription: Subscription;
  public onNewMessageReceived = new EventEmitter<Message>();

  constructor(private resetService: ResetService) {
    this.subscribeToEvents();
  }

  /**
   * On destroying service
   */
  ngOnDestroy(): void {
   this.resetServiceSubscription?.unsubscribe();
  }

  /**
   * Start hub connection
   */
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/chat')
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  /**
   * Listening on new messages
   */
  public addChatMessageListener = () => {
    this.hubConnection.on('NewMessageAdded', ((data: Message) => {
      this.onNewMessageReceived.emit(data);
    }));
  }

  /**
   * Stop hub connection
   */
  public stopConnection = () => {
    if (!this.hubConnection) { return; }
    this.hubConnection
    .stop()
    .then(() => console.log('Disconnected'))
    .catch(err => console.log('Error while disconnecting: ' + err));
  }

  /**
   * Subscribe to events
   */
  public subscribeToEvents() {
    // subscribe to reset events
    this.resetServiceSubscription = this.resetService.resetEvent
    .subscribe(res => {
      // Stop websocket connection on reset event
      if (res) {
        this.stopConnection();
      }
    });
  }
}
