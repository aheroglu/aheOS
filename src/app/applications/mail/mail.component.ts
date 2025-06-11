import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mail-container h-full w-full flex flex-col bg-[#c0c0c0]">
      <!-- Mail Form -->
      <div class="mail-form flex-1 p-3 bg-[#c0c0c0] overflow-y-auto">
        <!-- To Email (Readonly) -->
        <div class="form-group mb-3">
          <label class="block text-[13px] mb-1 font-bold">To Email:</label>
          <input
            type="text"
            class="w-full px-2 py-1 border border-[#808080] bg-white text-black text-[13px]"
            value="aheroglu.dev@gmail.com"
            readonly
          />
        </div>

        <!-- From Name -->
        <div class="form-group mb-3">
          <label class="block text-[13px] mb-1 font-bold">From Name:</label>
          <input
            type="text"
            [(ngModel)]="fromName"
            class="w-full px-2 py-1 border border-[#808080] bg-white text-black text-[13px]"
            placeholder="Your Name"
          />
        </div>

        <!-- From Email -->
        <div class="form-group mb-3">
          <label class="block text-[13px] mb-1 font-bold">From Email:</label>
          <input
            type="email"
            [(ngModel)]="fromEmail"
            class="w-full px-2 py-1 border border-[#808080] bg-white text-black text-[13px]"
            placeholder="your.email@example.com"
          />
        </div>

        <!-- Subject -->
        <div class="form-group mb-3">
          <label class="block text-[13px] mb-1 font-bold">Subject:</label>
          <input
            type="text"
            [(ngModel)]="subject"
            class="w-full px-2 py-1 border border-[#808080] bg-white text-black text-[13px]"
            placeholder="Enter subject"
          />
        </div>

        <!-- Message -->
        <div class="form-group mb-3">
          <label class="block text-[13px] mb-1 font-bold">Message:</label>
          <textarea
            [(ngModel)]="message"
            class="w-full h-48 px-2 py-1 border border-[#808080] bg-white text-black text-[13px] resize-none font-mono"
            placeholder="Type your message here..."
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="buttons flex gap-2 justify-end mt-4">
          <button
            (click)="sendMail()"
            class="px-4 py-1 bg-[#c0c0c0] border border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] text-[13px] active:border active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
          >
            Send
          </button>
          <button
            (click)="clearForm()"
            class="px-4 py-1 bg-[#c0c0c0] border border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] text-[13px] active:border active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Status Bar -->
      <div
        class="status-bar flex items-center justify-between text-[11px] px-1 py-0.5 border-t border-[#808080]"
      >
        <div>{{ statusMessage }}</div>
        <div>{{ getCurrentTime() }}</div>
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

      textarea,
      input {
        font-family: 'Tahoma', 'Arial', sans-serif;
      }

      button:focus {
        outline: 1px dotted #000;
      }

      .form-group label {
        font-family: 'Tahoma', 'Arial', sans-serif;
      }
    `,
  ],
})
export class MailComponent {
  toEmail: string = 'aheroglu.dev@gmail.com';
  fromName: string = '';
  fromEmail: string = '';
  subject: string = '';
  message: string = '';
  statusMessage: string = 'Ready';

  sendMail() {
    if (!this.fromEmail || !this.subject || !this.message) {
      this.statusMessage = 'Error: Please fill in all fields';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.fromEmail)) {
      this.statusMessage = 'Error: Please enter a valid email address';
      return;
    }

    this.statusMessage = 'Sending email...';
  }

  clearForm() {
    this.fromName = '';
    this.fromEmail = '';
    this.subject = '';
    this.message = '';
    this.statusMessage = 'Ready';
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString();
  }
}
