/**
 * Created by phuongnguyen on 26/02/16.
 */
angular.module('ocsApp.Sites')
    .factory("SiteModuleFactory",["Redimedsites","$log","toastr","$rootScope","$state",function(Redimedsites,$log,toastr,$rootScope,$state){
        $log = $log.getInstance("ocsApp.Sites.SiteModuleFactory");
        var rows = null;
        var message = '';
        var getRowFromServer = function(cb){
            Redimedsites.find(function(data){
                //{filter:{include:{relation:'AdminCalendars',scope:{limit:300}}}},
                console.log("Get company from server",data);
                rows = data;
                cb(rows)
            });
        };

        return {
            getCalendars: function(siteID,cb){
                Redimedsites.find({filter:{where:{id:siteID},include:{relation:'AdminCalendars',scope:{limit:1000}}}},function(data){
                    //,
                    console.log("Get calendar from server for siteId = " +siteID,data);
                    cb(data)
                });      
            },
            getMasterRows:function(cb){
                if(rows){
                    console.log("Get company from memory",rows);
                    cb(rows);
                }else{
                    getRowFromServer(cb);
                }
            },
            refreshMasterRows:function(cb){
                getRowFromServer(cb);
            },
            getMasterRow:function(id){
                $log.debug("Get master row with id = ",id);
                console.log("Get master rows  = ",rows);
                function get_type(thing){
                    if(thing===null)return "[object Null]"; // special case
                    return Object.prototype.toString.call(thing);
                }

                if(rows){
                    var row = rows[_.findIndex(rows, 'id', id)];
                    //console.log("get_type = ",get_type(id),get_type(companies[0].id));
                    return row;
                }else{
                    return {};
                }
            },
            deleteMasterRow:function(row){
                var that = this;
                $log.debug("This is a custom closeDeleteModal function",row);
                Redimedsites.deleteById({id:row.id},function(result){
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

                    Redimedsites.update({where:{"id":row.id}},row,function(res){
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

                    Redimedsites.create(row,function(rs){
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