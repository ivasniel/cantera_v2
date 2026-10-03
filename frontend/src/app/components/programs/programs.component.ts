import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AcademyProgram } from '../../models/program.model';
import { HomeApiService } from '../../services/home-api.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramsComponent {
  @Output() readonly programSelected = new EventEmitter<string>();

  private readonly api = inject(HomeApiService);

  readonly fallbackPrograms: AcademyProgram[] = [
    { id: 'foundations', ageRange: 'AGES 6–8', title: 'Foundations', description: 'Fun, structured training to build confidence and fundamental skills.', image: 'assets/images/program-foundations.png' },
    { id: 'development', ageRange: 'AGES 9–12', title: 'Development', description: 'Technical skills, teamwork, and game understanding.', image: 'assets/images/program-development.png' },
    { id: 'competitive', ageRange: 'AGES 13–16', title: 'Competitive', description: 'Advanced training for dedicated players ready for the next level.', image: 'assets/images/program-competitive.png' }
  ];

  readonly programs = signal<AcademyProgram[]>(this.fallbackPrograms);

  constructor() {
    this.api.getPrograms()
      .pipe(catchError(() => of(this.fallbackPrograms)))
      .subscribe((programs) => this.programs.set(programs));
  }
}
