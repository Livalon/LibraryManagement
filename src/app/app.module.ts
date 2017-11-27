import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutHeaderComponent } from './components/layout-header/layout-header.component';
import { MenuHeaderComponent } from './components/menu-header/menu-header.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { LoginComponent } from './components/login/login.component';
import { UserInfComponent } from './components/user-inf/user-inf.component';
import { BorrowInquireComponent } from './components/borrow-inquire/borrow-inquire.component';
import { PaymentRecordComponent } from './components/payment-record/payment-record.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { NeedBuyComponent } from './components/need-buy/need-buy.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MenuComponent,
    ContentHeaderComponent,
    MainContentComponent,
    FooterComponent,
    LayoutHeaderComponent,
    MenuHeaderComponent,
    LoginComponent,
    UserInfComponent,
    BorrowInquireComponent,
    PaymentRecordComponent,
    AppointmentComponent,
    NeedBuyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // Ng2SmartTableModule,
    AppRoutingModule,
    CommonModule,
    FileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
