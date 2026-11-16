import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableColumn } from '../../../../core/models';
import { Catalog } from '../../../../core/services/catalog';
import { DataTable } from '../../../../shared/data-table/data-table';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';

@Component({
  selector: 'app-comstreaming-contenido',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './contenido.html',
  styleUrl: './contenido.css',
})
export class ComstreamingContenido {
  readonly catalog = inject(Catalog);

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'canal', label: 'Canal' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'calidad', label: 'Calidad' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly rows = this.catalog.canales;
}
