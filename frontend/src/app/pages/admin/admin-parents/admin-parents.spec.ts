import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminParents } from './admin-parents';

describe('AdminParents', () => {
  let component: AdminParents;
  let fixture: ComponentFixture<AdminParents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminParents]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminParents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
