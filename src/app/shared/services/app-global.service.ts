import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FlagDescription} from '../../types/FlagDescription';

@Injectable({
  providedIn: 'root'
})
export class AppGlobalService {

  readonly handleNewAppClick$ = new BehaviorSubject<boolean>(false);
  readonly currentAppName$ = new BehaviorSubject<string | null>(null);
  readonly newFlagCreated$ = new BehaviorSubject<FlagDescription | null>(null);

  constructor() { }
}
