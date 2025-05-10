import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AppFlagsResponse, CreateFlagRequest, CreateFlagResponse} from '../../types/Api';
import {catchError, map, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  private _http = inject(HttpClient);
  private _createFlagResponse$ = new Subject<CreateFlagResponse>()

  createFlag(flag: CreateFlagRequest) {
    return this._http.post<CreateFlagResponse>('http://localhost:3000/flags/create', flag).pipe(catchError(error => {
      console.error('Error creating flag:', error);
      this._createFlagResponse$.error(error);
      return [];
    }));
  }

  get createFlagResponse$(): Observable<CreateFlagResponse> {
    return this._createFlagResponse$.asObservable();
  }

  getFlags(appName: string): Observable<AppFlagsResponse> {
    return this._http.get<AppFlagsResponse>(`http://localhost:3000/flags/${appName}`).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching flags:', error);
        return [];
      })
    );
  }
}
