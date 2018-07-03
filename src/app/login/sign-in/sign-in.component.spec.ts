import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

import { SignIn } from './sign-in.component';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../core/auth-service/auth.service';

class MockAuthService {       
  public login: Array<any>;
  public emailLogin(email, password) {
      this.login = [{ email: 'test@gmail.com', password: "test123" }]
      return new Promise (resolve => this.login);
  }
}

describe('SignIn', ()=>{
  let comp: SignIn;
  let fixture: ComponentFixture<SignIn>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(()=>{
    TestBed.configureTestingModule({
      declarations: [
        SignIn
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents().then(()=>{
      fixture = TestBed.createComponent(SignIn);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.css('.sign'));
    })
  }));

  it('should set submitted and isLoading to true', async(()=>{
    comp.signIn();
    expect(comp.submitted).toBeTruthy();
    expect(comp.isLoading).toBeTruthy()
  }))

  it('should call on signIn method', async(()=>{
    fixture.detectChanges();
    spyOn(comp, 'signIn');
    el = fixture.debugElement.query(By.css('#send')).nativeElement;
    el.click();
    expect(comp.signIn).toHaveBeenCalledTimes(0)
  }));

  it('should be invalid', async(()=>{
    comp.loginForm.controls['email'].setValue(''); 
    comp.loginForm.controls['password'].setValue(''); 
    expect(comp.loginForm.valid).toBeFalsy();
  }))

  it('should be valid', async(()=>{
    comp.loginForm.controls['email'].setValue('test@gmail.com'); 
    comp.loginForm.controls['password'].setValue('test123'); 
    expect(comp.loginForm.valid).toBeTruthy();
  }))

})