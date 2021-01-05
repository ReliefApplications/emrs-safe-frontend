import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { User, Role } from '../../models/user.model';
import { EditUserMutationResponse, EDIT_USER } from '../../graphql/mutations';
import { WhoEditUserComponent } from './components/edit-user/edit-user.component';
import { WhoInviteUserComponent } from './components/invite-user/invite-user.component';

@Component({
  selector: 'who-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class WhoUsersComponent implements OnInit {

  // === INPUT DATA ===
  @Input() users: MatTableDataSource<User>;
  @Input() roles: Role[];
  @Input() applicationService: any;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {}

  onInvite(): void {
    const dialogRef = this.dialog.open(WhoInviteUserComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: this.roles
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.inviteUser(value);
      }
    });
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(WhoEditUserComponent, {
      panelClass: 'add-dialog',
      data: {
        userRoles: user.roles,
        availableRoles: this.roles,
        multiple: Boolean(!this.applicationService)
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.applicationService) {
          this.applicationService.editUser(user, value);
        } else {
          this.apollo.mutate<EditUserMutationResponse>({
            mutation: EDIT_USER,
            variables: {
              id: user.id,
              roles: value.roles
            }
          }).subscribe(res => {
            this.snackBar.openSnackBar(`${user.username} roles updated.`);
            this.users.data = this.users.data.map(x => {
              if (x.id === user.id) {
                x.roles = res.data.editUser.roles.filter(role => !role.application);
              }
              return x;
            });
          });
        }
      }
    });
  }
}
