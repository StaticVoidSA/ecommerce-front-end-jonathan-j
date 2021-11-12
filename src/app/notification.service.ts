import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message, title){
      this.toastr.success(message, title, 
        { 
          timeOut: 1500, 
          closeButton: true, 
          extendedTimeOut: 2000, 
          easing: 'ease-in ease-out',
          tapToDismiss: true,
          positionClass: 'toast-top-right' 
        });
  }

  showError(message, title){
      this.toastr.error(message, title, 
        { 
          timeOut: 1500, 
          closeButton: true, 
          extendedTimeOut: 2000, 
          easing: 'ease-in ease-out',
          tapToDismiss: true,
          positionClass: 'toast-top-right' 
        });
  }

  showInfo(message, title){
      this.toastr.info(message, title, 
        { 
          timeOut: 1500, 
          closeButton: true, 
          extendedTimeOut: 2000, 
          easing: 'ease-in ease-out',
          tapToDismiss: true,
          positionClass: 'toast-top-right'  
        });
  }

  showWarning(message, title){
      this.toastr.warning(message, title, { 
        timeOut: 1500, 
          closeButton: true, 
          extendedTimeOut: 2000, 
          easing: 'ease-in ease-out',
          tapToDismiss: true,
          positionClass: 'toast-top-right' 
      });
  }
}