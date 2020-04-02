
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { KatexModule } from 'ng-katex';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { ConfirmationModalModule } from './common/confirmation-modal/confirmation-modal.module';
import { KatexPipe } from './common/pipe/katexPipe';
import { SafeHtmlPipe } from './common/pipe/safeHtmlPipe';
import { CallbackComponent } from './components/callback/callback.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ResultComponent } from './components/result/result.component';
import { TestQuestionImageComponent } from './components/test-question-image/test-question-image.component';
import { InputTestComponent } from './components/test/input-test/input-test.component';
import { OptionsTestComponent } from './components/test/options-test/options-test.component';
import { TestAdvanceComponent } from './components/test/test-advance/test-advance.component';
import { TestQuestionComponent } from './components/test/test-question/test-question.component';
import { TestComponent } from './components/test/test.component';
import { VerifyComponent } from './components/verify/verify.component';
import { AnswersService } from './services/AnswersService';

import { AuthenticatedGuardService } from './services/auth/AuthenticatedGuardService';
import { AuthorizationService } from './services/auth/AuthorizationService';
import { KeyboardService } from './services/KeyboardService';
import { QuizService } from './services/QuizService';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { RouteReuseStrategy } from '@angular/router';

// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage';
// import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';



import { AuthService } from './services/auth/auth.service';

@NgModule({
  declarations: [AppComponent, AppComponent,
    HomeComponent,
    CallbackComponent,
    ResultComponent,
    TestComponent,
    VerifyComponent,
    InputTestComponent,
    OptionsTestComponent,
    SafeHtmlPipe,
    TestAdvanceComponent,
    TestQuestionComponent,
    TestQuestionImageComponent,
    FooterComponent,
    KatexPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(),  BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ConfirmationModalModule,
    KatexModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    IonicStorageModule.forRoot(),   
    IonicModule.forRoot(),],
  providers: [
    AuthService,
    SafariViewController,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    AuthenticatedGuardService,
    AuthorizationService,
    QuizService,
    AnswersService,
    KeyboardService,
    SafariViewController,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
