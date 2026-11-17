import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Row, RowActionEvent, TableAction, TableColumn } from '../../../core/models';
import { Audit } from '../../../core/services/audit';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { CuentaUsuario, Users } from '../../../core/services/users';
import { DataTable } from '../../../shared/data-table/data-table';
import { Modal } from '../../../shared/modal/modal';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { TabItem, Tabs } from '../../../shared/tabs/tabs';

const ROLES = ['admin', 'administrativo', 'tecnico', 'cliente'];

@Component({
  selector: 'app-administracion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, Panel, DataTable, Tabs, Modal],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css',
})
export class Administracion {
  readonly users = inject(Users);
  readonly audit = inject(Audit);
  private readonly auth = inject(Auth);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly tab = signal('usuarios');
  readonly roles = ROLES;

  readonly tabs: TabItem[] = [
    { id: 'usuarios', label: 'Usuarios', icon: '👤' },
    { id: 'auditoria', label: 'Auditoría', icon: '📋' },
  ];

  readonly userColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', type: 'strong' },
    { key: 'username', label: 'Usuario', type: 'muted' },
    { key: 'rol', label: 'Rol', type: 'chip', variant: 'blue' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'ultimo', label: 'Último acceso', type: 'muted' },
  ];

  readonly auditColumns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha y hora', type: 'muted', width: '170px' },
    { key: 'usuario', label: 'Usuario', type: 'strong' },
    { key: 'rol', label: 'Rol', type: 'chip', variant: 'gray' },
    { key: 'accion', label: 'Acción', type: 'badge' },
    { key: 'detalle', label: 'Detalle', type: 'muted' },
    { key: 'ip', label: 'IP', type: 'muted', width: '160px' },
  ];

  readonly userActions: TableAction[] = [
    { label: 'Editar', icon: '✏️' },
    { label: 'Activar / Desactivar', icon: '⏻' },
    { label: 'Eliminar', icon: '🗑' },
  ];

  readonly userRows = computed<Row[]>(() =>
    this.users.usuarios().map((u) => ({
      ...u,
      estado: u.activo ? 'activa' : 'inactiva',
      ultimo: this.ultimoAcceso(u.username),
    })),
  );

  readonly auditRows = computed<Row[]>(() =>
    this.audit.eventos().map((e) => ({ ...e }) as Row),
  );

  readonly modalOpen = signal(false);
  readonly editing = signal<CuentaUsuario | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    nombre: ['', Validators.required],
    rol: ['cliente', Validators.required],
    password: ['12345', [Validators.required, Validators.minLength(4)]],
    activo: [true],
  });

  abrirNuevo(): void {
    this.editing.set(null);
    this.form.reset({ username: '', nombre: '', rol: 'cliente', password: '12345', activo: true });
    this.modalOpen.set(true);
  }

  abrirEditar(event: RowActionEvent): void {
    const user = this.users.usuarios().find((u) => u.id === String(event.row['id']));
    if (!user) {
      return;
    }
    this.editing.set(user);
    this.form.setValue({
      username: user.username,
      nombre: user.nombre,
      rol: user.rol,
      password: user.password,
      activo: user.activo,
    });
    this.modalOpen.set(true);
  }

  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    const editing = this.editing();
    if (editing) {
      this.users.actualizar(editing.id, v);
      this.audit.registrar(
        'Usuario actualizado',
        `${v.username} · rol ${v.rol} · ${v.activo ? 'activo' : 'inactivo'}`,
        this.auth.user()?.nombre,
        'admin',
      );
      this.toast.success(`Usuario ${v.username} actualizado.`);
    } else {
      this.users.crear(v);
      this.audit.registrar(
        'Usuario creado',
        `${v.username} · rol ${v.rol}`,
        this.auth.user()?.nombre,
        'admin',
      );
      this.toast.success(`Usuario ${v.username} creado.`);
    }
    this.modalOpen.set(false);
  }

  onUserAction(event: RowActionEvent): void {
    const user = this.users.usuarios().find((u) => u.id === String(event.row['id']));
    if (!user) {
      return;
    }
    const actual = this.auth.user()?.username ?? '';
    switch (event.action.label) {
      case 'Editar':
        this.abrirEditar(event);
        break;
      case 'Activar / Desactivar': {
        if (user.username === actual) {
          this.toast.error('No puedes desactivar tu propio usuario.');
          return;
        }
        const activo = !user.activo;
        this.users.actualizar(user.id, { activo });
        this.audit.registrar(
          activo ? 'Usuario activado' : 'Usuario desactivado',
          user.username,
          this.auth.user()?.nombre,
          'admin',
        );
        this.toast.success(`${user.username} ${activo ? 'activado' : 'desactivado'}.`);
        break;
      }
      case 'Eliminar': {
        if (user.username === actual) {
          this.toast.error('No puedes eliminar tu propio usuario.');
          return;
        }
        const adminsActivos = this.users
          .usuarios()
          .filter((u) => u.rol === 'admin' && u.activo && u.id !== user.id);
        if (user.rol === 'admin' && user.activo && adminsActivos.length === 0) {
          this.toast.error('Debe quedar al menos un administrador activo.');
          return;
        }
        this.users.eliminar(user.id);
        this.audit.registrar(
          'Usuario eliminado',
          `${user.username} · rol ${user.rol}`,
          this.auth.user()?.nombre,
          'admin',
        );
        this.toast.success(`Usuario ${user.username} eliminado.`);
        break;
      }
    }
  }

  private ultimoAcceso(username: string): string {
    const evento = this.audit
      .eventos()
      .find((e) => e.accion === 'Inicio de sesión' && e.detalle.includes(username));
    return evento?.fecha ?? '—';
  }
}
