import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

// Import AUTH_CONFIG, Auth0Cordova, and auth0.js
import { AUTH_CONFIG } from './auth.config';
import Auth0Cordova from '@auth0/cordova';
import * as auth0 from 'auth0-js';

declare let cordova: any;

@Injectable()
export class AuthService {
    Auth0 = new auth0.WebAuth(AUTH_CONFIG);
    Client = new Auth0Cordova(AUTH_CONFIG);

    user: any;
    loggedIn: boolean;
    loading = true;
    private _idToken: string;
    private _accessToken: string;
    private _expiresAt: number;

    private isAuthenticating: boolean;
    public authenticated: EventEmitter<boolean> = new EventEmitter();
    constructor(    public zone: NgZone,
        private storage: Storage,
        private safariViewController: SafariViewController) {
        this.isAuthenticating = false;
        
    }

    get accessToken(): string {
        return this._accessToken;
    }

    get idToken(): string {
        return this._idToken;
    }



    login() {
        this.loading = true;
        const options = {
            scope: 'openid profile offline_access'
        };
        // Authorize login request with Auth0: open login page and get auth results
        this.Client.authorize(options, (err, authResult) => {
            if (err) {
                this.zone.run(() => this.loading = false);
                throw err;
            }
            // Set access token
            this.storage.set('access_token', authResult.accessToken);
            this._accessToken = authResult.accessToken;
            // Set access token expiration
            const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            this.storage.set('expires_at', expiresAt);
            // Set logged in
            this.loading = false;
            this.loggedIn = true;
            // Fetch user's profile info
            this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
                if (err) {
                    throw err;
                }
                this.storage.set('profile', profile).then(val =>
                    this.zone.run(() => this.user = profile)
                );
            });
        });
    }


    public notifyAuth(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // if is authenticating wait for it
            if (this.isAuthenticating) {
                this.authenticated.subscribe(
                    (auth: boolean) => { resolve(auth); },
                    (err: Error) => { reject(err); }
                );
            } else {
                resolve(this.isAuthenticated());
            }
        });
    }

    public handleAuthentication() {
        if (!this.isAuthenticated()) {
            this.isAuthenticating = true;
            const options = {
                scope: 'openid profile offline_access'
            };
            // Authorize login request with Auth0: open login page and get auth results
            this.Client.authorize(options, (err, authResult) => {
                if (err) {
                    this.isAuthenticating = false;
                    console.log(err);
                    this.authenticated.next(false);
                } else if (authResult && authResult.accessToken) {
                    this.isAuthenticating = false;
                    this.localLogin(authResult);
                    this.authenticated.next(true);
                } else {
                    this.isAuthenticating = false;
                    this.authenticated.next(false);
                }
            });
        }
    }

    private localLogin(authResult): void {
        const expiresAt = (authResult.expiresIn * 1000) + Date.now();
        this._accessToken = authResult.accessToken;
        this._idToken = authResult.idToken;
        this._expiresAt = expiresAt;

        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('idToken', authResult.idToken);
        localStorage.setItem('expiresAt', <any>expiresAt);
    }

    public isAuthenticated(): boolean {
        if (!this._accessToken) {
            this._accessToken = localStorage.getItem('access_token');
        }
        if (!this._idToken) {
            this._idToken = localStorage.getItem('idToken');
        }
        if (!this._expiresAt) {
            this._expiresAt = parseInt(localStorage.getItem('expiresAt'));
        }
        return this._accessToken && Date.now() < this._expiresAt;
    }

    logout() {
        this._accessToken = null;
        this.user = null;
        this.loggedIn = false;
        this.safariViewController.isAvailable()
            .then((available: boolean) => {
                const auth0Domain = AUTH_CONFIG.domain;
                const clientId = AUTH_CONFIG.clientId;
                const pkgId = AUTH_CONFIG.packageIdentifier;
                let url = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${pkgId}://${auth0Domain}/cordova/${pkgId}/callback`;
                if (available) {
                    this.safariViewController.show({
                        url: url
                    })
                        .subscribe((result: any) => {
                            if (result.event === 'opened') console.log('Opened');
                            else if (result.event === 'closed') console.log('Closed');

                            if (result.event === 'loaded') {
                                console.log('Loaded');
                                this.storage.remove('profile');
                                this.storage.remove('access_token');
                                this.storage.remove('expires_at');
                                this.safariViewController.hide();
                            }
                        },
                            (error: any) => console.error(error)
                        );
                } else {
                    // use fallback browser
                    cordova.InAppBrowser.open(url, '_system');
                }
            }
            );
    }

}



