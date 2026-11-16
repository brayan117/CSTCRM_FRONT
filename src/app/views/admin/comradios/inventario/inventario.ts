import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableColumn } from '../../../../core/models';
import { Catalog } from '../../../../core/services/catalog';
import { Toast } from '../../../../core/services/toast';
import { DataTable } from '../../../../shared/data-table/data-table';
import { KpiCard } from '../../../../shared/kpi-card/kpi-card';
import { Modal } from '../../../../shared/modal/modal';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';

@Component({
  selector: 'app-comradios-inventario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, KpiCard, Panel, DataTable, Modal],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class ComradiosInventario {
  readonly catalog = inject(Catalog);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);
  readonly kpis = this.catalog.radiosKpis;

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'marca', label: 'Marca / Modelo' },
    { key: 'serial', label: 'Serial', type: 'muted' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly form = this.fb.nonNullable.group({
    tipo: ['Portátil'],
    marca: ['', [Validators.required]],
    serial: ['', [Validators.required]],
    cliente: ['', [Validators.required]],
    estado: ['operativo'],
  });

  openNew(): void {
    this.form.reset({
      tipo: 'Portátil',
      marca: '',
      serial: '',
      cliente: '',
      estado: 'operativo',
    });
    this.modalOpen.set(true);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const radio = this.catalog.addRadio(this.form.getRawValue());
    this.toast.success(`Radio ${radio.id} creado correctamente.`);
    this.modalOpen.set(false);
  }
}
