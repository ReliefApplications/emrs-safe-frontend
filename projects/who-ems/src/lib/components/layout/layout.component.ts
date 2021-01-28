import { Component, ComponentRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy,
  OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { WhoAuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { Account } from 'msal';
import { PermissionsManagement, PermissionType } from '../../models/user.model';
import { Application } from '../../models/application.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WhoNotificationService } from '../../services/notification.service';


@Component({
  selector: 'who-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class WhoLayoutComponent implements OnInit, OnChanges, OnDestroy {

  // === HEADER TITLE ===
  @Input() title: string;

  @Input() navGroups: any[];

  @Input() applications: Application[];

  @Input() route: ActivatedRoute;

  @Input() toolbar: TemplateRef<any>;

  @ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav: ViewContainerRef;

  @Output() openApplication: EventEmitter<Application> = new EventEmitter();


  filteredNavGroups = [];
  public searchText = '';

  // === NOTIFICATIONS ===
  notifications: Notification[] = [];
  notificationsSubscription: Subscription;

  // === AZURE ACCOUNT ===
  account: Account;

  // === DISPLAY ===
  public largeDevice: boolean;

  public showSidenav = false;

  constructor(
    private router: Router,
    private authService: WhoAuthService,
    public dialog: MatDialog,
    private notificationService: WhoNotificationService,
    private layoutService: LayoutService
  ) {
    this.largeDevice = (window.innerWidth > 1024);
    this.account = this.authService.account;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item) => {
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
      if (view) {
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
        const navItems = group.navItems.filter((item) => {
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
    this.notificationsSubscription.unsubscribe();
  }

  /*  Go back to previous view
  */
  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  /*  Change the display depending on windows size.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.largeDevice = (event.target.innerWidth > 1024);
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
    this.authService.logout();
  }

  onNotificationClick(notification: Notification): void {
    this.notificationService.markAsSeen(notification);
  }

  openApplicationEvent(application: Application): void {
    this.openApplication.emit(application);
  }
}

