import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppGlobalService {

  readonly handleNewAppClick = new BehaviorSubject<boolean>(false);

  constructor() { }
}
