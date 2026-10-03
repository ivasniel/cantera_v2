import { Component, computed, signal,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { HeaderComponent } from '../../components/header/header.component';
import {
  RegistrationDraftService
} from '../../services/registration-draft.service';

type ProgramType = 'FOUNDATIONS' | 'DEVELOPMENT' | 'COMPETITIVE';

interface ParentData {
  fullName: string;
  email: string;
  phone: string;
}

interface PlayerData {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  program: ProgramType | null;
}

interface ProgramOption {
  id: ProgramType;
  name: string;
  type: string;
  shortDescription: string;
  help: string;
  features: string[];
}

@Component({
  selector: 'app-register',
  imports: [
    HeaderComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  readonly step = signal(1);

  readonly submitting = signal(false);
  readonly completed = signal(false);

  private nextPlayerId = 2;
  private readonly registrationDraft =
  inject(RegistrationDraftService);

  parent: ParentData = {
    fullName: '',
    email: '',
    phone: ''
  };

  readonly players = signal<PlayerData[]>([
    {
      id: 1,
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      program: null
    }
  ]);

  readonly selectedProgramHelp = signal<ProgramType | null>(null);

  readonly programs: ProgramOption[] = [
    {
      id: 'FOUNDATIONS',
      name: 'Foundations',
      type: 'Recreational',
      shortDescription:
        'A fun introduction to soccer focused on fundamentals, confidence and enjoying the game.',
      help:
        'Foundations is a recreational program. Players train and participate in games, but official soccer association registration is not required.',
      features: [
        'Fundamental soccer skills',
        'Training and games',
        'Confidence and teamwork',
        'Recreational competition'
      ]
    },
    {
      id: 'DEVELOPMENT',
      name: 'Development',
      type: 'Recreational',
      shortDescription:
        'For players who want to improve technique, teamwork and their understanding of the game.',
      help:
        'Development remains recreational, but training becomes more advanced. Players can compete in games without requiring official association registration.',
      features: [
        'Technical development',
        'Game understanding',
        'Training and competition',
        'No association registration required'
      ]
    },
    {
      id: 'COMPETITIVE',
      name: 'Competitive',
      type: 'Competitive / Federated',
      shortDescription:
        'For players preparing to compete at a higher and officially registered level.',
      help:
        'Competitive is intended for players participating in officially registered competition. Additional soccer association registration and competitive requirements may apply.',
      features: [
        'Advanced training',
        'Competitive matches',
        'Tournament participation',
        'Association registration required'
      ]
    }
  ];

  readonly progress = computed(() => {
    return (this.step() / 4) * 100;
  });
constructor() {

  const draft =
    this.registrationDraft.draft();


  if (draft) {

    this.parent = {

      fullName:
        draft.fullName,

      email:
        draft.email,

      phone:
        draft.phone

    };


    console.log(
      'Quick registration received:',
      draft
    );


    this.registrationDraft.clearDraft();

  }

}
  goToStep(step: number): void {
    if (step < 1 || step > 4) {
      return;
    }

    this.step.set(step);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  continueParent(): void {
    if (
      !this.parent.fullName.trim() ||
      !this.parent.email.trim() ||
      !this.parent.phone.trim()
    ) {
      return;
    }

    this.goToStep(2);
  }

  continuePlayers(): void {
    const valid = this.players().every(player =>
      player.firstName.trim() &&
      player.lastName.trim() &&
      player.birthDate
    );

    if (!valid) {
      return;
    }

    this.goToStep(3);
  }

  continuePrograms(): void {
    const valid = this.players().every(
      player => player.program !== null
    );

    if (!valid) {
      return;
    }

    this.goToStep(4);
  }

  addPlayer(): void {
    this.players.update(players => [
      ...players,
      {
        id: this.nextPlayerId++,
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        program: null
      }
    ]);
  }

  removePlayer(id: number): void {
    if (this.players().length === 1) {
      return;
    }

    this.players.update(
      players => players.filter(player => player.id !== id)
    );
  }

  updatePlayer(
    id: number,
    field: keyof PlayerData,
    value: string
  ): void {

    this.players.update(players =>
      players.map(player =>
        player.id === id
          ? {
              ...player,
              [field]: value
            }
          : player
      )
    );
  }

  selectProgram(
    playerId: number,
    program: ProgramType
  ): void {

    this.players.update(players =>
      players.map(player =>
        player.id === playerId
          ? {
              ...player,
              program
            }
          : player
      )
    );

    this.selectedProgramHelp.set(program);
  }

  programFor(
    programId: ProgramType
  ): ProgramOption | undefined {
    return this.programs.find(
      program => program.id === programId
    );
  }

  finishWithoutBilling(): void {
    this.finishRegistration(false);
  }

  setupBilling(): void {
    /*
     * Mock for now.
     *
     * Later:
     * Stripe SetupIntent / PaymentMethod
     */
    this.finishRegistration(true);
  }

  private finishRegistration(
    billingConfigured: boolean
  ): void {

    this.submitting.set(true);

    const mockPayload = {
      parent: this.parent,

      players: this.players(),

      billingStatus: billingConfigured
        ? 'CONFIGURED'
        : 'NOT_CONFIGURED'
    };

    console.log(
      'MOCK REGISTRATION PAYLOAD',
      mockPayload
    );

    setTimeout(() => {
      this.submitting.set(false);
      this.completed.set(true);
    }, 700);
  }
}