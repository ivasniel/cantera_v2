import { Injectable, signal } from '@angular/core';

export interface RegistrationDraft {
  fullName: string;
  email: string;
  phone: string;
  programId?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationDraftService {

  readonly draft =
    signal<RegistrationDraft | null>(null);


  setDraft(
    draft: RegistrationDraft
  ): void {

    this.draft.set(draft);

  }


  clearDraft(): void {

    this.draft.set(null);

  }

}