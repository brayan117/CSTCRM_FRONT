import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Row, RowActionEvent, TableAction, TableColumn } from '../../core/models';
import { Badge } from '../badge/badge';
import { ProgressBar } from '../progress-bar/progress-bar';

@Component({
  selector: 'app-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, ProgressBar],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<readonly Row[]>();
  readonly actions = input<TableAction[]>([]);
  readonly clickable = input(false);
  readonly rowClick = output<Row>();
  readonly actionClick = output<RowActionEvent>();

  asText(value: Row[string]): string {
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }

  asNum(value: Row[string]): number {
    return typeof value === 'number' ? value : Number(value) || 0;
  }

  onRow(row: Row): void {
    if (this.clickable()) {
      this.rowClick.emit(row);
    }
  }

  onAction(event: Event, action: TableAction, row: Row): void {
    event.stopPropagation();
    this.actionClick.emit({ action, row });
  }
}
