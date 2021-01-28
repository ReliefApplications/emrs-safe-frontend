import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../../graphql/queries';
import { Dashboard, WhoSnackBarService } from '@who-ems/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id: string;
  public loading = true;
  public tiles = [];
  public dashboard: Dashboard;

  // === ROUTE ===
  private routeSubscription: Subscription;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.dashboard) {
          this.dashboard = res.data.dashboard;
          this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
          this.loading = res.loading;
        } else {
          this.snackBar.openSnackBar('No access provided to this dashboard.', { error: true });
          this.router.navigate(['/dashboards']);
        }
      },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/dashboards']);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
