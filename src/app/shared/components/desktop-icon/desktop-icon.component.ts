import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desktop-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="desktop-icon flex items-center justify-center align-middle flex-col mb-5  gap-2 {{
        coverSize
      }} cursor-default select-none"
      [class.selected]="isSelected"
      (click)="onClick($event)"
      (dblclick)="onDoubleClick()"
    >
      <div
        class="icon-wrapper {{
          wrapperSize
        }} flex items-center justify-center relative"
      >
        <img
          [src]="iconPath"
          [alt]="name"
          class="{{ imgSize }}"
          draggable="false"
        />
      </div>
      <span
        class="icon-label text-white {{
          fontSize
        }} text-center w-full px-1 break-words leading-tight"
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
export class DesktopIconComponent implements OnChanges {
  @Input() name = '';
  @Input() iconPath = '';
  @Input() isSelected = false;
  @Input() size = '';

  @Output() select = new EventEmitter<MouseEvent>();
  @Output() dblclick = new EventEmitter<void>();

  coverSize: string = 'w-[70px]';
  wrapperSize: string = 'w-14 h-14';
  imgSize: string = 'text-[12px]';
  fontSize: string = 'text-[10px]';

  constructor() {
    if (this.size === 'large') {
      this.coverSize = 'w-[100px]';
      this.imgSize = 'text-[14px]';
      this.wrapperSize = 'w-16 h-16';
      this.fontSize = 'text-[12px]';
    } else if (this.size === 'medium') {
      this.coverSize = 'w-[70px]';
      this.imgSize = 'text-[12px]';
      this.wrapperSize = 'w-14 h-14';
      this.fontSize = 'text-[10px]';
    } else if (this.size === 'small') {
      this.coverSize = 'w-[50px]';
      this.imgSize = 'text-[10px]';
      this.wrapperSize = 'w-12 h-12';
      this.fontSize = 'text-[8px]';
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']) {
      this.updateSizes();
    }
  }

  private updateSizes() {
    switch (this.size) {
      case 'large':
        this.wrapperSize = 'w-16 h-16';
        this.imgSize = 'w-16 h-16';
        this.fontSize = 'text-[15px]';
        break;
      case 'medium':
        this.wrapperSize = 'w-12 h-12';
        this.imgSize = 'w-12 h-12';
        this.fontSize = 'text-[11px]';
        break;
      case 'small':
        this.wrapperSize = 'w-10 h-10';
        this.imgSize = 'w-10 h-10';
        this.fontSize = 'text-[9px]';
        break;
    }
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.select.emit(event);
  }

  onDoubleClick() {}
}
