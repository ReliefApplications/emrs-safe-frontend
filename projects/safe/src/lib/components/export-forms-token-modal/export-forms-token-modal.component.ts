import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeDownloadService } from '../../services/download.service';

@Component({
  selector: 'safe-export-forms-token-modal',
  templateUrl: './export-forms-token-modal.component.html',
  styleUrls: ['./export-forms-token-modal.component.css']
})
export class ExportFormsTokenModalComponent implements OnInit {

  public link: string;
  public doneButton: boolean;
  public spinnerDisplay: boolean;
  public cardDisplay: boolean;

  public cardUrlDisplay: boolean;
  public successDisplay: boolean;
  public errorMsg: string;

  constructor(public dialogRef: MatDialogRef<ExportFormsTokenModalComponent>,
              private downloadService: SafeDownloadService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.link = '';
    this.doneButton = false;
    this.spinnerDisplay = false;
    this.cardDisplay = false;

    this.cardUrlDisplay = false;
    this.successDisplay = false;

    this.errorMsg = 'There was a problem exporting the form';
  }

  ngOnInit(): void {
  }

  async exportForm(accessToken: string): Promise<void> {
    // return this.dialogRef.close(accessToken);
    if (accessToken !== undefined) {
      this.doneButton = true;

      this.spinnerDisplay = true;
      const path = `upload/form/kobo/${this.data.elt.id}`;
      const dataReturn = await this.downloadService.exportFormGetLink(path, { aToken: accessToken });
      this.spinnerDisplay = false;

      if (dataReturn.status === true){
        this.successDisplay = true;
        this.cardUrlDisplay = true;
        this.cardDisplay = true;

        this.link = dataReturn.data.url;
        this.data.src = dataReturn.data.src;

        console.log(this.link);
      }
      else {
        this.errorMsg = 'There was a problem exporting the form\nReason: ' + dataReturn.data.error;
        this.successDisplay = false;
        this.cardUrlDisplay = false;
        this.cardDisplay = true;
      }
    }
  }

  copyLinkToClipboard(): void {
    const input = document.body.appendChild(document.createElement('input'));
    input.value = this.link;
    input.focus();
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
