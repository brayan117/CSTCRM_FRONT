import { Injectable, computed, signal } from '@angular/core';
import { loadState, nextId, saveState } from '../storage';

export interface CuentaUsuario {
  id: string;
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
  password: string;
}

const STORAGE_KEY = 'comsatech.users.v1';

const DEFAULT_USERS: CuentaUsuario[] = [
  {
    id: 'USR-001',
    username: 'admin',
    nombre: 'Administrador',
    rol: 'admin',
    activo: true,
    password: '12345',
  },
  {
    id: 'USR-002',
    username: 'administrativo',
    nombre: 'Administrativo',
    rol: 'administrativo',
    activo: true,
    password: '12345',
  },
  {
    id: 'USR-003',
    username: 'tecnico',
    nombre: 'Carlos Mendoza',
    rol: 'tecnico',
    activo: true,
    password: '12345',
  },
  {
    id: 'USR-004',
    username: 'cliente',
    nombre: 'Minería Andina S.A.',
    rol: 'cliente',
    activo: true,
    password: '12345',
  },
];

@Injectable({ providedIn: 'root' })
export class Users {
  private readonly state = signal<CuentaUsuario[]>(
    loadState<CuentaUsuario[]>(STORAGE_KEY, DEFAULT_USERS),
  );

  readonly usuarios = computed(() => this.state());

  findByUsername(username: string): CuentaUsuario | null {
    const u = username.trim().toLowerCase();
    return this.state().find((x) => x.username.toLowerCase() === u) ?? null;
  }

  crear(input: Omit<CuentaUsuario, 'id'>): CuentaUsuario {
    const user: CuentaUsuario = {
      ...input,
      username: input.username.trim().toLowerCase(),
      id: nextId('USR-', this.state().map((u) => u.id)),
    };
    this.state.update((list) => [...list, user]);
    this.save();
    return user;
  }

  actualizar(id: string, changes: Partial<Omit<CuentaUsuario, 'id'>>): void {
    this.state.update((list) =>
      list.map((u) =>
        u.id === id
          ? {
              ...u,
              ...changes,
              username: changes.username ? changes.username.trim().toLowerCase() : u.username,
            }
          : u,
      ),
    );
    this.save();
  }

  eliminar(id: string): void {
    this.state.update((list) => list.filter((u) => u.id !== id));
    this.save();
  }

  private save(): void {
    saveState(STORAGE_KEY, this.state());
  }
}
