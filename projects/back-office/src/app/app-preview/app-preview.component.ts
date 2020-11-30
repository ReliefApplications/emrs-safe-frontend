import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application, WhoAuthService } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-app-preview',
  templateUrl: './app-preview.component.html',
  styleUrls: ['./app-preview.component.scss']
})
export class AppPreviewComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title: string;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [];

  // === APPLICATION ===
  public application: Application;
  private applicationSubscription: Subscription;

  // === ROUTE ===
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.applicationService.loadApplication(params.id, true);
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.title = application.name + ' (Preview)';
        this.navGroups = [
          {
            name: 'Pages',
            navItems: application.pages.filter(x => x.content).map(x => {
              return {
                name: x.name,
                path: `./${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type)
              };
            })
          },
          // To change depending on roles selected
          {
            name: 'Administration',
            navItems: [
              {
                name: 'Users',
                path: './settings/users',
                icon: 'supervisor_account'
              },
              {
                name: 'Roles',
                path: './settings/roles',
                icon: 'admin_panel_settings'
              }
            ]
          }
        ];
      } else {
        this.navGroups = [];
      }
    });
  }

  private getNavIcon(type: string): string {
    switch (type) {
      case 'workflow':
        return 'linear_scale';
      case 'form':
        return 'description';
      default:
        return 'dashboard';
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

}