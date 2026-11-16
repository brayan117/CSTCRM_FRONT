import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly storageKey = 'comsatech.session';
  private readonly state = signal<Usuario | null>(this.restore());

  readonly user = this.state.asReadonly();
  readonly isAuthenticated = computed(() => this.state() !== null);
  readonly role = computed(() => this.state()?.rol ?? '');

  login(username: string, password: string): boolean {
    const u = username.trim().toLowerCase();
    if (password !== '12345') return false;
    let user: Usuario | null = null;
    if (u === 'admin') {
      user = { username: 'admin', nombre: 'Administrador', rol: 'admin' };
    } else if (u === 'cliente') {
      user = { username: 'cliente', nombre: 'Minería Andina S.A.', rol: 'cliente' };
    } else if (u === 'tecnico') {
      user = { username: 'tecnico', nombre: 'Carlos Mendoza', rol: 'tecnico' };
    } else if (u === 'administrativo') {
      user = { username: 'administrativo', nombre: 'Administrativo', rol: 'administrativo' };
    }
    if (!user) return false;
    this.state.set(user);
    this.persist(user);
    return true;
  }

  logout(): void {
    this.state.set(null);
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // sin almacenamiento disponible
    }
  }

  private persist(user: Usuario): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } catch {
      // sin almacenamiento disponible
    }
  }

  private restore(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const user = JSON.parse(raw) as Usuario;
      return ['admin', 'cliente', 'tecnico', 'administrativo'].includes(user.rol) ? user : null;
    } catch {
      return null;
    }
  }
}
