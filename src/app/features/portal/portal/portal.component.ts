import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FlagDescription} from '../../../types/FlagDescription';
import {BehaviorSubject, Subject} from 'rxjs';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {PublishService} from '../../../shared/services/publish.service';
import {NotificationComponent} from '../../../shared/components/notification/notification.component';
import {CreateFlagComponent} from '../../../shared/components/create-flag/create-flag.component';
import {FlagsService} from '../../../shared/services/flags.service';

@Component({
  selector: 'app-portal',
  imports: [
    AsyncPipe,
    NgIf,
    NgOptimizedImage,
    NotificationComponent,
    CreateFlagComponent
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnInit, OnDestroy {
  private _publishService = inject(PublishService);
  private _flagService = inject(FlagsService);
  private _destroy$ = new Subject<void>();
  private _defaults: FlagDescription[] = [{
    name: 'default1',
    enabled: false,
  }, {
    name: 'default2',
    enabled: false,
  }];
  flags$ = new BehaviorSubject<FlagDescription[]>(this._defaults);
  appName = 'temperature-blanket'

  ngOnInit() {
    this._flagService.getFlags(this.appName).subscribe(response => {
      this.flags$.next(response.flags);
    })
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

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
