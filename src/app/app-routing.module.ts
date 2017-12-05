import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { LoginComponent} from './components/login/login.component';
import { AppointmentComponent} from './components/appointment/appointment.component';
import { BorrowInquireComponent} from './components/borrow-inquire/borrow-inquire.component';
import { NeedBuyComponent} from './components/need-buy/need-buy.component';
import { PaymentRecordComponent} from './components/payment-record/payment-record.component';
import {UserInfComponent} from './components/user-inf/user-inf.component';
import { SearchBookComponent} from "./components/search-book/search-book.component";

import {ImportResolver} from "@angular/compiler";
import { AppComponent} from "./app.component";
// import { FooterComponent } from './components/footer/footer.component';
import {BookDetailComponent} from "./components/book-detail/book-detail.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'contentheader',
    component: ContentHeaderComponent,
  },
  {
    path: 'layout',
        component : LayoutComponent,
        children: [
          {
            path: 'appointment',
            component: AppointmentComponent
          },
          {
            path: 'borrowinquire',
            component: BorrowInquireComponent
          },
          {
        path: 'needbuy',
        component: NeedBuyComponent
      },
      {
        path: 'paymentrecord',
        component: PaymentRecordComponent
      },
      {
        path: 'userinf',
        component: UserInfComponent
      },
          {
            path: 'searchbook',
            component: SearchBookComponent,

          }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'bookdetail',
    component: BookDetailComponent
  }
  // {
  //   path: '**',
  //   component: LayoutComponent
  // },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
