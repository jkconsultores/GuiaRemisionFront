import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaTransportistaComponent } from './guia-transportista.component';

describe('GuiaTransportistaComponent', () => {
  let component: GuiaTransportistaComponent;
  let fixture: ComponentFixture<GuiaTransportistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuiaTransportistaComponent]
    });
    fixture = TestBed.createComponent(GuiaTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
