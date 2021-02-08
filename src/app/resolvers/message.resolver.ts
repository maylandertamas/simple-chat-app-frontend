import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Message } from '../interfaces/message';
import { MessageService } from '../services/message/message.service';

@Injectable({
  providedIn: 'root'
})
export class MessageResolver implements Resolve<Message[]> {

  constructor(private messageService: MessageService) {}

  /**
   * Resolve message history
   * @param route 
   * @param state 
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Message[]> {
    return this.messageService.getMessageHistory();
  }
}
