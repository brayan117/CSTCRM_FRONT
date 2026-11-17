import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';
import { DataTable } from '../../../../shared/data-table/data-table';
import { Toast } from '../../../../core/services/toast';
import { Row, TableColumn } from '../../../../core/models';
import { Operations } from '../../../../core/services/operations';
import { Inventory } from '../../../../core/services/inventory';
import { loadState, saveState } from '../../../../core/storage';

const FACTURADAS_KEY = 'comsatech.facturadas.v1';

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

  private readonly facturadasState = signal<string[]>(
    loadState<string[]>(FACTURADAS_KEY, []),
  );

  private clave(h: { id?: string; movil: string; fecha: string; tipo: string }): string {
    return h.id ?? `${h.movil}-${h.fecha}-${h.tipo}`;
  }

  readonly rows = computed<Row[]>(() =>
    this.operations
      .historial()
      .filter((h) => h.resultado === 'Completado')
      .map((h) => ({
        ...h,
        opId: h.id ?? '—',
        cliente: this.clienteDe(h.movil),
        factura: this.facturadasState().includes(this.clave(h)) ? 'facturada' : 'pendiente',
      })),
  );

  readonly pendientes = computed(() => this.rows().filter((r) => r['factura'] === 'pendiente'));

  readonly columns: TableColumn[] = [
    { key: 'opId', label: 'Operación', type: 'strong' },
    { key: 'fecha', label: 'Fecha', type: 'muted' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'factura', label: 'Factura', type: 'badge' },
  ];

  clienteDe(movil: string): string {
    return this.inventory.movilById(movil)?.cliente ?? '—';
  }

  esPendiente(row: Row): boolean {
    return row['factura'] === 'pendiente';
  }

  facturar(row: Row): void {
    const h = row as { movil: string; fecha: string; tipo: string; id?: string };
    const clave = this.clave(h);
    if (this.facturadasState().includes(clave)) {
      return;
    }
    this.facturadasState.update((list) => {
      const next = [...list, clave];
      saveState(FACTURADAS_KEY, next);
      return next;
    });
    this.toast.success(
      `Factura generada para ${h.id ?? h.movil} · ${h.movil} (${h.fecha}).`,
    );
  }
}
