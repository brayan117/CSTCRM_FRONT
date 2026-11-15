import { Injectable, computed, signal } from '@angular/core';
import { AGENDA } from '../mock-data';
import { AgendaRow, CitaSlot, Dia } from '../models';
import { loadState, saveState } from '../storage';

interface AgendaState {
  rows: AgendaRow[];
}

const STORAGE_KEY = 'comsatech.agenda.v1';

@Injectable({ providedIn: 'root' })
export class Agenda {
  private readonly state = signal<AgendaState>(
    loadState<AgendaState>(STORAGE_KEY, { rows: AGENDA }),
  );

  readonly rows = computed(() => this.state().rows);

  addCita(day: Dia, hora: string, slot: CitaSlot): void {
    this.state.update((s) => {
      const exists = s.rows.some((r) => r.hora === hora);
      const rows = exists
        ? s.rows.map((r) => (r.hora === hora ? ({ ...r, [day]: slot } as AgendaRow) : r))
        : [
            ...s.rows,
            {
              hora,
              lunes: null,
              martes: null,
              miercoles: null,
              jueves: null,
              viernes: null,
              [day]: slot,
            } as AgendaRow,
          ];
      return { rows: rows.sort((a, b) => a.hora.localeCompare(b.hora)) };
    });
    saveState(STORAGE_KEY, this.state());
  }
}
