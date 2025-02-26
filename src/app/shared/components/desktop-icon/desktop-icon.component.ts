import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desktop-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="desktop-icon flex flex-col mb-5 items-center gap-2 w-[70px] cursor-default select-none"
      [class.selected]="isSelected"
      (click)="onClick($event)"
      (dblclick)="onDoubleClick()"
    >
      <div
        class="icon-wrapper w-12 h-12 flex items-center justify-center relative"
      >
        <img
          [src]="iconPath"
          [alt]="name"
          class="w-12 h-12"
          draggable="false"
        />
      </div>
      <span
        class="icon-label text-white text-[11px] text-center w-full px-1 break-words leading-tight"
      >
        {{ name }}
      </span>
    </div>
  `,
  styles: [
    `
      .desktop-icon {
        &.selected {
          .icon-label {
            background: #0000aa;
          }
        }
      }
    `,
  ],
})
export class DesktopIconComponent {
  @Input() name = '';
  @Input() iconPath = '';
  @Input() isSelected = false;

  @Output() select = new EventEmitter<MouseEvent>();
  @Output() dblclick = new EventEmitter<void>();

  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.select.emit(event);
  }

  onDoubleClick() {}
}
