import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVariablesComponent } from './manage-variables.component';

describe('ManageVariablesComponent', () => {
  let component: ManageVariablesComponent;
  let fixture: ComponentFixture<ManageVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
