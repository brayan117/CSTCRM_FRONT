import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_SECTIONS } from '../../core/navigation';

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
  readonly sections = NAV_SECTIONS;

  private readonly openSections = signal<Record<string, boolean>>({ csat: true });

  isOpen(id: string): boolean {
    return !!this.openSections()[id];
  }

  toggle(id: string): void {
    this.openSections.update((sections) => ({ ...sections, [id]: !sections[id] }));
  }
}
