import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FlagDescription} from '../../../types/FlagDescription';
import {BehaviorSubject, find, Subject, take} from 'rxjs';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {PublishService} from '../../../shared/services/publish.service';
import {NotificationComponent} from '../../../shared/components/notification/notification.component';
import {CreateFlagComponent} from '../../../shared/components/create-flag/create-flag.component';
import {FlagsService} from '../../../shared/services/flags.service';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateAppComponent} from '../../../shared/components/create-app/create-app.component';
import {AppGlobalService} from '../../../shared/services/app-global.service';

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
export class PortalComponent implements OnInit, OnDestroy {
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
  appName$ = new BehaviorSubject<string |null>(null);
  shouldShowAppCreateForm$ = this._globalService.handleNewAppClick.asObservable();

  ngOnInit() {
  }

  get appNameControl(): FormControl<string | null> {
    return this.findForm.controls.appName
  }

  toggleFlag(flag: FlagDescription) {
    const flags = this.flags$.getValue();
    const found = flags.find(f => f.name === flag.name);
    if (found) {
      found.enabled = !found.enabled;
      this.flags$.next(flags);
      this._publishService.publish(found);
    }
  }

  handleAppName() {
    if (this.findForm.valid && this.appNameControl.value) {
      this._flagService.getFlags(this.appNameControl.value).pipe(take(1)).subscribe(response => {
        if (response) {
          console.log({location: 'PortalComponent.handleAppName', message: response});
          this.flags$.next(response.flags);
          this.appName$.next(response.appName);
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

  protected readonly find = find;
}
