import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isGranted } from '../../utils/role-validation';

const NOT_AUTHORIZED = '/pages/error-pages/401';
const SIGN_IN = '/authentication/sign-in';
// const TOTP = '/authentication/totp';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private authService: NbAuthService) {}

  canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().pipe(
      tap((authenticated) => {
        this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
          // this.logger.debug('Authenticated: ', authenticated);
          // this.logger.debug('activatedRoute: ', activatedRoute);
          // this.logger.debug('state: ', state);

          if (token) {
            // this.logger.debug(token);
            // this.logger.debug('Token is valid: ', token.isValid());
            // if (token.getPayload()) {
            //   this.logger.debug('Token authenticated to use TOTP: ', token.getPayload().authenticated);
            // }

            if (!authenticated || !token.isValid()) {
              // console.error('Unauthorized: 401');
              this.router.navigate([SIGN_IN], {
                queryParams: { returnUrl: state.url },
              });
              return false;
            }

            // if (token.getPayload() && !token.getPayload().authenticated) {
            //   console.error('Request: TOTP');
            //   this.router.navigate([TOTP], { queryParams: { returnUrl: state.url, userId: token.getPayload().id } });
            //   return false;
            // }
          }

          const roles = activatedRoute.data.roles;
          const currentUser = token.getPayload();

          // this.logger.debug('roles: ', roles);
console.log(currentUser);
          console.log(roles);
          if (!isGranted(roles, currentUser.scopes)) {
            // console.error('Unauthorized : 401');
            this.router.navigate([NOT_AUTHORIZED]);
            return false;
          }

          return true;
        });
      }),
    );
  }
}
