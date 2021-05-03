import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from "@ionic/storage";
import { tokenNotExpired} from 'angular2-jwt';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: Http, public storage: Storage) {
  }

  public error: any;
  public token: any;
  public user: any;

  // private LOGIN_URL = '/api/authenticate';
  // private RESET_URL = '/api/resetpassword';
  // private SIGNUP_URL = "/api/register";
  // private SIGNOUT_URL = '/api/logout';
  // private LOGIN_URL = 'http://curio.vicdenys.be/api/authenticate';
  // private RESET_URL = 'http://curio.vicdenys.be/api/resetpassword';
  // private SIGNUP_URL = "http://curio.vicdenys.be/api/register";
  // private SIGNOUT_URL = 'http://curio.vicdenys.be/api/logout';
  private LOGIN_URL = 'http://curio-vicdenys.c9users.io/api/authenticate';
  private RESET_URL = 'http://curio-vicdenys.c9users.io/api/resetpassword';
  private SIGNUP_URL = "http://curio-vicdenys.c9users.io/api/register";
  private SIGNOUT_URL = 'http://curio-vicdenys.c9users.io/api/logout';
  private HEADERS = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  public authenticated() {
    return new Promise(
      resolve => {
        this.storage.get('token').then(

          data => { resolve(tokenNotExpired(null, data));}
        );
      }
    )
  }

  public login(credentials) {

    return new Promise(
      (resolve, reject) => {
        this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.HEADERS })
          .map(res => res.json())
          .subscribe(
            data => {
              this.token = data.res.token;
              this.storage.set('token', this.token);
              this.addTokenToHeaders(this.token);
              this.user = data.res.user;
              this.storage.set('user', this.user);
              resolve(true);
            },
            err => {
              this.error = err;
              console.log(JSON.stringify(err));
              reject(err);
            }
          )
      }
    )
  }

  public register(credentials) {

    return new Promise(
      (resolve, reject) => {
        this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.HEADERS })
          .map(res => res.json())
          .subscribe(
            data => {
              this.token = data.res.token;
              this.storage.set('token', this.token);
              this.addTokenToHeaders(this.token);
              this.user = data.res.user;
              this.storage.set('user', this.user);
              resolve(true);
            },
            err => {
              this.error = err;
              console.log(JSON.stringify(err));
              reject(err);
            }
          )
      }
    )
  }

  public resetPasswordEmail(credentials){
    return new Promise(
      (resolve, reject) => {
        this.http.post(this.RESET_URL, JSON.stringify(credentials), { headers: this.HEADERS })
          .map(res => res.json())
          .subscribe(
            data => {
              console.log(data);
              resolve(data);
            },
            err => {
              reject(err);
            }
          )
      }
    )
  }

  public logout(){
    return new Promise(
      (resolve, reject) => {
        this.http.post(this.SIGNOUT_URL + '?token=' + this.token, null, { headers: this.HEADERS })
          .map(res => res.json())
          .subscribe(
            data => {
              this.storage.remove('token');
              this.storage.remove('user');
              this.token = {};
              this.user = {};
              resolve(data);
            },
            err => {
              reject(err);
            }
          )
      }
    )
  }

  private addTokenToHeaders(token:any){
    this.HEADERS.append('Authorization', 'Bearer ' + token);
  }

}
