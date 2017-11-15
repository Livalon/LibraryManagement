import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
 import { ContentHeaderComponent } from './components/content-header/content-header.component';
// import { FooterComponent } from './components/footer/footer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'layout',
    pathMatch: 'full'
  },
  {
    path: 'contentheader',
    component: ContentHeaderComponent,
  },
  {
    path: 'layout',
    component : LayoutComponent,
  },
  {
    path: '**',
    component: LayoutComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
