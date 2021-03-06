import { Component, Input, OnInit } from '@angular/core';
import { BaseFilterCellComponent, FilterService } from '@progress/kendo-angular-grid';
import { contains } from '../../../../utils/array-filter';

@Component({
  selector: 'safe-array-filter',
  templateUrl: './array-filter.component.html',
  styleUrls: ['./array-filter.component.scss']
})
export class SafeArrayFilterComponent extends BaseFilterCellComponent implements OnInit {

  public get selectedValue(): any {
    const filter = this.filterByField(this.valueField);
    return filter ? filter.value : null;
  }

  @Input() public field = '';
  @Input() public filter: any;
  @Input() public data: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';

  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
  }

  public onChange(value: any): void {
    this.applyFilter(
      value === null
        ? this.removeFilter(this.valueField)
        : this.updateFilter({
          field: this.field,
          operator: contains,
          value,
        })
    );
  }
}
