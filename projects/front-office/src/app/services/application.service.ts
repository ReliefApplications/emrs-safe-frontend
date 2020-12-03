import { Injectable } from '@angular/core';
import { Application, User, Role, WhoSnackBarService } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddRoleMutationResponse, AddRoleToUserMutationResponse, ADD_ROLE, ADD_ROLE_TO_USER,
  EditUserMutationResponse, EDIT_USER, EditRoleMutationResponse, EDIT_ROLE } from '../graphql/mutations';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  // tslint:disable-next-line: variable-name
  private _application = new BehaviorSubject<Application>(null);

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
  ) { }

  /*  Get the application from the database, using GraphQL.
  */
  loadApplication(id: string): void {
    this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id
      }
    }).valueChanges.subscribe(res => {
      this._application.next(res.data.application);
    });
  }

  /*  Return the application as an Observable.
  */
  get application(): Observable<Application> {
    return this._application.asObservable();
  }

  /* Add a new role to the opened application.
  */
  addRole(value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddRoleMutationResponse>({
      mutation: ADD_ROLE,
      variables: {
        title: value.title,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${value.title} role created`);
      application.roles = application.roles.concat([res.data.addRole]);
      this._application.next(application);
    });
  }

  /* Edit an existing role.
  */
  editRole(role: Role, value: any): void {
    this.apollo.mutate<EditRoleMutationResponse>({
      mutation: EDIT_ROLE,
      variables: {
        id: role.id,
        permissions: value.permissions
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${role.title} role updated.`);
      const application = this._application.getValue();
      this.loadApplication(application.id);
    });
  }

  /* Invite an user to the opened application.
  */
  inviteUser(value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddRoleToUserMutationResponse>({
      mutation: ADD_ROLE_TO_USER,
      variables: {
        id: value.user.id,
        role: value.role
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${res.data.addRoleToUser.username} invited.`);
      application.users = application.users.concat([res.data.addRoleToUser]);
      this._application.next(application);
    });
  }

  /* Edit an user that has access to the application.
  */
  editUser(user: User, value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<EditUserMutationResponse>({
      mutation: EDIT_USER,
      variables: {
        id: user.id,
        roles: value.roles,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${user.username} roles updated.`);
      const index = application.users.indexOf(user);
      application.users[index] = res.data.editUser;
      this._application.next(application);
    });
  }
}
