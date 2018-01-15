angular.module('starter.controllers', [])



.controller('RegStep1Ctrl',function($scope,$cordovaSQLite,$state,$ionicPopup,$stateParams,$timeout,$http,$ionicLoading)
{



          $scope.Register = function(MobNo,Name) {
     $scope.show($ionicLoading);
      var varWebServiceUrl = 'http://teslatech-001-site2.dtempurl.com/Revz_Transaction.asmx/';
            var varTimeOut = 10000; /* 30 Seconds */
            $http.get(varWebServiceUrl + "REVZ_RegisterUser?MOBILE=" + MobNo + "&NAME=" + Name ,{
                        timeout: varTimeOut
                     })

         .success(function(data, status, headers, config){
                            db = $cordovaSQLite.openDB({name:"User.db", location:'default'});
                             $cordovaSQLite.execute(db, 'INSERT INTO STD_USER_DETAILS (USR_ID) VALUES (?)', [data.USER_ID])
                                     .then(function(result) {
                                     if(data.RESULT=="0")
                                     {
                                     $ionicLoading.hide();
                                      var alertPopup = $ionicPopup.alert({
                                                                  title: 'User Already Exist',
                                                                  buttons: [{
                                                                      text: 'OK',
                                                                      type: 'button-assertive'
                                                                  }]
                                                              });
                                                              }
                                                              else
                                                              {
                                                              $ionicLoading.hide();
                                    var   alertPopup = $ionicPopup.alert({
                                                     title: 'User Created',
                                                     buttons: [{
                                                      text: 'OK',
                                                      type: 'button-assertive'
                                                       }]
                                                         });
                                                              }
                                      $state.go('app.Search',{});

                                       }, function(error) {
                                       $ionicLoading.hide();
                                        alert("error");
                                    })
                           })
                 .error(function(){
                 $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                           title: ' Check The Internet Connection',
                      buttons: [{
                                text: 'OK',
                                type: 'button-assertive'
                             }]
                          });
                    });
    }


            $scope.show = function() {
                                         $ionicLoading.show({
                                           template: '<p >Loading...</p><ion-spinner icon="android"></ion-spinner>'
                                         });
                                       };

           $scope.hide = function(){
             $ionicLoading.hide();
             };


})



.controller('SearchCtrl', function($scope,$state)
{
$scope.TrackIt=function(TrackId)
{

  document.getElementById('hfTrackIdFmSerach').value=TrackId;
  $state.go('TrackerMeMap',{});
}
})



