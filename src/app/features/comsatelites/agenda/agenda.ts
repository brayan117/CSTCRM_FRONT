import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgendaDay, CitaSlot, Dia } from '../../../core/models';
import { Agenda } from '../../../core/services/agenda';
import { Inventory } from '../../../core/services/inventory';
import { Toast } from '../../../core/services/toast';
import { Badge } from '../../../shared/badge/badge';
import { Modal } from '../../../shared/modal/modal';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { WeeklyAgenda } from '../../../shared/weekly-agenda/weekly-agenda';

@Component({
  selector: 'app-comsatelites-agenda',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, WeeklyAgenda, Modal, Badge],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class ComsatelitesAgenda {
  readonly inventory = inject(Inventory);
  readonly agenda = inject(Agenda);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly citaOpen = signal(false);
  readonly newOpen = signal(false);
  readonly selectedCita = signal<{ slot: CitaSlot; hora: string; day: AgendaDay } | null>(null);

  readonly detalle = computed(() => {
    const cita = this.selectedCita();
    if (!cita) {
      return null;
    }
    const movil = this.inventory.movilById(cita.slot.movil);
    const equipo = this.inventory.equipoById(cita.slot.equipo ?? movil?.equipo ?? '');
    const sim = this.inventory.simById(cita.slot.sim ?? movil?.sim ?? '');
    return { cita, movil, equipo, sim };
  });

  readonly form = this.fb.nonNullable.group({
    dia: ['lunes'],
    hora: ['09:00'],
    tipo: ['Mantenimiento'],
    movil: [this.inventory.moviles()[0]?.id ?? '', [Validators.required]],
    tecnico: [this.inventory.tecnicos()[0]?.nombre ?? '', [Validators.required]],
    obs: [''],
  });

  openCita(event: { slot: CitaSlot; hora: string; day: AgendaDay }): void {
    this.selectedCita.set(event);
    this.citaOpen.set(true);
  }

  atenderCita(): void {
    const detalle = this.detalle();
    this.citaOpen.set(false);
    if (detalle) {
      this.toast.success(
        `Cita de ${detalle.cita.slot.t} para ${detalle.movil?.id ?? detalle.cita.slot.movil} marcada como atendida.`,
      );
    }
  }

  openNew(): void {
    this.form.reset({
      dia: 'lunes',
      hora: '09:00',
      tipo: 'Mantenimiento',
      movil: this.inventory.moviles()[0]?.id ?? '',
      tecnico: this.inventory.tecnicos()[0]?.nombre ?? '',
      obs: '',
    });
    this.newOpen.set(true);
  }

  saveCita(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const classes: Record<string, string> = {
      Mantenimiento: 's-mant',
      Instalación: 's-inst',
      'Activación SIM': 's-act',
      Otro: 's-mant',
    };
    this.agenda.addCita(value.dia as Dia, value.hora, {
      t: value.tipo,
      c: classes[value.tipo] ?? 's-mant',
      movil: value.movil,
      tecnico: value.tecnico,
    });
    this.toast.success(`Cita de ${value.tipo} agregada el ${value.dia} a las ${value.hora}.`);
    this.newOpen.set(false);
  }
}
