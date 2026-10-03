import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../components/header/header.component';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  playerAge: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [
    HeaderComponent,
    FormsModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  readonly submitting = signal(false);
  readonly submitted = signal(false);

  form: ContactForm = {
    name: '',
    email: '',
    phone: '',
    playerAge: '',
    subject: '',
    message: ''
  };

  submitForm(): void {

    if (
      !this.form.name ||
      !this.form.email ||
      !this.form.message
    ) {
      return;
    }

    this.submitting.set(true);
    this.submitted.set(false);

    // Mock request.
    // Later this will call POST /api/contact
    setTimeout(() => {

      this.submitting.set(false);
      this.submitted.set(true);

      this.form = {
        name: '',
        email: '',
        phone: '',
        playerAge: '',
        subject: '',
        message: ''
      };

      setTimeout(() => {
        this.submitted.set(false);
      }, 5000);

    }, 700);
  }
}