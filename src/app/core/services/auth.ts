import { Injectable, computed, inject, signal } from '@angular/core';
import { Usuario } from '../models';
import { Audit } from './audit';
import { Users } from './users';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly storageKey = 'comsatech.session';
  private readonly users = inject(Users);
  private readonly audit = inject(Audit);
  private readonly state = signal<Usuario | null>(this.restore());

  readonly user = this.state.asReadonly();
  readonly isAuthenticated = computed(() => this.state() !== null);
  readonly role = computed(() => this.state()?.rol ?? '');

  login(username: string, password: string): boolean {
    const cuenta = this.users.findByUsername(username);
    if (!cuenta || !cuenta.activo || cuenta.password !== password) {
      this.audit.registrar('Inicio de sesión fallido', `Usuario: ${username.trim()}`);
      return false;
    }
    const user: Usuario = {
      username: cuenta.username,
      nombre: cuenta.nombre,
      rol: cuenta.rol,
    };
    this.state.set(user);
    this.persist(user);
    this.audit.registrar(
      'Inicio de sesión',
      `Usuario: ${cuenta.username} · Rol: ${cuenta.rol}`,
      cuenta.nombre,
      cuenta.rol,
    );
    return true;
  }

  logout(): void {
    const user = this.state();
    if (user) {
      this.audit.registrar('Cierre de sesión', '', user.nombre, user.rol);
    }
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