.controller('TrackerMeCtrl',  function($scope,$ionicLoading,$cordovaSocialSharing, $ionicModal,$ionicPlatform,$location, $http,$timeout,$state,$ionicPopup,$cordovaSQLite,$log) {
 var Selftimer;
 var NavigationId=null;
 var VariableChecking;


   $ionicPlatform.ready(function() {
                $scope.details = [];
                                 db = $cordovaSQLite.openDB({name:"User.db", location:'default'});
                                            $cordovaSQLite.execute(db, 'SELECT * FROM STD_USER_DETAILS ')
                                                .then(

                                                           function(result) {
                                                            if (result.rows.length > 0)
                                                            {

                                                           var User_Id=result.rows.item(0).USR_ID;
                                                              $scope.details= {Userid: result.rows.item(0).USR_ID};
                                                              document.getElementById('hfUserId').value=User_Id;
                                                             TrackingFunction();



                                                            }
                                                                           },
                                                               function(error)
                                                                      {
                                                                      $scope.statusMessage = "Error on loading: " + error.message;
                                                                      }
                                                    )

                });

   document.addEventListener("offline", onOffline, false);

   function onOffline() {
             var alertPopup = $ionicPopup.alert({
                                                  title: 'No internet access',
                                                  buttons: [{
                                                      text: 'OK',
                                                      type: 'button-assertive'
                                                  }]
                                              });
                        }
   document.addEventListener("online", OnlineFun, false);

   function OnlineFun()
   {
   TrackingFunction();

   }

    function TrackingFunction()
                               {
                                $scope.show($ionicLoading);
                                 var varWebServiceUrl = 'http://teslatech-001-site2.dtempurl.com/Revz_Transaction.asmx/';
                                var varTimeOut = 8000;

                                var ValueUserId=document.getElementById('hfUserId').value;

                                return $http.get(varWebServiceUrl + "REVZ_SelectTrackingId?USR_ID=" + ValueUserId  ,{

                                                         timeout: varTimeOut
                                                       })
                                              .success(function(data, status, headers, config){
                                          $ionicLoading.hide();

                                               $scope.TrackDetail= {Trackid: data.TRACK_ID.replace(ValueUserId,'')};


                                                  })
                                                 .error(function(){
                                                 $ionicLoading.hide();
                                            var alertPopup = $ionicPopup.alert({
                                                                                                                               title: 'No internet access',
                                                                                                                               buttons: [{
                                                                                                                                   text: 'OK',
                                                                                                                                   type: 'button-assertive'
                                                                                                                               }]
                                                                                                                           });
                                                   });


                             }
    $scope.UpdateTrackDetails = function(UserId,TrackId) {
                $scope.show($ionicLoading);
         var TrackIdfull=UserId+TrackId;
                          var varWebServiceUrl = 'http://teslatech-001-site2.dtempurl.com/Revz_Transaction.asmx/';
                                  var varTimeOut = 10000; /* 30 Seconds */
                                  $http.get(varWebServiceUrl + "REVZ_UpdateTrackingID?TrackingId=" + TrackIdfull + "&USR_ID=" + UserId ,{
                                              timeout: varTimeOut
                                           })
                               .success(function(data, status, headers, config){
                               $ionicLoading.hide();

                                                           if(data.RESULT=="1")
                                                           {
                                                           TrackingFunction();
                                                            var alertPopup = $ionicPopup.alert({
                                                                                        title: 'Tracking Id Updated',
                                                                                        buttons: [{
                                                                                            text: 'OK',
                                                                                            type: 'button-assertive'
                                                                                        }]
                                                                                    });
                                                                                    }
                                                                                    else
                                                                                    {
                                                          var   alertPopup = $ionicPopup.alert({
                                                                           title: 'Something Went Wrong',
                                                                           buttons: [{
                                                                            text: 'OK',
                                                                            type: 'button-assertive'
                                                                             }]
                                                                               });
                                                                                    }


                                                 })
                                       .error(function(){
                                        $ionicLoading.hide();
                                              var alertPopup = $ionicPopup.alert({
                                                 title: ' Check The Internet Connection',
                                            buttons: [{
                                                      text: 'OK',
                                                      type: 'button-assertive'
                                                   }]
                                                });
                                          });

                 }



             $scope.show = function() {
                                                $ionicLoading.show({
                                                  template: '<p >Loading...</p><ion-spinner icon="android"></ion-spinner>'
                                                });
                                              };

                  $scope.hide = function(){
                    $ionicLoading.hide();
                    };


         $scope.WhatattsappShare=function(UserId,TrackId)
         {


           var message="Hi "+UserId+TrackId+" is my Revz Tracking Code....Track Me in Revz";
           var image=null;
           var link=null;
           $cordovaSocialSharing
             .shareViaWhatsApp(message,image, link)
             .then(function(result) {

             }, function(err) {
               var   alertPopup = $ionicPopup.alert({
                                            title:  'Something Went Wrong',
                                            buttons: [{
                                            text:    'OK',
                                            type:    'button-assertive'
                                                          }]
                                                      });
             });

         }


      $scope.TrackerOn=function()
      {
      funTrackerOn();

      }

       function funTrackerOn()
            {
       ionic.Platform.ready(function(){
          cordova.plugins.locationAccuracy.canRequest(function(canRequest){
              if(canRequest){
                  cordova.plugins.locationAccuracy.request(function (success){
                      console.log("Successfully requested accuracy: "+success.message);
                  }, function (error){
                     console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
                     if(error.code == cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                         if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                             cordova.plugins.diagnostic.switchToLocationSettings();
                         }
                     }
                  }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
              }
          });

         });



        var confirmPopup = $ionicPopup.confirm({
                       title: 'TRACK IN BACKGROUND MODE '
                      // template: 'Track in background mode'
                    });

        confirmPopup.then(function(res) {
                       if(res) {
                    cordova.plugins.backgroundMode.enable();
                       // or
                       cordova.plugins.backgroundMode.setEnabled(true);
                       //cordova.plugins.backgroundMode.overrideBackButton();

                       cordova.plugins.backgroundMode.on('activate', function() {
                          cordova.plugins.backgroundMode.disableWebViewOptimizations();
                       });

                       cordova.plugins.backgroundMode.setDefaults({
                           title: 'REVZ',
                           text: 'Revz Tracker is On ',
                            // this will look for icon.png in platforms/android/res/drawable|mipmap
                           // hex format like 'F14F4D'
                           resume: true,

                           bigText: true
                       });
                       cordova.plugins.backgroundMode.moveToBackground();
                        GeolocationUpdate();
                         var TrackUid=document.getElementById('hfUserId').value;

                       } else {
                          GeolocationUpdate();
                         var TrackUid=document.getElementById('hfUserId').value;
                       }
                    });




         function GeolocationUpdate()
            {
             if( VariableChecking==1)
               {
                function onSuccess(position) {
                    if( VariableChecking==1)
                      {
                       var TrackUid=document.getElementById('hfUserId').value;
                       var LocationUpdateUrl = 'http://teslatech-001-site2.dtempurl.com/Revz_Transaction.asmx/';
                       var LocationUpdatTimeOut = 6000; /* 30 Seconds */
                       var hlat = position.coords.latitude;
                       var hlong = position.coords.longitude;

                                                              //    alert(LocationUpdateUrl + "REVZ_UpdateLatLon?latitude=" + hlat +"&longitude=" +hlong+"&USR_ID="+TrackUid)
                        $http.get(LocationUpdateUrl + "REVZ_UpdateLatLon?latitude=" + hlat +"&longitude=" +hlong+"&USR_ID="+TrackUid,{

                                                                                                               timeout: LocationUpdatTimeOut
                                      })
                                      .success(function(data, status, headers, config){

                                               })
                                      .error(function(){

                                                });

                       }
            };
            function onError(error) {
               alert('code: '    + error.code    + '\n' +
                     'message: ' + error.message + '\n');
             }
             NavigationId=  navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });

             Selftimer= $timeout(GeolocationUpdate, 4000);
                  }
             }

         }
         var vm = this;
         vm.turnClearAppData = 'Off';
         $scope.showConfirm = function(val) {

                 if ( val === 'On')
                    {
                           VariableChecking=1;
                           funTrackerOn();
                    }

                 if ( val === 'Off')
                   {
                   VariableChecking=2;


                  }
          };



})


