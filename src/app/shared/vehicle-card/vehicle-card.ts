import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Movil } from '../../core/models';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.css',
})
export class VehicleCard {
  readonly movil = input.required<Movil>();
  readonly selected = input(false);
  readonly select = output<string>();
}
