import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SafeLayoutService {

  // tslint:disable-next-line: variable-name
  private _rightSidenav = new BehaviorSubject<any>(null);
  private _navItems = new BehaviorSubject<any>(null);

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this._rightSidenav.next(null);
      this._navItems.next(null);
    });
  }

  setRightSidenav(container: any): void {
    this._rightSidenav.next(container);
  }

  get rightSidenav(): Observable<any> {
    return this._rightSidenav.asObservable();
  }

  setNavItems(navItems: any): void {
    this._navItems.next(navItems);
  }

  get navItems(): Observable<any> {
    return this._navItems.asObservable();
  }
}
