import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AguagtComponent } from './aguagt.component';

describe('AguagtComponent', () => {
  let component: AguagtComponent;
  let fixture: ComponentFixture<AguagtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AguagtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AguagtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
