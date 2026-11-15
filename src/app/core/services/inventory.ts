import { Injectable, computed, signal } from '@angular/core';
import { EQUIPOS, EVENTOS, MOVILES, SIMCARDS, TECNICOS } from '../mock-data';
import { Equipo, Evento, Movil, Simcard, Tecnico } from '../models';
import { loadState, nextId, saveState } from '../storage';

interface InventoryState {
  moviles: Movil[];
  equipos: Equipo[];
  simcards: Simcard[];
  tecnicos: Tecnico[];
  eventos: Evento[];
}

const STORAGE_KEY = 'comsatech.inventory.v1';

@Injectable({ providedIn: 'root' })
export class Inventory {
  private readonly state = signal<InventoryState>(
    loadState<InventoryState>(STORAGE_KEY, {
      moviles: MOVILES,
      equipos: EQUIPOS,
      simcards: SIMCARDS,
      tecnicos: TECNICOS,
      eventos: EVENTOS,
    }),
  );

  readonly moviles = computed(() => this.state().moviles);
  readonly equipos = computed(() => this.state().equipos);
  readonly simcards = computed(() => this.state().simcards);
  readonly tecnicos = computed(() => this.state().tecnicos);
  readonly eventos = computed(() => this.state().eventos);

  readonly kpis = computed(() => {
    const moviles = this.state().moviles;
    const equipos = this.state().equipos;
    return {
      moviles: moviles.length,
      operativos: moviles.filter((m) => m.estado === 'operativo').length,
      taller: moviles.filter((m) => m.estado === 'taller').length,
      desconectados: moviles.filter((m) => m.estado === 'desconectado').length,
      equiposDisponibles: equipos.filter((e) => e.estado === 'disponible').length,
    };
  });

  readonly tecnicosKpis = computed(() => {
    const tecnicos = this.state().tecnicos;
    return {
      total: tecnicos.length,
      disponibles: tecnicos.filter((t) => t.estado === 'disponible').length,
      campo: tecnicos.filter((t) => t.estado === 'en campo').length,
      vacaciones: tecnicos.filter((t) => t.estado === 'vacaciones').length,
    };
  });

  movilById(id: string): Movil | undefined {
    return this.state().moviles.find((m) => m.id === id);
  }

  equipoById(id: string): Equipo | undefined {
    return this.state().equipos.find((e) => e.id === id);
  }

  simById(id: string): Simcard | undefined {
    return this.state().simcards.find((s) => s.id === id);
  }

  eventosFor(movilId: string): Evento[] {
    return this.state()
      .eventos.filter((e) => e.movil === movilId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  addMovil(input: {
    placa: string;
    tipo: string;
    marca: string;
    modelo: string;
    cliente: string;
    estado: string;
    equipo: string;
    sim: string;
  }): Movil {
    const movil: Movil = { ...input, id: nextId('MOV-', this.state().moviles.map((m) => m.id)) };
    this.state.update((s) => ({ ...s, moviles: [...s.moviles, movil] }));
    this.save();
    return movil;
  }

  addEquipo(input: {
    tipo: string;
    marca: string;
    serie: string;
    estado: string;
    movil: string;
  }): Equipo {
    const equipo: Equipo = { ...input, id: nextId('EQ-', this.state().equipos.map((e) => e.id)) };
    this.state.update((s) => ({ ...s, equipos: [...s.equipos, equipo] }));
    this.save();
    return equipo;
  }

  addSimcard(input: {
    operador: string;
    numero: string;
    plan: string;
    estado: string;
    movil: string;
  }): Simcard {
    const sim: Simcard = { ...input, id: nextId('SIM-', this.state().simcards.map((s) => s.id)) };
    this.state.update((s) => ({ ...s, simcards: [...s.simcards, sim] }));
    this.save();
    return sim;
  }

  addTecnico(input: {
    nombre: string;
    especialidad: string;
    estado: string;
    telefono: string;
    carga?: number;
  }): Tecnico {
    const tecnico: Tecnico = {
      ...input,
      carga: input.carga ?? 0,
      id: nextId('TEC-', this.state().tecnicos.map((t) => t.id)),
    };
    this.state.update((s) => ({ ...s, tecnicos: [...s.tecnicos, tecnico] }));
    this.save();
    return tecnico;
  }

  private save(): void {
    saveState(STORAGE_KEY, this.state());
  }
}
