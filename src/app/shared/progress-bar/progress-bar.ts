import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
})
export class ProgressBar {
  readonly value = input(0);
  readonly variant = computed(() => {
    const value = this.value();
    return value >= 70 ? '' : value >= 30 ? 'warn' : 'bad';
  });
}
