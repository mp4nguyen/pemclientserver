/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Authentication')
    .controller('AuthenMainCtrl', function () {

      this.isRedimed = false;
      this.isKaja = false;
      var plogo = getLogo();
      console.log(plogo);
      if(plogo == 'REDIMED'){
        this.isRedimed = true;
      }

      if(plogo == 'KAJA'){
        this.isKaja = true;
      }


    });
