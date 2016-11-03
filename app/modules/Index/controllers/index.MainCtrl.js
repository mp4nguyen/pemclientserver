/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp')
    .controller('IndexMainCtrl',['$log','mySharedService','$scope','SetClassService','$location', function ($log,sharedService,$scope,SetClassService,$location) {
        $log = $log.getInstance("ocsApp.IndexMainCtrl");
        $log.debug("Hello, I am index controller and url = " + $location.path());
        this.className = 0;
        var that = this;

        this.className = SetClassService.getClass();

        //if the link is the booking form => set class of main page 
        if($location.path().indexOf('bookingForm') > 0){
          this.className = 2;
        }
        //listen to the mainCtrl and navigator.MainCtrl , if login/logout successfully, the mainCtrl will send a msg to the indexCtrl.
        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from LoginCrtl/navigator.MainCtrl = " + msg);
            if(msg.indexOf("Login successfully")>= 0 || msg.indexOf("Logout successfully")>= 0){
                //change body class if login successfully
                that.changeIt();
            }
        });

        this.changeIt = function(){
            if(this.className == 1){
                this.className = 0;
            }
            else {
                this.className = 1;
            }
            $log.debug("changeIt className to  " + this.className );
        };
        //{0:'login', 1:'page-container-bg-solid page-boxed',2:'three'}[indexCtrl.className]
    }]);