.controller('TrackerMeMapCtrl',function($scope,$http,$location,$ionicPlatform,$state,$timeout)
{
var timer;
var timer1 ;



$scope.$on("$ionicView.afterLeave", function(event, data){
   $timeout.cancel(timer);
   $timeout.cancel(timer1);
});
 //map.setCenter(newPoint);
 var deregisterSecond = $ionicPlatform.registerBackButtonAction(function(e){

    $timeout.cancel(timer);
    $timeout.cancel(timer1);
    if ($state.is('TrackMap')) {

    $state.go('app.ChildDetails');
    }
    if ($state.is('app.ChildDetails')) {

        $state.go('app.MainSearch');
     }
    if($state.is('app.MainSearch')){

        navigator.app.exitApp();
      }
    if($state.is('TrackerMeMap')){

            $state.go('app.Search');
     }

   //  return false;
    },101);
 $scope.$on('$destroy', deregisterSecond);

  $scope.$on('$ionicView.enter', function () {

    var varWebServiceUrl2 = 'http://teslatech-001-site2.dtempurl.com/Revz_Transaction.asmx/';
                                var varTimeOut2 = 8000;
                                var Trackid=document.getElementById('hfTrackIdFmSerach').value;

                                    $http.get(varWebServiceUrl2 + "REVZ_SelUserBasedTrkID?TRACK_ID=" + Trackid  ,{
                                                timeout: varTimeOut2
                                                       })
                                              .success(function(data, status, headers, config){
                                             // alert(data.CHI_NAME);
                                                LoadMapBasedOnName(data.USER_NAME)

                                                  })
                                                 .error(function(){

                                                  /* var alertPopup = $ionicPopup.alert({
                                                                                title: 'No internet access',
                                                                                buttons: [{
                                                                                text: 'OK',
                                                                                type: 'button-assertive'
                                                                                          }]
                                                                                });*/
                                                   });


function LoadMapBasedOnName(Child_Name)
{
var div = document.getElementById("map_canvas1");
var map = plugin.google.maps.Map.getMap(div);
 map.setMapTypeId(plugin.google.maps.event.MAP_READY);
     // Add a marker
     map.clear();
     map.one(plugin.google.maps.event.MAP_READY, function() {
     alert("cdd");
     map.addMarker({
       'position': {
         lat: 0,
         lng: 0
       },

       'title': Child_Name
     }, function(marker) {

     map.setCameraZoom(14);

       // Show the infoWindow.
       marker.showInfoWindow();


         TrackerUpdate();
         function TrackerUpdate()
                   {

//alert("5"); var LocationUpdateUrl = 'http://teslatech-001-site2.dtempurl.com/Revz_Transaction.asmx/';
                          var LocationUpdateUrl = 'http://revzwebservice.online/RevzWebservice.asmx/';
                                               var LocationUpdatTimeOut = 8000; /* 30 Seconds */
                                              // var Trackid=document.getElementById('hfTrackIdFmSerach').value;
                                              var Trackid="";

                                      $http.get(LocationUpdateUrl + "REVZ_SelectLATLON?TRACKING_ID=" + Trackid ,{
                                       timeout: LocationUpdatTimeOut
                                             })
                                            .success(function(data, status, headers, config){


                                             marker.setPosition({
                                                       lat: data.TRK_LAT,
                                                       lng: data.TRK_LON
                                                     });
                                                    map.setCameraTarget({
                                                         lat: data.TRK_LAT,
                                                      lng: data.TRK_LON
                                                  });
                                                   // map.setZoom(16);
                                           })
                                            .error(function(){

                                              });
                     timer= $timeout(TrackerUpdate, 2000);
                   };

       });

});
}
   });




})






;


