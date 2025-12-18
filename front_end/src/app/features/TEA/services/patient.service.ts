import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/pacientes`;

  constructor(private http: HttpClient) {}

  getAll(clinicaId?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (clinicaId) {
      params = params.set('clinicaId', clinicaId);
    }
    return this.http.get<Patient[]>(this.apiUrl, { params });
  }
}
