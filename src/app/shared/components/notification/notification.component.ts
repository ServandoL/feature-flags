import {Component, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {PublishedPayload} from '../../../types/FlagDescription';
import {AsyncPipe, NgIf} from '@angular/common';
import {PublishService} from '../../services/publish.service';
import {SharedUtils} from '../../utils/Utils';

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
  isVisible$: Observable<boolean> = SharedUtils.isVisible$(this.notification$)
}
