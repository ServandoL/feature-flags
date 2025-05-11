import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FlagDescription} from '../../../types/FlagDescription';
import {BehaviorSubject, find, Observable, Subject, take} from 'rxjs';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {PublishService} from '../../../shared/services/publish.service';
import {NotificationComponent} from '../../../shared/components/notification/notification.component';
import {CreateFlagComponent} from '../../../shared/components/create-flag/create-flag.component';
import {FlagsService} from '../../../shared/services/flags.service';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateAppComponent} from '../../../shared/components/create-app/create-app.component';
import {AppGlobalService} from '../../../shared/services/app-global.service';
import {UpdateFlagRequest} from '../../../types/Api';

@Component({
  selector: 'app-portal',
  imports: [
    AsyncPipe,
    NgIf,
    NgOptimizedImage,
    NotificationComponent,
    CreateFlagComponent,
    FormsModule,
    ReactiveFormsModule,
    CreateAppComponent
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnDestroy {
  private _publishService = inject(PublishService);
  private _flagService = inject(FlagsService);
  private _globalService = inject(AppGlobalService);
  private _fb = inject(FormBuilder);
  private _destroy$ = new Subject<void>();
  findForm = this._fb.group({
    appName: ['', Validators.required]
  })
  flags$ = new BehaviorSubject<FlagDescription[]>([]);
  nullResponse$ = new BehaviorSubject<boolean>(false);
  appName$: Observable<string | null>;
  shouldShowAppCreateForm$ = this._globalService.handleNewAppClick$.asObservable();

  constructor() {
    this.appName$ = this._globalService.currentAppName$.asObservable();
  }


  get appNameControl(): FormControl<string | null> {
    return this.findForm.controls.appName
  }

  toggleFlag(flag: FlagDescription) {
    const flags = this.flags$.getValue();
    const found = flags.find(f => f.name === flag.name);
    if (found) {
      found.enabled = !found.enabled;
      this.handleUpdateFlag(found, flags);
    }
  }

  private handleUpdateFlag(flag: FlagDescription, flags: FlagDescription[]) {
    const appName = this._globalService.currentAppName$.value;
    if (!appName) {
      console.warn({location: 'PortalComponent.handleUpdateFlag', message: 'No app name found'});
      return;
    }
    const request: UpdateFlagRequest = {
      appName,
      name: flag.name,
      enabled: flag.enabled
    }
    this._flagService.updateFlag(request).pipe(take(1)).subscribe(response => {
      if (response && response.success) {
        console.log({location: 'PortalComponent.handleUpdateFlag', message: response});
        this._publishService.publish(flag);
        this.flags$.next(flags);
      } else {
        console.warn({location: 'PortalComponent.handleUpdateFlag', message: 'No response from server'});
      }
    })
  }

  handleAppName() {
    if (this.findForm.valid && this.appNameControl.value) {
      this._flagService.getFlags(this.appNameControl.value).pipe(take(1)).subscribe(response => {
        if (response) {
          console.log({location: 'PortalComponent.handleAppName', message: response});
          this.flags$.next(response.flags);
          this._globalService.currentAppName$.next(response.appName);
          this.nullResponse$.next(false);
        } else {
          console.warn({location: 'PortalComponent.handleAppName', message: 'No flags found'});
          this.nullResponse$.next(true);
        }
      })
    } else {
      console.warn({location: 'PortalComponent.handleAppName', message: 'Invalid app name'});
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
