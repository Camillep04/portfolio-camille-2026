import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiovisuelComponent } from './audiovisuel.component';

describe('AudiovisuelComponent', () => {
  let component: AudiovisuelComponent;
  let fixture: ComponentFixture<AudiovisuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiovisuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudiovisuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
