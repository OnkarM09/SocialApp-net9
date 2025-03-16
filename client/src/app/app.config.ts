import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './_iterceptros/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideHttpClient(withInterceptors([errorInterceptor])),
  provideAnimations(),
  provideToastr({
    positionClass: 'toast-top-right',
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing'
  })
  ]
};
