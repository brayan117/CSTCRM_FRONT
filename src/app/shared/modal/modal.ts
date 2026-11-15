import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly open = model(false);
  readonly title = input('Detalle');
  readonly saveLabel = input('Guardar');
  readonly wide = input(false);
  readonly save = output<void>();
  readonly closed = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
