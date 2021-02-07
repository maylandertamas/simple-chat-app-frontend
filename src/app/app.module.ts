import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ChatService } from './services/chat/chat.service';
import { LoginService } from './services/login/login.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BaseUrlInterceptor } from './http-interceptors/base-url-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    // HTTP Interceptor to change base url on http requests
    {provide: HTTP_INTERCEPTORS,
    useClass: BaseUrlInterceptor,
    multi: true},
    LoginService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
