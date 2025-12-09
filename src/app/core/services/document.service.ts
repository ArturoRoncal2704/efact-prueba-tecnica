import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = environment.apiUrl;
  private ticket = environment.credentials.ticket;

  constructor(private http: HttpClient) {}

  getCDR(): Observable<Blob> {
    const url = `${this.apiUrl}/v1/cdr/${this.ticket}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getXML(): Observable<Blob> {
    const url = `${this.apiUrl}/v1/xml/${this.ticket}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getPDF(): Observable<Blob> {
    const url = `${this.apiUrl}/v1/pdf/${this.ticket}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  blobToText(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  }

  createObjectURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
