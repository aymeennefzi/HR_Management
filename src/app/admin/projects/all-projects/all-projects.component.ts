import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatIconModule,
    BoardComponent,
  ],
})
export class AllprojectsComponent {
  public title = 'Oh My Kanban!';

  @ViewChild(BoardComponent)
  boardComponent!: BoardComponent;
}
