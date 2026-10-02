import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  @Output() readonly registerClick = new EventEmitter<void>();
  @Output() readonly addPlayerClick = new EventEmitter<void>();
  @Output() readonly payClick = new EventEmitter<void>();
}
