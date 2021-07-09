import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafeDownloadService {

  public baseUrl: string;

  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.baseUrl = environment.API_URL;
  }

  /**
   * Download file from the server
   * @param path download path to append to base url
   * @param type type of the file
   * @param fileName name of the file
   * @param options (optional) request options
   */
  getFile(path: string, type: string, fileName: string, options?: any): void {
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    const token = localStorage.getItem('msal.idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    this.http.get(url, { ...options, responseType: 'blob', headers }).subscribe((res) => {
      const blob = new Blob([res], { type });
      this.saveFile(fileName, blob);
    });
  }

  private saveFile(fileName: string, blob: Blob): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    setTimeout(() => link.remove(), 0);
  }

  async getForm(path: string): Promise<any> {
    // const url = `${this.baseUrl}/download/form/${id}`;
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    const token = localStorage.getItem('msal.idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    console.log(url);
    // console.log(headers);
    let response;
    let reason;
    await this.http.get(url, { headers }).toPromise().then((res) => {
      response = res;
      // console.log('res');
      // console.log(res);
    }).catch((reas => {console.log(reas); reason = reas; }));
    // console.log(response);
    // console.log(reason);
    let dataReturn = null;
    if (reason == null) {
      dataReturn = {
        status: true,
        data: response
      };
    }
    else {
      dataReturn = {
        status: false,
        data: reason
      };
    }
    return dataReturn;
  }
}
