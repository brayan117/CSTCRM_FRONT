import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Evento } from '../../core/models';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class Timeline {
  readonly items = input.required<Evento[]>();
  readonly emptyMessage = input('Sin eventos registrados para este móvil.');
}
