import { Component, OnInit } from '@angular/core';
import { SafeAuthService, SafeFormService } from '@safe/builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'back-office';

  constructor(
    private authService: SafeAuthService,
    private formService: SafeFormService
  ) { }

  ngOnInit(): void {}
}
