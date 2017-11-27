/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NeedBuyComponent } from './need-buy.component';

describe('NeedBuyComponent', () => {
  let component: NeedBuyComponent;
  let fixture: ComponentFixture<NeedBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
