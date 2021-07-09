import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetQueryTypes, GET_QUERY_TYPES } from '../graphql/queries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const DEFAULT_FIELDS = ['id', 'createdAt', 'createdBy', 'lastUpdatedBy', 'modifiedAt', 'canUpdate', 'canDelete'];
const DISABLED_FIELDS = ['canUpdate', 'canDelete'];
const USER_FIELDS = ['id', 'name', 'username'];

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  // tslint:disable-next-line: variable-name
  public __availableQueries = new BehaviorSubject<any[]>([]);
  private userFields = [];

  get availableQueries(): Observable<any> {
    return this.__availableQueries.asObservable();
  }

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder
  ) {
    this.apollo.watchQuery<GetQueryTypes>({
      query: GET_QUERY_TYPES,
    }).valueChanges.subscribe((res) => {
      this.__availableQueries.next(res.data.__schema.queryType.fields.filter((x: any) => x.name.startsWith('all')));
      this.userFields = res.data.__schema.queryType.fields.find((x: any) => x.type.ofType ? x.type.ofType.name === 'User' : false)
        .type.ofType.fields.filter((x: any) => USER_FIELDS.includes(x.name));
    });
  }

  public getFields(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.type.ofType.fields.filter((x: any) => !DISABLED_FIELDS.includes(x.name)) : [];
  }

  public getFieldsFromType(typeName: string): any[] {
    if (typeName === 'User') {
      return this.userFields;
    }
    const query = this.__availableQueries.getValue().find(x => x.type.ofType.name === typeName);
    return query ? query.type.ofType.fields.filter((x: any) => !DISABLED_FIELDS.includes(x.name)) : [];
  }

  public getListFields(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.type.ofType.fields.filter((x: any) => x.type.kind === 'LIST') : [];
  }

  public getFilter(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.args.find((x: any) => x.name === 'filter').type.inputFields : [];
  }

  public getFilterFromType(typeName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.type.ofType.name === typeName);
    return query ? query.args.find((x: any) => x.name === 'filter').type.inputFields : [];
  }

  private buildFilter(filter: any): any {
    return filter ? Object.keys(filter).reduce((o, key) => {
      if (filter[key] || filter[key] === false) {
        if (filter[key] === 'today()') {
          return { ...o, [key]: new Date().toISOString().substring(0, 10) };
        }
        return { ...o, [key]: filter[key] };
      }
      return { ...o };
    }, {}) : null;
  }

  private buildFields(fields: any[]): any {
    return ['id\n'].concat(fields.map(x => {
      switch (x.kind) {
        case 'SCALAR': {
          return x.name + '\n';
        }
        case 'LIST': {
          return `${x.name}(
            sortField: ${x.sort.field ? `"${x.sort.field}"` : null},
            sortOrder: "${x.sort.order}",
            filter: ${this.objToString(this.buildFilter(x.filter))}
          ) {
            ${this.buildFields(x.fields)}
          }` + '\n';
        }
        case 'OBJECT': {
          return `${x.name} {
            ${this.buildFields(x.fields)}
          }` + '\n';
        }
        default: {
          return '';
        }
      }
    }));
  }

  private buildMetaFields(fields: any[]): any {
    if (!fields) {
      return '';
    }
    return [''].concat(fields.map(x => {
      switch (x.kind) {
        case 'SCALAR': {
          return x.name + '\n';
        }
        case 'LIST': {
          return `${x.name} {
            ${x.fields && x.fields.length > 0 ? this.buildMetaFields(x.fields) : ''}
          }` + '\n';
        }
        case 'OBJECT': {
          return `${x.name} {
            ${x.fields && x.fields.length > 0 ? this.buildMetaFields(x.fields) : ''}
          }` + '\n';
        }
        default: {
          return '';
        }
      }
    }));
  }

  public buildQuery(settings: any): any {
    const builtQuery = settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const fields = ['canUpdate\ncanDelete\n'].concat(this.buildFields(builtQuery.fields));
      const metaFields = this.buildMetaFields(builtQuery.fields);
      const query = gql`
        query GetCustomQuery {
          ${builtQuery.name}(
          sortField: ${builtQuery.sort && builtQuery.sort.field ? `"${builtQuery.sort.field}"` : null},
          sortOrder: "${builtQuery.sort?.order || '' }",
          filter: ${this.objToString(this.buildFilter(builtQuery.filter))}
          ) {
          ${fields}
        }
        }
      `;
      return this.apollo.watchQuery<any>({
        query,
        variables: {}
      });
    } else {
      return null;
    }
  }

  public buildMetaQuery(settings: any, subQuery = false): any {
    const builtQuery = subQuery ? settings : settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const metaFields = this.buildMetaFields(builtQuery.fields);
      const query = gql`
        query GetCustomMetaQuery {
          _${subQuery ? builtQuery.type : builtQuery.name}Meta {
            ${metaFields}
          }
        }
      `;
      return this.apollo.query<any>({
        query,
        variables: {}
      });
    } else {
      return null;
    }
  }

  public getQueryNameFromResourceName(resourceName: string): any {
    const nameTrimmed = resourceName.replace(/\s/g, '').toLowerCase();
    return this.__availableQueries.getValue().find(x => x.type.ofType.name.toLowerCase() === nameTrimmed)?.name || '';
  }

  private objToString(obj: any): string {
    let str = '{';
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str += p + ': ' + (
            typeof obj[p] === 'string' ? `"${obj[p]}"` :
            Array.isArray(obj[p]) ? this.arrayToString(obj[p]) :
            obj[p]
          ) + ',\n';
      }
    }
    return str + '}';
  }

  private arrayToString(array: any): string {
    let str = '[';
    for (const item of array) {
      str += (typeof item === 'string' ? `"${item}"` : item) + ',\n';
    }
    return str + ']';
  }

  public createQueryForm(value: any, validators = true): FormGroup {
    return this.formBuilder.group({
      name: [value ? value.name : '', validators ? Validators.required : null],
      fields: this.formBuilder.array((value && value.fields) ? value.fields.map((x: any) => this.addNewField(x)) : [],
       validators ? Validators.required : null),
      sort: this.formBuilder.group({
        field: [(value && value.sort) ? value.sort.field : ''],
        order: [(value && value.sort) ? value.sort.order : 'asc']
      }),
      filter: this.createFilterGroup(value && value.filter ? value.filter : {}, null)
    });
  }

  public createFilterGroup(filter: any, availableFilter: any): FormGroup {
    if (availableFilter) {
      const group = availableFilter.reduce((o: any, key: any) => {
        return ({
          ...o,
          [key.name]: [(filter && (filter[key.name] || filter[key.name] === false) ? filter[key.name] : null)]
        });
      }, {});
      return this.formBuilder.group(group);
    } else {
      const group = Object.keys(filter).reduce((o, key) => {
        return ({ ...o, [key]: [(filter && (filter[key] || filter[key] === false) ? filter[key] : null)] });
      }, {});
      return this.formBuilder.group(group);
    }
  }

  public addNewField(field: any, newField?: boolean): FormGroup {
    switch (newField ? field.type.kind : field.kind) {
      case 'LIST': {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          type: [newField ? field.type.ofType.name : field.type],
          kind: [newField ? field.type.kind : field.kind],
          fields: this.formBuilder.array((!newField && field.fields) ?
            field.fields.map((x: any) => this.addNewField(x)) : [], Validators.required),
          sort: this.formBuilder.group({
            field: [field.sort ? field.sort.field : ''],
            order: [(field.sort && field.sort.order) ? field.sort.order : 'asc']
          }),
          filter: newField ? this.formBuilder.group({}) : this.createFilterGroup(field.filter, null)
        });
      }
      case 'OBJECT': {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          type: [newField ? field.type.name : field.type],
          kind: [newField ? field.type.kind : field.kind],
          fields: this.formBuilder.array((!newField && field.fields) ?
            field.fields.map((x: any) => this.addNewField(x)) : [], Validators.required),
        });
      }
      default: {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          type: [{ value: newField ? field.type.name : field.type, disabled: true }],
          kind: [newField ? field.type.kind : field.kind],
          label: [field.label ? field.label : field.name, Validators.required],
          openOnClick: [field.openOnClick ? field.openOnClick : false]
        });
      }
    }
  }

  public sourceQuery(queryName: string): any {
    const queries = this.__availableQueries.getValue().map(x => x.name);
    if (queries.includes(queryName)) {
      const query = gql`
        query GetCustomSourceQuery {
          _${queryName}Meta {
            _source
          }
        }
      `;
      return this.apollo.query<any>({
        query,
        variables: {}
      });
    } else {
      return null;
    }
  }
}
