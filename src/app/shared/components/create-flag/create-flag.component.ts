import {Component, inject, Input} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateFlagForm} from '../../../types/Form';
import {FlagsService} from '../../services/flags.service';
import {BehaviorSubject, take} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {AppGlobalService} from '../../services/app-global.service';

@Component({
  selector: 'app-create-flag',
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './create-flag.component.html',
  styleUrl: './create-flag.component.scss'
})
export class CreateFlagComponent {
  private _flagService = inject(FlagsService);
  private _fb = inject(FormBuilder);
  private _globalService = inject(AppGlobalService)
  @Input() appName = '';
  flagForm = this._fb.group<CreateFlagForm>({
    name: new FormControl('', Validators.required)
  });
  createClicked$ = new BehaviorSubject<boolean>(false);
  submittedWithError$ = new BehaviorSubject<boolean>(false);

  get name(): FormControl<string | null> {
    return this.flagForm.controls.name;
  }

  handleBackButton() {
    this.submittedWithError$.next(false);
    this.createClicked$.next(false);
  }

  handleCreateClicked() {
    this.createClicked$.next(true);
    this.submittedWithError$.next(false);
  }

  submit() {
    if (this.flagForm.valid) {
      console.log('Form submitted:', this.flagForm.value);
      // Handle form submission logic here
      this._flagService.createFlag({
        appName: this.appName,
        name: this.name.value ?? ''
      }).pipe(take(1)).subscribe(response => {
        console.log({
          location: CreateFlagComponent.name + '.submit',
          message: response
        });
        if (response.success) {
          this.flagForm.reset();
          this.submittedWithError$.next(false);
          this.createClicked$.next(false);
          this._globalService.newFlagCreated$.next({name: this.name.value ?? '', enabled: false})
        } else {
          this.submittedWithError$.next(true);
        }
      })
    } else {
      this.submittedWithError$.next(true);
      console.log('Form is invalid');
    }
  }
}
