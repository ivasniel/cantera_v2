import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import {
  RegistrationDraftService
} from '../../services/registration-draft.service';


@Component({
  selector: 'app-quick-registration',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './quick-registration.component.html',

  styleUrl:
    './quick-registration.component.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class QuickRegistrationComponent {

  @Input()
  selectedProgramId: string | null = null;


  @Output()
  readonly notice =
    new EventEmitter<string>();

  private readonly router =
    inject(Router);

  private readonly registrationDraft =
    inject(RegistrationDraftService);
    
  private readonly fb =
    inject(FormBuilder);


  readonly submitting =
    signal(false);


  readonly form =
    this.fb.nonNullable.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[0-9+()\-\s.]{7,20}$/
          )
        ]
      ]

    });


  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.notice.emit(
        'Please check the highlighted fields and try again.'
      );

      return;

    }


    const raw =
      this.form.getRawValue();


    this.registrationDraft.setDraft({

      fullName:
        raw.fullName.trim(),

      email:
        raw.email.trim(),

      phone:
        raw.phone.trim(),

      programId:
        this.selectedProgramId

    });


    this.router.navigate([
      '/register'
    ]);

  }

  invalid(
    field:
      'fullName' |
      'email' |
      'phone'
  ): boolean {

    const control =
      this.form.controls[field];


    return (
      control.invalid &&
      (
        control.dirty ||
        control.touched
      )
    );

  }

}