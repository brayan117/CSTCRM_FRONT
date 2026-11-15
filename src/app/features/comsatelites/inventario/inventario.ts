import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Row, TableColumn } from '../../../core/models';
import { Inventory } from '../../../core/services/inventory';
import { ClientReport } from '../../../shared/client-report/client-report';
import { DataTable } from '../../../shared/data-table/data-table';
import { KpiCard } from '../../../shared/kpi-card/kpi-card';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';

@Component({
  selector: 'app-comsatelites-inventario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeader, KpiCard, Panel, DataTable, ClientReport],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class ComsatelitesInventario {
  readonly inventory = inject(Inventory);
  private readonly router = inject(Router);

  readonly kpis = this.inventory.kpis;

  readonly movilesColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'placa', label: 'Placa' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'equipo', label: 'Equipo', type: 'chip', variant: 'blue' },
    { key: 'sim', label: 'Simcard', type: 'chip', variant: 'gray' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly equiposColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'marca', label: 'Marca' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly simColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'operador', label: 'Operador' },
    { key: 'plan', label: 'Plan' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly equiposRows = computed(() => this.inventory.equipos().slice(0, 5));
  readonly simRows = computed(() => this.inventory.simcards().slice(0, 5));

  verMovil(row: Row): void {
    void this.router.navigate(['/comsatelites/hoja-vida'], {
      queryParams: { movil: String(row['id']) },
    });
  }
}
