import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shutdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="shutdown-screen h-screen w-screen bg-black flex flex-col items-center justify-center"
    >
      <!-- aheOS Logo -->
      <div class="text-center mb-8">
        <img src="/images/aheOS-logo.png" alt="aheOS Logo" class="w-48 h-32 mb-8" />
        <div class="text-white text-6xl font-bold tracking-wide font-win95">
          aheOS
        </div>
      </div>

      <!-- Shutdown Message -->
      <div class="shutdown-message text-white text-xl font-win95 mt-8">
        {{ currentMessage }}
      </div>

      <!-- Progress Dots -->
      <div class="progress-dots text-white text-2xl mt-4 font-mono">
        {{ progressDots }}
      </div>
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
    `,
  ],
})
export class ShutdownComponent implements OnInit {
  currentMessage: string = 'Windows 95 is shutting down...';
  progressDots: string = '';
  private audio: HTMLAudioElement;

  private shutdownMessages = [
    'aheOS is shutting down...',
    'Saving system settings...',
    'Stopping system services...',
    'It is now safe to turn off your computer.',
  ];

  constructor(private router: Router) {
    this.audio = new Audio('/sounds/shutdown.mp3');
  }

  ngOnInit() {
    this.startShutdown();
  }

  private async startShutdown() {
    try {
      // Play shutdown sound
      await this.audio.play();

      // Show shutdown messages
      let currentStep = 0;
      const totalSteps = this.shutdownMessages.length;

      const messageInterval = setInterval(() => {
        if (currentStep < totalSteps) {
          this.currentMessage = this.shutdownMessages[currentStep];
          this.progressDots += '.';
          currentStep++;
        } else {
          clearInterval(messageInterval);
          // Redirect to boot screen after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      }, 1500);
    } catch (error) {
      console.error('Failed to play audio:', error);
      // Continue shutdown sequence even if audio fails
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }
}
