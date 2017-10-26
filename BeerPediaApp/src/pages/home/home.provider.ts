import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class HomeService {
  // private apiUrl = "http://90.90.66.178:5000";
  // private apiUrl = "http://127.0.0.1:5000";
  private apiUrl = "http://192.168.0.46:5000";
  private registerEP = "/register";
  private loginEP = "/login";
  private getBeerEP = "/get_beer";
  private getBeersEP = "/get_beers";
  private rateBeerEP = "/rate_beer";
  private updateBeerEP = "/update_beer";
  private postBeerEP = "/post_beer";

  private token: String = undefined;

  constructor(private http: Http, private storage: Storage) {
    this.storage.get("token").then(token => {
      this.token = token;
    });
    console.log("beerService loaded");
  }

  register(dataUser): Observable<any> {
    return this.http.post(this.apiUrl + this.registerEP, { data: dataUser })
      .timeout(3000)
      .map(response => {
        console.log(response.json());
        let data = response.json().data;
        let code = response.status;
        console.log("Data received from server after register: " + data);
        console.log("Code received from server after register: " + code);
        if (code == 200) {
          this.storage.set("username", dataUser.username);
          this.storage.set("password", dataUser.password);
        }
        return data;
      }, error => {
        console.log(error.json());
        return error;
      });
  }

  login(dataUser): Observable<any> {
    return this.http.post(this.apiUrl + this.loginEP, { data: dataUser })
      .timeout(3000)
      .map(response => {
        let data = response.json().data;
        let code = response.status;
        console.log("Data received from server after login: " + data);
        console.log("Code received from server after login: " + code);
        if (code == 200) {
          this.token = data.token;
          this.storage.set("token", this.token);
          this.storage.set("username", dataUser.username);
          this.storage.set("password", dataUser.password);
        }
        return data;
      }, error => {
        console.log(error);
      });
  }

  getBeer(): Observable<any> {
    return this.http.get(this.apiUrl + this.getBeerEP)
      .timeout(3000)
      .map(response => {
        return response.json();
      }, error => {
      });
  }

  getBeers(): Observable<any> {
    return this.http.post(this.apiUrl + this.getBeersEP, {
      token: this.token
    })
      .timeout(3000)
      .map(response => {
        let data = response.json().data;
        return JSON.parse(data);
      }, error => {
        console.log("serv. err " + error);
        return error;
      });
  }

  rateBeer(): Observable<any> {
    return this.http.post(this.apiUrl + this.rateBeerEP, JSON.stringify({
      token: this.token
    }))
  }

  postBeer(dataUser): Observable<any> {
    return this.http.post(this.apiUrl + this.postBeerEP, { token: this.token, data: dataUser })
      .timeout(3000)
      .map(response => {
        let data = response.json().data;
        let code = response.status;
        console.log("Data received from server after login: " + data);
        console.log("Code received from server after login: " + code);

      }, error => {
        console.log(error);
      });
  }
}
