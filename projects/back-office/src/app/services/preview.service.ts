import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  // tslint:disable-next-line: variable-name
  private _roleId = new BehaviorSubject<string>('');

  constructor() { }

  /* Set role which will be used to load the application preview
  */
  setRole(id: string): void {
    this._roleId.next(id);
  }

  /*  Return the roleId as an Observable.
  */
  get roleId(): Observable<string> {
    return this._roleId.asObservable();
  }
}
