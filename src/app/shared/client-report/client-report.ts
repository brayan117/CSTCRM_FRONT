import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Movil, Row, TableColumn } from '../../core/models';
import { Inventory } from '../../core/services/inventory';
import { Toast } from '../../core/services/toast';
import { Badge } from '../badge/badge';
import { DataTable } from '../data-table/data-table';
import { Panel } from '../panel/panel';
import { ProgressBar } from '../progress-bar/progress-bar';

interface ClientGroup {
  cliente: string;
  moviles: Movil[];
  reportan: number;
  noReportan: number;
  pct: number;
}

@Component({
  selector: 'app-client-report',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Panel, DataTable, ProgressBar, Badge],
  templateUrl: './client-report.html',
  styleUrl: './client-report.css',
})
export class ClientReport {
  readonly inventory = inject(Inventory);
  private readonly toast = inject(Toast);

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'Móvil', type: 'strong' },
    { key: 'placa', label: 'Placa' },
    { key: 'vehiculo', label: 'Vehículo', type: 'muted' },
    { key: 'equipo', label: 'Equipo', type: 'chip', variant: 'blue' },
    { key: 'sim', label: 'Simcard', type: 'chip', variant: 'gray' },
    { key: 'reporta', label: '¿Reporta?', type: 'badge' },
    { key: 'observacion', label: 'Observaciones', type: 'muted' },
  ];

  readonly groups = computed<ClientGroup[]>(() => {
    const map = new Map<string, Movil[]>();
    for (const movil of this.inventory.moviles()) {
      const list = map.get(movil.cliente) ?? [];
      list.push(movil);
      map.set(movil.cliente, list);
    }
    return Array.from(map, ([cliente, moviles]) => {
      const reportan = moviles.filter((m) => m.estado === 'operativo').length;
      return {
        cliente,
        moviles,
        reportan,
        noReportan: moviles.length - reportan,
        pct: Math.round((reportan / moviles.length) * 100),
      };
    });
  });

  readonly totalReportan = computed(
    () => this.inventory.moviles().filter((m) => m.estado === 'operativo').length,
  );
  readonly totalNoReportan = computed(
    () => this.inventory.moviles().filter((m) => m.estado !== 'operativo').length,
  );

  rowsFor(moviles: Movil[]): Row[] {
    return moviles.map((m) => ({
      ...m,
      vehiculo: `${m.marca} ${m.modelo}`,
      reporta: m.estado === 'operativo' ? 'Sí reporta' : 'No reporta',
      observacion: this.observacion(m),
    }));
  }

  exportCsv(): void {
    const header = 'Movil,Placa,Vehiculo,Equipo,Simcard,Cliente,Reporta,Observacion';
    const lines = this.inventory.moviles().map((m) =>
      [
        m.id,
        m.placa,
        `${m.marca} ${m.modelo}`,
        m.equipo,
        m.sim,
        m.cliente,
        m.estado === 'operativo' ? 'Si' : 'No',
        this.observacion(m),
      ].join(','),
    );
    const blob = new Blob([[header, ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reporte-comsatelites.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    this.toast.success('Reporte exportado a CSV.');
  }

  private observacion(movil: Movil): string {
    switch (movil.estado) {
      case 'operativo':
        return 'Equipo en línea, señal estable.';
      case 'taller':
        return 'Equipo en taller por falla, en revisión.';
      case 'desconectado':
        return 'Sin señal, se asigna técnico de campo.';
      default:
        return '—';
    }
  }
}
