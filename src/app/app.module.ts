import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutHeaderComponent } from './components/layout-header/layout-header.component';
import { MenuHeaderComponent } from './components/menu-header/menu-header.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MenuComponent,
    ContentHeaderComponent,
    MainContentComponent,
    FooterComponent,
    LayoutHeaderComponent,
    MenuHeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
