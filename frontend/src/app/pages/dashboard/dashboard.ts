import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../components/header/header.component';

import { AuthService } from '../../services/auth.service';


interface Player {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  program: string;
  status: string;
}


interface Payment {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
}


@Component({
  selector: 'app-dashboard',

  imports: [
    HeaderComponent,
    FormsModule,
    RouterLink
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  readonly auth = inject(AuthService);

  private readonly router =
    inject(Router);


  readonly editingProfile =
    signal(false);

  readonly editingPlayerId =
    signal<number | null>(null);

  readonly passwordMode =
    signal(false);


  profile = {
    name:
      this.auth.user()?.fullName ??
      'Parent Name',

    email:
      this.auth.user()?.email ??
      '',

    phone:
      '(305) 555-0123'
  };


  readonly players =
    signal<Player[]>([

      {
        id: 1,
        firstName: 'Mateo',
        lastName: 'Chile',
        birthDate: '2016-05-17',
        program: 'Development',
        status: 'Active'
      },

      {
        id: 2,
        firstName: 'Daniel',
        lastName: 'Chile',
        birthDate: '2013-08-22',
        program: 'Competitive',
        status: 'Active'
      }

    ]);


  readonly hasPaymentMethod =
    signal(false);


  readonly payments =
    signal<Payment[]>([

      {
        id: 1,
        date: 'Sep 1, 2026',
        description: 'Monthly Training',
        amount: 125,
        status: 'Paid'
      },

      {
        id: 2,
        date: 'Aug 1, 2026',
        description: 'Monthly Training',
        amount: 125,
        status: 'Paid'
      },

      {
        id: 3,
        date: 'Jul 1, 2026',
        description: 'Monthly Training',
        amount: 125,
        status: 'Paid'
      }

    ]);


  editPlayer(id: number): void {

    this.editingPlayerId.set(id);

  }


  savePlayer(): void {

    this.editingPlayerId.set(null);

  }


  saveProfile(): void {

    this.editingProfile.set(false);

  }


  setupPayment(): void {

    this.hasPaymentMethod.set(true);

  }


  logout(): void {

    this.auth.logout();

    this.router.navigate([
      '/'
    ]);

  }

}