import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application } from '@safe/builder';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-applications-table',
  templateUrl: './applications-table.component.html',
  styleUrls: ['./applications-table.component.scss']
})
export class ApplicationsTableComponent implements OnInit {

  @Input()
  dataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);

  @Input()
  loading = true;

  @Input()
  loadMoreData = false;

  @Input()
  noMoreData = false;

  @Output()
  sortTable: EventEmitter<Sort> = new EventEmitter<Sort>();

  @Output()
  preview: EventEmitter<Application> = new EventEmitter<Application>();

  @Output()
  duplicate: EventEmitter<Application> = new EventEmitter<Application>();

  @Output()
  delete: EventEmitter<Application> = new EventEmitter<Application>();

  @Output()
  save: EventEmitter<{ permission: object, application: Application }> =
    new EventEmitter<{ permission: object, application: Application }>();

  // === SORTING ===
  sortActive = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  public displayedColumns = ['name', 'createdAt', 'status', 'usersCount', 'actions'];

  constructor() { }

  ngOnInit(): void {
  }

}
