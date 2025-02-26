import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey && event.key === 'p') || event.key === 'P') {
      event.preventDefault();
      console.log('Ctrl + P disabled');
    } else if ((event.ctrlKey && event.key === 'o') || event.key === 'O') {
      event.preventDefault();
      console.log('Ctrl + O disabled');
    }
  }
}
