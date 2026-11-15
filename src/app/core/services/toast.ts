import { Injectable, signal } from '@angular/core';

export type ToastType = 'ok' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class Toast {
  private counter = 0;
  private readonly state = signal<ToastMessage[]>([]);

  readonly messages = this.state.asReadonly();

  show(text: string, type: ToastType = 'ok'): void {
    const id = ++this.counter;
    this.state.update((items) => [...items, { id, text, type }]);
    setTimeout(() => this.dismiss(id), 3500);
  }

  success(text: string): void {
    this.show(text, 'ok');
  }

  error(text: string): void {
    this.show(text, 'error');
  }

  dismiss(id: number): void {
    this.state.update((items) => items.filter((item) => item.id !== id));
  }
}
