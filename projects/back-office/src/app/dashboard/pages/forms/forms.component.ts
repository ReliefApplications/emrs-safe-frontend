import { Apollo } from 'apollo-angular';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { GET_SHORT_FORMS, GetFormsQueryResponse } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import {
  SafeSnackBarService,
  SafeAuthService,
  PermissionsManagement,
  PermissionType,
  SafeConfirmModalComponent,
  NOTIFICATIONS,
  Form
} from '@safe/builder';
import { DeleteFormMutationResponse, DELETE_FORM, AddFormMutationResponse, ADD_FORM, EditFormMutationResponse, EDIT_FORM_LOCK } from '../../../graphql/mutations';
import { AddFormComponent } from '../../../components/add-form/add-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { FormUnlockedSubscriptionResponse, FORM_UNLOCKED_SUBSCRIPTION } from 'projects/safe/src/lib/graphql/subscriptions';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy, AfterViewInit {

  // === DATA ===
  public loading = true;
  displayedColumns = ['name', 'createdAt', 'status', 'versionsCount', 'recordsCount', 'core', 'parentForm', 'actions'];
  dataSource = new MatTableDataSource<Form>([]);
  public isLocked: boolean | undefined = undefined;
  public isLockedByActualUser: boolean | undefined = undefined;
  public user: any;


  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public filtersDate = { startDate: '', endDate: '' };
  public showFilters = false;
  public searchText = '';
  public statusFilter = '';
  public coreFilter = '';


  @ViewChild('startDate', { read: MatStartDate }) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;


  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService
  ) {}

  /*  Load the forms.
    Check user permission to add new forms.
  */
  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = { ...user};
      }
    });
    this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_SHORT_FORMS,
    }).valueChanges.subscribe((res: any) => {
      this.dataSource.data = res.data.forms;
      console.log("data source = ", this.dataSource.data);
      this.loading = res.loading;
      this.filterPredicate();
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
  }

  onUnlock(id: string, form: any): void {
    this.apollo.mutate<EditFormMutationResponse>({
      mutation: EDIT_FORM_LOCK,
      variables: {
        id,
        isLocked: false
      }
    }).subscribe(res => {
      if (res.data) {
        this.apollo.subscribe<FormUnlockedSubscriptionResponse>({
          query: FORM_UNLOCKED_SUBSCRIPTION,
          variables: {
            form: id,
            lockedByID: form.isLockedBy.id
          }
        }).subscribe(() => {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectUnlocked(element.name));
        });
        this.apollo.watchQuery<GetFormsQueryResponse>({
          query: GET_SHORT_FORMS,
        }).valueChanges.subscribe((res: any) => {
          this.dataSource.data = res.data.forms;
          this.isLocked = false;
          this.loading = res.loading;
          this.filterPredicate();
        });
        this.authSubscription = this.authService.user.subscribe(() => {
          this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
        });
      }
    });
  }

  private filterPredicate(): void {
    this.dataSource.filterPredicate = (data: any) => {
      const endDate = new Date(this.filtersDate.endDate).getTime();
      const startDate = new Date(this.filtersDate.startDate).getTime();
      return (((this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.coreFilter.trim().length === 0 ||
          (this.coreFilter.trim().length > 0 && data.core.toString().toLowerCase().includes(this.coreFilter.trim()))) &&
        (this.statusFilter.trim().length === 0 ||
          (this.statusFilter.trim().length > 0 && data.status.toLowerCase().includes(this.statusFilter.trim())))) &&
        (!startDate || !endDate || data.createdAt >= startDate && data.createdAt <= endDate));
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort || null;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /*  Remove a form if authorized.
  */
  onDelete(element: any, e: any): void {
    const warning = 'Deleting a core form will recursively delete linked forms and resources.';
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete form',
        content: `Do you confirm the deletion of the form ${element.name} ? ${element.core ? warning : null}`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = element.id;
        this.apollo.mutate<DeleteFormMutationResponse>({
          mutation: DELETE_FORM,
          variables: {
            id
          }
        }).subscribe((res: any) => {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Form'), { duration: 1000 });
          this.dataSource.data = this.dataSource.data.filter(x => {
            return x.id !== element.id && element.id !== x.resource?.coreForm?.id;
          });
        });
      }
    });
  }

  /*  Display the AddForm modal.
    Create a new form on closed if result.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      panelClass: 'add-dialog'
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const data = { name: value.name };
        Object.assign(data,
          value.binding === 'newResource' && { newResource: true },
          (value.binding === 'fromResource' && value.resource) && { resource: value.resource },
          (value.binding === 'fromResource' && value.template) && { template: value.template }
        );
        this.apollo.mutate<AddFormMutationResponse>({
          mutation: ADD_FORM,
          variables: data
        }).subscribe(res => {
          if (res.errors) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotCreated('form', res.errors[0].message), { error: true });
          } else {
            if (res.data) {
              const { id } = res.data.addForm;
              this.router.navigate(['/forms/builder', id]);
            }
          }
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        });
      }
    });
  }

  applyFilter(column: string, event: any): void {
    if (column === 'status') {
      this.statusFilter = !!event.value ? event.value.trim().toLowerCase() : '';
    } else if (column === 'core') {
      this.coreFilter = !!event.value ? event.value.trim().toLowerCase() : '';
    } else {
      this.searchText = !!event ? event.target.value.trim().toLowerCase() : this.searchText;
    }
    this.dataSource.filter = '##';
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
    this.applyFilter('createdAt', '');
  }

  clearAllFilters(): void {
    this.searchText = '';
    this.statusFilter = '';
    this.coreFilter = '';
    this.clearDateFilter();
  }
}
