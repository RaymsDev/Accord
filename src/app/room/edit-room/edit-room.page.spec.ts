import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomPage } from './edit-room.page';

describe('EditRoomPage', () => {
  let component: EditRoomPage;
  let fixture: ComponentFixture<EditRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
