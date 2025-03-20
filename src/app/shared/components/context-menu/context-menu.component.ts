import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContextMenuItem {
  id: string;
  label: string;
  isSeparator?: boolean;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul
      *ngIf="isVisible"
      class="win95-context-menu"
      [ngStyle]="{ 'top.px': position.y, 'left.px': position.x }"
    >
      <ng-container *ngFor="let item of menuItems">
        <li
          *ngIf="!item.isSeparator"
          class="win95-menu-item"
          (click)="onItemClick(item.id)"
        >
          {{ item.label }}
        </li>
        <li *ngIf="item.isSeparator" class="win95-menu-separator"></li>
      </ng-container>
    </ul>
  `,
  styles: [
    `
      .win95-context-menu {
        position: absolute;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #808080 #808080 #ffffff;
        padding: 2px;
        box-shadow: 1px 1px 0 0 #000;
        min-width: 160px;
        z-index: 9999;
      }

      .win95-menu-item {
        padding: 4px 8px;
        color: #000;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .win95-menu-item:hover {
        background: #000080;
        color: #ffffff;
      }

      .win95-menu-separator {
        height: 1px;
        background: #808080;
        margin: 4px 2px;
        border-bottom: 1px solid #ffffff;
      }
    `,
  ],
})
export class ContextMenuComponent {
  @Input() isVisible = false;
  @Input() position = { x: 0, y: 0 };
  @Input() menuItems: ContextMenuItem[] = [];

  @Output() itemClick = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onItemClick(itemId: string): void {
    this.itemClick.emit(itemId);
    this.close.emit();
  }
}
