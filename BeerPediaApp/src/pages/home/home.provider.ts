import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { ToastController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class HomeService {
  // private apiUrl = "http://90.90.66.178:5000";
  private apiUrl = "http://127.0.0.1:5000";
  private registerEP = "/register";
  private loginEP = "/login";
  private getBeerEP = "/get_beer";
  private getBeersEP = "/get_beers";
  private rateBeerEP = "/rate_beer";
  private updateBeerEP = "/update_beer";
  private postBeerEP = "/post_beer";

  private token: String = undefined;

  constructor(private http: Http, private storage: Storage, private toastCtrl: ToastController) {
    this.storage.get("token").then(token => {
      this.token = token;
    });
    console.log("beerService loaded");
  }

  presentToast(contentString): void {
    let toast = this.toastCtrl.create({
      message: contentString,
      duration: 5000
    });
    toast.present();
  }

  register(dataUser): Observable<any> {
    return this.http.post(this.apiUrl + this.registerEP, { data: dataUser })
      .timeout(3000)
      .map(response => {
        let data = response.json().data;
        this.storage.set("username", dataUser.username);
        this.storage.set("password", dataUser.password);
        return data;
      });
  }

  login(dataUser): Observable<any> {
    return this.http.post(this.apiUrl + this.loginEP, { data: dataUser })
      .timeout(3000)
      .map(response => {
        let data = response.json().data;
        this.token = data.token;
        this.storage.set("token", this.token);
        this.storage.set("username", dataUser.username);
        this.storage.set("password", dataUser.password);
        return data;
      }, error => {
        console.log(error);
      });
  }

  relog(): Observable<any> {
    this.presentToast("Error joining server... Please retry");
    this.storage.get("username").then(username => {
      this.storage.get("password").then(password => {
        if (username && password) {
          console.log(username, password);
          return this.login({ username: username, password: password }).subscribe();
        }
      });
    });
    return new Observable<any>();
  }

  getBeer(beerData): Observable<any> {
    return this.http.post(this.apiUrl + this.getBeerEP, {
      token: this.token, _id: beerData
    })
      .timeout(3000)
      .map(response => {
        return response.json();
      }, error => {
      })
      .catch(error => {
        if (error.status == 403) {
          return this.relog();
        }
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
      })
      .catch(error => {
        if (error.status == 403) {
          return this.relog();
        }
      });
  }

  rateBeer(reviewData): Observable<any> {
    return this.http.post(this.apiUrl + this.rateBeerEP, {
      token: this.token, data: reviewData
    })
      .timeout(3000)
      .map(response => {
        console.log(response);
      })
      .catch(error => {
        if (error.status == 403) {
          return this.relog();
        }
      });
  }

  postBeer(dataUser, navCtrl: NavController): Observable<any> {
    return this.http.post(this.apiUrl + this.postBeerEP, { token: this.token, data: dataUser })
      .timeout(3000)
      .map(response => {
        let data = response.json().data;
        let code = response.status;
        console.log("Data received from server after login: " + data);
        console.log("Code received from server after login: " + code);
        navCtrl.pop();
      })
      .catch(error => {
        if (error.status == 403) {
          return this.relog();
        }
      });
  }
}
