/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.Authentication').controller('ResetPasswordCtrl',['$state','Accounts','toastr','$log','$stateParams',function ($state,Accounts,toastr,$log,$stateParams) {
    
    $log = $log.getInstance("ocsApp.Authentication.ResetPasswordCtrl");    
    $log.debug("Hello, I am ResetPasswordCtrl",$stateParams.token);

    var that = this;
    this.loading1 = false;
    this.loading2 = false;
    this.token = $stateParams.token;
    this.showClickedValidation = false;
    

    this.reset = function() {
        $log.debug("forgot password function");
        that.showClickedValidation = true;

        if(that.form.password.$error.required){
            toastr.error('Please enter password', 'Error');
        }
        if(that.form.repassword.$error.required){
            toastr.error('Please enter re-password', 'Error');
        }


        if(that.form.$valid){
            if(that.password == that.repassword){
                $.post("https://medicalbookings.redimed.com.au:8181/api/Accounts/updatePassword?access_token="+that.token, {password:that.password}).then(function(succ){
                    $log.debug('succ',succ);
                    $log.save();
                    $state.go("authentication.login");
                }).fail(function(error){
                    $log.error('error',error);
                    if(error.statusText.indexOf("Unauthorized") >= 0){
                        toastr.error('Sorry, Time out, please reset password again!', 'Error');    
                    }else{
                        toastr.error('Sorry, Can not process to reset password, Please contact Redimed !', 'Error');    
                    }                    
                });                    
            }            
            else{
                toastr.error('Password and Re-password are not match together, Please re-enter again !', 'Error');
            }
        }else{
            $log.error("ForgotPasswordCtrl invalid",that.form.$error);                    
        }

    };

}]);

