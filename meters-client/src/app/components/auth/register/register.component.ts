import {Component, DestroyRef, inject} from '@angular/core';
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthClient} from '../../../services/auth/auth-client';
import {AuthRequest} from '../../../models/auth/auth-request';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, EMPTY, tap} from 'rxjs';
import {TranslatePipe} from '../../../services/language/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    Button,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [TranslatePipe]
})
export class RegisterComponent {
  private destroyRef = inject(DestroyRef);
  private authClient = inject(AuthClient);
  private router = inject(Router);
  private translatePipe = inject(TranslatePipe);

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
    this.authClient.register(request)
      .pipe(
        catchError(err => {
          const metadata = err.error.metadata;
          if (Object.hasOwn(metadata, 'DuplicateUserName')) {
            this.error = this.translatePipe.transform('', 'UI:AUTH:CONFLICT');
          } else {
            const props = Object.keys(metadata);
            if (props.some(p => p.toLowerCase().includes('password'))) {
              this.error = this.translatePipe.transform('', 'UI:AUTH:PASSWORD_TROUBLE');
            }
          }
          return EMPTY;
        }),
        tap(async (token) => {
          this.authClient.saveToken(token);
          await this.router.navigate(['/']);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }
}
