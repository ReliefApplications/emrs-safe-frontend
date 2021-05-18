import { Apollo } from 'apollo-angular';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Application, PermissionsManagement, PermissionType,
  SafeAuthService, SafeConfirmModalComponent, SafeSnackBarService, SafeApplicationService, NOTIFICATIONS
} from '@safe/builder';
import { GetApplicationsQueryResponse, GET_APPLICATIONS } from '../../../graphql/queries';
import {
  DeleteApplicationMutationResponse, DELETE_APPLICATION, AddApplicationMutationResponse,
  ADD_APPLICATION, EditApplicationMutationResponse, EDIT_APPLICATION
} from '../../../graphql/mutations';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { PreviewService } from '../../../services/preview.service';
import { DuplicateApplicationComponent } from '../../../components/duplicate-application/duplicate-application.component';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { throttle as _throttle } from 'lodash-es';
import { FormControl } from '@angular/forms';
import { delay, take } from 'rxjs/operators';

const PER_PAGE = 5;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public loadMoreData = false;
  public noMoreData = false;
  public applications: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);
  public displayedColumns = ['name', 'createdAt', 'status', 'usersCount', 'actions'];
  private page = 0;

  // === SORTING ===
  sortActive = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // === FILTERS ===
  public filtersDate = { startDate: '', endDate: '' };
  public showFilters = false;
  public name = new FormControl('');
  public statusFilter = new FormControl('');

  @ViewChild('startDate', { read: MatStartDate }) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private applicationService: SafeApplicationService,
    private previewService: PreviewService
  ) {
  }

  ngOnInit(): void {
    this.name.valueChanges.pipe(delay(500)).subscribe(value => {
      if (this.name.value === value) {
        this.search();
      }
    });
    this.statusFilter.valueChanges.subscribe(value => {
      this.search();
    });
    this.search();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /*  Delete an application if authorized.
  */
  onDelete(element: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete application',
        content: `Do you confirm the deletion of the application ${element.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = element.id;
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
      }
    });
  }

  /*  Display the AddApplication component.
    Add a new application once closed, if result exists.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddApplicationComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddApplicationMutationResponse>({
          mutation: ADD_APPLICATION,
          variables: {
            name: value.name
          }
        }).subscribe(res => {
          if (res.errors) {
            if (res.errors[0].message.includes('duplicate key error')) {
              this.snackBar.openSnackBar(NOTIFICATIONS.objectAlreadyExists('app', value.name), { error: true });

            } else {
              this.snackBar.openSnackBar(NOTIFICATIONS.objectNotCreated('App', res.errors[0].message));
            }
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated(value.name, 'application'));
            const id = res.data?.addApplication.id;
            this.router.navigate(['/applications', id]);
          }
        });
      }
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any, element: Application): void {
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: element.id,
        permissions: e
      }
    }).subscribe((res) => {
      if (res.data) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('access', element.name));
        const index = this.applications.data.findIndex(x => x.id === element.id);
        this.applications.data[index] = res.data.editApplication;
        this.applications.data = this.applications.data;
      }
    });
  }

  /*  Open a dialog to choose roles to fit in the preview.
  */
  onPreview(element: Application): void {
    const dialogRef = this.dialog.open(ChoseRoleComponent, {
      data: {
        application: element.id
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.previewService.setRole(value.role);
        this.router.navigate(['./app-preview', element.id]);
      }
    });
  }

  /*  Open a dialog to give a name for the duplicated application
  */
  onDuplicate(application: Application): void {
    const dialogRef = this.dialog.open(DuplicateApplicationComponent, {
      data: {
        id: application.id,
        name: application.name
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applications.data.push(value);
        this.applications.data = this.applications.data;
      }
    });
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
  }

  clearAllFilters(): void {
    this.name.setValue('', { emitEvent: false });
    this.statusFilter.setValue('', { emitEvent: false });
    this.clearDateFilter();
    this.search();
  }

  public onCheckScroll(): void {
    this.loadMoreData = true;
    this.getApplications(this.page).subscribe((res: any) => {
      if (res.data.applications.length > 0) {
        this.applications.data = this.applications.data.concat(res.data.applications);
        this.loadMoreData = res.loading;
        this.setPaginationData(res.data.applications.length);
      } else {
        this.noMoreData = true;
        this.loadMoreData = false;
      }
    });
  }

  search(): void {
    this.loading = true;
    this.noMoreData = false;
    this.loadMoreData = false;
    this.page = 0;
    this.getApplications().subscribe((res: any) => {
      this.applications.data = res.data.applications;
      this.loading = res.loading;
      this.setPaginationData(res.data.applications.length);
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
  }

  private setPaginationData(applicationsLength: number): void {
    this.page++;
    if (applicationsLength !== PER_PAGE) {
      this.noMoreData = true;
    }
  }

  private getApplications(page = 0): any {
    return this.apollo.watchQuery<GetApplicationsQueryResponse>({
      query: GET_APPLICATIONS,
      variables: {
        page,
        perPage: PER_PAGE,
        filters: this.buildFilters(),
        sort: this.buildSort()
      }
    }).valueChanges.pipe(take(1));
  }

  private buildFilters(): object {
    return {
      name: this.name.value,
      dateRange: {
        start: this.filtersDate.startDate,
        end: this.filtersDate.endDate
      },
      status: this.statusFilter.value
    };
  }

  sortData(event: Sort): void {
    this.sortDirection = event.direction === 'asc' && event.direction !== this.sortDirection ? 'asc' : 'desc';
    this.sortActive = event.active;
    this.search();
  }

  buildSort(): object {
    const field = this.sortActive;
    const direction = this.sortDirection === 'desc' ? -1 : 1;
    if (field.trim().length === 0) {
      return { createdAt: 1 };
    }
    return JSON.parse(`{"${field}": "${direction}"}`);
  }
}
