import {Component, inject} from '@angular/core';
import {FlagDescription} from '../../../types/FlagDescription';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {PublishService} from '../../../shared/services/publish.service';
import {NotificationComponent} from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-portal',
  imports: [
    AsyncPipe,
    NgIf,
    NgOptimizedImage,
    NotificationComponent
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent {
  private publishService = inject(PublishService);
  private _defaults: FlagDescription[] = [{
    name: 'default1',
    enabled: false,
  }, {
    name: 'default2',
    enabled: false,
  }]
  flags$ = new BehaviorSubject<FlagDescription[]>(this._defaults);

  toggleFlag(flag: FlagDescription) {
    const flags = this.flags$.getValue();
    const found = flags.find(f => f.name === flag.name);
    if (found) {
      found.enabled = !found.enabled;
      this.flags$.next(flags);
      this.publishService.publish(found);
    }
  }
}
