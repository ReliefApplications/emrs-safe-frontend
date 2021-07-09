import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder.service';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'safe-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  providers: [
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class SafeQueryBuilderComponent implements OnInit {

  // === QUERY BUILDER ===
  public availableQueries?: Observable<any[]>;
  public availableFields: any[] = [];
  public availableFilters: any[] = [];
  public factory?: ComponentFactory<any>;

  public allQueries: any[] = [];
  public filteredQueries: any[] = [];

  get availableScalarFields(): any[] {
    return this.availableFields.filter(x => x.type.kind === 'SCALAR');
  }

  @Input() form?: FormGroup;
  @Input() canExpand = true;
  @Input() canSelectDataSet = true;
  @Input() isChild = false;

  // === FIELD EDITION ===
  public isField = false;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) { }

  ngOnInit(): void {
    this.factory = this.componentFactoryResolver.resolveComponentFactory(SafeQueryBuilderComponent);
    if (this.form?.value.type) {
      this.isField = true;
      this.availableFields = this.queryBuilder.getFieldsFromType(this.form?.value.type)
        .filter(x => this.canExpand || x.type.kind !== 'LIST');
      if (this.form?.get('filter')) {
        this.availableFilters = this.queryBuilder.getFilterFromType(this.form?.value.type);
        this.form?.setControl('filter',
          this.queryBuilder.createFilterGroup(this.form?.value.filter, this.availableFilters));
      }
    } else {
      this.availableQueries = this.queryBuilder.availableQueries;
      this.availableQueries.subscribe((res) => {
        if (res && res.length > 0) {
          this.allQueries = res.map(x => x.name);
          this.filteredQueries = this.filterQueries(this.form?.value.name);
          this.availableFields = this.queryBuilder.getFields(this.form?.value.name);
          this.availableFilters = this.queryBuilder.getFilter(this.form?.value.name);
          this.form?.setControl('filter', this.queryBuilder.createFilterGroup(this.form?.value.filter, this.availableFilters));
        }
      });
      this.form?.controls.name.valueChanges.subscribe((res) => {
        if (this.allQueries.find(x => x === res)) {
          this.availableFields = this.queryBuilder.getFields(res);
          this.availableFilters = this.queryBuilder.getFilter(res);
          this.form?.setControl('filter', this.queryBuilder.createFilterGroup(null, this.availableFilters));
          this.form?.setControl('fields', this.formBuilder.array([], Validators.required));
          this.form?.setControl('sort', this.formBuilder.group({
            field: [''],
            order: ['asc']
          }));
        } else {
          this.availableFields = [];
          this.availableFilters = [];
          this.form?.setControl('filter', this.queryBuilder.createFilterGroup(null, this.availableFilters));
          this.form?.setControl('fields', this.formBuilder.array([]));
          this.form?.setControl('sort', this.formBuilder.group({
            field: [''],
            order: ['asc']
          }));
        }
        this.filteredQueries = this.filterQueries(res);
      });
    }
  }

  onCloseField(): void {
    this.closeField.emit(true);
  }

  private filterQueries(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allQueries.filter(x => x.toLowerCase().includes(filterValue));
  }
}
