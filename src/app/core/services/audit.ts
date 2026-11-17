import { Injectable, computed, signal } from '@angular/core';
import { loadState, nextId, saveState } from '../storage';

export interface AuditEvent {
  id: string;
  fecha: string;
  usuario: string;
  rol: string;
  accion: string;
  detalle: string;
  ip: string;
}

const STORAGE_KEY = 'comsatech.audit.v1';
const MAX_EVENTS = 300;

@Injectable({ providedIn: 'root' })
export class Audit {
  private readonly state = signal<AuditEvent[]>(loadState<AuditEvent[]>(STORAGE_KEY, []));

  readonly eventos = computed(() => this.state());

  registrar(accion: string, detalle = '', usuario = '—', rol = '—'): void {
    void this.ip().then((ip) => {
      const evento: AuditEvent = {
        id: nextId('EVT-', this.state().map((e) => e.id)),
        fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
        usuario,
        rol,
        accion,
        detalle,
        ip,
      };
      this.state.update((list) => [evento, ...list].slice(0, MAX_EVENTS));
      this.save();
    });
  }

  private async ip(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = (await res.json()) as { ip?: string };
      return data.ip ?? 'IP no detectada';
    } catch {
      return 'IP local / no detectada';
    }
  }

  private save(): void {
    saveState(STORAGE_KEY, this.state());
  }
}
