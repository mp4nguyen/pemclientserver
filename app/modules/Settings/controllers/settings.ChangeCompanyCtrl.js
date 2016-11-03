/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Settings')
    .controller('ChangeCompanyCtrl',['Accounts','$uibModalInstance','account','CompanyFactory','$cookieStore','$log','toastr','mySharedService', function (Accounts,$uibModalInstance,account,CompanyFactory,$cookieStore,$log,toastr,sharedService) {

        $log = $log.getInstance('ocsApp.Settings.NewAccountCtrl');
        $log.debug("I am  new or edit account controller.",account);

        var that = this;
        this.companies = [];
        this.user = CompanyFactory.getCurrentUser();
        this.firstCompany = $cookieStore.get("firstCompany");
        this.companies.push({Companies: this.firstCompany});

        $cookieStore.get("companies").forEach(function(company){
          that.companies.push(company);
        });

        this.currentCompany = CompanyFactory.getCurrentCompany();
        this.companies.forEach(function(company){
          if(company.Companies.id == that.currentCompany.id){
            company.isCurrent = true;
          }else{
            company.isCurrent = false;
          }
        });

        this.selectCompany = function(company){
          $log.debug("select company = ",company,'that.currentCompany = ',that.currentCompany);

          if(company.id != that.currentCompany.id){
              that.currentCompany = company;
              CompanyFactory.setCurrentCompany(company);

              Accounts.setCompany({companyId:company.id},function(rs){
                console.log('data = ',rs);
                that.companies.forEach(function(company){
                  if(company.Companies.id == that.currentCompany.id){
                    company.isCurrent = true;
                  }else{
                    company.isCurrent = false;
                  }
                });
                CompanyFactory.init(function(data){
                  sharedService.prepForBroadcast("Refresh booking list successfully");
                  sharedService.prepForBroadcast("Refresh make booking");
                  sharedService.prepForBroadcast("Refresh packages");
                  sharedService.prepForBroadcast("Refresh positions");
                  sharedService.prepForBroadcast("Refresh settings");
                  sharedService.prepForBroadcast("Refresh navigator");
                });
              },function(err){
                console.log('error = ',err);
              });
          }
        }

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
