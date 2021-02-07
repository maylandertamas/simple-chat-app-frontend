import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { MessageService } from './services/message/message.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard], resolve: { messages: MessageService }},
  {path:'**', redirectTo: '/login'},
  {path: '', pathMatch: 'full', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
