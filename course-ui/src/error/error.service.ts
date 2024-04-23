import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorService {
  constructor(
    private readonly toastr: ToastrService,
  ) { }

  getErrorMessage(httpError: HttpErrorResponse) {
    return httpError.status === 400 && httpError.error.errors
      ? Object.values(httpError.error.errors).flat() as string[]
      : httpError.error as string;
  }

  handleError(httpError: HttpErrorResponse) {
    if (httpError) {
      switch (httpError.status) {
        case 400:
          if (httpError.error?.errors) {
            Object.values(httpError.error.errors).flat().forEach((errorI) => {
              this.toastr.error(errorI as string, httpError.status.toString())
            });
          } else {
            this.toastr.error(httpError.error || (httpError as any).title, httpError.status.toString());
          }
          break;
        case 401:
          this.toastr.error('Unauthorized', httpError.status.toString());
          break;
        case 404:
          this.toastr.error('Not found', httpError.status.toString());
          break;
        case 500:
          this.toastr.error('Server error', httpError.status.toString());
          console.log(httpError.error);
          break;
        default:
          this.toastr.error('Unexpected error');
          console.log(httpError);
          break;
      }
    }
  }
}
