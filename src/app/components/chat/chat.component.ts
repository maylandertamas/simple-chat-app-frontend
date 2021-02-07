import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../interfaces/message';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message/message.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public messageHistory: Message[];
  public isLoading: boolean;
  public isError: boolean;
  public error: any;

  public newMessage: string;

  constructor(private loginService: LoginService,
              private messageService: MessageService,
              private chatService: ChatService) {
    this.reset();
  }

  /**
   * On component init
   */
  ngOnInit(): void {
    this.chatService.startConnection();
    this.chatService.addChatMessageListener();
    this.updateContent();
    this.subscribeToEvents();
  }

  /**
   * On component destroy
   */
  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }

  /**
   * Reset variables
   */
  reset(): void {
    this.messageHistory = [];
    this.isLoading = false;
    this.isError = false;
    this.error = null;
    this.newMessage = '';
  }

  /**
   * Update page content with message history
   */
  private updateContent() {
    this.isLoading = true;
    // Request message history
    this.messageService.getMessageHistory()
    .subscribe((res: Message[]) => {
      this.isLoading = false;
      this.messageHistory = res;
      // If error
    }, err => {
      this.isLoading = false;
      this.isError = true;
      this.error = err;
      console.log(err);
    });
  }

  /**
   * Create new message
   */
  public sendMessage() {
    if (!this.newMessage) { return; }
    this.isLoading = true;
    // Get logged in user
    this.loginService.getLoggedInUser()
    .subscribe((user: User) => {
      this.isLoading = false;
      // Create new message
      let message: Message = { text: this.newMessage, userId: user.id }
      // Send new message
      this.messageService.createMessage(message)
      .subscribe(res => {
        this.isLoading = false;
      });
    // If error happens
    }, err => {
      this.isLoading = false;
      this.isError = true;
      this.error = err;
    });
  }

  /**
   * Subscirbe to events
   */
  private subscribeToEvents() {
    // Subscribe to new message events 
    this.chatService.onNewMessageReceived
    .subscribe((newMessageReceived: Message) => {
      // Add new message to history
      this.messageHistory.push(newMessageReceived);
    });
  }

}
