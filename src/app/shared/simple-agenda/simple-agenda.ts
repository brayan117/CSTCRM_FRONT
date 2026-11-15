import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dia } from '../../core/models';
import { Agenda } from '../../core/services/agenda';
import { Toast } from '../../core/services/toast';
import { Modal } from '../modal/modal';
import { PageHeader } from '../page-header/page-header';
import { Panel } from '../panel/panel';
import { WeeklyAgenda } from '../weekly-agenda/weekly-agenda';

@Component({
  selector: 'app-simple-agenda',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, WeeklyAgenda, Modal],
  templateUrl: './simple-agenda.html',
  styleUrl: './simple-agenda.css',
})
export class SimpleAgenda {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly agenda = inject(Agenda);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);

  readonly form = this.fb.nonNullable.group({
    dia: ['lunes'],
    hora: ['09:00'],
    tipo: ['Mantenimiento'],
    detalle: ['', [Validators.required]],
    tecnico: [''],
  });

  openNew(): void {
    this.form.reset({
      dia: 'lunes',
      hora: '09:00',
      tipo: 'Mantenimiento',
      detalle: '',
      tecnico: '',
    });
    this.modalOpen.set(true);
  }

  save(): void {
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
      movil: value.detalle,
      tecnico: value.tecnico.trim() || 'Por asignar',
    });
    this.toast.success(`Cita de ${value.tipo} agregada el ${value.dia} a las ${value.hora}.`);
    this.modalOpen.set(false);
  }
}
