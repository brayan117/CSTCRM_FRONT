import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AgendaDay, AgendaRow, CitaSlot } from '../../core/models';

@Component({
  selector: 'app-weekly-agenda',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-agenda.html',
  styleUrl: './weekly-agenda.css',
})
export class WeeklyAgenda {
  readonly rows = input.required<AgendaRow[]>();
  readonly interactive = input(false);
  readonly slotClick = output<{ slot: CitaSlot; hora: string; day: AgendaDay }>();

  readonly days: AgendaDay[] = [
    { key: 'lunes', label: 'Lunes', sub: '16 nov' },
    { key: 'martes', label: 'Martes', sub: '17 nov' },
    { key: 'miercoles', label: 'Miércoles', sub: '18 nov' },
    { key: 'jueves', label: 'Jueves', sub: '19 nov' },
    { key: 'viernes', label: 'Viernes', sub: '20 nov' },
  ];

  onSlot(slot: CitaSlot, hora: string, day: AgendaDay): void {
    if (this.interactive()) {
      this.slotClick.emit({ slot, hora, day });
    }
  }
}
