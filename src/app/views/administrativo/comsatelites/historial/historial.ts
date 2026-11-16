import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';
import { DataTable } from '../../../../shared/data-table/data-table';
import { TableColumn } from '../../../../core/models';
import { Operations } from '../../../../core/services/operations';

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class AdminHistorial {
  readonly operations = inject(Operations);

  readonly columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', type: 'muted' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'resultado', label: 'Resultado', type: 'badge' },
    { key: 'obs', label: 'Observación', type: 'muted' },
  ];

  readonly rows = computed(() =>
    this.operations.historial().map((h) => ({ ...h })),
  );
}
