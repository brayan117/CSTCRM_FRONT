import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Panel } from '../../../shared/panel/panel';
import { Inventory } from '../../../core/services/inventory';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-tecnico-perfil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, Panel],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class TecnicoPerfil {
  readonly auth = inject(Auth);
  readonly inventory = inject(Inventory);

  readonly tecnico = () =>
    this.inventory.tecnicos().find((t) => t.nombre === this.auth.user()?.nombre);
}
