import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'front-office';

  // === MSAL ERROR HANDLING ===
  private subscription?: Subscription;

  constructor(
    private authService: SafeAuthService,
    private formService: SafeFormService
  ) { }

  ngOnInit(): void {}
}
