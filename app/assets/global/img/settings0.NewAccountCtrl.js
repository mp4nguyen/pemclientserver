/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Settings')
    .controller('NewAccountCtrl',['Accounts','$uibModalInstance','account','CompanyFactory','$cookieStore','$log','toastr', function (Accounts,$uibModalInstance,account,CompanyFactory,$cookieStore,$log,toastr) {

        $log = $log.getInstance('ocsApp.Settings.NewAccountCtrl');
        $log.debug("I am  new or edit account controller.",account);

        var that = this;
        this.user = $cookieStore.get("user");
        this.isSubmitted = false;
        this.form = {};
        this.companyObject = {};
        this.companyId = CompanyFactory.getCompanyId();
        this.accountObj = {};
        this.companies = [];
        $log.debug("current user = ",this.user);

        CompanyFactory.getCompany(function(data){
            console.log("New Account, get company info = ",data);
            that.companies = data.subsidiaries;
        });


        this.isAdmin = function(){
            return !account && that.user.userType.indexOf('RediMed') >= 0 ? true:false;
        }

        if(account){
            this.accountObj = account;
        }else{
            this.accountObj.isproject = 0;
            this.accountObj.iscalendar = 0;
            this.accountObj.isall = 0;
            this.accountObj.isenable = 0;
            this.accountObj.ismakebooking = 0;
            this.accountObj.isbooking = 0;
            this.accountObj.ispackage = 0;
            this.accountObj.isposition = 0;
            this.accountObj.issetting = 0;
            this.accountObj.isallcompanydata = 0;
        }

        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
        });

        this.isOpenCheckBoxControl = function(){
            //if true; display checkbox control to set the permission for user

            if(that.user.isall == 1){
                return true;
            }else{
                return that.user.issetting == 1?true:false;
            }
        };

        this.isPassRequire = function(){
            return account!=null?false:true;
        };

        this.emailChanged = function(email){

            that.accountObj.invoiceemail =   email;
            that.accountObj.resultEmail =   email;
        };

        this.ok = function () {
            that.isSubmitted = true;
            if(that.form.$valid){
                //Update Position if position is an object
                //If position = null, it means that it is new object
                if(account){
                    if(that.accountObj.password == ''){
                        delete that.accountObj.password;
                    }

                    $log.debug("will update this",that.accountObj);
                    Accounts.updateAccount(that.accountObj,function(res){
                        console.log("updated account",res);
                        $uibModalInstance.close({});
                    },function(err){
                        $log.error("Fail to update an account",err);
                        toastr.error("Fail to update an account ! Err:" + err.data.error.message);
                    });

                }else{
                    that.accountObj.id = -1;
                    //if acc is a redimed, will open the company list to select , so not assign the companyId of the current user
                    if(!that.accountObj.companyId){
                        that.accountObj.companyId = that.companyId;
                    }
                    that.accountObj.userType = 'Company';
                    $log.debug("will add this",that.accountObj);

                    Accounts.updateAccount(that.accountObj,function(rs){
                        console.log("After new acc = ",rs);
                        $uibModalInstance.close({});
                    },function(err){
                        $log.error("Fail to create an new account",err);
                        toastr.error("Fail to create an new account ! Err:" + err.data.error.message);
                    })
                }
            }else{
                $log.debug("there is error in UI",that.form.$error);
            }
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
