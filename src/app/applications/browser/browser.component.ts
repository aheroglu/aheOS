import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="browser-container h-full w-full flex flex-col">
      <div
        class="browser-toolbar h-8 bg-[#c0c0c0] flex items-center px-2 gap-2 border-b border-[#808080]"
      >
        <img src="/icons/browser.png" alt="Browser" class="w-4 h-4" />
        <span class="text-sm truncate">{{ url }}</span>
      </div>
      <div class="browser-content flex-1 bg-white">
        <iframe
          [src]="safeUrl"
          class="w-full h-full border-0"
          frameborder="0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        ></iframe>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class BrowserComponent implements OnInit {
  @Input() url: string = '';
  safeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
