import { Component, ComponentRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy,
  OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SafeAuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { PermissionsManagement, PermissionType } from '../../models/user.model';
import { Application } from '../../models/application.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SafeNotificationService } from '../../services/notification.service';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AccountInfo } from '@azure/msal-common';

@Component({
  selector: 'safe-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class SafeLayoutComponent implements OnInit, OnChanges, OnDestroy {

  // === HEADER TITLE ===
  @Input() title = '';

  @Input() navGroups: any[] = [];

  @Input() applications: Application[] = [];

  @Input() route?: ActivatedRoute;

  @Input() toolbar?: TemplateRef<any>;

  @ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav?: ViewContainerRef;

  @Output() openApplication: EventEmitter<Application> = new EventEmitter();


  filteredNavGroups: any[] = [];

  // === NOTIFICATIONS ===
  notifications: Notification[] = [];
  notificationsSubscription?: Subscription;

  // === AZURE ACCOUNT ===
  account: AccountInfo | null;

  // === DISPLAY ===
  public largeDevice: boolean;

  public showSidenav = false;

  constructor(
    private router: Router,
    private authService: SafeAuthService,
    private notificationService: SafeNotificationService,
    private layoutService: LayoutService,
    public dialog: MatDialog,
  ) {
    this.largeDevice = (window.innerWidth > 1024);
    this.account = this.authService.account;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item: any) => {
          const permission = PermissionsManagement.getRightFromPath(item.path, PermissionType.access);
          return this.authService.userHasClaim(permission);
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            navItems
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
    this.notificationService.initNotifications();
    this.notificationsSubscription = this.notificationService.notifications.subscribe((notifications: Notification[]) => {
      if (notifications) {
        this.notifications = notifications;
      } else {
        this.notifications = [];
      }
    });

    this.layoutService.rightSidenav.subscribe(view => {
      if (view && this.rightSidenav) {
        // this is necessary to prevent have more than one history component at the same time.
        this.layoutService.setRightSidenav(null);
        this.showSidenav = true;
        const componentRef: ComponentRef<any> = this.rightSidenav.createComponent(view.factory);
        for (const [key, value] of Object.entries(view.inputs)) {
          componentRef.instance[key] = value;
        }
        componentRef.instance.cancel.subscribe(() => {
          componentRef.destroy();
          this.layoutService.setRightSidenav(null);
        });
      } else {
        this.showSidenav = false;
        if (this.rightSidenav) {
          this.rightSidenav.clear();
        }
      }
    });
  }

  ngOnChanges(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item: any) => {
          const permission = PermissionsManagement.getRightFromPath(item.path, PermissionType.access);
          return this.authService.userHasClaim(permission);
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            callback: group.callback,
            navItems
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

  /*  Go back to previous view
  */
  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  /*  Change the display depending on windows size.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.largeDevice = (event.target.innerWidth > 1024);
  }

  /* Emit the application to open
  */
  onOpenApplication(application: Application): void {
    this.openApplication.emit(application);
  }

  onClick(callback: () => any, event: any): void {
    callback();
    event.preventDefault();
    event.stopPropagation();
  }

  drop(event: any, group: any): void {
    moveItemInArray(group.navItems, event.previousIndex, event.currentIndex);
    group.callback(group.navItems);
  }

  /*  Call logout method of authService.
    */
  logout(): void {
    if (!this.authService.canLogout.value) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: `Exit without saving changes`,
          content: `There are unsaved changes on your form. Are you sure you want to logout?`,
          confirmText: 'Confirm',
          confirmColor: 'primary'
        }
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.authService.canLogout.next(true);
          localStorage.clear();
          this.authService.logout();
        }
      });
    } else {
      this.authService.logout();
    }
  }

  onMarkAllNotificationsAsRead(): void {
    this.notificationService.markAllAsSeen();
  }

  onNotificationClick(notification: Notification): void {
    this.notificationService.markAsSeen(notification);
  }
}
