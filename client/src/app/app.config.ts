import { NgxSpinnerModule } from 'ngx-spinner';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './_interceptros/error.interceptor';
import { jwtInterceptor } from './_interceptros/jwt.interceptor';
import { loadingInterceptor } from './_interceptros/loading.interceptor';
import { TimeagoModule } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
  provideAnimations(),
  provideToastr({
    positionClass: 'toast-top-right',
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing'
  }),
  importProvidersFrom(NgxSpinnerModule, TimeagoModule.forRoot())
  ]
};
