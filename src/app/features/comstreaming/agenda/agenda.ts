import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SimpleAgenda } from '../../../shared/simple-agenda/simple-agenda';

@Component({
  selector: 'app-comstreaming-agenda',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SimpleAgenda],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class ComstreamingAgenda {}
