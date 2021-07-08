import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User, Role } from '../models/user.model';
import { Page, ContentType } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { PullJob } from '../models/pullJob.model';
import { SafeSnackBarService } from './snackbar.service';
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
  EDIT_POSITION_ATTRIBUTE_CATEGORY,
  ToggleApplicationLockMutationResponse,
  TOGGLE_APPLICATION_LOCK
} from '../graphql/mutations';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../graphql/queries';
import { PositionAttributeCategory } from '../models/position-attribute-category.model';
import { NOTIFICATIONS } from '../const/notifications';
import { ApplicationEditedSubscriptionResponse, ApplicationUnlockedSubscriptionResponse,
  APPLICATION_EDITED_SUBSCRIPTION, APPLICATION_UNLOCKED_SUBSCRIPTION } from '../graphql/subscriptions';

@Injectable({
  providedIn: 'root'
})
export class SafeApplicationService {

  // tslint:disable-next-line: variable-name
  private _application = new BehaviorSubject<Application | null>(null);
  private applicationSubscription?: Subscription;
  private notificationSubscription?: Subscription;
  private lockSubscription?: Subscription;

  /*  Return the application as an Observable.
*/
  get application(): Observable<Application | null> {
    return this._application.asObservable();
  }

  get isUnlocked(): boolean {
    const application = this._application.getValue();
    if (application) {
      if (application?.locked && !application.lockedByUser) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectIsLocked(application.name));
        return false;
      }
    }
    return true;
  }

  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) { }

  /*  Get the application from the database, using GraphQL.
  */
  loadApplication(id: string, asRole?: string): void {
    this.applicationSubscription = this.apollo.query<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id,
        asRole
      }
    }).subscribe(res => {
      this._application.next(res.data.application);
      const application = this._application.getValue();
      if (res.data.application.locked) {
        if (!application?.lockedByUser) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectIsLocked(res.data.application.name));
        }
      }
    });
    this.notificationSubscription = this.apollo.subscribe<ApplicationEditedSubscriptionResponse>({
      query: APPLICATION_EDITED_SUBSCRIPTION,
      variables: {
        id
      }
    }).subscribe(() => {
      const snackBar = this.snackBar.openSnackBar(NOTIFICATIONS.appEdited, {
        action: 'Reload',
        expires: false
      });
      snackBar.onAction().subscribe(() => window.location.reload());
    });
    this.lockSubscription = this.apollo.subscribe<ApplicationUnlockedSubscriptionResponse>({
      query: APPLICATION_UNLOCKED_SUBSCRIPTION,
      variables: {
        id
      }
    }).subscribe((res) => {
      if (res.data?.applicationUnlocked) {
        const application = this._application.getValue();
        const newApplication = { ...application,
          locked: res.data?.applicationUnlocked.locked,
          lockedByUser: res.data?.applicationUnlocked.lockedByUser
        };
        this._application.next(newApplication);
      }
    });
  }

  /*
    Leave application and unsubscribe to application changes.
  */
  leaveApplication(): void {
    const application = this._application.getValue();
    this._application.next(null);
    this.applicationSubscription?.unsubscribe();
    this.notificationSubscription?.unsubscribe();
    this.lockSubscription?.unsubscribe();
    this.apollo.mutate<ToggleApplicationLockMutationResponse>({
      mutation: TOGGLE_APPLICATION_LOCK,
      variables: {
        id: application?.id,
        lock: false
      }
    }).subscribe();
  }

  /*
    Lock application edition.
  */
  lockApplication(): void {
    const application = this._application.getValue();
    this.apollo.mutate<ToggleApplicationLockMutationResponse>({
      mutation: TOGGLE_APPLICATION_LOCK,
      variables: {
        id: application?.id,
        lock: true
      }
    }).subscribe((res) => {
      if (res.data?.toggleApplicationLock) {
        const newApplication = { ...application,
          locked: res.data?.toggleApplicationLock.locked,
          lockedByUser: res.data?.toggleApplicationLock.lockedByUser
        };
        this._application.next(newApplication);
      }
    });
  }

  /*
    Edit Application
  */
  editApplication(value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION,
        variables: {
          id: application?.id,
          name: value.name,
          description: value.description
        }
      }).subscribe(res => {
        if (res.errors) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectNotUpdated('Application', res.errors[0].message));
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('application', value.name));
        }
      });
    }
  }

  /* Change the application's status and navigate to the applications list
  */
  publish(): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION,
        variables: {
          id: application.id,
          status: 'active'
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.appPublished(res.data.editApplication.name));
          this.router.navigate(['/applications']);
        }
      });
    }
  }

  /* Delete a page and the associated content.
  */
  deletePage(id: string): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<DeletePageMutationResponse>({
        mutation: DELETE_PAGE,
        variables: {
          id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Page'));
          const app = this._application.getValue();
          if (app) {
            const newApplication = { ...app, pages: app.pages?.filter(x => x.id !== res.data?.deletePage.id) };
            this._application.next(newApplication);
            this.router.navigate([`./applications/${app.id}`]);
          }
        }
      });
    }
  }

  /* Reorder the pages, using material Drag n Drop.
  */
  reorderPages(pages: string[]): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION,
        variables: {
          id: application?.id,
          pages
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectReordered('Pages'));
      });
    }
  }

  /* Update a specific page name in the opened application.
  */
  updatePageName(page: Page): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      const newApplication = {
        ...application, pages: application.pages?.map(x => {
          if (x.id === page.id) {
            x = { ...x, name: page.name };
          }
          return x;
        })
      };
      this._application.next(newApplication);
    }
  }

  /* Add a new page to the opened application.
  */
  addPage(value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<AddPageMutationResponse>({
        mutation: ADD_PAGE,
        variables: {
          name: value.name,
          type: value.type,
          content: value.content,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated(value.name, 'page'));
          const content = res.data.addPage.content;
          const newApplication = { ...application, pages: application.pages?.concat([res.data.addPage]) };
          this._application.next(newApplication);
          this.router.navigate([(value.type === ContentType.form) ?
            `/applications/${application.id}/${value.type}/${res.data.addPage.id}` :
            `/applications/${application.id}/${value.type}/${content}`]);
        }
      });
    }
  }

  /* Add a new role to the opened application.
  */
  addRole(value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<AddRoleMutationResponse>({
        mutation: ADD_ROLE,
        variables: {
          title: value.title,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated(value.title, 'role'));
          const newApplication = { ...application, roles: application.roles?.concat([res.data.addRole]) };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Edit an existing role.
  */
  editRole(role: Role, value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<EditRoleMutationResponse>({
        mutation: EDIT_ROLE,
        variables: {
          id: role.id,
          permissions: value.permissions,
          channels: value.channels,
          title: value.title
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('role', role.title));
          const newApplication: Application = {
            ...application,
            roles: application.roles?.map(x => {
              if (x.id === role.id) {
                x = {
                  ...x,
                  permissions: res.data?.editRole.permissions,
                  channels: res.data?.editRole.channels
                };
              }
              return x;
            }),
            channels: application.channels?.map(x => {
              if (value.channels.includes(x.id)) {
                x = { ...x, subscribedRoles: x.subscribedRoles?.concat([role]) };
              } else if (x.subscribedRoles?.some(subRole => subRole.id === role.id)) {
                x = { ...x, subscribedRoles: x.subscribedRoles.filter(subRole => subRole.id !== role.id) };
              }
              return x;
            })
          };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Delete an existing role.
  */
  deleteRole(role: Role): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<DeleteRoleMutationResponse>({
        mutation: DELETE_ROLE,
        variables: {
          id: role.id
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted(role.title));
        const newApplication = { ...application, roles: application.roles?.filter(x => x.id !== role.id) };
        this._application.next(newApplication);
      });
    }
  }

  /* Delete users to the opened application.
  */
  deleteUsersFromApplication(ids: any[], resolved: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<DeleteUsersFromApplicationMutationResponse>({
        mutation: DELETE_USERS_FROM_APPLICATION,
        variables: {
          ids,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          const deletedUsers = res.data.deleteUsersFromApplication.map(x => x.id);
          this.snackBar.openSnackBar(NOTIFICATIONS.usersActions('deleted', deletedUsers.length), { duration: 3000 });
          const newApplication = { ...application, users: application.users?.filter(u => !deletedUsers.includes(u.id)) };
          this._application.next(newApplication);
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.userInvalidActions('deleted'), { error: true });
        }
        resolved();
      });
    }
  }

  /* Invite an user to the opened application.
  */
  inviteUser(value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<AddRoleToUsersMutationResponse>({
        mutation: ADD_ROLE_TO_USERS,
        variables: {
          usernames: value.email,
          role: value.role,
          ...value.positionAttributes && { positionAttributes: value.positionAttributes.filter((x: any) => x.value) }
        }
      }).subscribe((res: any) => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.usersActions('invited', res.data.addRoleToUsers.length));
          const newApplication = { ...application, users: application.users?.concat(res.data.addRoleToUsers) };
          this._application.next(newApplication);
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.userInvalidActions('invited'), { error: true });
        }
      });
    }
  }

  /* Edit an user that has access to the application.
  */
  editUser(user: User, value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<EditUserMutationResponse>({
        mutation: EDIT_USER,
        variables: {
          id: user.id,
          roles: value.roles,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('roles', user.username));
          const index = application?.users?.indexOf(user);
          if (application?.users && index) {
            const copyObjectApplication = {...application};
            const copyArrayUsers = [...application.users];
            copyArrayUsers[index] = res.data.editUser;
            copyObjectApplication.users = copyArrayUsers;
            application = copyObjectApplication;
          }
          this._application.next(application);
        }
      });
    }
  }

  /* Add a new position to the opened application.
  */
  addPositionAttributeCategory(value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<AddPositionAttributeCategoryMutationResponse>({
        mutation: ADD_POSITION_ATTRIBUTE_CATEGORY,
        variables: {
          title: value.title,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated(value.title, 'position category'));
          const newApplication: Application = {
            ...application,
            positionAttributeCategories: application.positionAttributeCategories?.concat([res.data.addPositionAttributeCategory])
          };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Remove a position from the opened application
  */
  deletePositionAttributeCategory(positionCategory: PositionAttributeCategory): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<DeletePositionAttributeCategoryMutationResponse>({
        mutation: DELETE_POSITION_ATTRIBUTE_CATEGORY,
        variables: {
          id: positionCategory.id,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted(positionCategory.title));
          const newApplication: Application = {
            ...application,
            positionAttributeCategories: application.positionAttributeCategories?.filter(x =>
              x.id !== res.data?.deletePositionAttributeCategory.id)
          };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Edit a position's name from the opened application
  */
  editPositionAttributeCategory(value: any, positionCategory: PositionAttributeCategory): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<EditPositionAttributeCategoryMutationResponse>({
        mutation: EDIT_POSITION_ATTRIBUTE_CATEGORY,
        variables: {
          id: positionCategory.id,
          application: application.id,
          title: value.title
        }
      }).subscribe(res => {
        if (res.errors) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectAlreadyExists('position category', value.title), { error: true });
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('position category', value.title));
          const newApplication: Application = {
            ...application,
            positionAttributeCategories: application.positionAttributeCategories?.map(pos => {
              if (pos.title === positionCategory.title) {
                pos = { ...pos, title: res.data?.editPositionAttributeCategory.title };
              }
              return pos;
            })
          };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Add a new channel to the application.
  */
  addChannel(value: { title: string }): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<AddChannelMutationResponse>({
        mutation: ADD_CHANNEL,
        variables: {
          title: value.title,
          application: application.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated('channel', value.title));
          const newApplication: Application = { ...application, channels: application.channels?.concat([res.data.addChannel]) };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Remove a channel from the system with all notifications linked to it
  */
  deleteChannel(channel: Channel): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<DeleteChannelMutationResponse>({
        mutation: DELETE_CHANNEL,
        variables: {
          id: channel.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted(channel.title));
          const newApplication: Application = {
            ...application,
            channels: application.channels?.filter(x => x.id !== res.data?.deleteChannel.id)
          };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Add a new subscription to the application.
  */
  addSubscription(value: { routingKey: string, title: string, convertTo: string, channel: string }): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
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
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated('subscription', value.title));
          const newApplication: Application = {
            ...application,
            subscriptions: application.subscriptions?.concat([res.data.addSubscription])
          };
          this._application.next(newApplication);
        }
      });
    }
  }


  /* Delete subscription from application.
  */
  deleteSubscription(value: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
      this.apollo.mutate<DeleteSubscriptionMutationResponse>({
        mutation: DELETE_SUBSCRIPTION,
        variables: {
          applicationId: application.id,
          routingKey: value
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Subscription'));
        const newApplication = { ...application, subscriptions: application.subscriptions?.filter(sub => sub.routingKey !== value) };
        this._application.next(newApplication);
      });
    }
  }

  /* Edit existing subscription
  */
  editSubscription(value: any, previousSubscription: any): void {
    const application = this._application.getValue();
    if (application && this.isUnlocked) {
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
        if (res.data) {
          const subscription = res.data.editSubscription;
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('subscription', value.title));
          const newApplication = {
            ...application, subscriptions: application.subscriptions?.map(sub => {
              if (sub.routingKey === previousSubscription) {
                sub = subscription;
              }
              return sub;
            })
          };
          this._application.next(newApplication);
        }
      });
    }
  }

  /* Update application with latest pullJobs
  */
  updatePullJobs(pullJobs: PullJob[]): void {
    const application = this._application.getValue();
    if (application) {
      const newApplication = {...application, pullJobs};
      this._application.next(newApplication);
    }
  }


}
