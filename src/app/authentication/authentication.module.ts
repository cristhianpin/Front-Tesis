import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { ThemeModule } from '../@theme/theme.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { RequestPaswordComponent } from './request-password/request-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ConfirmComponent,
    ChangePasswordComponent,
    RequestPaswordComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    AuthenticationRoutingModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbSpinnerModule,
    NbAlertModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbFormFieldModule,
    NgxOtpInputModule,
    NbIconModule,
    TranslateModule,
  ],
})
export class AuthenticationModule {}
