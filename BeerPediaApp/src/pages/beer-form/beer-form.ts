import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HomeService } from '../home/home.provider';

/**
 * Generated class for the BeerFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-beer-form',
  templateUrl: 'beer-form.html',
})

export class BeerFormPage {
  beerData = { name: null, country: null, barcode: null, rate: null, comments: [] };

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController, private scanner: BarcodeScanner, private beerService: HomeService) {
  }

  scanBarCode(): void {
    this.scanner.scan().then(res => {
      console.log(res);
      this.beerData.barcode = res.text
    }, err => {
      console.log(err)
    });
  }

  send(): void {
    if (this.beerData.name && this.beerData.country)
      this.beerService.postBeer(this.beerData, this.navCtrl).subscribe(success => {

      }, error => {

      })
  }
}
