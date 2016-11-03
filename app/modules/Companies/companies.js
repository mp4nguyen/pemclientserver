/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Companies',['lbServices','MasterDetailDirective','ct.ui.router.extras.sticky', 'ct.ui.router.extras.dsr', 'ct.ui.router.extras.statevis'])
    .config(['$stateProvider','$stickyStateProvider',function($stateProvider,$stickyStateProvider){
        //'$stickyStateProvider'
        $stickyStateProvider.enableDebug(false);
        $stateProvider
            .state("navigator.companies",{
                abstract:false,
                url:"/companies",
                controller: function($log){

                    $log = $log.getInstance("ocsApp.Companies");
                    $log.debug("I am controller of Company");

                    var masterDefines = {
                        div:{
                            type:"div",
                            fieldClass: "portlet box green portet-datatable",
                            fields:{
                                div:{
                                    type:"div",
                                    "isSubmitedVar": "isSubmitted",
                                    "controllerAs": "CompaniesMainCtrl",
                                    fieldClass:"portlet-title",
                                    fields:{
                                        div1:{
                                            type:"div",
                                            fieldClass: "caption bold",
                                            fields:{
                                                span:{type:"span", label:"Company List", fieldClass:"caption-subject bold uppercase"}
                                            }
                                        },
                                        div2:{type:"div", fieldClass: "tools", fields:{
                                            newButton:{type:"button", label:"New Company", fieldClass:"btn btn-primary", ngClick: "detail()"}
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
                                                companyName: { field: 'companyName', displayName: "Company Name", width: "100"},
                                                addr: { field: 'addr', displayName: "Address", width: "100"},
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
                            "controllerAs": "NewCompanyCtrl",
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
                                        "companyName": { field: 'companyName', ngModel : 'row.companyName', label: "Company Name", placeholder: "Company name", width: "100", isList: true, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: true, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
                                        'addr': { field: 'addr', ngModel : 'row.addr', label: "Address", placeholder: "Address", width: "100", isList: true, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
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
                                        },
                                        'defaultStatus': { field: 'defaultStatus', ngModel : 'row.defaultStatusObject', label: "Default Status", placeholder: "Default status", width: "100", isList: false, isNew: true, isUpdate: true, type: 'select', fieldClass:'form-control', isRequire: true, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', ngOptions: "status.bookingStatus for status in NewCompanyCtrl.bookingStatus"},
                                        'description': { field: 'description', ngModel : 'row.description', label: "Description", placeholder: "Description", width: "100", isList: false, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
                                        'industry': { field: 'industry', ngModel : 'row.industry', label: "Industry", placeholder: "Industry", width: "100", isList: false, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
                                        'invoiceEmail': { field: 'invoiceEmail', ngModel : 'row.invoiceEmail', label: "Invoice Email", placeholder: "Invoice email", width: "100", isList: false, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Invoice email is required", emailHelpBlock : "Email is invalid"},
                                        'resultEmail': { field: 'resultEmail', ngModel : 'row.resultEmail', label: "Result Email", placeholder: "Result email", width: "100", isList: false, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Result email is required", emailHelpBlock : "Email is invalid"},
                                        'reportToEmail': { field: 'reportToEmail', ngModel : 'row.reportToEmail', label: "Report Email", placeholder: "", width: "100", isList: false, isNew: true, isUpdate: true, type: 'email', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Report email is required", emailHelpBlock : "Email is invalid"},
                                        'fieldGroup' : {type:'horizontalFieldGroup', fieldClass :'col-md-12', columnClass: 'col-md-3' ,fields:{
                                            'isaddcontactemailtoresult': { field: 'isaddcontactemailtoresult', ngModel : 'row.isaddcontactemailtoresult', label: "Is Result Email", placeholder: "Is Result Email", width: "100", isList: false, isNew: true, isUpdate: true, type: 'checkbox', fieldClass:'form-control', isRequire: false, labelClass:'col-md-8 control-label', fieldGroupClass:'col-md-4', formGroupClass:'col-md-3', isOn: 1, isOff: 0 },
                                            'isinvoiceemailtouser': { field: 'isinvoiceemailtouser', ngModel : 'row.isinvoiceemailtouser', label: "Is Invoice Email", placeholder: "Is Invoice Email", width: "100", isList: false, isNew: true, isUpdate: true, type: 'checkbox', fieldClass:'form-control', isRequire: false, labelClass:'col-md-8 control-label', fieldGroupClass:'col-md-4', formGroupClass:'col-md-3', isOn: 1, isOff: 0},
                                            'ispo': { field: 'ispo', ngModel : 'row.ispo', label: "PO", placeholder: "PO", width: "100", isList: false, isNew: true, isUpdate: true, type: 'checkbox', fieldClass:'form-control', isRequire: false, labelClass:'col-md-8 control-label', fieldGroupClass:'col-md-4', formGroupClass:'col-md-3', isOn: 1, isOff: 0},
                                            'isproject': { field: 'isproject', ngModel : 'row.isproject', label: "Project", placeholder: "Project", width: "100", isList: false, isNew: true, isUpdate: true, type: 'checkbox', fieldClass:'form-control', isRequire: false, labelClass:'col-md-8 control-label', fieldGroupClass:'col-md-4', formGroupClass:'col-md-3', isOn: 1, isOff: 0}
                                        }
                                        },
                                        'poNumber': { field: 'poNumber', ngModel : 'row.poNumber', label: "PO Number", placeholder: "PO Number", width: "100", isList: false, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"}
                                        //'submit': { label: "Submit", isNew: true, isUpdate: true, type: 'button', fieldClass:'btn btn-primary', ngClick: "okMainCtrl()"}
                                    }
                                },
                                table: {
                                    "type": "table",
                                    "controllerAs": "NewCompanyCtrl",
                                    "isSubmitedVar": "isSubmitted",
                                    "dataSource": "row.subsidiaries",
                                    "fieldClass": "table table-striped table-bordered table-hover order-column",
                                    "ngClick": "newOrEditRow(row)",
                                    "fields": {
                                        companyName: { field: 'companyName', displayName: "Company Name", width: "100"},
                                        addr: { field: 'addr', displayName: "Address", width: "100"},
                                        state: { field: 'state', displayName: "State", width: "100"},
                                        country: { field: 'country', displayName: "Country", width: "100"}
                                    }
                                }
                            }
                        },
                        "div3": {
                            type: "div",
                            fieldClass: "modal-footer",
                            fields: {
                                SaveButton:{type:"button",label:"Save", fieldClass:"btn btn-primary",ngClick:"ok()"},
                                CancelButton:{type:"button",label:"Cancel", fieldClass:"btn btn-warning",ngClick:"cancel()"},
                                NewButton:{type:"button",label:"New Sub Company", fieldClass:"btn btn-warning",ngClick:"newOrEditRow()"}
                            }
                        }
                    };

                    this.masterDetailDefs = {
                        master: {name: 'list', controller: 'CompaniesMainCtrl', layout: masterDefines},
                        detail: {name: 'detail', controller: 'NewCompanyCtrl', layout: detailDefines}
                    };

                },
                controllerAs: "companyForm",
                template: '<main-master-detail-directive setup="{{companyForm.masterDetailDefs}}" ></main-master-detail-directive>'
            });
    }]);
