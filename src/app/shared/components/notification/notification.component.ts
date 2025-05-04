import {Component, inject} from '@angular/core';
import {map, Observable, startWith, switchMap, timer} from 'rxjs';
import {PublishedPayload} from '../../../types/FlagDescription';
import {AsyncPipe, NgIf} from '@angular/common';
import {PublishService} from '../../services/publish.service';

@Component({
  selector: 'app-notification',
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  private publishService = inject(PublishService);
  notification$: Observable<PublishedPayload | undefined> = this.publishService.isPublished$;
  isVisible$: Observable<boolean> = this.notification$.pipe(
    switchMap(notification => {
      if (notification) {
        return timer(3000).pipe(map(() => false), startWith(true));
      }
      return [false];
    })
  );
}
