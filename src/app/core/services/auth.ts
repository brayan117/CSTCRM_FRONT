import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly storageKey = 'comsatech.session';
  private readonly state = signal<Usuario | null>(this.restore());

  readonly user = this.state.asReadonly();
  readonly isAuthenticated = computed(() => this.state() !== null);

  login(username: string, password: string): boolean {
    if (username.trim().toLowerCase() === 'admin' && password === '12345') {
      const user: Usuario = {
        username: 'admin',
        nombre: 'Administrador',
        rol: 'Coordinador de operaciones',
      };
      this.state.set(user);
      this.persist(user);
      return true;
    }
    return false;
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
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}
