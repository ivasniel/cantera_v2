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
  AdminPlayer
} from '../../../models/admin.model';


type StatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'INACTIVE';


type ProgramFilter =
  | 'ALL'
  | 'Foundations'
  | 'Development'
  | 'Competitive';


@Component({
  selector: 'app-admin-players',

  imports: [
    FormsModule
  ],

  templateUrl: './admin-players.html',
  styleUrl: './admin-players.css'
})
export class AdminPlayers {

  readonly data =
    inject(AdminDataService);


  readonly search =
    signal('');


  readonly statusFilter =
    signal<StatusFilter>('ALL');


  readonly programFilter =
    signal<ProgramFilter>('ALL');


  readonly editingPlayerId =
    signal<number | null>(null);


  readonly confirmPlayer =
    signal<AdminPlayer | null>(null);


  readonly page =
    signal(1);


  readonly pageSize = 6;


  readonly filteredPlayers =
    computed(() => {

      const search =
        this.search()
          .trim()
          .toLowerCase();

      const status =
        this.statusFilter();

      const program =
        this.programFilter();


      return this.data.players()
        .filter(player => {

          const parent =
            this.data.parentForPlayer(
              player.id
            );

          const playerName =
            `${player.firstName} ${player.lastName}`
              .toLowerCase();


          const matchesSearch =
            !search ||
            playerName.includes(search) ||
            parent?.fullName
              .toLowerCase()
              .includes(search);


          const matchesStatus =
            status === 'ALL' ||
            player.status === status;


          const matchesProgram =
            program === 'ALL' ||
            player.program === program;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesProgram
          );

        });

    });


  readonly totalPages =
    computed(() =>
      Math.max(
        1,
        Math.ceil(
          this.filteredPlayers().length /
          this.pageSize
        )
      )
    );


  readonly paginatedPlayers =
    computed(() => {

      const page =
        Math.min(
          this.page(),
          this.totalPages()
        );

      const start =
        (page - 1) *
        this.pageSize;


      return this.filteredPlayers()
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
        this.filteredPlayers().length === 0
      ) {
        return 0;
      }

      return (
        (this.page() - 1) *
        this.pageSize
      ) + 1;

    });


  readonly lastResult =
    computed(() =>
      Math.min(
        this.page() *
        this.pageSize,
        this.filteredPlayers().length
      )
    );


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


  setProgram(
    program: ProgramFilter
  ): void {

    this.programFilter.set(program);

    this.page.set(1);

  }


  editPlayer(
    playerId: number
  ): void {

    this.editingPlayerId.set(
      playerId
    );

  }


  savePlayer(
    player: AdminPlayer
  ): void {

    this.data.updatePlayer(
      player.id,
      {
        firstName:
          player.firstName,

        lastName:
          player.lastName,

        program:
          player.program
      }
    );

    this.editingPlayerId.set(
      null
    );

  }


  requestDeactivate(
    player: AdminPlayer
  ): void {

    this.confirmPlayer.set(
      player
    );

  }


  cancelDeactivate(): void {

    this.confirmPlayer.set(
      null
    );

  }


  confirmDeactivate(): void {

    const player =
      this.confirmPlayer();

    if (!player) {
      return;
    }

    this.data.deactivatePlayer(
      player.id
    );

    this.confirmPlayer.set(
      null
    );

  }


  reactivate(
    player: AdminPlayer
  ): void {

    this.data.reactivatePlayer(
      player.id
    );

  }


  parentName(
    playerId: number
  ): string {

    return (
      this.data
        .parentForPlayer(playerId)
        ?.fullName ??
      'No Parent'
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