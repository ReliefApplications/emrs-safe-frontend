import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // === HEADER TITLE ===
  public title = 'Back-office';

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [
    {
      name: 'Site builder',
      navItems: [
        // Commented in order to prevent confusion about dashboards
        // {
        //   name: 'My dashboards',
        //   path: '/dashboards',
        //   icon: 'dashboard',
        // },
        {
          name: 'My applications',
          path: '/applications',
          icon: 'apps',
        }
      ]
    },
    {
      name: 'Advanced settings',
      navItems: [
        {
          name: 'Forms',
          path: '/forms',
          icon: 'poll',
        },
        {
          name: 'Resources',
          path: '/resources',
          icon: 'storage',
        }
      ]
    },
    {
      name: 'Administration',
      navItems: [
        {
          name: 'Users',
          path: '/settings/users',
          icon: 'supervisor_account'
        },
        {
          name: 'Roles',
          path: '/settings/roles',
          icon: 'admin_panel_settings'
        },
        {
          name: 'Clients',
          path: '/settings/clients',
          icon: 'connect_without_contact'
        },
        {
          name: 'API Configurations',
          path: '/settings/apiconfigurations',
          icon: 'settings_input_composite'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {}
}
