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
  private loadedBeerList: any[];
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

  disconnect(): void {
    this.storage.remove("token").then(token => {
      this.navCtrl.pop();
    })
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

  initBeerList(): void {
    this.beers = this.loadedBeerList;
  }

  scanBarCode(): void {
    this.scanner.scan().then(res => { console.log(res) }, err => { console.log(err) });
  }

  refreshBeerList(refresher): void {
    setTimeout(() => {
      this.beerService.getBeers().subscribe(
        success => {
          this.loadAct.dismiss();
          console.log(success);
          this.loadedBeerList = success;
          this.initBeerList();
        },
        error => {
          this.loadAct.dismiss();
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
        console.log(success);
        this.loadedBeerList = success;
        this.initBeerList();
      },
      error => {
        this.loadAct.dismiss();
      }
    );
  }

  getItems(ev): void {
    this.initBeerList();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.beers = this.beers.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  searchByBarcode(): void {
    this.scanner.scan().then(res => {
      let beer = this.beers.find(item => {
        return item.barcode == res.text
      })
      if (beer) {
        this.openBeerPage(beer);
      }
    }, err => {
      console.log(err);
    })
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
