import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { findBreadcrumb } from '../../core/navigation';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  readonly menu = output<void>();
  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly breadcrumb = computed(() => findBreadcrumb(this.url()));

  readonly initials = computed(() => {
    const nombre = this.auth.user()?.nombre ?? 'Admin';
    return nombre
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
