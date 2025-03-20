import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NoteTab {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
}

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notepad-container h-full w-full flex flex-col bg-[#c0c0c0]">
      <!-- Tab Bar -->
      <div
        class="tab-bar flex items-center p-0.5 bg-[#c0c0c0] border-b border-[#808080]"
      >
        <div
          *ngFor="let tab of tabs"
          (click)="selectTab(tab)"
          class="tab cursor-pointer px-2 py-0.5 mr-0.5 text-[13px] font-normal tracking-wider"
          [class.active-tab]="tab.isActive"
        >
          {{ tab.title }}
        </div>
      </div>

      <!-- Menu Bar -->
      <div
        class="menu-bar flex items-center text-[12px] border-b border-[#808080]"
      >
        <div
          class="menu-item px-2 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer"
        >
          File
        </div>
        <div
          class="menu-item px-2 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer"
        >
          Edit
        </div>
        <div
          class="menu-item px-2 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer"
        >
          View
        </div>
        <div
          class="menu-item px-2 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer"
        >
          Help
        </div>
      </div>

      <!-- Editor Area -->
      <div class="editor-area flex-1 p-1 bg-white overflow-y-hidden">
        <textarea
          *ngIf="activeTab"
          [(ngModel)]="activeTab.content"
          class="w-full h-full resize-none bg-white text-black font-mono text-[16px] p-1 border-none outline-none"
          spellcheck="false"
          readonly
        ></textarea>
      </div>

      <!-- Status Bar -->
      <div
        class="status-bar flex items-center justify-between text-[11px] px-1 py-0.5 border-t border-[#808080]"
      >
        <div>Ln 1, Col 1</div>
        <div>100%</div>
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

      .active-tab {
        background: #fff;
        border: 1px solid #808080;
        border-bottom: none;
        position: relative;
      }

      .active-tab::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: #fff;
      }

      textarea {
        font-family: 'Courier New', Courier, monospace;
      }
    `,
  ],
})
export class NotepadComponent implements OnInit {
  tabs: NoteTab[] = [
    {
      id: 'about',
      title: 'About me.txt',
      content: `I embarked on my software development journey with C# programming language before my university education. After following tutorials and building desktop and dynamic web applications, I enhanced my practical skills through various projects.

In enterprise-level development, I specialize in N-Tier, Onion, and Clean architectures using .NET Core. These architectures enable me to create scalable and sustainable software solutions.

Furthermore, I have gained valuable experience in developing dynamic web applications using Angular for the front-end. I continue to expand my knowledge daily, enjoying the continuous evolution of my software development career.

GitHub: github.com/aheroglu
LinkedIn: linkedin.com/in/aheroglu`,
      isActive: true,
    },
    {
      id: 'skills',
      title: 'Skills.txt',
      content: `Frontend Development: Angular, TypeScript, Ionic, Bootstrap, Tailwind CSS
Backend Development: C#, .NET Core, Entity Framework Core 
Database: MsSQL, Firebase`,
      isActive: false,
    },
    {
      id: 'projects',
      title: 'Projects.txt',
      content: `1. aheOS - A Windows 95 themed portfolio 
2. LinkedAI - AI based LinkedIn Content Generator 
3. NG Commerce - An e-commerce application developed with .NET Core and Angular`,
      isActive: false,
    },
  ];

  activeTab: NoteTab | null = null;

  ngOnInit() {
    this.activeTab = this.tabs.find((tab) => tab.isActive) || null;
  }

  selectTab(tab: NoteTab) {
    this.tabs.forEach((t) => (t.isActive = false));
    tab.isActive = true;
    this.activeTab = tab;
  }
}
