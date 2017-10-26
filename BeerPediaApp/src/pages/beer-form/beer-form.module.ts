import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeerFormPage } from './beer-form';

@NgModule({
  declarations: [
    BeerFormPage,
  ],
  imports: [
    IonicPageModule.forChild(BeerFormPage),
  ],
})
export class BeerFormPageModule {}
