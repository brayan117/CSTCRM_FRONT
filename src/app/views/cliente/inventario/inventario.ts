import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { DataTable } from '../../../shared/data-table/data-table';
import { TableColumn } from '../../../core/models';
import { Inventory } from '../../../core/services/inventory';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-cliente-inventario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class ClienteInventario {
  readonly inventory = inject(Inventory);
  private readonly auth = inject(Auth);

  readonly misMoviles = computed(() => {
    const cliente = this.auth.user()?.nombre ?? '';
    return this.inventory.moviles().filter((m) => m.cliente === cliente);
  });

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'placa', label: 'Placa' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'marca', label: 'Marca / Modelo' },
    { key: 'equipo', label: 'Equipo', type: 'chip', variant: 'blue' },
    { key: 'sim', label: 'Simcard', type: 'chip', variant: 'gray' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];
}
