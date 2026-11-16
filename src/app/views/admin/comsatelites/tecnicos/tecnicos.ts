import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Inventory } from '../../../../core/services/inventory';
import { Toast } from '../../../../core/services/toast';
import { Badge } from '../../../../shared/badge/badge';
import { KpiCard } from '../../../../shared/kpi-card/kpi-card';
import { Modal } from '../../../../shared/modal/modal';
import { PageHeader } from '../../../../shared/page-header/page-header';

@Component({
  selector: 'app-comsatelites-tecnicos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeader, KpiCard, Badge, Modal],
  templateUrl: './tecnicos.html',
  styleUrl: './tecnicos.css',
})
export class ComsatelitesTecnicos {
  readonly inventory = inject(Inventory);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  readonly modalOpen = signal(false);
  readonly kpis = this.inventory.tecnicosKpis;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    especialidad: ['', [Validators.required]],
    telefono: [''],
    estado: ['disponible'],
  });

  openNew(): void {
    this.form.reset({
      nombre: '',
      especialidad: '',
      telefono: '',
      estado: 'disponible',
    });
    this.modalOpen.set(true);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const tecnico = this.inventory.addTecnico(this.form.getRawValue());
    this.toast.success(`Técnico ${tecnico.nombre} agregado correctamente.`);
    this.modalOpen.set(false);
  }
}
