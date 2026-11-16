import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableColumn } from '../../../../core/models';
import { Inventory } from '../../../../core/services/inventory';
import { Toast } from '../../../../core/services/toast';
import { DataTable } from '../../../../shared/data-table/data-table';
import { Modal } from '../../../../shared/modal/modal';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';

@Component({
  selector: 'app-comsatelites-simcards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, DataTable, Modal],
  templateUrl: './simcards.html',
  styleUrl: './simcards.css',
})
export class ComsatelitesSimcards {
  readonly inventory = inject(Inventory);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'operador', label: 'Operador' },
    { key: 'numero', label: 'Número', type: 'muted' },
    { key: 'plan', label: 'Plan' },
    { key: 'movil', label: 'Móvil asignado', type: 'chip', variant: 'blue' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly form = this.fb.nonNullable.group({
    operador: ['Claro'],
    numero: ['', [Validators.required]],
    plan: ['Datos 5GB'],
    estado: ['disponible'],
    movil: ['—'],
  });

  openNew(): void {
    this.form.reset({
      operador: 'Claro',
      numero: '',
      plan: 'Datos 5GB',
      estado: 'disponible',
      movil: '—',
    });
    this.modalOpen.set(true);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const sim = this.inventory.addSimcard(this.form.getRawValue());
    this.toast.success(`Simcard ${sim.id} creada correctamente.`);
    this.modalOpen.set(false);
  }
}
