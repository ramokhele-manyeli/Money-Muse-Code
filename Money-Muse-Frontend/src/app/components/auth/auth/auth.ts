import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../../login/login';
import { Register } from '../../register/register/register';
@Component({
  selector: 'app-auth',
  imports: [CommonModule, Login, Register],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class Auth {
  mode: 'login' | 'register' = 'login';

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
