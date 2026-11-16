import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { getNavForRole } from '../../core/navigation';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly open = input(false);
  readonly navigate = output<void>();
  private readonly auth = inject(Auth);
  readonly sections = computed(() => getNavForRole(this.auth.role()));

  private readonly openSections = signal<Record<string, boolean>>({ csat: true, crad: true, cstr: true });

  isOpen(id: string): boolean {
    return this.openSections()[id] !== false;
  }

  toggle(id: string): void {
    this.openSections.update((sections) => ({ ...sections, [id]: !sections[id] }));
  }
}
