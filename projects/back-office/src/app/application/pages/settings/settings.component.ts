import {Apollo} from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Application, SafeApplicationService, SafeConfirmModalComponent, SafeSnackBarService,
  NOTIFICATIONS, SafeAuthService, SafeLayoutService } from '@safe/builder';
import { MatDialog} from '@angular/material/dialog';
import { DeleteApplicationMutationResponse, DELETE_APPLICATION } from '../../../graphql/mutations';
import { DuplicateApplicationComponent } from '../../../components/duplicate-application/duplicate-application.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {


  public applications = new MatTableDataSource<Application>([]);
  public settingsForm?: FormGroup;
  private applicationSubscription?: Subscription;
  public application?: Application;
  public user: any;
  public locked: boolean  | undefined = undefined;
  public lockedByUser: boolean | undefined = undefined;
  public navItems: any[] = [];
  public title = '';

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private applicationService: SafeApplicationService,
    private authService: SafeAuthService,
    private layoutService: SafeLayoutService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      if (application){
        this.application = application;
        this.settingsForm = this.formBuilder.group(
          {
            id: [{ value: application.id, disabled: true }],
            name: [application.name, Validators.required],
            description: [application.description]
          }
        );
        this.locked = this.application?.locked;
        this.lockedByUser = this.application?.lockedByUser;
      }
    });
    this.navItems = [
      {
        name: 'Settings',
        path: './settings/edit',
        icon: 'settings'
      },
      {
        name: 'Users',
        path: './settings/users',
        icon: 'supervisor_account'
      },
      {
        name: 'Roles',
        path: './settings/roles',
        icon: 'admin_panel_settings'
      },
      {
        name: 'Attributes',
        path: './settings/position',
        icon: 'manage_accounts'
      },
      {
        name: 'Channels',
        path: './settings/channels',
        icon: 'edit_notifications'
      },
      {
        name: 'Subscriptions',
        path: './settings/subscriptions',
        icon: 'move_to_inbox'
      },
      {
        name: 'Pull jobs',
        path: './settings/pull-jobs',
        icon: 'cloud_download'
      }
    ];
    this.layoutService.setNavItems(this.navItems);
  }

  onSubmit(): void {
    this.applicationService.editApplication(this.settingsForm?.value);
    this.settingsForm?.markAsPristine();
  }

  onDuplicate(): void {
    if (this.locked && !this.lockedByUser) {
      this.snackBar.openSnackBar(NOTIFICATIONS.objectIsLocked(this.application?.name));
    } else {
      this.dialog.open(DuplicateApplicationComponent, {
        data: {
          id: this.application?.id,
          name: this.application?.name
        }
      });
    }
  }

  onDelete(): void {
    if (this.locked && !this.lockedByUser) {
      this.snackBar.openSnackBar(NOTIFICATIONS.objectIsLocked(this.application?.name));
    } else {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: 'Delete application',
          content: `Do you confirm the deletion of this application ?`,
          confirmText: 'Delete',
          confirmColor: 'warn'
        }
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          const id = this.application?.id;
          this.apollo.mutate<DeleteApplicationMutationResponse>({
            mutation: DELETE_APPLICATION,
            variables: {
              id
            }
          }).subscribe(res => {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Application'), { duration: 1000 });
            this.applications.data = this.applications.data.filter(x => {
              return x.id !== res.data?.deleteApplication.id;
            });
          });
          this.router.navigate(['/applications']);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
