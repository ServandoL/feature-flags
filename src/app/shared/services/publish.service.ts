import {Injectable} from '@angular/core';
import {FlagDescription} from '../../types/FlagDescription';
import {IoService} from './io.service';

@Injectable({
  providedIn: 'root'
})
export class PublishService {

  constructor(private io: IoService) {
  }

  get isPublished$() {
    return this.io.isPublished$;
  }

  publish(flag: FlagDescription) {
    console.log({
      location: PublishService.name + '.publish',
      message: flag
    });
    this.io.publish(flag);
  }
}
