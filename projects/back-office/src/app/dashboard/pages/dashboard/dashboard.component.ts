import {Apollo} from 'apollo-angular';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Dashboard, SafeSnackBarService, SafeApplicationService, SafeWorkflowService, NOTIFICATIONS } from '@safe/builder';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import {
  EditDashboardMutationResponse, EDIT_DASHBOARD,
  EditPageMutationResponse, EDIT_PAGE,
  EditStepMutationResponse, EDIT_STEP } from '../../../graphql/mutations';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../../graphql/queries';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id = '';
  public applicationId?: string;
  public loading = true;
  public tiles: any[] = [];
  public dashboard?: Dashboard;

  // === GRID ===
  private generatedTiles = 0;

  // === DASHBOARD NAME EDITION ===
  public formActive = false;
  public dashboardNameForm: FormGroup = new FormGroup({});

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private applicationService: SafeApplicationService,
    private workflowService: SafeWorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.dashboard) {
          this.dashboard = res.data.dashboard;
          this.dashboardNameForm = new FormGroup({
            dashboardName: new FormControl(this.dashboard.name, Validators.required)
          });
          this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
          this.generatedTiles = this.tiles.length === 0 ? 0 : Math.max(...this.tiles.map(x => x.id)) + 1;
          this.applicationId = this.dashboard.page ? this.dashboard.page.application?.id : this.dashboard.step ?
            this.dashboard.step.workflow?.page?.application?.id : '';
          this.loading = res.loading;
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('dashboard'), { error: true });
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
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  /*  Add a new widget to the dashboard.
  */
  onAdd(e: any): void {
    const tile = JSON.parse(JSON.stringify(e));
    // tile.id = this.generatedTiles;
    this.generatedTiles += 1;
    this.tiles = [...this.tiles, tile];
    this.autoSaveChanges();
  }

  /* Upgrade all tiles with the new ones
  */
  onUpdate(e: any): void {
    this.tiles = e;
    this.autoSaveChanges();
  }

  /*  Edit the settings or display of a widget.
  */
  onEditTile(e: any): void {
    const options = e.options;
    if (options) {
      switch (e.type) {
        case 'display': {
          this.tiles = this.tiles.map(x => {
            if (x.id === e.id) {
              x = { ...x, defaultCols: options.cols, defaultRows: options.rows };
            }
            return x;
          });
          this.autoSaveChanges();
          break;
        }
        case 'data': {
          this.tiles = this.tiles.map(x => {
            if (x.id === e.id) {
              x = { ...x, settings: options };
            }
            return x;
          });
          this.autoSaveChanges();
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /*  Remove a widget from the dashboard.
  */
  onDeleteTile(e: any): void {
    this.tiles = this.tiles.filter(x => x.id !== e.id);
    this.autoSaveChanges();
  }

  /*  Drag and drop a widget to move it.
  */
  onMove(): void {
    this.autoSaveChanges();
  }

  /*  Save the dashboard changes in the database.
  */
  private autoSaveChanges(): void {
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: this.id,
        structure: this.tiles
      }
    }).subscribe(res => {
      this.tiles = res.data?.editDashboard.structure;
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    if (this.router.url.includes('/workflow/')) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.dashboard?.step?.id,
          permissions: e
        }
      }).subscribe(res => {
        this.dashboard = { ...this.dashboard, permissions: res.data?.editStep.permissions };
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.dashboard?.page?.id,
          permissions: e
        }
      }).subscribe(res => {
        this.dashboard = { ...this.dashboard, permissions: res.data?.editPage.permissions };
      });
    }
  }

  toggleFormActive(): void {
    if (this.dashboard?.page ? this.dashboard.page.canUpdate : this.dashboard?.step?.canUpdate) { this.formActive = !this.formActive; }
  }

  /*  Update the name of the dashboard and the step or page linked to it.
  */
  saveName(): void {
    const { dashboardName } = this.dashboardNameForm.value;
    this.toggleFormActive();
    if (this.router.url.includes('/workflow/')) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.dashboard?.step?.id,
          name: dashboardName
        }
      }).subscribe(res => {
        this.dashboard = { ...this.dashboard, name: res.data?.editStep.name };
        if (res.data?.editStep) {
          this.workflowService.updateStepName(res.data.editStep);
        }
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.dashboard?.page?.id,
          name: dashboardName
        }
      }).subscribe(res => {
        this.dashboard = { ...this.dashboard, name: res.data?.editPage.name };
        if (res.data?.editPage) {
          this.applicationService.updatePageName(res.data.editPage);
        }
      });
    }
  }

  /*  Display the ShareUrl modal with the route to access the dashboard.
  */
  public onShare(): void {
    const dialogRef = this.dialog.open(ShareUrlComponent, {
      data: {
        url: window.location
      }
    });
    dialogRef.afterClosed().subscribe();
  }
}
