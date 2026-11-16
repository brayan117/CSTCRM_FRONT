import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';
import { DataTable } from '../../../../shared/data-table/data-table';
import { Toast } from '../../../../core/services/toast';
import { TableColumn } from '../../../../core/models';
import { Operations } from '../../../../core/services/operations';
import { Inventory } from '../../../../core/services/inventory';

@Component({
  selector: 'app-admin-facturacion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './facturacion.html',
  styleUrl: './facturacion.css',
})
export class AdminFacturacion {
  readonly operations = inject(Operations);
  readonly inventory = inject(Inventory);
  private readonly toast = inject(Toast);

  readonly facturables = computed(() =>
    this.operations
      .historial()
      .filter((h) => h.resultado === 'Completado')
      .map((h) => ({ ...h, cliente: this.clienteDe(h.movil) })),
  );

  readonly columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', type: 'muted' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'resultado', label: 'Resultado', type: 'badge' },
    { key: 'obs', label: 'Observación', type: 'muted' },
  ];

  clienteDe(movil: string): string {
    return this.inventory.movilById(movil)?.cliente ?? '—';
  }

  facturar(movil: string, fecha: string): void {
    this.toast.success(`Factura generada para ${movil} (${fecha}) (demo).`);
  }
}
