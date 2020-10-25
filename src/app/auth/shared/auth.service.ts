import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SignupRequestPayload } from '../sign-up/sign-up-request.payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private localStorage: LocalStorageService) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any>{
    return this.httpClient.post('http://localhost:8080/api/auth/signup', signupRequestPayload, {responseType: 'text'});
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean>{
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/login',
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);

        return true;
      }));
  }

  getJwtToken(): string {
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken(): Observable<any> {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUsername()
    };
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token', refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.store('authenticationToken',
          response.authenticationToken);

        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  getUsername(): string {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshToken');
  }
}
