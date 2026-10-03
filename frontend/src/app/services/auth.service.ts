import {
  Injectable,
  computed,
  signal
} from '@angular/core';


export type UserRole =
  | 'PARENT'
  | 'ADMIN';


export interface AuthUser {

  id: number;

  fullName: string;

  email: string;

  role: UserRole;

}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly storageKey =
    'la_cantera_mock_user';


  readonly user =
    signal<AuthUser | null>(
      this.readStoredUser()
    );


  readonly isLoggedIn =
    computed(
      () => this.user() !== null
    );


  readonly isAdmin =
    computed(
      () =>
        this.user()?.role === 'ADMIN'
    );


  readonly isParent =
    computed(
      () =>
        this.user()?.role === 'PARENT'
    );


  readonly initials =
    computed(() => {

      const user = this.user();

      if (!user) {
        return '';
      }

      return user.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(
          part =>
            part.charAt(0)
        )
        .join('')
        .toUpperCase();

    });


  login(
    email: string
  ): AuthUser {

    /*
     * MOCK LOGIN
     *
     * For now:
     *
     * admin@demo.com = ADMIN
     *
     * Any other email = PARENT
     */

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    const isAdmin =
      normalizedEmail ===
      'admin@demo.com';


    const user: AuthUser =
      isAdmin
        ? {
            id: 1000,
            fullName:
              'La Cantera Admin',
            email:
              normalizedEmail,
            role:
              'ADMIN'
          }
        : {
            id: 1,
            fullName:
              'Ivasniel Chile',
            email:
              normalizedEmail,
            role:
              'PARENT'
          };


    localStorage.setItem(
      this.storageKey,
      JSON.stringify(user)
    );


    this.user.set(user);


    return user;
  }


  logout(): void {

    localStorage.removeItem(
      this.storageKey
    );

    this.user.set(null);

  }


  private readStoredUser():
    AuthUser | null {

    const stored =
      localStorage.getItem(
        this.storageKey
      );


    if (!stored) {
      return null;
    }


    try {

      return JSON.parse(
        stored
      ) as AuthUser;

    } catch {

      localStorage.removeItem(
        this.storageKey
      );

      return null;

    }

  }

  updateCurrentUser(
    changes: Partial<{
      fullName: string;
      email: string;
      phone: string;
    }>
  ): void {

    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    const updatedUser = {
      ...currentUser,
      ...changes
    };

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(updatedUser)
    );

    this.user.set(updatedUser);
  }

}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
}

