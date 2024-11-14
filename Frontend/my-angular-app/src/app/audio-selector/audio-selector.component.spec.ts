import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSelectorComponent } from './audio-selector.component';

describe('AudioSelectorComponent', () => {
  let component: AudioSelectorComponent;
  let fixture: ComponentFixture<AudioSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioSelectorComponent]
    });
    fixture = TestBed.createComponent(AudioSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
