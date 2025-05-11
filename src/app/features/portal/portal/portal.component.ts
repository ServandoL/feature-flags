import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FlagDescription} from '../../../types/FlagDescription';
import {BehaviorSubject, Observable, of, Subject, switchMap, take, takeUntil} from 'rxjs';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {PublishService} from '../../../shared/services/publish.service';
import {NotificationComponent} from '../../../shared/components/notification/notification.component';
import {CreateFlagComponent} from '../../../shared/components/create-flag/create-flag.component';
import {FlagsService} from '../../../shared/services/flags.service';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateAppComponent} from '../../../shared/components/create-app/create-app.component';
import {AppGlobalService} from '../../../shared/services/app-global.service';
import {DeleteFlagRequest, UpdateFlagRequest} from '../../../types/Api';
import {HoverOverBannerComponent} from '../../../shared/components/hover-over-banner/hover-over-banner.component';
import {MessageType} from '../../../types/Common';
import {SharedUtils} from '../../../shared/utils/Utils';

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
    CreateAppComponent,
    HoverOverBannerComponent
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnDestroy, OnInit {
  readonly messageTypes = MessageType;
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
  errorResponse$ = new BehaviorSubject<string | null>(null);
  isDeleted$ = new BehaviorSubject<{ flagName: string, success: boolean, message: string } | null>(null);
  isVisible$: Observable<boolean> = SharedUtils.isVisible$(this.isDeleted$);

  constructor() {
    this.appName$ = this._globalService.currentAppName$.asObservable();
  }

  ngOnInit() {
    this._globalService.newFlagCreated$.pipe(switchMap(() => {
      if (this._globalService.currentAppName$.value) {
        return this._flagService.getFlags(this._globalService.currentAppName$.value)
      } else {
        return of(null);
      }
    }), takeUntil(this._destroy$)).subscribe(app => {
      if (app) {
        this.flags$.next(app.flags);
        this._globalService.currentAppName$.next(app.appName);
        this.nullResponse$.next(false);
      }
    })

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

  deleteFlag(flag: FlagDescription) {
    const request: DeleteFlagRequest = {
      appName: this._globalService.currentAppName$.value ?? '',
      name: flag.name
    }
    this._flagService.deleteFlag(request).pipe(take(1)).subscribe(response => {
      if (response && response.success) {
        console.log({location: 'PortalComponent.deleteFlag', message: response});
        this.flags$.next(this.flags$.getValue().filter(f => f.name !== flag.name));
        this.isDeleted$.next({flagName: flag.name, success: true, message: response.results.message});
        this.errorResponse$.next(null);
      } else {
        console.warn({location: 'PortalComponent.deleteFlag', message: 'No response from server'});
        this.errorResponse$.next('Error deleting flag');
        this.isDeleted$.next({flagName: flag.name, success: false, message: 'Error'});
      }
    })
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
