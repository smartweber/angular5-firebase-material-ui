import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  objDefaultOptions: Object;

  constructor() {
    localStorage.removeItem('firebase:previous_websocket_failure');
    this.objDefaultOptions = {
      timeOut: 3000,
      clickToClose: true,
      pauseOnHover: true,
      animate: 'fromTop',
      position: ['top', 'right']
    };
  }
}
