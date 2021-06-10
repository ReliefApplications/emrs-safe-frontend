import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatStartDate, MatEndDate } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { Subscription, Client } from '@safe/builder';
import { GetClientsQueryResponse, GET_CLIENTS } from '../../../graphql/queries';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewInit {

  // === DATA ===
  public loading = true;
  public clients = new MatTableDataSource<Client>([]);
  public displayedColumns = ['name', 'createdAt', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public filtersDate = { startDate: '', endDate: '' };
  public searchText = '';
  public showFilters = false;

  @ViewChild('startDate', { read: MatStartDate }) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetClientsQueryResponse>({
      query: GET_CLIENTS
    }).valueChanges.subscribe(res => {
      this.clients.data = res.data.clients;
      this.loading = res.loading;
      this.filterPredicate();
    });
    // this.authSubscription = this.authService.user.subscribe(() => {
    //   this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    // });
  }

  private filterPredicate(): void {
    this.clients.filterPredicate = (data: any) => {
      const endDate = new Date(this.filtersDate.endDate).getTime();
      const startDate = new Date(this.filtersDate.startDate).getTime();
      return (((this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (!startDate || !endDate || data.createdAt >= startDate && data.createdAt <= endDate)));
    };
  }

  ngAfterViewInit(): void {
    this.clients.sort = this.sort || null;
  }

  // ngOnDestroy(): void {
  //   if (this.authSubscription) {
  //     this.authSubscription.unsubscribe();
  //   }
  // }

  /*  Delete an application if authorized.
  */
  onDelete(element: any, e: any): void {
    e.stopPropagation();
  }

  applyFilter(column: string, event: any): void {
    this.searchText = !!event ? event.target.value.trim().toLowerCase() : this.searchText;
    this.clients.filter = '##';
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    this.startDate.value = '';
    this.endDate.value = '';
    this.applyFilter('createdAt', '');
  }

  clearAllFilters(): void {
    this.searchText = '';
    this.clearDateFilter();
  }
}
