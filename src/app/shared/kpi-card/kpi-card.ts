import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  readonly icon = input('');
  readonly value = input<string | number>(0);
  readonly label = input('');
  readonly color = input<'blue' | 'cyan' | 'dark' | 'gray'>('blue');
}
