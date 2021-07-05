import {Apollo} from 'apollo-angular';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Role, User, AddUser } from '../../../../models/user.model';
import { GetUsersQueryResponse, GET_USERS } from '../../../../graphql/queries';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SafeSnackBarService } from '../../../../services/snackbar.service';
import { NOTIFICATIONS } from '../../../../const/notifications';

@Component({
  selector: 'safe-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class SafeInviteUserComponent implements OnInit {

  // === REACTIVE FORM ===
  inviteForm: FormGroup = new FormGroup({});
  multipleInviteForm: FormArray = new FormArray([]);

  // === DATA ===
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  private users: User[] = [];
  public filteredUsers?: Observable<User[]>;
  public emails: any[] = [];
  public formValues: any;
  public csvRecords: any[] = [];
  public userArray: any[] = [];
  public emailsList: any[] = [];
  public rolesList: any[] = [];
  public positionAttributesList: any[] = [];
  public allowMultipleInvites = false;

  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;
  @ViewChild('csvReader') csvReader: any;

  get email(): string {
    return this.inviteForm.value.email;
  }

  set email(value: string) {
    this.inviteForm.controls.email.setValue(value);
  }

  get positionAttributes(): FormArray | null {
    return this.inviteForm.get('positionAttributes') ? this.inviteForm.get('positionAttributes') as FormArray : null;
  }

  getRoles(i: number): FormArray | null {
    return this.multipleInviteForm.at(i).get('role') ? this.multipleInviteForm.at(i).get('role') as FormArray : null;
  }

  getCategories(i: number): FormArray | null {
    return this.multipleInviteForm.at(i).get('categories') ? this.multipleInviteForm.at(i).get('categories') as FormArray : null;
  }

  getMultipleInviteForm(i: number): FormGroup {
    return this.multipleInviteForm.at(i) as FormGroup;
  }

  removeUserForm(i: number): any {
    this.multipleInviteForm.removeAt(i);
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeInviteUserComponent>,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: {
      roles: Role[];
      users: [];
      positionAttributeCategories?: PositionAttributeCategory[]
    }
  ) {
  }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.inviteForm = this.formBuilder.group({
      email: [[], Validators.minLength(1)],
      role: ['', Validators.required],
      ...this.data.positionAttributeCategories &&
      {
        positionAttributes: this.formBuilder.array(this.data.positionAttributeCategories.map(x => {
          return this.formBuilder.group({
            value: [''],
            category: [x.id, Validators.required]
          });
        }))
      }
    });
    this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS
    }).valueChanges.subscribe(res => {
      // filter the users that are not registered in the application
      this.users = res.data.users.filter((u: any) => !this.data.users.find((usr: any) => usr.id === u.id));
      this.filteredUsers = this.inviteForm.controls.email.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(x => this.filter(x))
      );
    });

  }

  private filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users ? this.users.filter(x => x.username?.toLowerCase().indexOf(filterValue) === 0) : this.users;
  }

  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent | any): void {
    // use setTimeout to prevent add input value on focusout
    setTimeout(() => {
      const input = event.type === 'focusout' ? this.emailInput?.nativeElement : event.input;
      const value = event.type === 'focusout' ? this.emailInput?.nativeElement.value : event.value;
      if ((value || '').trim()) {
        if (!this.data.users.find((user: any) => user.username.toLowerCase() === value.toLocaleString())) {
          this.emails.push(value.trim());
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectAlreadyExists('user', value));
        }
      }
      this.inviteForm.get('email')?.setValue(this.emails);

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }, event.type === 'focusout' ? 500 : 0);
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.emails.push(event.option.viewValue);
    this.inviteForm.get('email')?.setValue(this.emails);
    if (this.emailInput) {
      this.emailInput.nativeElement.value = '';
    }
  }

  uploadListener($event: any): void {
    const files = $event.target.files;

    if (files[0] && this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      let emailRegistered = false;
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result || '';
        const csvRecordsArray = csvData.toString().split(/\r\n|\n/);
        const header = csvRecordsArray[0].split(',');
        for (let index = 1; index < csvRecordsArray.length - 1; index++) {
          const update: any = {};
          const row = csvRecordsArray[index].split(',');
          for (const column in row) {
            if (row[column]) { update[header[column]] = row[column]; }
          }
          this.userArray.push(update);
        }
        this.userArray.forEach((e) => {
          const user: any = {
            category : [],
            role: []
          };
          for (const el in e) {
            if (el === 'email') {
              if (e[el].trim()) {
                if (!this.data.users.find((email: any) => email.username.toLowerCase() === e[el].toLocaleString())) {
                  user[el] = e[el];
                  emailRegistered = false;
                } else {
                  emailRegistered = true;
                  this.snackBar.openSnackBar(NOTIFICATIONS.emailRegistered);
                }
              }
            } else if (el === 'role') {
              this.allowMultipleInvites = true;
              this.data.roles?.map(x => {
                if (x.title?.toLowerCase() === e[el].toLowerCase()) {
                  user.role.push({ title: e[el], id: x.id});
                }
              });
            } else {
              this.data.positionAttributeCategories?.map(x => {
                if (x.title?.toLowerCase() === el.toLowerCase()) {
                  user.category.push({ title: el, value: e[el], id: x.id});
                }
              });
            }
          }
          if (!emailRegistered) {
            const userForm = this.formBuilder.group({
              email: [user.email, Validators.minLength(1)],
              role: this.formBuilder.array(user.role.map((x: any) => {
                return this.formBuilder.group({
                  title: [x.title],
                  id: [x.id, Validators.required],
                });
              })),
              categories: this.formBuilder.array(user.category.map((x: any) => {
                return this.formBuilder.group({
                  title: [x.title],
                  value: [x.value],
                  id: [x.id, Validators.required],
                });
              }))
            });
            this.multipleInviteForm.push(userForm);
          }
        });
        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
        for (const record of this.csvRecords) {
          if (record.trim()) {
            if (!this.data.users.find((email: any) => email.username.toLowerCase() === record.toLocaleString())) {
              this.emails.push(record.trim());
              this.inviteForm.get('email')?.setValue(this.emails);
            } else {
              emailRegistered = true;
            }
          }
        }
        if (emailRegistered) {
          this.snackBar.openSnackBar(NOTIFICATIONS.emailRegistered);
        }
      };

      reader.onerror = () => {
        console.log('Error is occured while reading file!');
      };

    } else {
      if (files.length > 0) {
        this.snackBar.openSnackBar(NOTIFICATIONS.isFormatValid, {error: true});
      }
      this.fileReset();
    }
  }

  private fileReset(): void {
    this.csvReader.nativeElement.value = '';
    this.csvRecords = [];
  }

  private isValidCSVFile(file: any): any {
    return file.name.endsWith('.csv');
  }

  private getDataRecordsArrayFromCSVFile(csvRecordsArray: any): any {
    const csvArr: any[] = [];
    for (const recordLine of csvRecordsArray) {
      const currentRecordLine = recordLine.split(';').map((x: any) => x.split(','));
      if (currentRecordLine.length > 0) {
        for (const record of currentRecordLine) {
          const csvRecord: string  = record.toString().trim();
          if (csvRecord) {
            csvArr.push(csvRecord);
          }
        }
      }
    }
    return Array.from(new Set(csvArr));
  }

  public returnValueMultipleUsers(): AddUser[]{
    return this.multipleInviteForm.value.map((userForm: any) => {
      return {
        email: userForm.email,
        roles: userForm.role.map((x: any) => x.id),
        attributes: userForm.categories.map((x: any) => ({ value: x.value, category: x.id }))
      };
    });
  }
}
