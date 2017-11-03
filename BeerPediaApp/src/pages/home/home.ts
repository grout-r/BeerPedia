import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';

import { BeerFormPage } from '../beer-form/beer-form';
import { BeerPage } from '../beer/beer';
import { HomeService } from './home.provider';

@Component({
  selector: 'page-beer',
  templateUrl: 'home.html'
})

export class HomePage {
  private beers: any[];
  private loadAct: Loading;
  addBeerPage = BeerFormPage;

  constructor(public navCtrl: NavController, private beerService: HomeService, private scanner: BarcodeScanner, private alertCtrl: AlertController, private loadCtrl: LoadingController, private storage: Storage) {
    this.beers = [];
    this.loadAct = this.loadCtrl.create();
    this.storage.get('token').then(token => {
      if (!token) {
        this.login();
      }
    });
  }

  ionViewDidEnter() {
    this.refreshAutoBeerList();
  }

  login(): void {
    this.storage.get("username").then(username => {
      this.storage.get("password").then(password => {
        if (username && password) {
          this.presentLoading('Login...');
          this.beerService.login({ username: username, password: password }).subscribe(
            success => {
              this.loadAct.dismiss();
              this.refreshAutoBeerList();
            }, error => {
              console.log(error);
              this.loadAct.dismiss();
            }
          );
        } else {
          this.presentLoginAlert();
        }
      })
    });
  }

  scanBarCode(): void {
    this.scanner.scan().then(res => { console.log(res) }, err => { console.log(err) });
  }

  refreshBeerList(refresher): void {
    setTimeout(() => {
      this.beerService.getBeers().subscribe(
        success => {
          this.loadAct.dismiss();
          console.log(success); this.beers = success;
        },
        error => {
          this.loadAct.dismiss();
          console.log("sub error " + error)
        }
      );
      refresher.complete();
    }, 3000);
  }

  refreshAutoBeerList(): void {
    this.presentLoading('Refreshing beers list...');
    this.beerService.getBeers().subscribe(
      success => {
        this.loadAct.dismiss();
        console.log(success); this.beers = success;
      },
      error => {
        this.loadAct.dismiss();
        console.log("sub error " + error);
      }
    );
  }

  presentLoginAlert(): boolean {
    let user = undefined, pass = undefined;
    this.storage.get("username").then(username => user = username);
    this.storage.get("password").then(password => pass = password);
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username',
          value: user,
        }, {
          name: 'password',
          placeholder: 'Password',
          value: pass,
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Login',
          handler: data => {
            if (data.username && data.password) {
              // let test;
              this.presentLoading('Login...');
              this.beerService.login(data).subscribe(
                success => {
                  this.loadAct.dismiss();
                  return true;
                }, error => {
                  this.loadAct.dismiss();
                  return false;
                }
              );
              // return test;
            } else {
              // invalid login
              return false;
            }
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
    return true;
  }

  openBeerPage(beer: any): void {
    this.navCtrl.push(BeerPage, { id: beer._id.$oid, name: beer.name });
  }

  presentLoading(contentString): void {
    this.loadAct = this.loadCtrl.create({
      content: contentString
    });

    this.loadAct.present();
  }
}
