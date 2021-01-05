import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { Role } from '../../models/user.model';
import { WhoConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { WhoApplicationService } from '../../services/application.service';
import { WhoAddRoleComponent } from './components/add-role/add-role.component';
import { WhoEditRoleComponent } from './components/edit-role/edit-role.component';
import {
  AddRoleMutationResponse, ADD_ROLE,
   DeleteRoleMutationResponse, DELETE_ROLE,
    EditRoleMutationResponse, EDIT_ROLE } from '../../graphql/mutations';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';

@Component({
  selector: 'who-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class WhoRolesComponent implements OnInit, OnDestroy {

  // === INPUT DATA ===
  @Input() inApplication: boolean;

  // === DATA ===
  public loading = true;
  public roles = [];
  public displayedColumns = ['title', 'usersCount', 'actions'];
  private applicationSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: WhoApplicationService,
    private apollo: Apollo,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    if (this.inApplication) {
      this.loading = false;
      this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
        if (application) {
          this.roles = application.roles;
        } else {
          this.roles = [];
        }
      });
    } else {
      this.getRoles();
    }
  }

  /*  Load the roles.
  */
  private getRoles(): void {
    this.apollo.watchQuery<GetRolesQueryResponse>({
      query: GET_ROLES
    }).valueChanges.subscribe(res => {
      this.roles = res.data.roles;
      this.loading = res.loading;
    });
  }

  ngOnDestroy(): void {
    if (this.inApplication) { this.applicationSubscription.unsubscribe(); }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(WhoAddRoleComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.inApplication) {
          this.applicationService.addRole(value);
        } else {
          this.apollo.mutate<AddRoleMutationResponse>({
            mutation: ADD_ROLE,
            variables: {
              title: value.title
            }
          }).subscribe(res => {
            this.snackBar.openSnackBar(`${value.title} role created`);
            this.getRoles();
          }, (err) => {
            console.log(err);
          });
        }
      }
    });
  }

  /*  Display the EditRole modal, passing a role as a parameter.
    Edit the role when closed, if there is a result.
  */
  onEdit(role: Role): void {
    const dialogRef = this.dialog.open(WhoEditRoleComponent, {
      data: {
        role,
        application: this.inApplication
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.inApplication) {
          this.applicationService.editRole(role, value);
        } else {
          this.apollo.mutate<EditRoleMutationResponse>({
            mutation: EDIT_ROLE,
            variables: {
              id: role.id,
              permissions: value.permissions,
              channels: value.channels
            }
          }).subscribe(res => {
            this.snackBar.openSnackBar(`${role.title} role updated.`);
            this.getRoles();
          });
        }
      }
    });
  }

  /* Display a modal to confirm the deletion of the role.
    If confirmed, the role is removed from the system.
  */
  onDelete(item: any): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete role',
        content: `Do you confirm the deletion of the role ${item.title} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.inApplication) {
          this.applicationService.deleteRole(item);
        } else {
          this.apollo.mutate<DeleteRoleMutationResponse>({
            mutation: DELETE_ROLE,
            variables: {
              id: item.id
            }
          }).subscribe(res => {
            this.snackBar.openSnackBar(`${item.title} role deleted.`);
            this.getRoles();
          });
        }
      }
    });
  }
}
