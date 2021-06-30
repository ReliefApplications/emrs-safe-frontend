import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'safe-import-record-modal',
  templateUrl: './import-record-modal.component.html',
  styleUrls: ['./import-record-modal.component.css']
})
export class ImportRecordModalComponent implements OnInit {

  files: File[] = [];
  baseUrl: string;

  constructor(private http: HttpClient, @Inject('environment') environment: any) {
    this.baseUrl = environment.API_URL;
  }

  ngOnInit(): void {
  }

  onSelect(event: any): void {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  sendFiles(event: any): void {
    const path = 'upload/records/add';
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    const token = localStorage.getItem('msal.idtoken');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('sampleFile', this.files[0], this.files[0].name);

    this.http.post(url, formData, {headers}).subscribe(response => {
      console.log(response);
    });
  }
}
