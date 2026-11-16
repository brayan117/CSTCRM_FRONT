import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Row, RowActionEvent, TableAction, TableColumn } from '../../../../core/models';
import { Inventory } from '../../../../core/services/inventory';
import { Toast } from '../../../../core/services/toast';
import { DataTable } from '../../../../shared/data-table/data-table';
import { Modal } from '../../../../shared/modal/modal';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';

@Component({
  selector: 'app-comsatelites-moviles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, DataTable, Modal],
  templateUrl: './moviles.html',
  styleUrl: './moviles.css',
})
export class ComsatelitesMoviles {
  readonly inventory = inject(Inventory);
  private readonly toast = inject(Toast);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'placa', label: 'Placa' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'marca', label: 'Marca / Modelo' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'equipo', label: 'Equipo', type: 'chip', variant: 'blue' },
    { key: 'sim', label: 'Simcard', type: 'chip', variant: 'gray' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly actions: TableAction[] = [{ label: 'Hoja de vida →' }];

  readonly form = this.fb.nonNullable.group({
    placa: ['', [Validators.required]],
    tipo: ['Camioneta'],
    marca: [''],
    modelo: [''],
    cliente: ['', [Validators.required]],
    estado: ['operativo'],
    equipo: ['—'],
    sim: ['—'],
  });

  openNew(): void {
    this.form.reset({
      placa: '',
      tipo: 'Camioneta',
      marca: '',
      modelo: '',
      cliente: '',
      estado: 'operativo',
      equipo: '—',
      sim: '—',
    });
    this.modalOpen.set(true);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const movil = this.inventory.addMovil(this.form.getRawValue());
    this.toast.success(`Móvil ${movil.id} creado correctamente.`);
    this.modalOpen.set(false);
  }

  verHoja(row: Row): void {
    void this.router.navigate(['/comsatelites/hoja-vida'], {
      queryParams: { movil: String(row['id']) },
    });
  }

  onAction(event: RowActionEvent): void {
    this.verHoja(event.row);
  }
}
