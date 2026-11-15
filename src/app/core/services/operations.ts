import { Injectable, computed, signal } from '@angular/core';
import { HISTORIAL, OPERACIONES_ACTIVAS } from '../mock-data';
import { HistorialItem, Operacion } from '../models';
import { loadState, nextId, saveState } from '../storage';

interface OperationsState {
  operaciones: Operacion[];
  historial: HistorialItem[];
}

const STORAGE_KEY = 'comsatech.operations.v1';

@Injectable({ providedIn: 'root' })
export class Operations {
  private readonly state = signal<OperationsState>(
    loadState<OperationsState>(STORAGE_KEY, {
      operaciones: OPERACIONES_ACTIVAS,
      historial: HISTORIAL,
    }),
  );

  readonly operaciones = computed(() => this.state().operaciones);
  readonly historial = computed(() => this.state().historial);

  readonly kpis = computed(() => {
    const operaciones = this.state().operaciones;
    return {
      activas: operaciones.length,
      enProceso: operaciones.filter((o) => o.estado === 'en proceso').length,
      pendientes: operaciones.filter((o) => o.estado === 'pendiente').length,
      historial: this.state().historial.length,
    };
  });

  addOperacion(input: {
    tipo: string;
    movil: string;
    tecnico: string;
    inicio: string;
    obs: string;
    avance?: number;
    estado?: string;
  }): Operacion {
    const operacion: Operacion = {
      ...input,
      avance: input.avance ?? 0,
      estado: input.estado ?? 'pendiente',
      id: nextId('OP-', this.state().operaciones.map((o) => o.id)),
    };
    this.state.update((s) => ({ ...s, operaciones: [...s.operaciones, operacion] }));
    this.save();
    return operacion;
  }

  updateOperacion(id: string, changes: { avance?: number; estado?: string; obs?: string }): void {
    const current = this.state().operaciones.find((o) => o.id === id);
    if (!current) {
      return;
    }

    if (changes.estado === 'completado') {
      const updated: Operacion = {
        ...current,
        ...changes,
        avance: changes.avance ?? 100,
        estado: 'completado',
      };
      const registro: HistorialItem = {
        fecha: new Date().toISOString().slice(0, 10),
        tipo: updated.tipo,
        movil: updated.movil,
        tecnico: updated.tecnico,
        resultado: 'Completado',
        obs: updated.obs,
      };
      this.state.update((s) => ({
        operaciones: s.operaciones.filter((o) => o.id !== id),
        historial: [registro, ...s.historial],
      }));
      this.save();
      return;
    }

    this.state.update((s) => ({
      ...s,
      operaciones: s.operaciones.map((o) => (o.id === id ? { ...o, ...changes } : o)),
    }));
    this.save();
  }

  private save(): void {
    saveState(STORAGE_KEY, this.state());
  }
}
