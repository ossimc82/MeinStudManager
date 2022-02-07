import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "../auth.service";

// Interceptor that will later attach the token to outgoing requests
// has to be modified later maybe

// has to be provided in providers {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor} in app.module

/*
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.loginSatus.pipe(
      take(1),
      exhaustMap(loginStatus => {
        // if not loged-in no token will be attached
        if(!loginStatus) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', loginStatus.getToken())
        });
        return next.handle(modifiedReq);
      })
    );

  }

}
*/
