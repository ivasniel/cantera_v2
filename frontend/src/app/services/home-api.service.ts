import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcademyProgram, RegistrationLead, RegistrationResponse } from '../models/program.model';

@Injectable({ providedIn: 'root' })
export class HomeApiService {
  private readonly http = inject(HttpClient);

  getPrograms(): Observable<AcademyProgram[]> {
    return this.http.get<AcademyProgram[]>('/api/programs');
  }

  createRegistrationLead(payload: RegistrationLead): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>('/api/registration-leads', payload);
  }
}
