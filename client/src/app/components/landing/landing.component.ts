import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {

  constructor() { }
  videoSrc:string = environment.landingVideoSrc;
  welcomeText:string = environment.landingWelcomeText;
  ctaText:string = environment.landingCtaText;

  ngOnInit(): void {
  }

}
