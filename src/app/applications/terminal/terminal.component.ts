import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowService } from '../../services/window.service';
import { GithubService } from '../../services/github.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="terminal-container h-full w-full bg-black text-white font-mono p-1 overflow-auto"
    >
      <div class="terminal-output mb-1">
        <div class="text-[16px] leading-tight">aheOS Terminal</div>
        <div class="text-[16px] leading-tight mb-2">
          (C) Copyright ahe 2025. All rights reserved.
        </div>

        <div *ngFor="let line of outputLines; trackBy: trackLine">
          <div class="text-[16px] leading-tight whitespace-pre">
            {{ line }}
          </div>
        </div>
      </div>

      <div class="flex items-center text-[16px] leading-tight">
        <span class="mr-2">C:\\></span>
        <input
          #cmdInput
          type="text"
          placeholder="Type 'help' for help, 'about' to show information, 'clear' to clear the screen or enter a command"
          class="flex-1 bg-transparent border placeholder:italic border-black outline-none text-white font-mono text-[16px] leading-tight p-0"
          [(ngModel)]="currentCommand"
          (keydown.enter)="executeCommand()"
          autocomplete="off"
          spellcheck="false"
        />
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
        background-color: black;
      }

      .terminal-container {
        height: 100%;
        width: 100%;
        font-family: 'Courier New', Courier, monospace;
      }

      input {
        caret-color: white;
        margin: 0;
        padding: 0;
        background-color: transparent !important;
      }

      input:focus {
        background-color: transparent !important;
        border: none;
        outline: none;
      }
    `,
  ],
})
export class TerminalComponent implements AfterViewInit {
  @ViewChild('cmdInput') cmdInput!: ElementRef<HTMLInputElement>;

  constructor(
    private windowService: WindowService,
    private githubService: GithubService,
    private router: Router
  ) {}

  outputLines: string[] = [];
  currentCommand = '';
  commandHistory: string[] = [];
  currentHistoryIndex = -1;

  private readonly asciiArt = [
    '          _           ___  ____  ',
    '     __ _| |__   ___ / _ \\/ ___| ',
    "    / _` | '_ \\ / _ \\ | | \\___ \\ ",
    '   | (_| | | | |  __/ |_| |___) |',
    '    \\__,_|_| |_|\\___|\\___/|____/ ',
    '',
    '           I ♥ Open Source',
    '',
    '    Operating System [Version 1.0.3]',
    '    Developed by Ahmet Hakan Eroğlu',
    '    GitHub: github.com/aheroglu',
    '    LinkedIn: linkedin.com/in/aheroglu',
    '',
    '    You can access all source code on "github.com/aheroglu/aheOS"',
    '',
  ];

  private readonly socialLinks: Record<string, string> = {
    github: 'https://github.com/aheroglu',
    linkedin: 'https://linkedin.com/in/aheroglu'
  };

  private readonly availableCommands = [
    'about    - Shows information about the operating system',
    'clear    - Clears the screen',
    'date     - Shows the current date',
    'dir      - Lists the files in the aheOS repository',
    'exit     - Closes the terminal',
    'help     - This shows the help message',
    'open     - Opens specified social media links (use "open --help" for more info)',
    'shutdown - Shuts down the operating system',
    'time     - Shows the current time',
    'ver      - Shows the version information of the operating system',
  ];

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory('up');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory('down');
    }
  }

  navigateHistory(direction: 'up' | 'down') {
    if (this.commandHistory.length === 0) return;

    if (direction === 'up') {
      if (this.currentHistoryIndex < this.commandHistory.length - 1) {
        this.currentHistoryIndex++;
        this.currentCommand = this.commandHistory[this.currentHistoryIndex];
      }
    } else {
      if (this.currentHistoryIndex > 0) {
        this.currentHistoryIndex--;
        this.currentCommand = this.commandHistory[this.currentHistoryIndex];
      } else if (this.currentHistoryIndex === 0) {
        this.currentHistoryIndex = -1;
        this.currentCommand = '';
      }
    }
  }

  ngAfterViewInit() {
    this.cmdInput.nativeElement.focus();
  }

  trackLine(index: number, line: string) {
    return line;
  }

  executeCommand() {
    if (this.currentCommand.trim()) {
      this.outputLines.push(`C:\\> ${this.currentCommand}`);
      this.commandHistory.unshift(this.currentCommand);
      this.currentHistoryIndex = -1;

      const command = this.currentCommand.toLowerCase().trim();

      if (command.startsWith('open')) {
        const args = command.split(' ');
        if (args.length === 1) {
          this.outputLines.push('Usage: open <platform>');
          this.outputLines.push('Example: open github');
          this.outputLines.push('');
          this.outputLines.push('Use "open --help" to see available platforms');
        } else if (args[1] === '--help') {
          this.outputLines.push('Available platforms:');
          this.outputLines.push('');
          Object.keys(this.socialLinks).forEach(platform => {
            this.outputLines.push(`${platform.padEnd(10)} - Opens ${this.socialLinks[platform]}`);
          });
        } else {
          const platform = args[1];
          if (this.socialLinks[platform]) {
            window.open(this.socialLinks[platform], '_blank');
            this.outputLines.push(`Opening ${platform} in a new tab...`);
          } else {
            this.outputLines.push(`Error: Unknown platform "${platform}"`);
            this.outputLines.push('Use "open --help" to see available platforms');
          }
        }
        this.currentCommand = '';
        return;
      }

      switch (command) {
        case 'help':
          this.outputLines.push(
            'Available commands:',
            '',
            ...this.availableCommands,
            ''
          );
          break;

        case 'clear':
          this.outputLines = [];
          break;

        case 'date':
          this.outputLines.push(new Date().toLocaleDateString());
          break;

        case 'time':
          this.outputLines.push(new Date().toLocaleTimeString());
          break;

        case 'ver':
          this.outputLines.push('aheOS [Version 1.0.3]');
          break;

        case 'about':
          this.asciiArt.forEach((line) => this.outputLines.push(line));
          break;

        case 'dir':
          this.githubService.getRepositoryContents().subscribe({
            next: (contents) => {
              this.outputLines.push(' Directory of aheOS Repository\n');
              contents.forEach((item) => {
                const size = item.size.toString().padStart(10, ' ');
                this.outputLines.push(`${size}  ${item.name}`);
              });
              this.outputLines.push('\n');
            },
            error: () => {
              this.outputLines.push(
                'Error: Unable to fetch repository contents.\n'
              );
            },
          });
          break;

        case 'shutdown':
          this.outputLines.push('Shutting down aheOS...\n');
          setTimeout(() => {
            this.router.navigate(['/shutdown']);
          }, 1500);
          break;

        case 'exit':
          this.windowService.closeWindow('terminal');
          break;

        default:
          this.outputLines.push(
            `'${this.currentCommand}' command not found.\nType 'help' for available commands.`
          );
      }

      this.currentCommand = '';
      setTimeout(() => {
        this.cmdInput.nativeElement.focus();
      });
    }
  }
}
