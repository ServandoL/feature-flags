import {Component, Input} from '@angular/core';
import {MessageType} from '../../../types/Common';
import {NgClass} from '@angular/common';
import {MessageTypeCssPipe} from '../../pipe/message-type-css.pipe';

@Component({
  selector: 'app-hover-over-banner',
  imports: [
    NgClass,
    MessageTypeCssPipe
  ],
  templateUrl: './hover-over-banner.component.html',
  styleUrl: './hover-over-banner.component.scss'
})
export class HoverOverBannerComponent {
  @Input() message: string = '';
  @Input() messageType: MessageType = MessageType.SUCCESS;
}
