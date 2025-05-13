import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowService } from '../../services/window.service';
import { WindowManagerService } from '../../services/window-manager.service';

interface ProgramItem {
  id: number;
  name: string;
  icon: string;
  type: 'web';
  url: string;
  description: string;
  size?: string;
  date?: string;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="computer-container h-full flex flex-col bg-[#c0c0c0] p-1">
      <!-- Address Bar -->
      <div
        class="address-bar h-[24px] flex items-center gap-1 bg-white border-[1px] border-inset px-1 mb-1"
      >
        <img src="/icons/folder.png" alt="Folder" class="w-4 h-4" />
        <span class="text-[11px]">Path:</span>
        <div class="flex-1 flex items-center">
          <span class="text-[11px]">My Projects</span>
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="content-area flex-1 bg-white border-[1px] border-inset p-1 overflow-auto"
      >
        <!-- Programs Grid -->
        <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
          @for (program of programs; track program.id) {
          <div
            class="file-item flex flex-col items-center p-1 cursor-pointer"
            [class.selected]="selectedProgram === program"
            (click)="selectProgram(program)"
            (dblclick)="openProgram(program)"
          >
            <img [src]="program.icon" [alt]="program.name" class="w-10 h-10 mb-1" />
            <span class="text-[11px] text-center">{{ program.name }}</span>
          </div>
          }
        </div>
      </div>

      <!-- Status Bar -->
      <div
        class="status-bar h-[24px] flex items-center bg-[#c0c0c0] border-[1px] border-inset mt-1 px-2"
      >
        <span class="text-[11px]">{{ programs.length }} item(s)</span>
      </div>
    </div>
  `,
  styles: [
    `
      .file-item {
        &:hover {
          background: #e5e5e5;
        }

        &.selected {
          background: #0000aa;
          color: white;
        }
      }

      .border-inset {
        border-color: #808080 #ffffff #ffffff #808080;
      }
    `,
  ],
})
export class ProgramsComponent {
  programs: ProgramItem[] = [
    {
      id: 1,
      name: 'NG Commerce',
      icon: '/icons/browser.png',
      type: 'web',
      url: 'https://ng-commerce.aheroglu.dev/',
      description: 'Angular e-commerce application',
      size: '15.2 MB',
      date: '20.03.2024'
    },
    {
      id: 2,
      name: 'LinkedAI',
      icon: '/icons/linkedai.png',
      type: 'web',
      url: 'https://linkedai.app/',
      description: 'AI-powered platform for professionals',
      size: '22.4 MB',
      date: '21.03.2024'
    },
  ];

  selectedProgram: ProgramItem | null = null;

  constructor(private windowManagerService: WindowManagerService) {}

  selectProgram(program: ProgramItem): void {
    this.selectedProgram = program;
  }

  openProgram(program: ProgramItem): void {
    if (program.type === 'web') {
      // Pencere pozisyonunu ayarla
      const x = 100 + Math.floor(Math.random() * 50);
      const y = 50 + Math.floor(Math.random() * 30);
      
      // Pencere nesnesini oluştur
      const windowObj = {
        id: Date.now(),
        title: program.name,
        icon: program.icon,
        type: 'web' as 'web', // Tip güvenliği için as kullanıyoruz
        x,
        y,
        width: 1000,
        height: 600,
        zIndex: this.windowManagerService.getNextZIndex(),
        isMinimized: false,
        isMaximized: false,
        url: program.url,
      };
      
      // Pencereyi aç
      this.windowManagerService.openWindow(windowObj);
    }
  }
}
