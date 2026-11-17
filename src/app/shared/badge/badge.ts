import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeVariant } from '../../core/models';

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  operativo: { variant: 'ok', label: 'Operativo' },
  instalado: { variant: 'ok', label: 'Instalado' },
  activa: { variant: 'ok', label: 'Activa' },
  disponible: { variant: 'blue', label: 'Disponible' },
  taller: { variant: 'warn', label: 'En taller' },
  suspendida: { variant: 'warn', label: 'Suspendida' },
  'en proceso': { variant: 'warn', label: 'En proceso' },
  'por vencer': { variant: 'warn', label: 'Por vencer' },
  buffering: { variant: 'warn', label: 'Buffering' },
  programada: { variant: 'warn', label: 'Programada' },
  desconectado: { variant: 'bad', label: 'Desconectado' },
  inactiva: { variant: 'bad', label: 'Inactiva' },
  pendiente: { variant: 'bad', label: 'Pendiente' },
  cancelada: { variant: 'bad', label: 'Cancelada' },
  vacaciones: { variant: 'gray', label: 'Vacaciones' },
  'en campo': { variant: 'blue', label: 'En campo' },
  online: { variant: 'ok', label: 'Online' },
  completado: { variant: 'ok', label: 'Completado' },
  facturada: { variant: 'ok', label: 'Facturada' },
  facturado: { variant: 'ok', label: 'Facturado' },
  completada: { variant: 'ok', label: 'Completada' },
  mantenimiento: { variant: 'blue', label: 'Mantenimiento' },
  instalación: { variant: 'ok', label: 'Instalación' },
  instalacion: { variant: 'ok', label: 'Instalación' },
  'activación sim': { variant: 'warn', label: 'Activación SIM' },
  activación: { variant: 'warn', label: 'Activación' },
  activacion: { variant: 'warn', label: 'Activación' },
  desconexion: { variant: 'bad', label: 'Desconexión' },
  desconexión: { variant: 'bad', label: 'Desconexión' },
  'sí reporta': { variant: 'ok', label: 'Sí reporta' },
  'si reporta': { variant: 'ok', label: 'Sí reporta' },
  'no reporta': { variant: 'bad', label: 'No reporta' },
  programación: { variant: 'blue', label: 'Programación' },
  incidencia: { variant: 'warn', label: 'Incidencia' },
  reporte: { variant: 'bad', label: 'Reporte' },
  '—': { variant: 'gray', label: '—' },
  '-': { variant: 'gray', label: '—' },
};

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {
  readonly status = input<string>('');
  readonly label = input<string | undefined>(undefined);
  readonly variant = input<BadgeVariant | undefined>(undefined);

  private readonly entry = computed(() => {
    const key = this.status().trim().toLowerCase();
    return STATUS_MAP[key];
  });

  readonly cls = computed(() => this.variant() ?? this.entry()?.variant ?? 'gray');
  readonly text = computed(() => this.label() ?? this.entry()?.label ?? this.status() ?? '—');
}
