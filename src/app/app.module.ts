import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AmplifyService } from 'aws-amplify-angular';
import { AmplifyModules } from 'aws-amplify-angular/dist/src/providers';
import Auth from '@aws-amplify/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    {
      provide: AmplifyService,
      useFactory: () => {
        return AmplifyModules({
          Auth,
        });
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
