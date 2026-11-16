import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { DataTable } from '../../../shared/data-table/data-table';
import { Modal } from '../../../shared/modal/modal';
import { Toast } from '../../../core/services/toast';
import { TableColumn } from '../../../core/models';
import { Inventory } from '../../../core/services/inventory';
import { Operations } from '../../../core/services/operations';
import { Auth } from '../../../core/services/auth';

const TIPOS_OPERACION = [
  'Mantenimiento',
  'Instalación',
  'Revisión',
  'Cambio de equipo',
  'Cambio de simcard',
  'Soporte',
];

@Component({
  selector: 'app-cliente-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, DataTable, Modal],
  templateUrl: './operaciones.html',
  styleUrl: './operaciones.css',
})
export class ClienteOperaciones {
  readonly inventory = inject(Inventory);
  readonly operations = inject(Operations);
  private readonly auth = inject(Auth);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);
  readonly tipos = TIPOS_OPERACION;

  readonly misMoviles = computed(() => {
    const cliente = this.auth.user()?.nombre ?? '';
    return this.inventory.moviles().filter((m) => m.cliente === cliente);
  });

  readonly misOperaciones = computed(() => {
    const ids = new Set(this.misMoviles().map((m) => m.id));
    return this.operations.operaciones().filter((o) => ids.has(String(o.movil)));
  });

  readonly misHistorial = computed(() => {
    const ids = new Set(this.misMoviles().map((m) => m.id));
    return this.operations.historial().filter((h) => ids.has(String(h.movil)));
  });

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'strong' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'inicio', label: 'Inicio', type: 'muted' },
    { key: 'estado', label: 'Estado', type: 'badge' },
  ];

  readonly historialColumns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', type: 'muted' },
    { key: 'tipo', label: 'Tipo', type: 'badge' },
    { key: 'movil', label: 'Móvil', type: 'chip', variant: 'blue' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'resultado', label: 'Resultado', type: 'badge' },
  ];

  readonly form = this.fb.nonNullable.group({
    tipo: ['Mantenimiento', Validators.required],
    movil: ['', Validators.required],
    obs: [''],
  });

  openNew(): void {
    this.form.reset({ tipo: 'Mantenimiento', movil: '', obs: '' });
    this.modalOpen.set(true);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const op = this.operations.addOperacion({
      tipo: v.tipo,
      movil: v.movil,
      tecnico: '',
      inicio: new Date().toISOString().slice(0, 10),
      obs: v.obs,
      estado: 'pendiente',
    });
    this.toast.success(`Operación ${op.id} creada.`);
    this.modalOpen.set(false);
  }
}
