import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map,take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(rout: ActivatedRouteSnapshot, router: RouterStateSnapshot)
          : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.authService.loginStatus.pipe(
      take(1),
      map(loginStatus => {
      const istAuth = !!loginStatus; //!! converts thruthy to true
      if (istAuth) {
        return true;
      }
      return this.router.createUrlTree(['login'])
    }));
  }

}
