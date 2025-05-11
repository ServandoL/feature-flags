import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AppFlagsResponse, CreateAppResponse, CreateFlagRequest, CreateFlagResponse} from '../../types/Api';
import {catchError, map, Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  private _http = inject(HttpClient);
  private _createFlagResponse$ = new Subject<CreateAppResponse>()

  createFlag(flag: CreateFlagRequest) {
    return this._http.post<CreateAppResponse>('http://localhost:3000/flags/create', flag).pipe(catchError(error => {
      console.error('Error creating flag:', error);
      this._createFlagResponse$.error(error);
      return [];
    }));
  }

  createApp(flag: CreateFlagRequest) {
    return this._http.post<CreateAppResponse>('http://localhost:3000/app/create', flag).pipe(catchError(error => {
      console.error('Error creating flag:', error);
      this._createFlagResponse$.error(error);
      return of(error);
    }));
  }

  get createFlagResponse$(): Observable<CreateAppResponse> {
    return this._createFlagResponse$.asObservable();
  }

  getFlags(appName: string): Observable<AppFlagsResponse | null> {
    return this._http.get<AppFlagsResponse | null>(`http://localhost:3000/flags/${appName}`).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching flags:', error);
        return [];
      })
    );
  }
}
