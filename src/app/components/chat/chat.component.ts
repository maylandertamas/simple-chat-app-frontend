import { Component, OnDestroy, OnInit, ViewChild, NgZone, HostListener } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Message } from '../../interfaces/message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message/message.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from 'src/app/interfaces/user';
import { map, take } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

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
  public scollItemSize: number;

  public newMessage = new FormControl('', [Validators.maxLength(1024)]);

  @ViewChild(CdkVirtualScrollViewport) virtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  /**
   Pop up confirmation dialog on leave page attempt 
   */
  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    if (this.newMessage.value && !this.isStringEmpty(this.newMessage.value)) {
      return confirm('Are you sure you want to leave the chat?');
    }
    return true;
  }

  constructor(private activeRoute: ActivatedRoute,
              private loginService: LoginService,
              private messageService: MessageService,
              private chatService: ChatService,
              private ngZone: NgZone) {
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
    // Get current user on init
    this.loginService.getLoggedInUser()
    .subscribe((res: User) =>
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
    this.scollItemSize = 0;
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
          this.scollItemSize = this.messageHistory.length;
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
    }, 2000);
  }

  /**
   * Create new message
   */
  public sendMessage() {
    if (this.isStringEmpty(this.newMessage.value) || this.newMessage.errors) { return null; }
    this.isLoading = true;
    // Get logged in user
    if (!this.currentUser) {
      this.loginService.getLoggedInUser()
      .subscribe((user: User) => {
        this.isLoading = false;
        // Create new message
        let message: Message = { text: this.newMessage.value, userId: user.id }
        // Send new message
        this.messageService.createMessage(message)
        .subscribe(res => {
          this.isLoading = false;
          this.newMessage.setValue('');
        });
      // If error happens
      }, err => {
        this.isLoading = false;
        this.isError = true;
        this.error = err;
      });
    // Curent user already loaded, so just send new message
    } else {
      let message: Message = { text: this.newMessage.value, userId: this.currentUser.id }
       // Send new message
       this.messageService.createMessage(message)
       .subscribe(res => {
         // Create new message
         this.isLoading = false;
         this.newMessage.setValue('');
       }, err => {
        this.isLoading = false;
        this.isError = true;
        this.error = err;
      });
    }
  }

  /**
   * Submit text message on enter
   * @param event
   */
  public enterSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  /**
   * Subscirbe to events
   */
  private subscribeToEvents() {
    // Subscribe to new message events 
    this.chatService.onNewMessageReceived
    .subscribe((newMessageReceived: Message) => {
      // Add new message to history, and force change detection
      this.messageHistory = [...this.messageHistory, newMessageReceived];
      this.scrollToBottom();
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

  /**
   * Helper function to resize text area for chat messages
   */
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  /**
   * Get error message if invalid chat message
   */ 
  public getErrorMessage() {
    if(this.newMessage.errors.maxlength) {
      return 'Chat message is too long';
    } 
    return 'Invalid chat message';
  }

  /**
   * Check if string is empty /\r|\n/
   * @param text
   */
  public isStringEmpty(text: string): boolean {
    return text === null || text.length <= 0 || text.match(/^\s*$/) !== null;
  };

  /**
   * Compare message dates if date label is required in chat
   * @param actualMessageDate
   * @param nextMessageDate 
   */
  public isDateLabelRequired(actualMessageDate: string, nextMessageDate: string) {
    if (!actualMessageDate || !nextMessageDate) { return false; }

    const actualMessageDateAsDate = new Date(actualMessageDate);
    const nextMessageDateAsDate = new Date(nextMessageDate);
    // If dates not equal
    if (actualMessageDateAsDate.getDate() !== nextMessageDateAsDate.getDate()) {
     return true;
    }
    // If hours not equal
    if (actualMessageDateAsDate.getHours() !== nextMessageDateAsDate.getHours()) {
      return true;
    }
    // If minutes not equal
    if (actualMessageDateAsDate.getMinutes() !== nextMessageDateAsDate.getMinutes()) {
      return true;
    }
    return false;
  }
}
