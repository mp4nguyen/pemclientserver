/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Sites',['lbServices','MasterDetailDirective','ct.ui.router.extras.sticky', 'ct.ui.router.extras.dsr', 'ct.ui.router.extras.statevis'])
    .config(['$stateProvider','$stickyStateProvider',function($stateProvider,$stickyStateProvider){
        //'$stickyStateProvider'

        $stateProvider
            .state("navigator.sites",{
                abstract:false,
                url:"/sites",
                controller: function($log){

                    $log = $log.getInstance("ocsApp.Sites");
                    $log.debug("I am controller of Site");

                    var masterDefines = {
                        div:{
                            type:"div",
                            fieldClass: "portlet box green portet-datatable",
                            fields:{
                                div:{
                                    type:"div",
                                    "isSubmitedVar": "isSubmitted",
                                    "controllerAs": "SitesMainCtrl",
                                    fieldClass:"portlet-title",
                                    fields:{
                                        div1:{
                                            type:"div",
                                            fieldClass: "caption bold",
                                            fields:{
                                                span:{type:"span", label:"Site List", fieldClass:"caption-subject bold uppercase"}
                                            }
                                        },
                                        div2:{type:"div", fieldClass: "tools", fields:{
                                            newButton:{type:"button", label:"New Site", fieldClass:"btn btn-primary", ngClick: "detail()"}
                                        }
                                        }
                                    }
                                },
                                div2:{
                                    type:"div",
                                    fieldClass:"portlet-body",
                                    fields:{
                                        table: {
                                            "type": "table",
                                            "isSort": true,
                                            "isSearch": true,
                                            "dataSource": "rows",
                                            "fieldClass": "table table-striped table-bordered table-hover order-column",
                                            "ngClick": "detail(row)",//newOrEditRow(row)
                                            "fields": {
                                                companyName: { field: 'siteName', displayName: "Site Name", width: "100"},
                                                addr: { field: 'siteAddr', displayName: "Address", width: "100"},
                                                state: { field: 'state', displayName: "State", width: "100"},
                                                country: { field: 'country', displayName: "Country", width: "100"},
                                                deleteRow: { type: 'button', label: 'Delete', displayName: "Action", fieldClass: "btn btn-warning", ngClick: "deleteRow(row)"}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };


                    var detailDefines = {
                        "div1": {
                            type: "div",
                            fieldClass: "modal-header",
                            "controllerAs": "NewSiteCtrl",
                            "isSubmitedVar": "isSubmitted",
                            fields: {"h3": {type:"h3",label: "{{NewCompanyCtrl.windowTitle}}", fieldClass: "modal-title"}}
                        },
                        "div2": {
                            type: "div",
                            fieldClass: "modal-body",
                            fields: {
                                "form":{
                                    "type": "form",
                                    "name": "form",
                                    "fieldClass": "form-horizontal form-row-seperated",
                                    "fields": {
                                        "companyName": { field: 'siteName', ngModel : 'row.siteName', label: "Site Name", placeholder: "Site name", width: "100", isList: true, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: true, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Site name is required"},
                                        'addr': { field: 'siteAddr', ngModel : 'row.siteAddr', label: "Address", placeholder: "Address", width: "100", isList: true, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
                                        'state': { field: 'state', ngModel : 'row.state', label: "State", placeholder: "State", width: "100", isList: true, isNew: true, isUpdate: true, type: 'select', fieldClass:'form-control', isRequire: true, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required","empty": "nothing selected",options:{
                                            "ACT": {
                                                "label": "Australian Capital Territory"
                                            },
                                            "NSW": {
                                                "label": "New South Wales"
                                            },
                                            "VIC": {
                                                "label": "Victoria"
                                            },
                                            "QLD": {
                                                "label": "Queensland"
                                            },
                                            "SA": {
                                                "label": "South Australia"
                                            },
                                            "WA": {
                                                "label": "Western Australia"
                                            },
                                            "NT": {
                                                "label": "Northern Territory"
                                            }
                                        }
                                        },
                                        'country': { field: 'country', ngModel : 'row.country', label: "Country", placeholder: "Country", width: "100", isList: true, isNew: true, isUpdate: true, type: 'select', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required","empty": "nothing selected",options:{
                                            "Australia": {
                                                "label": "Australia"
                                            }
                                        }
                                        }

                                    }
                                },
                                /*
                    <div class="portlet box green">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-gift"></i>Search
                            </div>
                        </div>
                        <div class="portlet-body form">
                        </div>
                    </div>
*/

                                div3:{
                                    type: "div",
                                    fieldClass: "portlet box green",
                                    fields:{
                                        div1:{type:"div",fieldClass:"portlet-title",fields:{div:{type:"div",label:"Search",fieldClass:"caption"}}},
                                        div2:{type:"div",fieldClass:"portlet-body",
                                            fields:{form:{type:"form",fieldClass:"form-horizontal",fields:{div:{type:"div",fieldClass:"form-group",
                                                fields:
                                                {
                                                    fromDate:{type:"date",ngModel:"fromDate",label:"Date" ,fieldClass:'form-control', labelClass:'col-md-1', fieldGroupClass:'col-md-3'},
                                                    toDate:{type:"date",ngModel:"toDate", label:"", fieldClass:'form-control', labelClass:'col-md-1', fieldGroupClass:'col-md-3'},
                                                    search:{type:"button", label:"Search", ngClick:"filterDetail(NewSiteCtrl.fromDate,NewSiteCtrl.toDate)", fieldClass:'col-md-2 btn btn-primary'}
                                                }
                                            }}

                                            }}

                                        },
                                    }
                                },
                                table: {
                                    "type": "table",
                                    "dataSource": "row.AdminCalendars",
                                    "isSort": true,
                                    "isSearch": true,
                                    "fieldClass": "table table-striped table-bordered table-hover order-column",
                                    "ngClick": "newOrEditRow(row)",
                                    "fields": {
                                        fromTime: { field: 'fromTime', displayName: "From time", width: "100", filter: "|dateFilter| date:'dd/MM/yyyy HH:mm'"},
                                        available: { field: 'available', displayName: "Available", width: "100"}
                                    }
                                }
                            }
                        },
                        "div3": {
                            type: "div",
                            fieldClass: "modal-footer",
                            fields: {
                                SaveButton:{type:"button",label:"Save", fieldClass:"btn btn-primary",ngClick:"ok()"},
                                CancelButton:{type:"button",label:"Cancel", fieldClass:"btn btn-warning",ngClick:"cancel()"}
                            }
                        }
                    };


/*
 rangeFilter:{
 filter:"|rangeDateFilter:NewSiteCtrl.fromDate:NewSiteCtrl.toDate",
 template:{
 div:{
 type: "div",
 fieldClass: "form-group",
 fields:{
 fromDate:{type:"date",ngModel:"fromDate",label:"Date" ,fieldClass:'form-control', labelClass:'col-md-1', fieldGroupClass:'col-md-4'},
 toDate:{type:"date",ngModel:"toDate", label:"", fieldClass:'form-control', labelClass:'col-md-1', fieldGroupClass:'col-md-3'},
 search:{type:"button", label:"Search", ngClick:"filterDetail(NewSiteCtrl.fromDate,NewSiteCtrl.toDate)", fieldClass:'col-md-2 btn btn-primary'}
 }
 }
 }
 }
* */
                    this.masterDetailDefs = {
                        master: {name: 'list', controller: 'SitesMainCtrl', layout: masterDefines},
                        detail: {name: 'detail', controller: 'NewSiteCtrl', layout: detailDefines}
                    };

                },
                controllerAs: "companyForm",
                template: '<main-master-detail-directive setup="{{companyForm.masterDetailDefs}}" ></main-master-detail-directive>'
            });
    }]);
