import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableColumn } from '../../../core/models';
import { Catalog } from '../../../core/services/catalog';
import { DataTable } from '../../../shared/data-table/data-table';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';

@Component({
  selector: 'app-comradios-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './operaciones.html',
  styleUrl: './operaciones.css',
})
export class ComradiosOperaciones {
  readonly catalog = inject(Catalog);

  readonly columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', type: 'muted' },
    { key: 'radio', label: 'Radio', type: 'chip', variant: 'blue' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'detalle', label: 'Detalle', type: 'muted' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly rows = this.catalog.radioOperaciones;
}
