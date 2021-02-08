import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../interfaces/message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message/message.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from 'src/app/interfaces/user';
import { map } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

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
  public currentUser: User;

  public newMessage: string;

  @ViewChild(CdkVirtualScrollViewport) virtualScrollViewport: CdkVirtualScrollViewport;


  constructor(private activeRoute: ActivatedRoute,
              private loginService: LoginService,
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
    this.loginService.getLoggedInUser().subscribe((res: User) =>
    {
      this.currentUser = res;
    });
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
    // Set timeout only for displaying loading screen
    // TODO: REMOVE
    setTimeout(() => {
      // Try fetch data with resolver
      this.activeRoute.data.pipe(map(data => data.messages))
      .subscribe((result: Message[]) => {
        if (result) {
          this.messageHistory = result;
          // Scroll viewport to bottom
          this.scrollToBottom();
          this.isLoading = false;
        // Resolver failed, try with service
        } else {
          // Request message history
          this.messageService.getMessageHistory()
          .subscribe((res: Message[]) => {
            this.messageHistory = res;
            this.isLoading = false;
          });
        }
      // If error
      }, err => {
        this.isLoading = false;
        this.isError = true;
        this.error = err;
        console.log(err);
      });
    }, 0);
  }

  /**
   * Create new message
   */
  public sendMessage() {
    if (!this.newMessage) { return; }
    this.isLoading = true;
    // Get logged in user
    if (!this.currentUser) {
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
    } else {
      let message: Message = { text: this.newMessage, userId: this.currentUser.id }
       // Send new message
       this.messageService.createMessage(message)
       .subscribe(res => {
         // Create new message
         this.isLoading = false;
       }, err => {
        this.isLoading = false;
        this.isError = true;
        this.error = err;
      });
    }
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

  /**
   * Helper function to scoll to the bottom of virtual scroll viewport
   * Note: Hacky solution. There is no really good solution found
   */
  private scrollToBottom() {
    setTimeout(() => {
      this.virtualScrollViewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.virtualScrollViewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 50);
  }

}
