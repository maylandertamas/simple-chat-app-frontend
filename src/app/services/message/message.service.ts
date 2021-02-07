import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Message } from 'src/app/interfaces/message';
import { ResetService } from '../reset/reset.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy, Resolve<any> {

  private messageHistory: Message[];
  private resetServiceSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private resetService: ResetService) {
      this.resetMessageHistory();
      this.subscribeToEvents();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getMessageHistory();
  }

  /**
   * On service destroy
   */
  ngOnDestroy(): void {
    this.resetServiceSubscription?.unsubscribe();
  }

  /**
   * Get message history
   */
  public getMessageHistory() : Observable<Message[]> {
    // return messages from cache if possible
    if (this.messageHistory && this.messageHistory.length > 0) {
      return new Observable<Message[]>(observer => {
        observer.next(this.messageHistory);
      }).pipe(first());
    }
    // request messages from server
    return this.http.get('api/messages').pipe(
      map((res: Message[]) => {
        this.messageHistory = res;
        return res
      }), first());
  }

  /**
   * Create new message
   * @param message
   */
  public createMessage(message: Message) : Observable<Message> {
    return this.http.post('api/messages', message).pipe(first());
  }

  /**
   * Reset message history cache
   */
  public resetMessageHistory() {
    this.messageHistory = [];
  }

  /**
   * Subscribe on events
   */
  public subscribeToEvents() {
    // subscribe to reset events
    this.resetServiceSubscription = this.resetService.resetEvent
    // Delete cache on reset event
    .subscribe(res => {
      if (res) {
        this.resetMessageHistory();
      }
    });
  }
}
