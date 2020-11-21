import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AmplifyService } from 'aws-amplify-angular';
import { ToastrService } from 'ngx-toastr';
import { WindowService } from './app.service';

interface IAccount {
  email: string;
  password: string;
}

enum Screen {
  Login = 'Login',
  Verify = 'Verify',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  account: IAccount = {
    email: '',
    password: '',
  };

  screen: Screen = Screen.Login;
  screenEnum = Screen;

  errorMessage: string;
  loading: boolean;
  isVerifiedCaptcha: boolean;

  windowRef: any;
  firebase: any;
  verificationCode: string;

  constructor(
    private amplifyService: AmplifyService,
    private toastr: ToastrService,
    private win: WindowService
  ) {}

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.firebase = this.win.firebase;

    this.setFirebaseConfig();
  }

  ngAfterViewInit() {
    this.setWindowRefConfig();
  }

  setFirebaseConfig() {
    const config = {
      apiKey: 'AIzaSyB0J6Dp4r_eHVWzaK7ePxsv-2WSrht4N7c',
      authDomain: 'lyhien-ab759.firebaseapp.com',
      databaseURL: 'https://lyhien-ab759.firebaseio.com',
      projectId: 'lyhien-ab759',
      storageBucket: 'lyhien-ab759.appspot.com',
      messagingSenderId: '439086562403',
      appId: '1:439086562403:web:daf4fc4df5c364d5454c56',
      measurementId: 'G-XFP2D4VL7V',
    };
    this.firebase.default.initializeApp(config);
  }

  setWindowRefConfig() {
    const recaptchaContainerInstance = new this.firebase.default.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        callback: () => {
          this.isVerifiedCaptcha = true;
        },
      }
    );

    this.windowRef.recaptchaVerifier = recaptchaContainerInstance;

    this.windowRef.recaptchaVerifier.render();
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';

    if (!this.isValidForm) {
      return;
    }

    const { email, password } = this.account;

    try {
      const result = await this.amplifyService.auth().signIn(email, password);
      await this.sendLoginCode(result);

      this.screen = Screen.Verify;
      this.refreshForm();
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }

  async sendLoginCode(cognitoInfo) {
    console.log(cognitoInfo);
    const appVerifier = this.windowRef.recaptchaVerifier;
    const PHONE_NUMBER = `+84${cognitoInfo.username}`;

    const result = await this.firebase.default
      .auth()
      .signInWithPhoneNumber(PHONE_NUMBER, appVerifier);

    this.windowRef.confirmationResult = result;
  }

  async verifyLoginCode() {
    if (!this.verificationCode) {
      return;
    }

    this.loading = true;

    try {
      await this.windowRef.confirmationResult.confirm(this.verificationCode);

      this.showSuccess('Login is successfully !');
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.loading = false;
    }
  }

  showError(message) {
    this.toastr.error(message);
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  get isValidForm() {
    return (
      this.isVerifiedCaptcha && this.account.email && this.account.password
    );
  }

  backToLogin() {
    this.screen = Screen.Login;

    this.refreshForm();
  }

  refreshForm() {
    this.verificationCode = '';
    this.account.email = '';
    this.account.password = '';
  }
}
