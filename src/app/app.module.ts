import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ScrollingModule } from '@angular/cdk/scrolling';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    LogoutComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Material
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    MatIconModule
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
