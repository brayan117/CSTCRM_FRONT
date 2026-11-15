import { Injectable, computed, signal } from '@angular/core';
import { CANALES, RADIO_OPERACIONES, RADIOS, STREAM_OPERACIONES } from '../mock-data';
import { Canal, Radio, RadioOperacion, StreamOperacion } from '../models';
import { loadState, nextId, saveState } from '../storage';

interface CatalogState {
  radios: Radio[];
}

const STORAGE_KEY = 'comsatech.catalog.v1';

@Injectable({ providedIn: 'root' })
export class Catalog {
  private readonly state = signal<CatalogState>(loadState<CatalogState>(STORAGE_KEY, { radios: RADIOS }));

  readonly radios = computed(() => this.state().radios);
  readonly radioOperaciones: readonly RadioOperacion[] = RADIO_OPERACIONES;
  readonly canales: readonly Canal[] = CANALES;
  readonly streamOperaciones: readonly StreamOperacion[] = STREAM_OPERACIONES;

  readonly radiosKpis = computed(() => {
    const radios = this.state().radios;
    return {
      total: radios.length,
      operativos: radios.filter((r) => r.estado === 'operativo').length,
      taller: radios.filter((r) => r.estado === 'taller').length,
      desconectados: radios.filter((r) => r.estado === 'desconectado').length,
    };
  });

  addRadio(input: {
    tipo: string;
    marca: string;
    serial: string;
    cliente: string;
    estado: string;
  }): Radio {
    const radio: Radio = { ...input, id: nextId('RAD-', this.state().radios.map((r) => r.id)) };
    this.state.update((s) => ({ radios: [...s.radios, radio] }));
    saveState(STORAGE_KEY, this.state());
    return radio;
  }
}
