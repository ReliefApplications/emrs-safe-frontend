import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { User, Role } from '../models/user.model';
import { Page, ContentType } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { WhoSnackBarService } from './snackbar.service';
import {
  AddPageMutationResponse,
  ADD_PAGE,
  AddRoleMutationResponse,
  ADD_ROLE,
  AddRoleToUsersMutationResponse,
  ADD_ROLE_TO_USERS,
  DeletePageMutationResponse,
  DELETE_PAGE,
  DeleteRoleMutationResponse,
  DELETE_ROLE,
  EditApplicationMutationResponse,
  EDIT_APPLICATION,
  EditUserMutationResponse,
  EDIT_USER,
  EditRoleMutationResponse,
  EDIT_ROLE,
  AddChannelMutationResponse,
  ADD_CHANNEL,
  DeleteChannelMutationResponse,
  DELETE_CHANNEL,
  AddSubscriptionMutationResponse,
  ADD_SUBSCRIPTION,
  EditSubscriptionMutationResponse,
  EDIT_SUBSCRIPTION,
  DeleteSubscriptionMutationResponse,
  DELETE_SUBSCRIPTION,
  AddPositionAttributeCategoryMutationResponse,
  ADD_POSITION_ATTRIBUTE_CATEGORY,
  DeleteUsersFromApplicationMutationResponse,
  DELETE_USERS_FROM_APPLICATION,
  DeletePositionAttributeCategoryMutationResponse,
  DELETE_POSITION_ATTRIBUTE_CATEGORY,
  EditPositionAttributeCategoryMutationResponse,
  EDIT_POSITION_ATTRIBUTE_CATEGORY
} from '../graphql/mutations';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../graphql/queries';
import { PositionAttributeCategory } from '../models/position-attribute-category.model';

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
  editApplication(value: any): void {
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
        if (res.errors) {
          this.snackBar.openSnackBar('The App was not changed. ' + res.errors[0].message);
        } else {
          this.snackBar.openSnackBar('Application updated');
        }
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
      if (x.id === page.id) { x.name = page.name; }
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

  /* Delete users to the opened application.
  */
  deleteUsersFromApplication(ids: any[], resolved): void {
    const application = this._application.getValue();
    this.apollo.mutate<DeleteUsersFromApplicationMutationResponse>({
      mutation: DELETE_USERS_FROM_APPLICATION,
      variables: {
        ids,
        application: application.id
      }
    }).subscribe(res => {
      if (!res.errors) {
        const deletedUsers = res.data.deleteUsersFromApplication.map(x => x.id);
        this.snackBar.openSnackBar(deletedUsers.length > 1 ? `${deletedUsers.length} users were deleted` : 'User was deleted',
        { duration: 3000 });
        application.users = application.users.filter(u => !deletedUsers.includes(u.id));
        this._application.next(application);
      } else {
        this.snackBar.openSnackBar('Users could not be deleted.', { error: true });
      }
      resolved();
    });
  }

  /* Invite an user to the opened application.
  */
  inviteUser(value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddRoleToUsersMutationResponse>({
      mutation: ADD_ROLE_TO_USERS,
      variables: {
        usernames: value.email,
        role: value.role,
        ...value.positionAttributes && { positionAttributes: value.positionAttributes.filter(x => x.value) }
      }
    }).subscribe((res: any) => {
      if (!res.errors) {
        this.snackBar.openSnackBar(res.data.addRoleToUsers.length > 1 ? `${res.data.addRoleToUsers.length} users were invited.` : 'user was invited.');
        application.users = application.users.concat(res.data.addRoleToUsers);
        this._application.next(application);
      } else {
        this.snackBar.openSnackBar('User could not be invited.', { error: true });
      }
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
        application: application.id,
        ...value.positionAttributes && { positionAttributes: value.positionAttributes }
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${user.username} updated.`);
      const index = application.users.indexOf(user);
      application.users[index] = res.data.editUser;
      this._application.next(application);
    });
  }

  /* Add a new position to the opened application.
  */
  addPositionAttributeCategory(value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddPositionAttributeCategoryMutationResponse>({
      mutation: ADD_POSITION_ATTRIBUTE_CATEGORY,
      variables: {
        title: value.title,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${value.title} position category created`);
      application.positionAttributeCategories = application.positionAttributeCategories.concat([res.data.addPositionAttributeCategory]);
      this._application.next(application);
    });
  }

  /* Remove a position from the opened application
  */
  deletePositionAttributeCategory(positionCategory: PositionAttributeCategory): void {
    const application = this._application.getValue();
    this.apollo.mutate<DeletePositionAttributeCategoryMutationResponse>({
      mutation: DELETE_POSITION_ATTRIBUTE_CATEGORY,
      variables: {
        id: positionCategory.id,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${positionCategory.title} position category deleted.`);
      application.positionAttributeCategories = application.positionAttributeCategories.filter(x =>
        x.id !== res.data.deletePositionAttributeCategory.id);
      this._application.next(application);
    });
  }

  /* Edit a position's name from the opened application
  */
  editPositionAttributeCategory(value: any, positionCategory: PositionAttributeCategory): void {
    const application = this._application.getValue();
    this.apollo.mutate<EditPositionAttributeCategoryMutationResponse>({
      mutation: EDIT_POSITION_ATTRIBUTE_CATEGORY,
      variables: {
        id: positionCategory.id,
        application: application.id,
        title: value.title
      }
    }).subscribe(res => {
      if (res.errors) {
        this.snackBar.openSnackBar('Position category with this title already exists.', { error: true });
      } else {
        this.snackBar.openSnackBar('Edited position category.');
        application.positionAttributeCategories = application.positionAttributeCategories.map(pos => {
          if (pos.title === positionCategory.title) {
            pos.title = res.data.editPositionAttributeCategory.title;
          }
          return pos;
        });
        this._application.next(application);
      }
    });
  }

  /* Add a new channel to the application.
  */
  addChannel(value: { title: string }): void {
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

  /* Add a new subscription to the application.
  */
  addSubscription(value: { routingKey: string, title: string, convertTo: string, channel: string }): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddSubscriptionMutationResponse>({
      mutation: ADD_SUBSCRIPTION,
      variables: {
        application: application.id,
        routingKey: value.routingKey,
        title: value.title,
        convertTo: value.convertTo,
        channel: value.channel
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('New subscription created.');
      application.subscriptions = application.subscriptions.concat([res.data.addSubscription]);
      this._application.next(application);
    });
  }


  /* Delete subscription from application.
  */
  deleteSubscription(value): void {
    const application = this._application.getValue();
    this.apollo.mutate<DeleteSubscriptionMutationResponse>({
      mutation: DELETE_SUBSCRIPTION,
      variables: {
        applicationId: application.id,
        routingKey: value
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Subscription removed.');
      application.subscriptions = application.subscriptions.filter(sub => sub.routingKey !== value);
      this._application.next(application);
    });
  }

  /* Edit existing subscription
  */
  editSubscription(value, previousSubscription): void {
    const application = this._application.getValue();
    this.apollo.mutate<EditSubscriptionMutationResponse>({
      mutation: EDIT_SUBSCRIPTION,
      variables: {
        applicationId: application.id,
        title: value.title,
        routingKey: value.routingKey,
        convertTo: value.convertTo,
        channel: value.channel,
        previousSubscription,
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Edited subscription.');
      application.subscriptions = application.subscriptions.map(sub => {
        if (sub.routingKey === previousSubscription) {
          sub = res.data.editSubscription;
        }
        return sub;
      });
      this._application.next(application);
    });
  }
}
