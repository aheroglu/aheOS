import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface GitHubFile {
  name: string;
  type: string;
  path: string;
  download_url: string | null;
}

@Component({
  selector: 'app-computer',
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
          <span class="text-[11px]">{{
            currentPath.join(' > ') || 'aheOS'
          }}</span>
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="content-area flex-1 bg-white border-[1px] border-inset p-1 overflow-auto"
      >
        <!-- Loading -->
        @if (loading) {
        <div class="h-full flex items-center justify-center">
          <span class="text-[11px]">Loading...</span>
        </div>
        }

        <!-- Error -->
        @if (error) {
        <div class="h-full flex items-center justify-center">
          <span class="text-[11px] text-red-600">{{ error }}</span>
        </div>
        }

        <!-- Files and Folders -->
        @if (!loading && !error) {
        <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          @if (currentPath.length > 0) {
          <div
            class="file-item flex items-center gap-2 p-1 cursor-pointer"
            (click)="navigateUp()"
            (dblclick)="navigateUp()"
          >
            <img src="/icons/folder-up.png" alt="Up" class="w-4 h-4" />
            <span class="text-[11px]">..</span>
          </div>
          } @for (item of items; track item.path) {
          <div
            class="file-item flex items-center gap-2 p-1 cursor-pointer"
            [class.selected]="selectedItem === item"
            (click)="selectItem(item)"
            (dblclick)="openItem(item)"
          >
            <img [src]="getItemIcon(item)" [alt]="item.type" class="w-4 h-4" />
            <span class="text-[11px] truncate">{{ item.name }}</span>
          </div>
          }
        </div>
        }
      </div>

      <!-- Status Bar -->
      <div
        class="status-bar h-[24px] flex items-center bg-[#c0c0c0] border-[1px] border-inset mt-1 px-2"
      >
        <span class="text-[11px]">{{ getStatusText() }}</span>
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
export class ComputerComponent implements OnInit {
  loading = false;
  error: string | null = null;
  items: GitHubFile[] = [];
  selectedItem: GitHubFile | null = null;
  currentPath: string[] = [];
  baseUrl =
    'https://api.github.com/repos/aheroglu/clean-architecture-starter/contents';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadContent();
  }

  loadContent(path: string = '') {
    this.loading = true;
    this.error = null;
    this.selectedItem = null;

    const url = path ? `${this.baseUrl}/${path}` : this.baseUrl;

    this.http.get<GitHubFile[]>(url).subscribe({
      next: (files) => {
        this.items = files.sort((a, b) => {
          // Önce klasörler, sonra dosyalar
          if (a.type === 'dir' && b.type !== 'dir') return -1;
          if (a.type !== 'dir' && b.type === 'dir') return 1;
          return a.name.localeCompare(b.name);
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repository content';
        this.loading = false;
        console.error('GitHub API Error:', err);
      },
    });
  }

  selectItem(item: GitHubFile) {
    this.selectedItem = item;
  }

  openItem(item: GitHubFile) {
    if (item.type === 'dir') {
      this.currentPath.push(item.name);
      this.loadContent(item.path);
    }
  }

  navigateUp() {
    if (this.currentPath.length > 0) {
      this.currentPath.pop();
      const path = this.currentPath.join('/');
      this.loadContent(path);
    }
  }

  getItemIcon(item: GitHubFile): string {
    if (item.type === 'dir') {
      return '/icons/folder.png';
    }

    // Dosya uzantısına göre icon seç
    const extension = item.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts':
      case 'js':
        return '/icons/code.png';
      case 'json':
        return '/icons/json.png';
      case 'md':
        return '/icons/text.png';
      case 'gitignore':
        return '/icons/git.png';
      case 'yml':
      case 'yaml':
        return '/icons/config.png';
      default:
        return '/icons/file.png';
    }
  }

  getStatusText(): string {
    if (this.loading) {
      return 'Loading...';
    }
    if (this.error) {
      return this.error;
    }
    return `${this.items.length} item(s)`;
  }
}
