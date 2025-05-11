import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {FlagDescription, PublishedPayload} from '../../types/FlagDescription';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IoService {

  private _socket: Socket;
  private _isPublished$ = new BehaviorSubject<PublishedPayload | undefined>(undefined)

  constructor() {
    this._socket = io('http://localhost:3000?room=feature-flag-ui');
    this._socket.on('connect', () => {
      console.log({
        location: IoService.name + '.connect',
        message: 'Connected to server'
      })
    })
  }

  get isPublished$() {
    return this._isPublished$.asObservable();
  }

  publish(flag: FlagDescription) {
    this._socket.timeout(5000).emit('flag', flag, (error: unknown, ack: unknown) => {
      if (error) {
        console.error({
          location: IoService.name + '.publish',
          message: 'Error publishing flag',
          error
        });
        this._isPublished$.next({
          name: flag.name,
          enabled: flag.enabled,
          published: false
        });
      } else {
        console.log({
          location: IoService.name + '.publish',
          message: ack
        });
        this._isPublished$.next({
          name: flag.name,
          enabled: flag.enabled,
          published: true
        });
      }
    })
  }
}
