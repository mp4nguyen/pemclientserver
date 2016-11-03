/**
 * Created by phuongnguyen on 26/02/16.
 */
angular.module('ocsApp.Companies')
    .factory("CompanyModuleFactory",["Companies","$log","toastr","$rootScope","$state",function(Companies,$log,toastr,$rootScope,$state){
        $log = $log.getInstance("ocsApp.Companies.CompanyModuleFactory");
        var companies = null;
        var message = '';
        var getCompanyFromServer = function(cb){
            Companies.find({filter:{include:'subsidiaries'}},function(data){
                console.log("Get company from server",data);
                companies = data;
                cb(companies)
            });
        };

        return {
            getMasterRows:function(cb){
                if(companies){
                    console.log("Get company from memory",companies);
                    cb(companies);
                }else{
                    getCompanyFromServer(cb);
                }
            },
            refreshMasterRows:function(cb){
                getCompanyFromServer(cb);
            },
            getMasterRow:function(id){

                function get_type(thing){
                    if(thing===null)return "[object Null]"; // special case
                    return Object.prototype.toString.call(thing);
                }

                if(companies){
                    var company = companies[_.findIndex(companies, 'id', id)];
                    //console.log("get_type = ",get_type(id),get_type(companies[0].id));
                    console.log("get company from memory= ",id,company,companies);

                    return company;
                }else{
                    return {};
                }
            },
            deleteMasterRow:function(row){
                var that = this;
                $log.debug("This is a custom closeDeleteModal function",row);
                Companies.deleteById({id:row.id},function(result){
                    console.log(result);
                    $log.debug("Successfully delete company",result);
                    that.refreshMasterRows(function(data){
                        that.masterDetailBroadcast('Delete Master Successfully');
                    });
                },function(err){
                    $log.error("Fail to delete company",err);
                    toastr.error("Fail to delete the company. " + err.data.error.message,"error");
                });
            },
            masterDetailBroadcast:function(msg){
                message = msg;
                $rootScope.$broadcast('MasterDetailBroadcast');
            },
            getMessage:function(){
                return message;
            },
            saveMaster:function(row){
                var that = this;
                if(row.id){
                    $log.debug("will update company",row);

                    if(row.defaultStatusObject){
                        row.defaultStatus = row.defaultStatusObject.bookingStatus;
                    }

                    Companies.update({where:{"id":row.id}},row,function(res){
                        $log.debug("updated company",res);
                        toastr.success('Company was updated successfully', '');
                        $state.go("navigator.companies.list");
                        that.refreshMasterRows(function(data){
                            that.masterDetailBroadcast('Update Master Successfully');
                        });
                    },function(err){
                        $log.error("Fail to update position",err);
                        toastr.error('Fail to update Position ' + err.data.error.message, 'Error');
                    });
                }else{

                    if(row.defaultStatusObject){
                        row.defaultStatus = row.defaultStatusObject.bookingStatus;
                    }

                    row.id = 0;
                    $log.debug("will create new company",row);

                    Companies.create(row,function(rs){
                        $log.debug("created company",rs);
                        toastr.success('Company was created successfully', '');
                        $state.go("navigator.companies.list");
                        that.refreshMasterRows(function(data){
                            that.masterDetailBroadcast('Insert Master Successfully');
                        });
                    },function(err){
                        toastr.error('Fail to create Position', 'Error');
                        toastr.error('Fail to create Position ' + err.data.error.message, 'Error');
                    })
                }
            }
        };
    }]);