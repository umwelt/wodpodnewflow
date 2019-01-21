// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,
    firebase: {
        apiKey: "AIzaSyBMkH2FRpb-IlLFjP5msJ2zQX0X1JqTCGU",
        authDomain: "wodpod-f2086.firebaseapp.com",
        databaseURL: "https://wodpod-f2086.firebaseio.com/",
        projectId: "wodpod-f2086",
        storageBucket: "gs://wodpod-f2086.appspot.com",
        messagingSenderId: ""
    },
    mailchimp: {
        subscriberUri:"https://wodpod.us7.list-manage.com/subscribe/post",
        apiKey:"apikey 06cc32efc5602c5bf07722ac0815834d-us7",
        Curl:"https://wodpod.us7.list-manage.com/subscribe/post?u=34dca7d59614b47cdc4dde486&amp;id=da0a430276"
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
