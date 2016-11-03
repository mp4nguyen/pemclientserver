/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.Authentication').controller('ForgotPasswordCtrl',['$state','Accounts','toastr','$log',function ($state,Accounts,toastr,$log) {
    
    $log = $log.getInstance("ocsApp.Authentication.ForgotPasswordCtrl");    
    $log.debug("Hello, I am ForgotPasswordCtrl");

    var that = this;
    this.loading1 = false;
    this.loading2 = false;

    this.showClickedValidation = false;

    this.goBackLogin = function(){
        $log.debug("go back login...");
        $state.go('authentication.login');        
    };

    this.forgotPassword = function() {
        $log.debug("forgot password function");
        that.showClickedValidation = true;

        if(this.form.username.$error.required){
            toastr.error('Please enter username', 'Error');
        }
        if(this.form.email.$error.required){
            toastr.error('Please enter email', 'Error');
        }

        if(that.form.$valid){
            $log.debug( "login", this.username );
            Accounts.resetPassword({username: this.username, email: this.email}, function(succ) {
                that.showClickedValidation = false;
                $log.debug("Send an email to reset pass successfully !",succ);
                $log.save();
                toastr.success('Sent an email to reset the password in your email, Please check the email');       
                that.username = "";
                that.email = "";
            },function(err){
                $log.error("Send an email to reset pass  failed !",err);
                //$log.save();
                toastr.error("Wrong username or password. Please check your username or password",'Error');
            });
        }else{
            $log.error("ForgotPasswordCtrl invalid",that.form.$error);
        }

    };
}]);

