import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="boot-screen h-screen w-screen bg-black flex flex-col items-center justify-center"
    >
      <ng-container *ngIf="!showLogo">
        <!-- Initial Message -->
        <div class="text-white text-xl font-win95">{{ currentStatus }}</div>
      </ng-container>

      <ng-container *ngIf="showLogo">
        <!-- aheOS Logo -->
        <div class="text-center mb-8" [class.fade-in]="showLogo">
          <img src="/images/aheOS-logo.png" alt="aheOS Logo" class="w-48 h-32 mb-8" />
          <div class="text-white text-6xl font-bold tracking-wide font-win95">
            aheOS
          </div>
        </div>

        <!-- Loading Status -->
        <div
          class="loading-status text-white text-xl font-win95 mt-8"
          [class.fade-in]="showStatus"
        >
          {{ currentStatus }}
        </div>

        <!-- Progress Bar -->
        <div
          class="progress-container w-96 h-2 bg-gray-700 mt-4"
          [class.fade-in]="showProgress"
        >
          <div
            class="progress-bar h-full bg-white"
            [style.width.%]="progress"
          ></div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
        background-color: black;
      }

      .font-win95 {
        font-family: 'MS Sans Serif', sans-serif;
      }

      .fade-in {
        opacity: 0;
        animation: fadeIn 1s ease-in forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .progress-bar {
        transition: width 0.3s ease-in-out;
      }
    `,
  ],
})
export class BootComponent implements OnInit {
  progress: number = 0;
  currentStatus: string = 'Click anywhere to start Windows 95...';
  showLogo: boolean = false;
  showStatus: boolean = true;
  showProgress: boolean = false;
  isBooting: boolean = false;
  private audio: HTMLAudioElement;

  private bootSequence = [
    'Starting aheOS...',
    'Loading system files...',
    'Checking system configuration...',
    'Initializing drivers...',
    'Starting system services...',
    'Preparing desktop...',
  ];

  constructor(private router: Router) {
    this.audio = new Audio('/sounds/startup.mp3');
  }

  ngOnInit() {
    // Display initial message
    this.currentStatus = 'Click anywhere to start aheOS...';

    // Wait for user interaction
    document.addEventListener('click', () => this.startBoot(), { once: true });
  }

  private async startBoot() {
    if (this.isBooting) return;
    this.isBooting = true;

    try {
      // Play startup sound
      await this.audio.play();

      // Start boot sequence
      this.currentStatus = this.bootSequence[0];
      this.showLogo = true;

      setTimeout(() => {
        this.showProgress = true;
        this.startBootSequence();
      }, 2000);
    } catch (error) {
      console.error('Failed to play audio:', error);
      // Continue boot sequence even if audio fails
      this.startBootSequence();
    }
  }

  private startBootSequence() {
    let currentStep = 0;
    const totalSteps = this.bootSequence.length;
    const intervalTime = 800;

    const bootInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        this.currentStatus = this.bootSequence[currentStep];
        this.progress = (currentStep + 1) * (100 / totalSteps);
        currentStep++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => {
          this.router.navigate(['/desktop']);
        }, 1000);
      }
    }, intervalTime);
  }
}
