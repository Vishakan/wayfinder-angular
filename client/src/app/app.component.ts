import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from './services/api.service';

declare interface Floor {
  buttonLabel: string;
  id: string;
  imageUrl: string;
}

declare interface Location {
  id: string;
  location:string;
  subheader: string;
  directions: string;
  imageUrl: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private api:ApiService) { // Pre-init
      let tab = document.querySelector('title');
      if (tab && environment.title) tab.innerText = environment.title;
  }

  private timeoutCount:number = 0;
  private updateCount:number = 0;

  showLanding:boolean = true;
  adaEnabled:boolean = false;
  

  floorData:{[key:string]:Floor} = {};
  locationData:{[key:string]:Location[]} = {}
  fullLocationData:Location[] = [];
  locationDisplayData:Location[][] = [];

  selectedFloor:string = environment.defaultFloor;
  selectedLetter:string = "";
  popoverTarget:Location | null = null;

  floorButtonText:string = environment.floorButtonText;
  bannerTitle:string = environment.bannerTitle;
  bannerHint:string = environment.bannerHint;
  adaButtonSrc:string = environment.adaButtonTextPath;
  adaExitSrc: string = environment.adaButtonExitPath;

  scrollButtonEnabled: boolean = environment.scrollButtonsEnabled;
  customMobileScrollEnabled:boolean = environment.customMobileScrollEnabled;
  canScrollDown:boolean = true;
  canScrollUp:boolean = false;

  htmlScrollDirectory:HTMLElement | null = null;
  
  ngOnInit():void { 
    // Check for updates.
    this.api.checkUpdates();
    this.api.getJsonData().subscribe(result => { // Pull JSON data.
      let floorArr:string[][] = result.valueRanges[0].values;
      let letterArr:string[][] = result.valueRanges[1].values; 
      let floorMap:{[key:string]:number} = environment.jsonApiFloorMap;
      let letterMap:{[key:string]:number} = environment.jsonApiLocationMap;
      floorArr.slice(1).map((data:string[]) => { // Floor Map
        if (data[floorMap.label] !== "") this.floorData[data[floorMap.label]] = {buttonLabel: data[floorMap.label], id: data[floorMap.id], imageUrl: data[floorMap.imageUrl]};
      });
      [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((c:string) => { // Init with empty lists.
        this.locationData[c] = [];
      });
      letterArr.slice(1).map((data:string[]) => { // Fill those lists with data.
        let x = {id: data[letterMap.id], location: data[letterMap.location], subheader: data[letterMap.subheader], directions: data[letterMap.directions], imageUrl: data[letterMap.imageUrl]};
        if (data[letterMap.id] !== "") { 
          this.locationData[data[0]].push(x);
          this.fullLocationData.push(x);
        }
      });
    });
    setInterval(()=> {
      this.timeoutCount++;
      this.updateCount++;
      if (this.timeoutCount >= environment.landingTimeoutSeconds) this.resetApp();
      if (this.updateCount >= environment.updateCheckTimeSeconds) { this.updateCount = 0; this.api.checkUpdates(); }
    }, 1000);
  }

  // Helper Functions
  resetApp():void {
    this.timeoutCount = 0;
    this.selectedFloor = environment.defaultFloor;
    this.selectedLetter = "";
    this.popoverTarget = null;
    this.showLanding = true;
    if (this.htmlScrollDirectory) this.htmlScrollDirectory.scrollTop = 0;
    this.canScrollUp = false;
  }
  timerReset():void {
    this.timeoutCount = 0;
  }
  updateLocations():void {   // Help Update Locations to display for getLocations()
    let raw:Location[] = (this.selectedLetter)? this.locationData[this.selectedLetter] : this.fullLocationData;
    let res:Location[][] = [];
    let num:number = environment.entriesPerColumn
    while (raw.length > 0 || (!environment.dynamicColumns && environment.columnNum > res.length)) {
      if (raw.length > num) {
        res.push(raw.slice(0, num));
        raw = raw.slice(num);
      } else {
        while (raw.length < environment.entriesPerColumn && res.length >= 1) {
          raw.push({ id: "", location:"", subheader: "", directions: "", imageUrl: ""});
        }
        res.push(raw.slice(0, raw.length));
        raw = raw.slice(raw.length);
      }
    }
    this.locationDisplayData = res;
    if (this.htmlScrollDirectory) this.htmlScrollDirectory.scrollTop = 0; // Should start at top.
    setTimeout(()=>this.checkScroll(),100); // Check if can scroll on new directory list. if its too small to scroll remove buttons.
  } 
  checkScroll() { // Check if user is able to scroll and which directions are available. 
    if (!this.htmlScrollDirectory) this.htmlScrollDirectory = document.querySelector('#directory');
    if (this.htmlScrollDirectory) {
      this.canScrollDown = !(this.htmlScrollDirectory.scrollTop === this.htmlScrollDirectory.scrollHeight - this.htmlScrollDirectory.offsetHeight);
      this.canScrollUp =  !(this.htmlScrollDirectory.scrollTop === 0);
    }
  }

  // DOM gets
  getFloors():string[] {
    return Object.keys(this.floorData).sort((a,b) => { return a >= b? 1 : -1});
  }
  getLetters():string[] {
    return Object.keys(this.locationData);
  }
  getLocations():Location[][] {
    return this.locationDisplayData;
  }
  getMapUrl():string {
    if (this.popoverTarget) return 'url('+this.popoverTarget.imageUrl+')';
    else if (this.floorData && this.floorData[this.selectedFloor]) return 'url('+this.floorData[this.selectedFloor].imageUrl+')';
    else return "";
  }
  showPopover():boolean {
    return (this.popoverTarget !== null);
  }

  // DOM output functions
  changeFloor(selectedFloor:string):void {
    this.selectedFloor = selectedFloor;
  }
  changeLetter(letter:string):void {
    if (letter === this.selectedLetter) this.selectedLetter = "";
    else this.selectedLetter = letter;
    this.updateLocations();
  }
  toggleAda():void {
    this.adaEnabled = !this.adaEnabled;
  }
  onLandingClick():void {
    this.showLanding = false;
    this.updateLocations();
  }
  onLocationClick(target:Location):void {
    if (target.id === "") return;
    this.popoverTarget = target;
  }
  onPopoverExitClick():void {
    this.popoverTarget = null;
  }
  onScrollArrowClick(event:MouseEvent, direction:'up'|'down'|'reset'):void {
    if (!this.htmlScrollDirectory) this.htmlScrollDirectory = document.querySelector('#directory');
    this.stopPropogation(event);
    if (this.htmlScrollDirectory) {
      this.htmlScrollDirectory.scrollTo({top: this.htmlScrollDirectory.scrollTop + (direction==='up'? -environment.scrollButtonIncrement : environment.scrollButtonIncrement), behavior: 'smooth' });
    }
  }
  stopPropogation(event:MouseEvent):void {
    event.stopPropagation();
    this.timerReset();
  }


  //Touch scrolling custom
  private track: boolean = false;
  private prevClientY: number = 0;
  mouseDown(mouse:MouseEvent):void {
    if (!this.customMobileScrollEnabled) return;
    if (!this.htmlScrollDirectory) this.htmlScrollDirectory = document.querySelector('#directory');
    this.track = true;
    this.prevClientY = mouse.clientY;
  }
  mouseUp():void {
    if (!this.customMobileScrollEnabled) return;
    this.track = false;
  }
  mouseMove(mouse:MouseEvent):void {
    if (!this.customMobileScrollEnabled || !this.track) return;
    let dif = this.prevClientY - mouse.clientY;
    if (this.htmlScrollDirectory) {
      this.htmlScrollDirectory.scrollTo({top: this.htmlScrollDirectory.scrollTop + dif, behavior: 'smooth' });
    }
  }
}
