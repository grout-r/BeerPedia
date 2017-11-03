import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Slides } from 'ionic-angular';
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
  registerUsername: any;
  registerEmail: any;
  registerPassword: any;
  loginUsername: any;
  loginPassword: any;
  loadAct: any;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private beerService: HomeService, private storage: Storage, private loadCtrl: LoadingController, private toastCtrl: ToastController) {
    // this.storage.clear();
    this.loadAct = this.loadCtrl.create();
    this.storage.get('token').then(token => {
      this.storage.get("username").then(username => {
        this.storage.get("password").then(password => {
          console.log("Token dans register: " + token);
          console.log("Token dans register: " + username);
          console.log("Token dans register: " + password);
          if (token || (username && password)) {
            this.loginUsername = username;
            this.loginPassword = password;
            this.goToLogin();
          }
        });
      });
    });
  }

  register(): void {
    if (this.registerUsername && this.registerEmail && this.registerPassword) {
      this.presentLoading('Registering...');
      this.beerService.register({ "username": this.registerUsername, "registerEmail": this.registerEmail, "password": this.registerPassword }).subscribe(
        success => {
          this.loadAct.dismiss();
          console.log(success);
          this.navCtrl.push(HomePage);
        },
        error => {
          this.presentToast('User already exists, please login');
          this.loadAct.dismiss();
          this.goToLogin();
        }
      );
    }
  }

  login(): void {
    if (this.loginUsername && this.loginPassword) {
      this.presentLoading('Login...');
      this.beerService.login({ "username": this.loginUsername, "password": this.loginPassword }).subscribe(
        success => {
          this.loadAct.dismiss();
          console.log(success);
          this.navCtrl.push(HomePage);
        },
        error => {
          this.loadAct.dismiss();
        }
      );
    }
  }

  goToLogin(): void {
    this.slides.slideNext();
  }

  goToRegister(): void {
    this.slides.slidePrev();
  }

  presentToast(contentString): void {
    let toast = this.toastCtrl.create({
      message: contentString,
      duration: 5000
    });
    toast.present();
  }

  presentLoading(contentString): void {
    this.loadAct = this.loadCtrl.create({
      content: contentString
    });
    this.loadAct.present();
  }
}
