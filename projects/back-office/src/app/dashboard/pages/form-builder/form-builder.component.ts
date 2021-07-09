import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EditFormMutationResponse, EDIT_FORM_NAME, EDIT_FORM_PERMISSIONS, EDIT_FORM_STATUS, EDIT_FORM_STRUCTURE } from '../../../graphql/mutations';
import { GetFormByIdQueryResponse, GET_SHORT_FORM_BY_ID } from '../../../graphql/queries';
import { MatDialog } from '@angular/material/dialog';
import { SafeAuthService, SafeSnackBarService, Form, SafeConfirmModalComponent } from '@safe/builder';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SafeStatusModalComponent, NOTIFICATIONS } from '@safe/builder';
import { REFRESH } from '../../../app.module';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {

  public loading = true;
  public id = '';
  public form?: Form;
  public structure: any;
  public activeVersions = false;
  public activeVersion: any;

  // === ENUM OF FORM STATUSES ===
  public statuses = [
    {
      value: 'active',
      text: 'Active',
      color: 'primary'
    },
    {
      value: 'pending',
      text: 'Pending',
      color: 'accent'
    },
    {
      value: 'archived',
      text: 'Archive',
      color: 'warn'
    }
  ];

  // === FORM EDITION ===
  public formActive = false;
  public nameForm: FormGroup = new FormGroup({});
  public hasChanges = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService,
    public dialog: MatDialog,
    private authService: SafeAuthService
  ) { }

  /* Shows modal confirmation before leave the page if has changes on form
  */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasChanges) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: `Exit without saving changes`,
          content: `There are unsaved changes on your form. Are you sure you want to exit?`,
          confirmText: 'Confirm',
          confirmColor: 'primary'
        }
      });
      return dialogRef.afterClosed().pipe(map(value => {
        if (value) {
          this.authService.canLogout.next(true);
          window.localStorage.removeItem(`form:${this.id}`);
          return true;
        }
        return false;
      }));
    }
    return true;
  }


  ngOnInit(): void {
    this.formActive = false;
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_SHORT_FORM_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.form) {
          this.loading = res.loading;
          this.form = res.data.form;
          this.nameForm = new FormGroup({
            formName: new FormControl(this.form.name, Validators.required)
          });
          const storedStructure = window.localStorage.getItem(`form:${this.id}`);
          this.structure = storedStructure ? storedStructure : this.form.structure;
          if (this.structure !== this.form.structure) {
            this.hasChanges = true;
            this.authService.canLogout.next(!this.hasChanges);
          }
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('form'), { error: true });
          // redirect to default screen if error
          this.router.navigate(['/forms']);
        }
      }, (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        // redirect to default screen if error
        this.router.navigate(['/forms']);
      });
    } else {
      this.loading = false;
      // redirect to default screen if error
      this.router.navigate(['/forms']);
    }
  }

  toggleFormActive(): void {
    if (this.form?.canUpdate) {
      this.formActive = !this.formActive;
    }
  }

  /* Save the form
  */
  public onSave(structure: any): void {
    if (!this.form?.id) {
      alert('not valid');
    } else {
      REFRESH.next(false);
      const statusModal = this.dialog.open(SafeStatusModalComponent, {
        disableClose: true,
        data: {
          title: 'Saving survey',
          showSpinner: true
        }
      });
      this.apollo.mutate<EditFormMutationResponse>({
        mutation: EDIT_FORM_STRUCTURE,
        variables: {
          id: this.form.id,
          structure
        }
      }).subscribe(res => {
        if (res.errors) {
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
          statusModal.close();
        } else {
          REFRESH.asObservable().subscribe(r => {
            if (r) {
              statusModal.close();
              this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('form', this.form?.name));
              this.form = res.data?.editForm;
              this.structure = structure;
              localStorage.removeItem(`form:${this.id}`);
              this.hasChanges = false;
              this.authService.canLogout.next(true);
            }
          });
        }
      }, (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        statusModal.close();
      });
    }
  }

  /*  Update the status of the form.
  */
  public updateStatus(e: any): void {
    const statusModal = this.dialog.open(SafeStatusModalComponent, {
      disableClose: true,
      data: {
        title: 'Saving survey',
        showSpinner: true
      }
    });
    this.apollo.mutate<EditFormMutationResponse>({
      mutation: EDIT_FORM_STATUS,
      variables: {
        id: this.id,
        status: e.value
      }
    }).subscribe(res => {
      if (res.errors) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectNotUpdated('Status', res.errors[0].message));
        statusModal.close();
      } else {
        this.snackBar.openSnackBar(NOTIFICATIONS.statusUpdated(e.value), { duration: 1000 });
        this.form = { ...this.form, status: res.data?.editForm.status };
        statusModal.close();
      }
    });
  }

  /*  Available in previous version to change the template.
  */
  setTemplate(id: string): void {
    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_SHORT_FORM_BY_ID,
      variables: {
        id
      }
    }).valueChanges.subscribe(res => {
      this.structure = res.data.form.structure;
    });
  }

  /*  Available in previous version to change the version.
*/
  public onOpenVersion(e: any): void {
    this.activeVersion = e;
    this.structure = this.activeVersion.data;
    // this.surveyCreator.makeNewViewActive('test');
    // this.surveyCreator.saveSurveyFunc = null;
  }

  /*  Available in previous version to change the version.
  */
  public resetActiveVersion(): void {
    this.activeVersion = null;
    this.structure = this.form?.structure;
    // this.surveyCreator.makeNewViewActive('designer');
    // this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
  }

  /*  Edit the form name.
*/
  public saveName(): void {
    const statusModal = this.dialog.open(SafeStatusModalComponent, {
      disableClose: true,
      data: {
        title: 'Saving survey',
        showSpinner: true
      }
    });
    const { formName } = this.nameForm.value;
    this.toggleFormActive();
    this.apollo.mutate<EditFormMutationResponse>({
      mutation: EDIT_FORM_NAME,
      variables: {
        id: this.id,
        name: formName
      }
    }).subscribe(
      res => {
        if (res.errors) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectNotUpdated('form', res.errors[0].message));
          statusModal.close();
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('form', formName), { duration: 1000 });
          this.form = { ...this.form, name: res.data?.editForm.name };
          statusModal.close();
        }
      });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    const statusModal = this.dialog.open(SafeStatusModalComponent, {
      disableClose: true,
      data: {
        title: 'Saving survey',
        showSpinner: true
      }
    });
    this.apollo.mutate<EditFormMutationResponse>({
      mutation: EDIT_FORM_PERMISSIONS,
      variables: {
        id: this.id,
        permissions: e
      }
    }).subscribe(res => {
      if (res.errors) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectNotUpdated('access', res.errors[0].message));
        statusModal.close();
      } else {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('access', ''));
        this.form = res.data?.editForm;
        statusModal.close();
      }
    });
  }

  formStructureChange(event: any): void {
    this.hasChanges = (event !== this.form?.structure);
    localStorage.setItem(`form:${this.id}`, event);
    this.authService.canLogout.next(!this.hasChanges);
  }
}
