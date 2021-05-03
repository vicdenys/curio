import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { Storage } from "@ionic/storage";
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from 'ionic-native';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ModulesPage } from '../pages/modules/modules';
import { SettingsPage } from '../pages/settings/settings';
import { StartPage } from '../pages/start/start';
import { PasswordPage } from '../pages/auth/password';
import { ResultsPage } from '../pages/results/results';
import { MoodNotSettingsPage } from '../pages/settings/notifications/mood';
import { AuthProvider} from '../providers/auth/auth';
import { ModuleProvider} from '../providers/module/module';
import { ParallaxHeaderDirective } from '../directives/parallax-header/parallax-header';
import { SleepmoduleDirective } from '../directives/sleepmodule/sleepmodule';
import { MoodmoduleDirective } from '../directives/moodmodule/moodmodule';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeStorage } from '@ionic-native/native-storage';
import { SleepNotSettingsPage } from '../pages/settings/notifications/sleep';



const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'APP_ID'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ModulesPage,
    SettingsPage,
    StartPage,
    PasswordPage,
    ParallaxHeaderDirective,
    SleepmoduleDirective,
    MoodmoduleDirective,
    ResultsPage,
    MoodNotSettingsPage,
    SleepNotSettingsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {statusbarPadding: false}),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ModulesPage,
    SettingsPage,
    StartPage,
    PasswordPage,
    ResultsPage,
    MoodNotSettingsPage,
    SleepNotSettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Network,
    ModuleProvider,
    PhotoLibrary,
    ImagePicker,
    Camera,
    Diagnostic,
    Transfer,
    File,
    DatePicker,
    LocalNotifications,
    NativeStorage,
  ]

})
export class AppModule {}
