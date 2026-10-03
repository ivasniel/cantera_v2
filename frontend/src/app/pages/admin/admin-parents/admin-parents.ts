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
  AdminDataService
} from '../../../services/admin-data.service';

import {
  AdminParent
} from '../../../models/admin.model';


type StatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'INACTIVE';


@Component({
  selector: 'app-admin-parents',

  imports: [
    FormsModule
  ],

  templateUrl: './admin-parents.html',
  styleUrl: './admin-parents.css'
})
export class AdminParents {

  readonly data =
    inject(AdminDataService);


  readonly search =
    signal('');


  readonly statusFilter =
    signal<StatusFilter>('ALL');


  readonly expandedParentId =
    signal<number | null>(null);


  readonly confirmParent =
    signal<AdminParent | null>(null);


  readonly filteredParents =
    computed(() => {

      const search =
        this.search()
          .trim()
          .toLowerCase();


      const status =
        this.statusFilter();


      return this.data.parents()
        .filter(parent => {

          const matchesStatus =
            status === 'ALL' ||
            parent.status === status;


          const matchesSearch =
            !search ||
            parent.fullName
              .toLowerCase()
              .includes(search) ||

            parent.email
              .toLowerCase()
              .includes(search) ||

            parent.phone
              .toLowerCase()
              .includes(search);


          return (
            matchesStatus &&
            matchesSearch
          );

        });

    });

  readonly page = signal(1);

  readonly pageSize = 6;


  readonly totalPages = computed(() => {

    return Math.max(
      1,
      Math.ceil(
        this.filteredParents().length /
        this.pageSize
      )
    );

  });


  readonly paginatedParents = computed(() => {

    const currentPage =
      Math.min(
        this.page(),
        this.totalPages()
      );

    const start =
      (currentPage - 1) *
      this.pageSize;

    return this.filteredParents()
      .slice(
        start,
        start + this.pageSize
      );

  });


  readonly firstResult = computed(() => {

    if (
      this.filteredParents().length === 0
    ) {
      return 0;
    }

    return (
      (this.page() - 1) *
      this.pageSize
    ) + 1;

  });


  readonly lastResult = computed(() => {

    return Math.min(
      this.page() *
      this.pageSize,
      this.filteredParents().length
    );

  });

  readonly pageNumbers =
    computed(() => {

      return Array.from(
        {
          length:
            this.totalPages()
        },

        (_, index) =>
          index + 1
      );

    });

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

  toggleParent(
    parentId: number
  ): void {

    this.expandedParentId.update(
      current =>
        current === parentId
          ? null
          : parentId
    );

  }


  playerCount(
    parentId: number
  ): number {

    return this.data
      .playersForParent(parentId)
      .length;

  }


  activePlayerCount(
    parentId: number
  ): number {

    return this.data
      .playersForParent(parentId)
      .filter(
        player =>
          player.status === 'ACTIVE'
      )
      .length;

  }


  requestDeactivate(
    parent: AdminParent
  ): void {

    this.confirmParent.set(parent);

  }


  cancelDeactivate(): void {

    this.confirmParent.set(null);

  }


  confirmDeactivate(): void {

    const parent =
      this.confirmParent();

    if (!parent) {
      return;
    }


    this.data.deactivateParent(
      parent.id
    );

    this.confirmParent.set(null);

  }


  reactivate(
    parent: AdminParent
  ): void {

    this.data.reactivateParent(
      parent.id
    );

  }

}