import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'back-office';

  // === MSAL ERROR HANDLING ===
  private subscription?: Subscription;
  private timeout?: NodeJS.Timeout;

  private readonly destroying$ = new Subject<void>();

  constructor(
    private broadcastService: MsalBroadcastService,
    private authService: SafeAuthService,
    private msalService: MsalService,
    private formService: SafeFormService
  ) { }

  ngOnInit(): void {
    this.authService.checkAccount();
    this.subscription = this.broadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
      takeUntil(this.destroying$)
    ).subscribe((result: EventMessage) => {
      console.log('mah');
    });
    
    // subscribe('msal:acquireTokenSuccess', () => {
    //   this.authService.getProfileIfNull();
    //   this.authService.getAccountIfNull();
    //   if (this.authService.account) {
    //     const idToken = this.authService.account.idToken;
    //     const timeout = Number(idToken.exp) * 1000 - Date.now() - 1000;
    //     if (idToken && timeout > 0) {
    //       this.timeout = setTimeout(() => {
    //         this.msalService.acquireTokenSilent({
    //           scopes: [environment.clientId]
    //         });
    //       }, timeout);
    //     }
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
    // this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
