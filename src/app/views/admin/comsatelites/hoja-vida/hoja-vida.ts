import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inventory } from '../../../../core/services/inventory';
import { PageHeader } from '../../../../shared/page-header/page-header';
import { Panel } from '../../../../shared/panel/panel';
import { Timeline } from '../../../../shared/timeline/timeline';
import { VehicleCard } from '../../../../shared/vehicle-card/vehicle-card';

@Component({
  selector: 'app-hoja-vida',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, VehicleCard, Panel, Timeline],
  templateUrl: './hoja-vida.html',
  styleUrl: './hoja-vida.css',
})
export class HojaVida {
  readonly inventory = inject(Inventory);
  private readonly route = inject(ActivatedRoute);

  readonly selectedId = signal(
    this.route.snapshot.queryParamMap.get('movil') ??
      this.inventory.moviles()[0]?.id ??
      '',
  );

  readonly movil = computed(
    () => this.inventory.movilById(this.selectedId()) ?? this.inventory.moviles()[0],
  );

  readonly equipo = computed(() => {
    const movil = this.movil();
    return movil ? this.inventory.equipoById(movil.equipo) : undefined;
  });

  readonly sim = computed(() => {
    const movil = this.movil();
    return movil ? this.inventory.simById(movil.sim) : undefined;
  });

  readonly eventos = computed(() => {
    const movil = this.movil();
    return movil ? this.inventory.eventosFor(movil.id) : [];
  });
}
