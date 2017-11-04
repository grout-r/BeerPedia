import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController, Slides } from 'ionic-angular';
import { Ionic2Rating } from 'ionic2-rating';
import { HomeService } from '../home/home.provider';

/**
 * Generated class for the BeerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-beer',
  templateUrl: 'beer.html',
})

export class BeerPage {
  id: number;
  name: string;
  beer = {comments:[], rate: {avg: 0}};
  avg = 0;
  rate = 0;
  comment = "";
  private loadAct: Loading;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController, private beerService: HomeService, private toastCtrl: ToastController) {
    this.id = navParams.get('id');
    this.name = navParams.get('name');
    this.presentLoading('Fetching beer data...');
    this.beerService.getBeer(this.id).subscribe(success => {
      this.loadAct.dismiss();
      console.log(success);
      this.beer = success;
      this.avg = (this.beer.rate) ? this.beer.rate.avg : 0;
    }, error => {
      this.loadAct.dismiss();
    })
  }

  sendReview(): void {
    let review = { _id: this.id, rate: null, comment: null };
    if (this.rate != 0) {
      review.rate = this.rate;
    }
    if (this.comment != "") {
      review.comment = this.comment;
    }
    this.presentLoading('Posting your review...');
    this.beerService.rateBeer(review).subscribe(success => {
      this.loadAct.dismiss();
      this.presentToast('Your review has been sent!');
    }, error => {
      this.loadAct.dismiss();
    })
  }

  rateValue(ev): void {
    this.moveToComment();
  }

  moveToComment(): void {
    this.slides.slideNext();
  }

  presentLoading(contentString): void {
    this.loadAct = this.loadCtrl.create({
      content: contentString
    });
    this.loadAct.present();
  }

  presentToast(contentString): void {
    let toast = this.toastCtrl.create({
      message: contentString,
      duration: 5000
    });
    toast.present();
  }
}
