import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Operacion, Row, RowActionEvent, TableAction, TableColumn } from '../../../core/models';
import { Inventory } from '../../../core/services/inventory';
import { Operations } from '../../../core/services/operations';
import { Toast } from '../../../core/services/toast';
import { DataTable } from '../../../shared/data-table/data-table';
import { KpiCard } from '../../../shared/kpi-card/kpi-card';
import { Modal } from '../../../shared/modal/modal';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { TabItem, Tabs } from '../../../shared/tabs/tabs';

@Component({
  selector: 'app-comsatelites-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    PageHeader,
    KpiCard,
    Panel,
    DataTable,
    Tabs,
    Modal,
  ],
  templateUrl: './operaciones.html',
  styleUrl: './operaciones.css',
})
export class ComsatelitesOperaciones {
  readonly inventory = inject(Inventory);
  readonly operations = inject(Operations);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly kpis = this.operations.kpis;
  readonly tab = signal('activas');

  readonly tabs: TabItem[] = [
    { id: 'activas', label: 'Operaciones activas', icon: '⚡' },
    { id: 'crear', label: 'Crear operación', icon: '➕' },
    { id: 'historial', label: 'Historial de operaciones', icon: '📚' },
  ];

  readonly activasColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'inicio', label: 'Inicio', type: 'muted' },
    { key: 'avance', label: 'Avance', type: 'progress' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'obs', label: 'Observación', type: 'muted' },
  ];

  readonly historialColumns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', type: 'muted' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'detalle', label: 'Detalle', type: 'muted' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'recurso', label: 'Recurso', type: 'muted' },
    { key: 'resultado', label: 'Resultado', type: 'badge' },
  ];

  readonly acciones: TableAction[] = [{ label: 'Seguimiento →' }];

  readonly historialRows = computed<Row[]>(() =>
    this.operations.historial().map((item) => ({
      ...item,
      detalle: item.subtipo ?? item.equipo ?? item.sim ?? '—',
      recurso: item.equipo ?? item.sim ?? '—',
    })),
  );

  readonly seguimientoOpen = signal(false);
  readonly selected = signal<Operacion | null>(null);

  readonly seguimientoForm = this.fb.nonNullable.group({
    avance: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    estado: ['en proceso'],
    obs: [''],
  });

  readonly crearForm = this.fb.nonNullable.group({
    tipo: ['Mantenimiento'],
    tecnico: [this.inventory.tecnicos()[0]?.nombre ?? '', [Validators.required]],
    movil: [this.inventory.moviles()[0]?.id ?? '', [Validators.required]],
    fecha: ['2026-11-16'],
    hora: ['09:00'],
    prioridad: ['Normal'],
    obs: [''],
  });

  abrirSeguimiento(event: RowActionEvent): void {
    const operacion =
      this.operations.operaciones().find((o) => o.id === String(event.row['id'])) ?? null;
    this.selected.set(operacion);
    if (!operacion) {
      return;
    }
    this.seguimientoForm.setValue({
      avance: operacion.avance,
      estado: operacion.estado,
      obs: operacion.obs,
    });
    this.seguimientoOpen.set(true);
  }

  guardarSeguimiento(): void {
    const operacion = this.selected();
    if (!operacion) {
      return;
    }
    const value = this.seguimientoForm.getRawValue();
    this.operations.updateOperacion(operacion.id, {
      avance: Number(value.avance),
      estado: value.estado,
      obs: value.obs,
    });
    this.seguimientoOpen.set(false);
    this.toast.success(
      value.estado === 'completado'
        ? `Operación ${operacion.id} cerrada y enviada al historial.`
        : `Seguimiento de ${operacion.id} actualizado.`,
    );
  }

  crearOperacion(): void {
    this.crearForm.markAllAsTouched();
    if (this.crearForm.invalid) {
      return;
    }
    const value = this.crearForm.getRawValue();
    const operacion = this.operations.addOperacion({
      tipo: value.tipo,
      movil: value.movil,
      tecnico: value.tecnico,
      inicio: `${value.fecha} ${value.hora}`,
      obs: value.obs,
    });
    this.toast.success(`Operación ${operacion.id} asignada a ${operacion.tecnico}.`);
    this.limpiarCrear();
    this.tab.set('activas');
  }

  limpiarCrear(): void {
    this.crearForm.reset({
      tipo: 'Mantenimiento',
      tecnico: this.inventory.tecnicos()[0]?.nombre ?? '',
      movil: this.inventory.moviles()[0]?.id ?? '',
      fecha: '2026-11-16',
      hora: '09:00',
      prioridad: 'Normal',
      obs: '',
    });
  }
}
