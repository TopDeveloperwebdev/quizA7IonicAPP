import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Import Auth0Cordova
import Auth0Cordova from '@auth0/cordova';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {

    constructor(auth: AuthService,
        private router: Router,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar) {
        auth.handleAuthentication();
        this.initializeApp();
    }

    public isMathTextVisible() {
        return this.router.url == '/' || this.router.url == '/verify';
    }


    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            // Redirect back to app after authenticating
            (window as any).handleOpenURL = (url: string) => {
                Auth0Cordova.onRedirectUri(url);
            }
        });
    }
}
