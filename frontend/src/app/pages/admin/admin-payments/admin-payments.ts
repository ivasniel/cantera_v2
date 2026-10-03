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
  AdminPayment,
  PaymentStatus
} from '../../../models/admin.model';


type PaymentStatusFilter =
  | 'ALL'
  | PaymentStatus;


@Component({
  selector: 'app-admin-payments',

  imports: [
    FormsModule
  ],

  templateUrl: './admin-payments.html',
  styleUrl: './admin-payments.css'
})
export class AdminPayments {

  readonly data =
    inject(AdminDataService);


  readonly search =
    signal('');


  readonly selectedMonth =
    signal('2026-10');


  readonly statusFilter =
    signal<PaymentStatusFilter>('ALL');


  readonly paidLessThan =
    signal<number | null>(null);


  readonly page =
    signal(1);


  readonly pageSize = 6;


  readonly availableMonths = [
    {
      value: '2026-10',
      label: 'October 2026'
    },
    {
      value: '2026-09',
      label: 'September 2026'
    },
    {
      value: '2026-08',
      label: 'August 2026'
    }
  ];


  readonly monthPayments =
    computed(() =>
      this.data.payments()
        .filter(
          payment =>
            payment.month ===
            this.selectedMonth()
        )
    );


  readonly filteredPayments =
    computed(() => {

      const search =
        this.search()
          .trim()
          .toLowerCase();

      const status =
        this.statusFilter();

      const lessThan =
        this.paidLessThan();


      return this.monthPayments()
        .filter(payment => {

          const player =
            this.data.players()
              .find(
                item =>
                  item.id ===
                  payment.playerId
              );


          const parent =
            player
              ? this.data.parents()
                  .find(
                    item =>
                      item.id ===
                      player.parentId
                  )
              : undefined;


          const playerName =
            player
              ? `${player.firstName} ${player.lastName}`
                  .toLowerCase()
              : '';


          const parentName =
            parent
              ?.fullName
              .toLowerCase() ?? '';


          const matchesSearch =
            !search ||
            playerName.includes(search) ||
            parentName.includes(search);


          const matchesStatus =
            status === 'ALL' ||
            payment.status === status;


          const matchesAmount =
            lessThan === null ||
            payment.paidAmount < lessThan;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesAmount
          );

        });

    });


  readonly totalExpected =
    computed(() =>
      this.monthPayments()
        .reduce(
          (total, payment) =>
            total +
            payment.expectedAmount,
          0
        )
    );


  readonly totalCollected =
    computed(() =>
      this.monthPayments()
        .reduce(
          (total, payment) =>
            total +
            payment.paidAmount,
          0
        )
    );


  readonly outstanding =
    computed(() =>
      this.monthPayments()
        .reduce(
          (total, payment) =>
            total +
            Math.max(
              payment.expectedAmount -
              payment.paidAmount,
              0
            ),
          0
        )
    );


  readonly paidCount =
    computed(() =>
      this.monthPayments()
        .filter(
          payment =>
            payment.status === 'PAID'
        )
        .length
    );


  readonly partialCount =
    computed(() =>
      this.monthPayments()
        .filter(
          payment =>
            payment.status === 'PARTIAL'
        )
        .length
    );


  readonly unpaidCount =
    computed(() =>
      this.monthPayments()
        .filter(
          payment =>
            payment.status === 'UNPAID'
        )
        .length
    );


  readonly collectionRate =
    computed(() => {

      const expected =
        this.totalExpected();

      if (!expected) {
        return 0;
      }

      return Math.round(
        (
          this.totalCollected() /
          expected
        ) * 100
      );

    });


  readonly totalPages =
    computed(() =>
      Math.max(
        1,
        Math.ceil(
          this.filteredPayments().length /
          this.pageSize
        )
      )
    );


  readonly paginatedPayments =
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


      return this.filteredPayments()
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
        this.filteredPayments()
          .length === 0
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

        this.filteredPayments()
          .length
      )
    );


  setSearch(
    value: string
  ): void {

    this.search.set(value);

    this.page.set(1);

  }


  setMonth(
    month: string
  ): void {

    this.selectedMonth.set(month);

    this.page.set(1);

  }


  setStatus(
    status: PaymentStatusFilter
  ): void {

    this.statusFilter.set(status);

    this.page.set(1);

  }


  setPaidLessThan(
    value: string
  ): void {

    const numberValue =
      Number(value);


    if (
      value.trim() === '' ||
      Number.isNaN(numberValue)
    ) {

      this.paidLessThan.set(
        null
      );

    } else {

      this.paidLessThan.set(
        numberValue
      );

    }


    this.page.set(1);

  }


  clearFilters(): void {

    this.search.set('');

    this.statusFilter.set('ALL');

    this.paidLessThan.set(null);

    this.page.set(1);

  }


  playerName(
    payment: AdminPayment
  ): string {

    const player =
      this.data.players()
        .find(
          item =>
            item.id ===
            payment.playerId
        );


    if (!player) {
      return 'Unknown Player';
    }


    return (
      `${player.firstName} ${player.lastName}`
    );

  }


  parentName(
    payment: AdminPayment
  ): string {

    const player =
      this.data.players()
        .find(
          item =>
            item.id ===
            payment.playerId
        );


    if (!player) {
      return 'Unknown Parent';
    }


    const parent =
      this.data.parents()
        .find(
          item =>
            item.id ===
            player.parentId
        );


    return (
      parent?.fullName ??
      'Unknown Parent'
    );

  }


  remaining(
    payment: AdminPayment
  ): number {

    return Math.max(
      payment.expectedAmount -
      payment.paidAmount,
      0
    );

  }


  exportFiltered(): void {

    const rows =
      this.filteredPayments();


    const header = [
      'Player',
      'Parent',
      'Month',
      'Expected',
      'Paid',
      'Remaining',
      'Status',
      'Paid At'
    ];


    const dataRows =
      rows.map(payment => [

        this.playerName(payment),

        this.parentName(payment),

        payment.month,

        payment.expectedAmount,

        payment.paidAmount,

        this.remaining(payment),

        payment.status,

        payment.paidAt ?? ''

      ]);


    const csv =
      [
        header,
        ...dataRows
      ]
        .map(row =>
          row
            .map(value =>
              `"${String(value)
                .replaceAll('"', '""')}"`
            )
            .join(',')
        )
        .join('\n');


    const blob =
      new Blob(
        [csv],
        {
          type:
            'text/csv;charset=utf-8'
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        'a'
      );


    link.href = url;

    link.download =
      `la-cantera-payments-${this.selectedMonth()}.csv`;


    link.click();


    URL.revokeObjectURL(
      url
    );

  }


  exportUnpaid(): void {

    const previousStatus =
      this.statusFilter();

    this.statusFilter.set(
      'UNPAID'
    );

    this.exportFiltered();

    this.statusFilter.set(
      previousStatus
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