import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { StepsComponent } from '../../components/steps/steps.component';
import { ProgramsComponent } from '../../components/programs/programs.component';
import { QuickRegistrationComponent } from '../../components/quick-registration/quick-registration.component';
import { BenefitsComponent } from '../../components/benefits/benefits.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    StepsComponent,
    ProgramsComponent,
    QuickRegistrationComponent,
    BenefitsComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly selectedProgramId = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  registerParent(): void {
    this.scrollToRegistration();
  }

  guideProtectedAction(action: 'player' | 'payment'): void {
    const message = action === 'player'
      ? 'Create or sign in to a parent account first. Then adding a player takes only a minute.'
      : 'Create or sign in to your parent account first to view and pay a player balance.';

    this.showToast(message);
    this.scrollToRegistration();
  }

  selectProgram(programId: string): void {
    this.selectedProgramId.set(programId);
    this.showToast('Program selected. Complete the quick registration form to continue.');
    this.scrollToRegistration();
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(null), 4200);
  }

  private scrollToRegistration(): void {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
