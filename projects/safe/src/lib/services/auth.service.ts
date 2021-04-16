import {Apollo} from 'apollo-angular';
import { Inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountInfo, AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/*  Auth service, using Msal service for Azure AD.
  Authentication and Authorization methods.
*/
export class SafeAuthService {

  // === LOGGED USER ===
  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<User | null>(null);
  public account: AccountInfo | null = null;

  // if we have the modal confirmation open on form builder we cannot logout until close modal
  public canLogout = new BehaviorSubject<boolean>(true);

  constructor(
    @Inject('environment') environment: any,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private apollo: Apollo
  ) {
    this.checkAccount();
    this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((res: EventMessage) => {
      console.log('=== LOGIN ===');
      const payload = res.payload as AuthenticationResult;
      this.msalService.instance.setActiveAccount(payload.account);
      this.getProfile();
    });
    this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.HANDLE_REDIRECT_START)
    )
    .subscribe((res: EventMessage) => {
      console.log('=== REDIRECT ===');
      console.log(res);
      // const payload = res.payload as AuthenticationResult;
      // this.msalService.instance.setActiveAccount(payload.account);
      // this.getProfile();
    });
    this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)
    )
    .subscribe(() => {
      console.log('=== ACQUIRE TOKEN ===');
      this.checkAccount();
      this.getProfile();
      if (this.account) {
        const idToken: any = this.msalService.instance.getActiveAccount()?.idTokenClaims;
        console.log(idToken);
        const timeout = Number(idToken.exp) * 1000 - Date.now() - 1000;
        if (idToken && timeout > 0) {
          setTimeout(() => {
            this.msalService.acquireTokenSilent({
              scopes: [environment.clientId]
            }).subscribe(res => console.log(res));
          }, timeout);
        }
      }
    });
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.checkAccount();
      });
  }

  /*  Check if user has permission.
    If user profile is empty, try to get it.
  */
  userHasClaim(permission: string): boolean {
    console.log('has claim');
    const user = this._user.getValue();
    if (user) {
      if (user.permissions && (!permission || user.permissions.find(x => x.type === permission))) {
        return true;
      }
      return false;
    } else {
      this.getProfile();
      return false;
    }
  }

  /*  Check if user is admin.
    If user profile is empty, try to get it.
  */
  get userIsAdmin(): boolean {
    console.log('is admin');
    const user = this._user.getValue();
    if (user) {
      return user.isAdmin || false;
    } else {
      this.getProfile();
      return false;
    }
  }

  /*  Clean user profile, and logout.
  */
  logout(): void {
    console.log('logout');
    this.msalService.logoutRedirect();
    this.account = null;
    this._user.next(null);
  }

  /*  Get the Azure AD profile.
  */
  checkAccount(): void {
    console.log('account');
    this.account = this.msalService.instance.getActiveAccount();
    console.log(this.account);
  }

  /*  Get the profile from the database, using GraphQL.
  */
  getProfile(): void {
    console.log('get profile');
    this.apollo.query<GetProfileQueryResponse>({
      query: GET_PROFILE,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).subscribe(
      res => {
        this._user.next(res.data.me);
      }
    );
  }

  /*  Return the user as an Observable.
  */
  get user(): Observable<User | null> {
    return this._user.asObservable();
  }
}
