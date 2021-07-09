import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Apollo
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

// Env
import { environment } from '../environments/environment';

// MSAL
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { BehaviorSubject } from 'rxjs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';



const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const REFRESH = new BehaviorSubject<boolean>(false);

/*  Configuration of the Apollo client.
*/
export function provideApollo(httpLink: HttpLink): any {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));


  const auth = setContext((operation, context) => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem('msal.idtoken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  });

  const http = httpLink.create({ uri: `${environment.API_URL}/graphql` });

  const ws = new WebSocketLink({
    uri: `${environment.SUBSCRIPTION_API_URL}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem('msal.idtoken')
      },
      connectionCallback: (error) => {
        if (!error) {
          REFRESH.next(true);
          console.log('Schema generated without cache reloading.');
        }
      }
    }
  });

  interface Definition {
    kind: string;
    operation?: string;
  }

  const link = ApolloLink.from([basic, auth, split(
    ({ query }) => {
      const { kind, operation }: Definition = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    http,
  )]);

  // Cache is not currently used, due to fetchPolicy values
  const cache = new InMemoryCache();

  return {
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      }
    }
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    // Configuration of the Msal module. Check that the scope are actually enabled by Azure AD on Azure portal.
    MsalModule.forRoot({
      auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: environment.redirectUrl,
        postLogoutRedirectUri: environment.postLogoutRedirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
      framework: {
        isAngular: true
      }
    },
      {
        popUp: false,
        consentScopes: [
          'user.read',
          'openid',
          'profile',
        ],
        protectedResourceMap: [
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
        ],
        extraQueryParameters: {}
      }),
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: 'environment',
      useValue: environment
    },
    {
      // TODO: added default options to solve cache issues, cache solution can be added at the query / mutation level.
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private apollo: Apollo
  ) {}
}
