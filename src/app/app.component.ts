import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'egg', label: 'Lotes de Ovos', route: '/lotes-ovos' },
    { icon: 'thermostat', label: 'Incubação', route: '/incubacao' },
    { icon: 'pets', label: 'Lotes de Aves', route: '/lotes-aves' }
  ];

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
