import { Pipe, PipeTransform } from '@angular/core';
import {MessageType} from '../../types/Common';

@Pipe({
  name: 'messageTypeCss'
})
export class MessageTypeCssPipe implements PipeTransform {

  transform(type: MessageType): string {
    switch (type) {
      case MessageType.SUCCESS:
        return 'success';
      case MessageType.ERROR:
        return 'error';
      case MessageType.INFO:
        return 'info';
      case MessageType.WARNING:
        return 'warning';
      default:
        return 'default';
    }
  }

}
