import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastrService);
  const router = inject(Router);
  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErros = [];
              for (let key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErros.push(error.error.errors[key]);
                }
              }
              throw modalStateErros.flat();
            } else {
              toast.error(error.error, error.status);
            }
            break;

          case 401:
            toast.error("Unauthorised", error.status);
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            router.navigateByUrl('/server-error', { state: { error: error.error } });
            break;
          default:
            toast.error("An unexpected error occured!");
            break;
        }
      }
      throw error;
    })
  );
};
