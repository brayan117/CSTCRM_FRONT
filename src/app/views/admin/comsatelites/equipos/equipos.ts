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
  selector: 'app-comsatelites-equipos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, DataTable, Modal],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css',
})
export class ComsatelitesEquipos {
  readonly inventory = inject(Inventory);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'marca', label: 'Marca' },
    { key: 'serie', label: 'Serie', type: 'muted' },
    { key: 'movil', label: 'Móvil asignado', type: 'chip', variant: 'blue' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly form = this.fb.nonNullable.group({
    tipo: ['Terminal satelital'],
    marca: ['', [Validators.required]],
    serie: ['', [Validators.required]],
    estado: ['disponible'],
    movil: ['—'],
  });

  openNew(): void {
    this.form.reset({
      tipo: 'Terminal satelital',
      marca: '',
      serie: '',
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
    const equipo = this.inventory.addEquipo(this.form.getRawValue());
    this.toast.success(`Equipo ${equipo.id} creado correctamente.`);
    this.modalOpen.set(false);
  }
}
