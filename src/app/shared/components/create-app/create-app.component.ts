import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FlagsService} from '../../services/flags.service';
import {CreateAppResponse, CreateFlagRequest} from '../../../types/Api';
import {BehaviorSubject, catchError, of, take} from 'rxjs';
import {AppGlobalService} from '../../services/app-global.service';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-create-app',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    AsyncPipe
  ],
  templateUrl: './create-app.component.html',
  styleUrl: './create-app.component.scss'
})
export class CreateAppComponent implements OnDestroy {
  private _fb = inject(FormBuilder);
  private _flagService = inject(FlagsService);
  private _globalService = inject(AppGlobalService);
  createAppForm = this._fb.group({
    appName: ['', Validators.required],
    flagName: ['', Validators.required],
  });
  createResponse$ = new BehaviorSubject<CreateAppResponse | null>(null);

  get appNameControl() {
    return this.createAppForm.controls.appName;
  }

  get flagNameControl() {
    return this.createAppForm.controls.flagName;
  }

  handleClose() {
    this._globalService.handleNewAppClick.next(false);
  }

  handleSubmitForm() {
    if (this.createAppForm.valid && this.appNameControl.value && this.flagNameControl.value) {
      const request: CreateFlagRequest = {
        appName: this.appNameControl.value, name: this.flagNameControl.value
      }
      this._flagService.createApp(request).pipe(take(1), catchError(error => {
        console.error({location: 'CreateAppComponent.handleSubmitForm', message: error});
        this.createResponse$.next(error);
        return of(error);
      })).subscribe(response => {
        console.log({location: 'CreateAppComponent.handleSubmitForm', message: response});
        if (response) {
          this.createResponse$.next(response);
          if (response.success) {
            this.appNameControl.disable();
            this.flagNameControl.disable();
          }
        } else {
          this.appNameControl.enable();
          this.flagNameControl.enable();
          this.createResponse$.next(null);
        }
      });
    }
  }

  ngOnDestroy() {
    this.createAppForm.reset();
  }
}
