import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="certificate-viewer h-full flex flex-col bg-[#c0c0c0] p-1">
      <!-- Content Area -->
      <div
        class="content-area flex-1 bg-white border-[1px] border-inset p-1 overflow-auto flex items-center justify-center"
      >
        <img [src]="imagePath" [alt]="name" class="max-w-full max-h-full object-contain" />
      </div>

      <!-- Status Bar -->
      <div
        class="status-bar h-[24px] flex items-center bg-[#c0c0c0] border-[1px] border-inset mt-1 px-2"
      >
        <span class="text-[11px]">{{ name }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .border-inset {
        border-color: #808080 #ffffff #ffffff #808080;
      }
    `,
  ],
})
export class CertificateViewerComponent {
  @Input() imagePath: string = '';
  @Input() name: string = '';
}
