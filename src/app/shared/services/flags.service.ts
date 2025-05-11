import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
  AppFlagsResponse,
  GenericApiResponse,
  CreateFlagRequest,
  UpdateFlagRequest, DeleteFlagRequest
} from '../../types/Api';
import {catchError, map, Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  private _http = inject(HttpClient);
  private _createFlagResponse$ = new Subject<GenericApiResponse>();

  deleteFlag(flag: DeleteFlagRequest): Observable<GenericApiResponse> {
    return this._http.post<GenericApiResponse>('http://localhost:3000/flags/delete', flag).pipe(catchError(error => {
      console.error({location: 'FlagsService.deleteFlag', message: error});
      this._createFlagResponse$.error(error);
      return of(error);
    }));
  }

  createFlag(flag: CreateFlagRequest): Observable<GenericApiResponse> {
    return this._http.post<GenericApiResponse>('http://localhost:3000/flags/create', flag).pipe(catchError(error => {
      console.error({location: 'FlagsService.createFlag', message: error});
      this._createFlagResponse$.error(error);
      return of(error);
    }));
  }

  createApp(flag: CreateFlagRequest): Observable<GenericApiResponse> {
    return this._http.post<GenericApiResponse>('http://localhost:3000/app/create', flag).pipe(catchError(error => {
      console.error({location: 'FlagsService.createApp', message: error});
      this._createFlagResponse$.error(error);
      return of(error);
    }));
  }

  updateFlag(flag: UpdateFlagRequest): Observable<GenericApiResponse> {
    return this._http.put<GenericApiResponse>('http://localhost:3000/flags/update', flag).pipe(catchError(error => {
      console.error({location: 'FlagsService.updateFlag', message: error});
      this._createFlagResponse$.error(error);
      return of(error);
    }))
  }

  get createFlagResponse$(): Observable<GenericApiResponse> {
    return this._createFlagResponse$.asObservable();
  }

  getFlags(appName: string): Observable<AppFlagsResponse | null> {
    return this._http.get<AppFlagsResponse | null>(`http://localhost:3000/flags/${appName}`).pipe(
      map(response => response),
      catchError(error => {
        console.error({location: 'FlagsService.getFlags', message: error});
        return [];
      })
    );
  }
}
