import { Component, signal } from '@angular/core';
import { ListaProdutos } from './features/podutos/lista-produtos/lista-produtos';

@Component({
  selector: 'app-root',
  imports: [ListaProdutos],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('meu-primeiro-app');
}
