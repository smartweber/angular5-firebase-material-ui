import { Component, OnInit } from '@angular/core';
import { StorageManagerService } from '../services/storage-manager.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  bIsProcess: boolean;

  constructor(private storageManagerService: StorageManagerService) {
    this.bIsProcess = false;

    this.storageManagerService.clearStorage().then(() => {
      this.bIsProcess = true;
    });
  }

  ngOnInit() {
  }

}
