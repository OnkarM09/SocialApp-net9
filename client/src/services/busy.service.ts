import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0;
  private readonly spinnerService = inject(NgxSpinnerService);

  busy(){
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: "line-scale-party",
      bdColor: "rgba(255, 255, 255, 0.1)",
      color: "#2196F3",
    });
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0){
      this.busyRequestCount =0;
      this.spinnerService.hide();
    }
  }
}
