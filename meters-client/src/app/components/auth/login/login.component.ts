import {Component, DestroyRef, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {Router, RouterLink} from '@angular/router';
import {AuthClient} from '../../../services/auth/auth-client';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthRequest} from '../../../models/auth/auth-request';
import {catchError, EMPTY, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Button,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private destroyRef = inject(DestroyRef);
  private authClient = inject(AuthClient);
  private router = inject(Router);

  public triedToSubmit = false;
  public error?: string;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    this.triedToSubmit = true;
    if (!this.form.valid) {
      return;
    }

    const request: AuthRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };
    this.authClient.login(request)
      .pipe(
        catchError(err => {
          if (err.status === 401) {
            this.error = 'Invalid credentials';
          } else if (err.status === 404) {
            this.error = err.error.description
          }
          return EMPTY;
        }),
        tap(async (token) => {
          this.authClient.saveToken(token);
          await this.router.navigate(['/'])
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }
}
