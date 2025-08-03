import { Component } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from '../../@core/shared/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends NbRegisterComponent {
  user: any = {
    id : '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleName: 'estudiante',
  };

  showMessages = {
    success: false,
    error: false,
  };

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  constructor(public router: Router, private authService: AuthService, private toastrService: NbToastrService) {
    super(null, null, null, null);
  }

  register(): void {
    this.showMessages = { success: false, error: false };
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.authService.createSign(this.user).subscribe({
      next: () => {
        this.messages.push('Usuario registrado correctamente.');
        this.showMessages.success = true;
        this.toastrService.success('Registro exitoso.', 'Éxito');
        this.submitted = false;
        this.router.navigateByUrl(`/authentication/sign-in`);
      },
      error: (err) => {
        const backendMsg = err?.error?.message || 'Error al registrar el usuario.';
        this.errors.push(backendMsg);
        this.showMessages.error = true;
        this.toastrService.danger('Error al registrar.', 'Error');
        this.submitted = false;
      },
    });
  }
}
