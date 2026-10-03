import {
  Component,
  computed,
  signal
} from '@angular/core';

import {
  MOCK_ADMIN_PARENTS,
  MOCK_ADMIN_PAYMENTS,
  MOCK_ADMIN_PLAYERS
} from '../../../mocks/admin.mock';
import { HeaderComponent } from '../../../components/header/header.component';

import {
  inject
} from '@angular/core';

import {
  AdminDataService
} from '../../../services/admin-data.service';

@Component({
  selector: 'app-admin-dashboard',

  imports: [HeaderComponent],

  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  readonly data =
  inject(AdminDataService);

  readonly selectedMonth =
    signal('2026-10');


  readonly parents =
    this.data.parents;

  readonly players =
    this.data.players;

  readonly payments =
    this.data.payments;

  readonly activeParents =
    this.data.activeParents;


  readonly activePlayers =
    this.data.activePlayers;


  readonly monthPayments =
    computed(() =>
      this.payments()
        .filter(
          payment =>
            payment.month ===
            this.selectedMonth()
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


  readonly attentionPayments =
    computed(() =>
      this.monthPayments()
        .filter(
          payment =>
            payment.status !== 'PAID'
        )
    );


  playerName(
    playerId: number
  ): string {

    const player =
      this.players()
        .find(
          item =>
            item.id === playerId
        );


    if (!player) {
      return 'Unknown Player';
    }


    return `${player.firstName} ${player.lastName}`;

  }


  parentName(
    playerId: number
  ): string {

    const player =
      this.players()
        .find(
          item =>
            item.id === playerId
        );


    if (!player) {
      return '';
    }


    const parent =
      this.parents()
        .find(
          item =>
            item.id === player.parentId
        );


    return parent?.fullName ?? '';

  }

}