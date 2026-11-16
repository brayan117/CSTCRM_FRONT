import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';
import { DataTable } from '../../../../shared/data-table/data-table';
import { TableColumn } from '../../../../core/models';
import { Inventory } from '../../../../core/services/inventory';
import { Operations } from '../../../../core/services/operations';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class AdminClientes {
  readonly inventory = inject(Inventory);
  readonly operations = inject(Operations);

  readonly clientes = computed(() => {
    const map = new Map<string, { cliente: string; moviles: number; operaciones: number }>();
    for (const m of this.inventory.moviles()) {
      const entry = map.get(m.cliente) ?? { cliente: m.cliente, moviles: 0, operaciones: 0 };
      entry.moviles += 1;
      map.set(m.cliente, entry);
    }
    const movilCliente = new Map(this.inventory.moviles().map((m) => [m.id, m.cliente]));
    for (const o of this.operations.operaciones()) {
      const c = movilCliente.get(String(o.movil));
      if (c) {
        const entry = map.get(c);
        if (entry) entry.operaciones += 1;
      }
    }
    return [...map.values()].sort((a, b) => a.cliente.localeCompare(b.cliente));
  });

  readonly columns: TableColumn[] = [
    { key: 'cliente', label: 'Cliente', type: 'strong' },
    { key: 'moviles', label: 'Móviles' },
    { key: 'operaciones', label: 'Operaciones activas' },
  ];
}
