import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './app.module';

describe('Router: App', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
      ],
      imports: [
        AppModule
      ]
    });
    router = TestBed.get(Router);
    router.initialNavigation();
  })

  it('navigate to "map" takes you to /map', async(() => {
    router.navigate(['map'])
    .then(() => expect(router.url).toEqual('/map'))
  }));

  it('navigate to "" redirects you to /home', async(() => {
    router.navigate([''])
    .then(() => expect(router.url).toEqual('/home'))
  }));

})