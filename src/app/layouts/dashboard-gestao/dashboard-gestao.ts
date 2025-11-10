import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-gestao',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './dashboard-gestao.html',
  styleUrl: './dashboard-gestao.css',
})
export class DashboardGestao {

}
