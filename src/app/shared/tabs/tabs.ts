import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  readonly tabs = input.required<TabItem[]>();
  readonly active = input('');
  readonly activeChange = output<string>();
}
