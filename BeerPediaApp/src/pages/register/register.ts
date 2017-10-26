import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomeService } from '../home/home.provider';
import { HomePage } from '../home/home'

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  username: any;
  email: any;
  password: any;
  loadAct: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private beerService: HomeService, private storage: Storage, private loadCtrl: LoadingController) {
    // this.storage.clear();
    this.loadAct = this.loadCtrl.create();
    this.storage.get('token').then(token => {
      this.storage.get("username").then(username => {
        this.storage.get("password").then(password => {
          console.log("Token dans register: " + token);
          if (token || (username && password)) {
            this.navCtrl.push(HomePage);
          }
        });
      });
    });
  }


  register(): void {
    if (this.username && this.email && this.password) {
      this.presentLoading('Registering...');
      this.beerService.register({ "username": this.username, "email": this.email, "password": this.password }).subscribe(
        success => {
          this.loadAct.dismiss();
          console.log(success);
          this.navCtrl.push(HomePage);
        },
        error => {
          this.loadAct.dismiss();
          if (error.json().data == "User already exists") {
            this.navCtrl.push(HomePage);
          }
        }
      );
    }
  }

  presentLoading(contentString): void {
    this.loadAct = this.loadCtrl.create({
      content: contentString
    });

    this.loadAct.present();
  }
}
