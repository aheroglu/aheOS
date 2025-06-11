import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../../services/window-manager.service';

interface Certificate {
  id: number;
  name: string;
  icon: string;
  imagePath: string;
  date?: string;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="certificates-container h-full flex flex-col bg-[#c0c0c0] p-1">
      <!-- Address Bar -->
      <div
        class="address-bar h-[24px] flex items-center gap-1 bg-white border-[1px] border-inset px-1 mb-1"
      >
        <img src="/icons/folder.png" alt="Folder" class="w-4 h-4" />
        <span class="text-[11px]">Path:</span>
        <div class="flex-1 flex items-center">
          <span class="text-[11px]">Certificates</span>
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="content-area flex-1 bg-white border-[1px] border-inset p-1 overflow-auto"
      >
        <!-- Certificates Grid -->
        <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
          @for (certificate of certificates; track certificate.id) {
          <div
            class="file-item flex flex-col items-center p-1 cursor-pointer"
            [class.selected]="selectedCertificate === certificate"
            (click)="selectCertificate(certificate)"
            (dblclick)="openCertificate(certificate)"
          >
            <div
              class="certificate-thumbnail w-16 h-16 mb-1 border border-gray-300 flex items-center justify-center overflow-hidden bg-white"
            >
              <img
                [src]="certificate.imagePath"
                [alt]="certificate.name"
                class="max-w-full max-h-full object-contain"
              />
            </div>
            <span class="text-[11px] text-center">{{ certificate.name }}</span>
          </div>
          }
        </div>
      </div>

      <!-- Status Bar -->
      <div
        class="status-bar h-[24px] flex items-center bg-[#c0c0c0] border-[1px] border-inset mt-1 px-2"
      >
        <span class="text-[11px]">{{ certificates.length }} item(s)</span>
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
export class CertificatesComponent implements OnInit {
  certificates: Certificate[] = [];
  selectedCertificate: Certificate | null = null;

  constructor(private windowManagerService: WindowManagerService) {}

  ngOnInit(): void {
    // Sertifikaları yükle
    this.loadCertificates();
  }

  loadCertificates(): void {
    // Şu anda sadece bir sertifika var
    this.certificates = [
      {
        id: 1,
        name: 'TS Bootcamp',
        icon: '/icons/certificate.png',
        imagePath: '/certifications/ts-bootcamp.png',
        date: '11.06.2025',
      },
    ];
  }

  selectCertificate(certificate: Certificate): void {
    this.selectedCertificate = certificate;
  }

  openCertificate(certificate: Certificate): void {
    // Pencere pozisyonunu ayarla
    const x = 100 + Math.floor(Math.random() * 50);
    const y = 50 + Math.floor(Math.random() * 30);

    // Pencere nesnesini oluştur
    const windowObj = {
      id: Date.now(),
      title: certificate.name,
      icon: '/icons/certificate.png',
      type: 'certificate' as 'certificate',
      x,
      y,
      width: 800,
      height: 600,
      zIndex: this.windowManagerService.getNextZIndex(),
      isMinimized: false,
      isMaximized: false,
      content: {
        component: 'certificate-viewer',
        data: {
          imagePath: certificate.imagePath,
          name: certificate.name,
        },
      },
    };

    // Pencereyi aç
    this.windowManagerService.openWindow(windowObj);
  }
}
