import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../../../services/auth.service';

import {
  AdminDataService
} from '../../../services/admin-data.service';

import {
  AdminUser
} from '../../../models/admin.model';


type StatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'INACTIVE';


@Component({
  selector: 'app-admin-users',

  imports: [
    FormsModule
  ],

  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers {

  readonly auth =
    inject(AuthService);

  readonly data =
    inject(AdminDataService);


  readonly search =
    signal('');

  readonly statusFilter =
    signal<StatusFilter>('ALL');

  readonly page =
    signal(1);

  readonly pageSize = 6;


  readonly editingAdminId =
    signal<number | null>(null);

  readonly showAddAdmin =
    signal(false);

  readonly confirmAdmin =
    signal<AdminUser | null>(null);

  readonly passwordAdmin =
    signal<AdminUser | null>(null);


  newAdmin = {
    fullName: '',
    email: '',
    phone: ''
  };


  newPassword = '';

  confirmPassword = '';


  readonly filteredAdmins =
    computed(() => {

      const search =
        this.search()
          .trim()
          .toLowerCase();

      const status =
        this.statusFilter();


      return this.data.admins()
        .filter(admin => {

          const matchesSearch =
            !search ||
            admin.fullName
              .toLowerCase()
              .includes(search) ||
            admin.email
              .toLowerCase()
              .includes(search) ||
            (
              admin.phone ?? ''
            )
              .toLowerCase()
              .includes(search);


          const matchesStatus =
            status === 'ALL' ||
            admin.status === status;


          return (
            matchesSearch &&
            matchesStatus
          );

        });

    });


  readonly totalPages =
    computed(() =>
      Math.max(
        1,
        Math.ceil(
          this.filteredAdmins().length /
          this.pageSize
        )
      )
    );


  readonly paginatedAdmins =
    computed(() => {

      const currentPage =
        Math.min(
          this.page(),
          this.totalPages()
        );

      const start =
        (
          currentPage - 1
        ) * this.pageSize;


      return this.filteredAdmins()
        .slice(
          start,
          start + this.pageSize
        );

    });


  readonly pageNumbers =
    computed(() =>
      Array.from(
        {
          length:
            this.totalPages()
        },
        (_, index) =>
          index + 1
      )
    );


  readonly firstResult =
    computed(() => {

      if (
        this.filteredAdmins().length === 0
      ) {
        return 0;
      }

      return (
        (
          this.page() - 1
        ) * this.pageSize
      ) + 1;

    });


  readonly lastResult =
    computed(() =>
      Math.min(
        this.page() *
        this.pageSize,
        this.filteredAdmins().length
      )
    );


  isCurrentAdmin(
    admin: AdminUser
  ): boolean {

    return (
      this.auth.user()?.id ===
      admin.id
    );

  }


  setSearch(
    value: string
  ): void {

    this.search.set(value);

    this.page.set(1);

  }


  setStatus(
    status: StatusFilter
  ): void {

    this.statusFilter.set(status);

    this.page.set(1);

  }


  editAdmin(
    adminId: number
  ): void {

    this.editingAdminId.set(
      adminId
    );

  }


  saveAdmin(
    admin: AdminUser
  ): void {

    this.data.updateAdmin(
      admin.id,
      {
        fullName:
          admin.fullName,

        email:
          admin.email,

        phone:
          admin.phone ?? ''
      }
    );

    this.editingAdminId.set(
      null
    );

  }


  openAddAdmin(): void {

    this.newAdmin = {
      fullName: '',
      email: '',
      phone: ''
    };

    this.showAddAdmin.set(
      true
    );

  }


  closeAddAdmin(): void {

    this.showAddAdmin.set(
      false
    );

  }


  saveNewAdmin(): void {

    if (
      !this.newAdmin.fullName.trim() ||
      !this.newAdmin.email.trim()
    ) {
      return;
    }


    this.data.addAdmin(
      this.newAdmin
    );


    this.showAddAdmin.set(
      false
    );

  }


  requestDeactivate(
    admin: AdminUser
  ): void {

    if (
      this.isCurrentAdmin(admin)
    ) {
      return;
    }


    this.confirmAdmin.set(
      admin
    );

  }


  cancelDeactivate(): void {

    this.confirmAdmin.set(
      null
    );

  }


  confirmDeactivate(): void {

    const admin =
      this.confirmAdmin();

    if (!admin) {
      return;
    }


    if (
      this.isCurrentAdmin(admin)
    ) {
      return;
    }


    this.data.deactivateAdmin(
      admin.id
    );

    this.confirmAdmin.set(
      null
    );

  }


  reactivate(
    admin: AdminUser
  ): void {

    this.data.reactivateAdmin(
      admin.id
    );

  }


  openPassword(
    admin: AdminUser
  ): void {

    this.newPassword = '';

    this.confirmPassword = '';

    this.passwordAdmin.set(
      admin
    );

  }


  closePassword(): void {

    this.passwordAdmin.set(
      null
    );

  }


  savePassword(): void {

    if (
      this.newPassword.length < 6 ||
      this.newPassword !==
      this.confirmPassword
    ) {
      return;
    }


    console.log(
      'MOCK PASSWORD CHANGE',
      {
        adminId:
          this.passwordAdmin()?.id,

        newPassword:
          this.newPassword
      }
    );


    this.passwordAdmin.set(
      null
    );

  }


  goToPage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages()
    ) {
      return;
    }

    this.page.set(page);

  }


  previousPage(): void {

    if (
      this.page() > 1
    ) {

      this.page.update(
        page => page - 1
      );

    }

  }


  nextPage(): void {

    if (
      this.page() <
      this.totalPages()
    ) {

      this.page.update(
        page => page + 1
      );

    }

  }

}