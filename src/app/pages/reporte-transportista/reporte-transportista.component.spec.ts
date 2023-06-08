import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTransportistaComponent } from './reporte-transportista.component';

describe('ReporteTransportistaComponent', () => {
  let component: ReporteTransportistaComponent;
  let fixture: ComponentFixture<ReporteTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTransportistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
