/**
/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.Authentication').controller('LoginCtrl',['$state','Accounts','toastr','$cookieStore','CompanyFactory','RedimedSiteFactory','$log','mySharedService','storeToken','mySocket',function ($state,Accounts,toastr,$cookieStore,CompanyFactory,RedimedSiteFactory, $log,sharedService,storeToken,mySocket) {
    $log = $log.getInstance("ocsApp.Authentication.LoginCtrl");

    var that = this;
    this.loading1 = false;
    this.loading2 = false;


    this.showClickedValidation = false;

    this.login = function() {

        this.showClickedValidation = true;

        if(this.loginForm.username.$error.required){
            toastr.error('Please enter username', 'Error');
        }
        if(this.loginForm.password.$error.required){
            toastr.error('Please enter password', 'Error');
        }

        if(that.loginForm.$valid){
            $log.debug( "login", this.username );

            mySocket.emit('msg',{message:'will login into the system with account = '+this.username+' and password = '+this.password});
            Accounts.login({username: this.username, password: this.password}, function(succ,s2) {
                CompanyFactory.setCurrentCompany(succ.user.Company);
                CompanyFactory.setCurrentUser(succ.user);
                that.loading1 = true;
                that.loading2 = true;

                $cookieStore.put('firstCompany',succ.user.Company);
                $cookieStore.put('companies',succ.user.AccountCompanies);
                $log.setUser(succ.user)
                $log.setAccessToken(succ.id)
                $log.debug("Login successfully !",succ.user)
                storeToken.setAccessToken(succ.id);

                //Loading all need information for the user
                CompanyFactory.init(function(data){
                    that.loading1 = false;
                    mySocket.emit('login',{message: 'Login successfully',userName: succ.user.username,userId: succ.user.id,companyId:succ.user.companyId,companyName: data.companyName});
                    RedimedSiteFactory.getSite(function(data){
                        that.loading2 = false;
                        //After loading company infor and redimed site, go to main screen
                        if(!that.loading1 && !that.loading2){
                            /// notify to IndexMainCtrl and let it change the Class of body on HTML
                            sharedService.prepForBroadcast("Login successfully");
                            $state.go('navigator');
                        }
                    });
                });


                //var user = $cookieStore.get('user');
                //console.log("user = ",user);

            },function(err){
                $log.error("Login failed !",err);
                //$log.save();
                if(err.statusText.indexOf('Unauthorized')>=0){
                    toastr.error("Wrong username or password. Please check your username or password",'Error');
                }else{
                    toastr.error("Cannot connect to the server. Please refesh your browser !",'Error');
                }

            });
        }else{
            $log.error("form is invalid",that.loginForm.$error);
        }
    };
}]);
