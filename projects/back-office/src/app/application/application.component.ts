import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, SafeConfirmModalComponent, ContentType, SafeApplicationService, SafeLayoutService } from '@safe/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===

  public title = '';

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups: any[] = [];
  public navItems: any[] = [];

  // === APPLICATION ===
  public application?: Application;
  private applicationSubscription?: Subscription;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private layoutService: SafeLayoutService,
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.applicationService.loadApplication(params.id);
    });
    this.layoutService.navItems.subscribe((navItems: any) => {
      if (navItems) {
        this.navItems = navItems;
      } else {
        this.navItems = [
          {
            name: 'Settings',
            path: './settings/edit',
            icon: 'settings'
          }
        ];
      }
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      if (application) {
        this.title = application.name || '';
        const navItems: any[] = [];
        this.navGroups = [
          {
            name: 'Display',
            callback: (event: any) => this.onReorder(event),
            navItems: navItems
            .concat(application.pages?.filter(x => x.content).map(x => {
              return {
                id: x.id,
                name: x.name,
                path: (x.type === ContentType.form) ? `./${x.type}/${x.id}` : `./${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type || ''),
                class: null,
                orderable: true,
                action: {
                  icon: 'delete',
                  toolTip: 'Delete the page',
                  callback: () => this.onDelete(x)
                }
              };
            }))
            .concat(
              {
                name: 'Add a page',
                path: './add-page',
                icon: 'add_circle',
                class: 'nav-item-add',
                isAddPage: true
              }
            )
          },
          {
            name: 'Administration',
            navItems: this.navItems
          }
        ];
        if (!this.application || application.id !== this.application.id) {
          const [firstPage, ..._] = application.pages || [];
          if (this.router.url.endsWith(application?.id || '') || !firstPage) {
            if (firstPage) {
              this.router.navigate([`./${firstPage.type}/${firstPage.type === ContentType.form ? firstPage.id : firstPage.content}`],
              { relativeTo: this.route });
            } else {
              this.router.navigate([`./`], { relativeTo: this.route });
            }
          }
        }
        this.application = application;
      } else {
        this.title = '';
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

  onDelete(item: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete page',
        content: `Do you confirm the deletion of the page ${item.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if ( value ) {
        this.applicationService.deletePage(item.id);
      }
    });
  }

  onReorder(event: any): void {
    this.applicationService.reorderPages(event.filter((x: any) => x.id).map((x: any) => x.id));
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
      this.applicationService.leaveApplication();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
