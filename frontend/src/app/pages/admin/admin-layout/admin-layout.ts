import {
  Component,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  AuthService
} from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',

  imports: [
  RouterOutlet,
  RouterLink,
  RouterLinkActive
  ],

  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  readonly auth =
    inject(AuthService);

  private readonly router =
    inject(Router);

  logout(): void {

    this.auth.logout();

    this.router.navigate([
      '/'
    ]);

  }

}