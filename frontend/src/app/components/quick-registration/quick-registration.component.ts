import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { HomeApiService } from '../../services/home-api.service';

@Component({
  selector: 'app-quick-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './quick-registration.component.html',
  styleUrl: './quick-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickRegistrationComponent {
  @Input() selectedProgramId: string | null = null;
  @Output() readonly notice = new EventEmitter<string>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(HomeApiService);

  readonly submitting = signal(false);
  readonly success = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+()\-\s.]{7,20}$/)]]
  });

  submit(): void {
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notice.emit('Please check the highlighted fields and try again.');
      return;
    }

    this.submitting.set(true);
    const raw = this.form.getRawValue();

    this.api.createRegistrationLead({
      ...raw,
      ...(this.selectedProgramId ? { programId: this.selectedProgramId } : {})
    })
    .pipe(finalize(() => this.submitting.set(false)))
    .subscribe({
      next: () => {
        this.success.set(true);
        this.form.reset();
        this.notice.emit('Thanks! Your information was received. We will continue with the parent registration flow next.');
      },
      error: () => this.notice.emit('We could not submit the form. Make sure the Node server is running and try again.')
    });
  }

  invalid(field: 'fullName' | 'email' | 'phone'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
