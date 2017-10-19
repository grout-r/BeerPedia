import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  beers: any[];
  public pullToRefresh: boolean;

  constructor(public navCtrl: NavController, private scanner: BarcodeScanner) {
    this.beers = [];
  }

  scanBarCode(): void {
    this.scanner.scan().then(res => { console.log(res) }, err => { console.log(err) });
  }

  refreshBeerList(refresher): void {
    setTimeout(() => {
      this.beers.push({ "beer_name": "toto" });
      refresher.complete();
    }, 1000);
  }
}
