import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Role } from '../models/user.model';
import { Page, ContentType } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { WhoSnackBarService } from './snackbar.service';
import {
  AddPageMutationResponse, ADD_PAGE,
  AddRoleMutationResponse, ADD_ROLE,
  AddRoleToUserMutationResponse, ADD_ROLE_TO_USER,
  DeletePageMutationResponse, DELETE_PAGE,
  DeleteRoleMutationResponse, DELETE_ROLE,
  EditApplicationMutationResponse, EDIT_APPLICATION,
  EditUserMutationResponse, EDIT_USER,
  EditRoleMutationResponse, EDIT_ROLE,
  AddChannelMutationResponse, ADD_CHANNEL,
  DeleteChannelMutationResponse, DELETE_CHANNEL } from '../graphql/mutations';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class WhoApplicationService {

  // tslint:disable-next-line: variable-name
  private _application = new BehaviorSubject<Application>(null);

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
    private router: Router
  ) { }

  /*  Get the application from the database, using GraphQL.
  */
  loadApplication(id: string, asRole: string = null): void {
    this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id,
        asRole
      }
    }).valueChanges.subscribe(res => {
      this._application.next(res.data.application);
    });
  }

  /*
    Edit Application
  */
  editApplication(value: any): void{
    const application = this._application.getValue();
    this.apollo.mutate<EditApplicationMutationResponse>(
      {
        mutation: EDIT_APPLICATION,
        variables: {
          id: application.id,
          name: value.name,
          description: value.description
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar('Application updated');
      });
  }

  /*  Return the application as an Observable.
  */
  get application(): Observable<Application> {
    return this._application.asObservable();
  }

  /* Change the application's status and navigate to the applications list
  */
  publish(): void {
    const application = this._application.getValue();
    if (application) {
      this.apollo.mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION,
        variables: {
          id: application.id,
          status: 'active'
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(`Application ${res.data.editApplication.name} published`);
        this.router.navigate(['/applications']);
      });
    } else {
      this.snackBar.openSnackBar('No opened application.', { error: true });
    }
  }

  /* Delete a page and the associated content.
  */
  deletePage(id: string): void {
    this.apollo.mutate<DeletePageMutationResponse>({
      mutation: DELETE_PAGE,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Page deleted');
      const application = this._application.getValue();
      application.pages = application.pages.filter(x => x.id !== res.data.deletePage.id);
      this._application.next(application);
      this.router.navigate([`./applications/${application.id}`]);
    });
  }

  /* Reorder the pages, using material Drag n Drop.
  */
  reorderPages(pages: string[]): void {
    const application = this._application.getValue();
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: application.id,
        pages
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Pages reordered');
    });
  }

  /* Update a specific page name in the opened application.
  */
  updatePageName(page: Page): void {
    const application = this._application.getValue();
    application.pages = application.pages.map(x => {
      if (x.id === page.id) { x.name = page.name; }
      return x;
    });
    this._application.next(application);
  }

  /* Add a new page to the opened application.
  */
  addPage(value: any): void {
    const application = this._application.getValue();
    if (application) {
      this.apollo.mutate<AddPageMutationResponse>({
        mutation: ADD_PAGE,
        variables: {
          name: value.name,
          type: value.type,
          content: value.content,
          application: application.id
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(`${value.name} page created`);
        const content = res.data.addPage.content;
        application.pages = application.pages.concat([res.data.addPage]);
        this._application.next(application);
        this.router.navigate([(value.type === ContentType.form) ? `/applications/${application.id}/${value.type}/${res.data.addPage.id}` :
        `/applications/${application.id}/${value.type}/${content}`]);
      });
    } else {
      this.snackBar.openSnackBar('No opened application.', { error: true });
    }
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
    const application = this._application.getValue();
    this.apollo.mutate<EditRoleMutationResponse>({
      mutation: EDIT_ROLE,
      variables: {
        id: role.id,
        permissions: value.permissions,
        channels: value.channels
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${role.title} role updated.`);
      application.roles = application.roles.map(x => {
        if (x.id === role.id) {
          x.permissions = res.data.editRole.permissions;
          x.channels = res.data.editRole.channels;
        }
        return x;
      });
      application.channels = application.channels.map(x => {
        if (value.channels.includes(x.id)) {
          x.subscribedRoles = x.subscribedRoles.concat([role]);
        } else if (x.subscribedRoles.some(subRole => subRole.id === role.id)) {
          x.subscribedRoles = x.subscribedRoles.filter(subRole => subRole.id !== role.id);
        }
        return x;
      });
      this._application.next(application);
    });
  }

  /* Delete an existing role.
  */
  deleteRole(role: Role): void {
    const application = this._application.getValue();
    this.apollo.mutate<DeleteRoleMutationResponse>({
      mutation: DELETE_ROLE,
      variables: {
        id: role.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${role.title} role deleted.`);
      application.roles = application.roles.filter(x => x.id !== role.id);
      this._application.next(application);
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
        roles: [value.role],
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${user.username} roles updated.`);
      const index = application.users.indexOf(user);
      application.users[index] = res.data.editUser;
      this._application.next(application);
    });
  }

  /* Add a new channel to the application.
  */
  addChannel(value: {title: string}): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddChannelMutationResponse>({
      mutation: ADD_CHANNEL,
      variables: {
        title: value.title,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${value.title} channel created.`);
      application.channels = application.channels.concat([res.data.addChannel]);
      this._application.next(application);
    });
  }

  /* Remove a channel from the system with all notifications linked to it
  */
  deleteChannel(channel: Channel): void {
    const application = this._application.getValue();
    this.apollo.mutate<DeleteChannelMutationResponse>({
      mutation: DELETE_CHANNEL,
      variables: {
        id: channel.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${channel.title} channel deleted.`);
      application.channels = application.channels.filter(x => x.id !== res.data.deleteChannel.id);
      this._application.next(application);
    });
  }
}
