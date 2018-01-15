// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter',['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform,$cordovaSQLite,$state,$rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    var db;
             db = $cordovaSQLite.openDB({name:"User.db", location:'default'});
            $cordovaSQLite.execute(db, 'CREATE  TABLE IF NOT EXISTS STD_USER_DETAILS  (id INTEGER PRIMARY KEY AUTOINCREMENT, USR_ID TEXT)');

    var query=  "SELECT count(*) Count FROM STD_USER_DETAILS"
                 $cordovaSQLite.execute(db, query, [])

              .then(
                   function(result) {


             var temp = result.rows.item(0).Count;
            if(temp!='0')
           {

            $state.go('app.Search',{});
           }
           else
           {

           $state.go('RegStep1',{});
           }
       /* document.getElementById('hfTemp').value="SET";*/
                   },
                   function(error) {
                   }
               );


  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('app', {
     url: '/app',
     abstract: true,
     templateUrl: 'templates/menu.html',
     cache: false

   })

   .state('RegStep1', {
          url: '/RegStep1',

              templateUrl: 'templates/RegStep1.html',
              controller: 'RegStep1Ctrl',
              cache: false

        })

      .state('app.Search', {
            url: '/Search',
               views: {
                 'menuContent': {
                   templateUrl: 'templates/Search.html',
                  controller: 'SearchCtrl',
                   cache: false
                 }
               }
             })

      .state('app.TrackerMe', {
                     url: '/TrackerMe',
                        views: {
                          'menuContent': {
                            templateUrl: 'templates/TrackerMe.html',
                            controller: 'TrackerMeCtrl',
                            cache: false
                          }
                        }
                      })

        .state('TrackerMeMap', {
                                     url: '/TrackerMeMap',

                                            templateUrl: 'templates/TrackerMeMap.html',
                                            controller: 'TrackerMeMapCtrl',
                                            cache: false

                                      })


//$urlRouterProvider.otherwise('/RegStep1');

  });
