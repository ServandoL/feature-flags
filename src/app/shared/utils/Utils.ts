import {map, Observable, startWith, switchMap, timer} from 'rxjs';

export class SharedUtils {
  static isVisible$<T>(observable: Observable<T>): Observable<boolean> {
    return observable.pipe(
      switchMap(notification => {
        if (notification) {
          return timer(3000).pipe(map(() => false), startWith(true));
        }
        return [false];
      })
    );
  }
}
