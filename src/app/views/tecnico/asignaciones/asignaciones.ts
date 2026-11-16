import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { DataTable } from '../../../shared/data-table/data-table';
import { Toast } from '../../../core/services/toast';
import { TableColumn } from '../../../core/models';
import { Operations } from '../../../core/services/operations';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-tecnico-asignaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel, DataTable],
  templateUrl: './asignaciones.html',
  styleUrl: './asignaciones.css',
})
export class TecnicoAsignaciones {
  readonly operations = inject(Operations);
  private readonly auth = inject(Auth);
  private readonly toast = inject(Toast);

  private readonly tecnicoNombre = computed(() => this.auth.user()?.nombre ?? '');

  readonly misOperaciones = computed(() =>
    this.operations
      .operaciones()
      .filter((o) => o.tecnico === this.tecnicoNombre()),
  );

  readonly sinAceptar = computed(() =>
    this.misOperaciones().filter((o) => o.estado === 'pendiente'),
  );

  readonly enProceso = computed(() =>
    this.misOperaciones().filter((o) => o.estado === 'en proceso'),
  );

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'inicio', label: 'Inicio', type: 'muted' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'obs', label: 'Observación', type: 'muted' },
  ];

  aceptar(id: string): void {
    this.operations.updateOperacion(id, { estado: 'en proceso', avance: 10 });
    this.toast.success(`Asignación ${id} aceptada.`);
  }

  finalizar(id: string): void {
    this.operations.updateOperacion(id, { estado: 'completado', avance: 100 });
    this.toast.success(`Operación ${id} completada y enviada al historial.`);
  }
}
