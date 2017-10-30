import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

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
  beerData = {name: null, country: null};

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController, private beerService: HomeService) {
  }

  send(): void {
    this.beerService.postBeer(this.beerData, this.navCtrl).subscribe(success => {

    }, error => {

    })
  }
}
