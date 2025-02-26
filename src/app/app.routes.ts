import { Routes } from '@angular/router';
import { BootComponent } from './features/boot/boot.component';
import { DesktopComponent } from './features/desktop/desktop.component';
import { ShutdownComponent } from './features/shutdown/shutdown.component';

export const routes: Routes = [
  {
    path: '',
    component: BootComponent,
  },
  {
    path: 'desktop',
    component: DesktopComponent,
  },
  {
    path: 'shutdown',
    component: ShutdownComponent,
  },
  {
    path: '**',
    redirectTo: 'desktop',
  },
];
