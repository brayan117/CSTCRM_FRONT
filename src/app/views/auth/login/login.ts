import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { homeRouteForRole } from '../../../core/navigation';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly show = signal(false);
  readonly error = signal('');
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  invalid(field: 'username' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.error.set('');
    this.loading.set(true);
    const { username, password } = this.form.getRawValue();

    setTimeout(() => {
      if (this.auth.login(username, password)) {
        void this.router.navigate([homeRouteForRole(this.auth.role())]);
      } else {
        this.error.set(
          'Usuario o contraseña incorrectos. Usa admin, cliente, tecnico o administrativo / 12345.',
        );
        this.loading.set(false);
      }
    }, 300);
  }
}
