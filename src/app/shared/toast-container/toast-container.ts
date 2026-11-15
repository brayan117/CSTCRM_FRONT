import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast } from '../../core/services/toast';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  readonly toast = inject(Toast);

  icon(type: string): string {
    return type === 'ok' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  }
}
