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
import { MessageService } from './services/message/message.service';
import { ChatComponent } from './components/chat/chat.component';
import { ResetService } from './services/reset/reset.service';
import { LogoutComponent } from './components/logout/logout.component';
import { MessageResolver } from './resolvers/message.resolver';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    // HTTP Interceptor to change base url on http requests
    {provide: HTTP_INTERCEPTORS,
    useClass: BaseUrlInterceptor,
    multi: true},
    // Services
    LoginService,
    ChatService,
    MessageService,
    ResetService,
    // Resolvers
    MessageResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
