import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import {
  MOCK_ADMIN_PARENTS,
  MOCK_ADMIN_PAYMENTS,
  MOCK_ADMIN_PLAYERS,
  MOCK_ADMIN_USERS
} from '../mocks/admin.mock';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  readonly admins = signal(
    MOCK_ADMIN_USERS.map(admin => ({
      ...admin
    }))
  );
  readonly parents = signal(
    MOCK_ADMIN_PARENTS.map(parent => ({
      ...parent
    }))
  );

  readonly players = signal(
    MOCK_ADMIN_PLAYERS.map(player => ({
      ...player
    }))
  );

  readonly payments = signal(
    MOCK_ADMIN_PAYMENTS.map(payment => ({
      ...payment
    }))
  );


  readonly activeParents = computed(() =>
    this.parents().filter(
      parent => parent.status === 'ACTIVE'
    )
  );


  readonly activePlayers = computed(() =>
    this.players().filter(
      player => player.status === 'ACTIVE'
    )
  );

addAdmin(
  admin: {
    fullName: string;
    email: string;
    phone?: string;
  }
): void {

  const nextId =
    Math.max(
      1000,
      ...this.admins()
        .map(admin => admin.id)
    ) + 1;


  this.admins.update(admins => [
    ...admins,

    {
      id: nextId,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      status: 'ACTIVE'
    }

  ]);

}

  updateAdmin(
    adminId: number,
    changes: Partial<{
      fullName: string;
      email: string;
      phone: string;
    }>
  ): void {

    this.admins.update(admins =>
      admins.map(admin =>
        admin.id === adminId
          ? {
              ...admin,
              ...changes
            }
          : admin
      )
    );

  }


  deactivateAdmin(
    adminId: number
  ): void {

    this.admins.update(admins =>
      admins.map(admin =>
        admin.id === adminId
          ? {
              ...admin,
              status: 'INACTIVE'
            }
          : admin
      )
    );

  }


  reactivateAdmin(
    adminId: number
  ): void {

    this.admins.update(admins =>
      admins.map(admin =>
        admin.id === adminId
          ? {
              ...admin,
              status: 'ACTIVE'
            }
          : admin
      )
    );

  }

  playersForParent(
    parentId: number
  ) {

    return this.players().filter(
      player =>
        player.parentId === parentId
    );

  }


  deactivateParent(
    parentId: number
  ): void {

    this.parents.update(parents =>
      parents.map(parent =>
        parent.id === parentId
          ? {
              ...parent,
              status: 'INACTIVE'
            }
          : parent
      )
    );


    // Deactivating the parent also
    // deactivates all associated players.

    this.players.update(players =>
      players.map(player =>
        player.parentId === parentId
          ? {
              ...player,
              status: 'INACTIVE'
            }
          : player
      )
    );

  }

updatePlayer(
  playerId: number,
  changes: Partial<{
    firstName: string;
    lastName: string;
    program: 'Foundations' | 'Development' | 'Competitive';
  }>
): void {

  this.players.update(players =>
    players.map(player =>
      player.id === playerId
        ? {
            ...player,
            ...changes
          }
        : player
    )
  );

}


deactivatePlayer(
  playerId: number
): void {

  this.players.update(players =>
    players.map(player =>
      player.id === playerId
        ? {
            ...player,
            status: 'INACTIVE'
          }
        : player
    )
  );

}


reactivatePlayer(
  playerId: number
): void {

  this.players.update(players =>
    players.map(player =>
      player.id === playerId
        ? {
            ...player,
            status: 'ACTIVE'
          }
        : player
    )
  );

}


parentForPlayer(
  playerId: number
) {

  const player =
    this.players()
      .find(
        item =>
          item.id === playerId
      );

  if (!player) {
    return undefined;
  }

  return this.parents()
    .find(
      parent =>
        parent.id === player.parentId
    );

}

  reactivateParent(
    parentId: number
  ): void {

    this.parents.update(parents =>
      parents.map(parent =>
        parent.id === parentId
          ? {
              ...parent,
              status: 'ACTIVE'
            }
          : parent
      )
    );

    /*
     * We do NOT automatically reactivate
     * the players.
     *
     * Later the admin can decide which
     * players are returning.
     */

  }

}