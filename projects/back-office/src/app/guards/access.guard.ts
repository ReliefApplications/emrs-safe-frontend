import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { User, SafeAuthService, SafeSnackBarService } from '@safe/builder';
import { Observable } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(
    private authService: SafeAuthService,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user.pipe(
        // take(1),
        skip(1), // this is important as first value of behaviorSubject is null
        map((user: User | null) => {
          console.log(user);
          if (user) {
            if (user.isAdmin) {
              return true;
            }
            this.snackBar.openSnackBar('No access provided to this platform.', { error: true });
            this.authService.logout();
            this.router.navigate(['/auth']);
            return false;
          } else {
            if (this.authService.account) {
              this.authService.logout();
            } else {
              this.router.navigate(['/auth']);
            }
            return false;
          }
        })
      );
  }
}
