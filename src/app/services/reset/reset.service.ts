import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  private resetSubject: Subject<boolean>;

  public resetEvent: Observable<boolean>;

  constructor() { 
    this.reset();
  }

  /**
   * Reset variables
   */
  private reset() {
    this.resetSubject = new Subject<boolean>()
    this.resetEvent = this.resetSubject.asObservable();
  }

  /**
   * Trigger reset event
   */
  public triggerResetEvent() {
    this.resetSubject.next(true);
  }
}
