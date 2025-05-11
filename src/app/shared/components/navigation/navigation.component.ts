import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {AppGlobalService} from '../../services/app-global.service';

@Component({
  selector: 'app-navigation',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  private _globalService = inject(AppGlobalService);

  handleNewApp() {
    this._globalService.handleNewAppClick.next(true);
  }

}
