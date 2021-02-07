import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  // Intercept every request and change their base url to api
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // Get url from environment
    const urlFromEnvironment = environment?.apiUrl ? environment.apiUrl : 'http://localhost:5001'
    // Set new base url
    const apiUrl = req.clone({ url: urlFromEnvironment + `/${req.url}` }); 
    return next.handle(apiUrl);
  }
}