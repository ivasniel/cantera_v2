import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../../../services/auth.service';


@Component({
  selector: 'app-admin-account',

  imports: [
    FormsModule
  ],

  templateUrl: './admin-account.html',
  styleUrl: './admin-account.css'
})
export class AdminAccount {

  readonly auth =
    inject(AuthService);


  readonly editingProfile =
    signal(false);


  readonly showPassword =
    signal(false);


  readonly profileSaved =
    signal(false);


  readonly passwordSaved =
    signal(false);


  profile = {
    fullName:
      this.auth.user()?.fullName ?? '',

    email:
      this.auth.user()?.email ?? '',

    phone:
      this.auth.user()?.phone ?? ''
  };


  currentPassword = '';

  newPassword = '';

  confirmPassword = '';


  startEdit(): void {

    const user =
      this.auth.user();

    if (!user) {
      return;
    }


    this.profile = {
      fullName:
        user.fullName,

      email:
        user.email,

      phone:
        user.phone ?? ''
    };


    this.editingProfile.set(true);

    this.profileSaved.set(false);

  }


  cancelEdit(): void {

    this.editingProfile.set(false);

  }


  saveProfile(): void {

    if (
      !this.profile.fullName.trim() ||
      !this.profile.email.trim()
    ) {
      return;
    }


    this.auth.updateCurrentUser({
      fullName:
        this.profile.fullName.trim(),

      email:
        this.profile.email.trim(),

      phone:
        this.profile.phone.trim()
    });


    this.editingProfile.set(false);

    this.profileSaved.set(true);


    setTimeout(() => {
      this.profileSaved.set(false);
    }, 3500);

  }


  openPassword(): void {

    this.currentPassword = '';

    this.newPassword = '';

    this.confirmPassword = '';

    this.passwordSaved.set(false);

    this.showPassword.set(true);

  }


  closePassword(): void {

    this.showPassword.set(false);

  }


  changePassword(): void {

    if (
      !this.currentPassword ||
      this.newPassword.length < 6 ||
      this.newPassword !==
        this.confirmPassword
    ) {
      return;
    }


    /*
     * MOCK ONLY
     *
     * Later:
     *
     * PATCH /api/account/password
     */

    console.log(
      'MOCK PASSWORD CHANGE',
      {
        currentPassword:
          this.currentPassword,

        newPassword:
          this.newPassword
      }
    );


    this.showPassword.set(false);

    this.passwordSaved.set(true);


    setTimeout(() => {
      this.passwordSaved.set(false);
    }, 3500);

  }

}