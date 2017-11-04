import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';

import { MyApp } from './app.component';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { BeerFormPage } from '../pages/beer-form/beer-form';
import { BeerPage } from '../pages/beer/beer';

import { HomeService } from '../pages/home/home.provider';

@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    HomePage,
    BeerFormPage,
    BeerPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp
      /*
   * MODIFY BOOTSTRAP CODE BELOW
   * Adds a config object that disables scrollAssist and autoFocusAssist for android only
   * https://github.com/driftyco/ionic/issues/5571
   */
      , {
        platforms: {
          android: {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          }
          // http://ionicframework.com/docs/v2/api/config/Config/)
        }
      }
      /*
       * END MODIFY
       */
    ),
    IonicStorageModule.forRoot(),
    HttpModule,
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage,
    HomePage,
    BeerFormPage,
    BeerPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScanner,
    HomeService
  ]
})
export class AppModule { }
