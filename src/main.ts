import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import Amplify from '@aws-amplify/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


const cognitoInfo = {
  region: 'us-east-2',
  userPoolId: 'us-east-2_XGVtMhYt8',
  userPoolWebClientId: '2nqt2ucvb3klgk1l77s95evenh',
};

Amplify.configure({
  Auth: {
    region:  cognitoInfo.region,
    userPoolId:  cognitoInfo.userPoolId,
    userPoolWebClientId: cognitoInfo.userPoolWebClientId,
  },
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
