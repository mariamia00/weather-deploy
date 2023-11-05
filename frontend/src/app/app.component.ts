import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private titleService: Title, private meta: Meta) {
    this.titleService.setTitle('Crazy weather forecast');
    this.meta.updateTag({
      name: 'description',
      content: 'Crazy weather forecast, worldwide forecast weather',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'crazy weather forecast, uyw, weather forecast, worldwide weather, heatmap weather, crazy weather, targu jiu weather',
    });
  }

  title = 'Weather forecast';
}
