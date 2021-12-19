export const environment = {
  production: true,
  title: "Maison de la francophonie d'Ottawa – CMFO",
  
  landingTimeoutSeconds: 30,                                   // Time of inactivity before returning to landing page.
  landingVideoSrc: "data/cmfologoanimationavecmascottev3.mp4", // Can change to local: ../assets/video/cmfologoanimationavecmascottev3.mp4 Just move video from server's data folder to assets folder for client.
  landingLogoSrc: "data/home-logo.png",                        // Same as above
  landingWelcomeText: "Maison de la francophonie d'Ottawa - CMFO",
  landingCtaText: "Appuyez <span class='highlighted'>ici </span>pour activer le plan interactif du site",

  defaultFloor: "1B",
  floorButtonText: "ÉTAGE",
  bannerTitle: "Annuaire des locaux",
  bannerHint: "Sélectionnez un étage pour voir le plan",
  
  // These are local paths since these icons are sent with the app. src/assets/imgs/... Can move to server's data folder instead too.
  adaButtonTextPath: "../assets/img/ada-button.png",
  adaButtonExitPath: "../assets/img/ada-button-on.png",

  dynamicColumns: true, // Switch to one or two columns if there is not enough entries.
  columnNum: 2, // Max number of columns if dynamic else required number.
  entriesPerColumn: 20, // Max entries per column.

  scrollButtonsEnabled: true,
  scrollButtonIncrement: 100,       // How many pixels it scrolls by when a scroll button is clicked
  customMobileScrollEnabled: false,  // Tested a custom click and drag scroll, but most modern browsers support touch scrolling automatically when on a touch device so it shouldn't need to be turned on. 

  jsonApi: '/api/getJson',
  updateApi: '/api/shouldUpdate',
  updateCheckTimeSeconds: 60 * 60,       // Timer to check for updates again. Currently set to 1 hour. 
  jsonApiFloorMap: { id: 0, label: 3, imageUrl: 1 },  // What index each corresponding jsonResult maps to what target.
  jsonApiLocationMap: { id: 0, location: 1, subheader: 2, directions: 3, imageUrl: 4 } // Same as above.
};
