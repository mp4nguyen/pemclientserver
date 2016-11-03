/**
 * Created by phuongnguyen on 24/02/16.
 *//**
 * Created by phuongnguyen on 27/11/15.
 */

angular.module('ocsApp.Companies')
    .controller('NewSubCompanyCtrl',['Companies','row','$log','toastr','BookingStatusFactory','$uibModalInstance','DetailModal','DeleteModal',function (Companies,row,$log,toastr,BookingStatusFactory,$uibModalInstance,DetailModal,DeleteModal) {

        DetailWithTableBaseCtrl.call(this,$uibModalInstance,row,$log,toastr,DetailModal,DeleteModal,'NewSubCompanyCtrl');
        var that = this;
        this.row.defaultStatusObject = {};
        this.bookingStatus = [];

        if(row){
            this.windowTitle = "Update Sub Company";
        }else{
            this.windowTitle = "New Sub Company";
        }


        $log.debug("modalTitle = ",this.windowTitle);

        BookingStatusFactory.getStatus(function(data){
            that.bookingStatus = data;
            that.row.defaultStatusObject =  that.bookingStatus[_.findIndex(that.bookingStatus, 'bookingStatus', that.row.defaultStatus)];
            console.log(" get status = ",data,that.row.defaultStatusObject);
        });

        this.saveRow = function(){
            $log.debug("saveRow.....");
            if(row){
                $log.debug("will update company",row);

                if(that.row.defaultStatusObject){
                    that.row.defaultStatus = that.row.defaultStatusObject.bookingStatus;
                }

                Companies.update({where:{"id":that.row.id}},that.row,function(res){
                    $log.debug("updated company",res);
                    toastr.success('Company was updated successfully', '');
                    that.closeModalAfterSave();
                },function(err){
                    $log.error("Fail to update position",err);
                    toastr.error('Fail to update Position', 'Error');
                });
            }else{

                if(that.row.defaultStatusObject){
                    that.row.defaultStatus = that.row.defaultStatusObject.bookingStatus;
                }

                that.row.id = 0;
                $log.debug("will create new company",row);

                Companies.create(that.row,function(rs){
                    $log.debug("created company",rs);
                    toastr.success('Company was created successfully', '');
                    $uibModalInstance.close({});
                },function(err){
                    toastr.error('Fail to create Position', 'Error');
                    $log.error("failt to create position",err);
                })
                //that.closeModalAfterSave();
            }
        }


        this.formDefines = {
            "div1": {
                type: "div",
                fieldClass: "modal-header",
                "controllerAs": "NewSubCompanyCtrl",
                "isSubmitedVar": "isSubmitted",
                fields: {"h3": {type:"h3",label: "{{NewSubCompanyCtrl.windowTitle}}", fieldClass: "modal-title"}}
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
                            'defaultStatus': { field: 'defaultStatus', ngModel : 'row.defaultStatusObject', label: "Default Status", placeholder: "Default status", width: "100", isList: false, isNew: true, isUpdate: true, type: 'select', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', ngOptions: "status.bookingStatus for status in NewCompanyCtrl.bookingStatus"},
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

        console.log(this.formDefines);
    }]);

/*
 this.stdFormTemplate = {
 "fieldset": {
 "type": "fieldset",
 "label": "fieldset",
 "fields": {
 "text": {
 "type": "text",
 "label": "text",
 "placeholder": "text",
 "required":true
 },
 "date": {
 "type": "date",
 "label": "date",
 "placeholder": "date"
 },
 "datetime": {
 "type": "datetime",
 "label": "datetime",
 "placeholder": "datetime"
 },
 "datetime-local": {
 "type": "datetime-local",
 "label": "datetime-local",
 "placeholder": "datetime-local"
 },
 "email": {
 "type": "email",
 "label": "email",
 "placeholder": "email",
 "required":true
 },
 "month": {
 "type": "month",
 "label": "month",
 "placeholder": "month"
 },
 "coordinates-fieldset": {
 "type": "fieldset",
 "label": "nested model example",
 "fields": {
 "coordinates.lat": {
 "type": "number",
 "label": "coordinates.lat",
 "placeholder": "coordinates.lat",
 "val": 36.5
 },
 "coordinates.lon": {
 "type": "number",
 "label": "coordinates.lon",
 "placeholder": "coordinates.lon",
 "val": -0.15
 }
 }
 },
 "number": {
 "type": "number",
 "label": "number",
 "placeholder": "number"
 },
 "password": {
 "type": "password",
 "label": "password",
 "placeholder": "password"
 },
 "search": {
 "type": "search",
 "label": "search",
 "placeholder": "search"
 },
 "tel": {
 "type": "tel",
 "label": "tel",
 "placeholder": "tel"
 },
 "textarea": {
 "type": "textarea",
 "label": "textarea",
 "placeholder": "textarea",
 "splitBy": "\n",
 "val": ["This array should be","separated by new lines"]
 },
 "time": {
 "type": "time",
 "label": "time",
 "placeholder": "time"
 },
 "url": {
 "type": "url",
 "label": "url",
 "placeholder": "url"
 },
 "week": {
 "type": "week",
 "label": "week",
 "placeholder": "week"
 }
 }
 },
 "checkbox": {
 "type": "checkbox",
 "label": "checkbox"
 },
 "color": {
 "type": "color",
 "label": "color"
 },
 "file": {
 "type": "file",
 "label": "file",
 "multiple": true
 },
 "range": {
 "type": "range",
 "label": "range",
 "model": "number",
 "val": 42,
 "minValue": -42,
 "maxValue": 84
 },
 "select": {
 "type": "select",
 "label": "select",
 "empty": "nothing selected",
 "options": {
 "first": {
 "label": "first option"
 },
 "second": {
 "label": "second option",
 "group": "first group"
 },
 "third": {
 "label": "third option",
 "group": "second group"
 },
 "fourth": {
 "label": "fourth option",
 "group": "first group"
 },
 "fifth": {
 "label": "fifth option"
 },
 "sixth": {
 "label": "sixth option",
 "group": "second group"
 },
 "seventh": {
 "label": "seventh option"
 },
 "eighth": {
 "label": "eighth option",
 "group": "first group"
 },
 "ninth": {
 "label": "ninth option",
 "group": "second group"
 },
 "tenth": {
 "label": "tenth option"
 }
 }
 },
 "checklist": {
 "type": "checklist",
 "label": "checklist",
 "options": {
 "first": {
 "label": "first option"
 },
 "second": {
 "label": "second option",
 "isOn": "on",   //  If you use Angular versions 1.3.x and up, this needs to be changed to "'on'"...
 "isOff": "off"  //  If you use Angular versions 1.3.x and up, this needs to be changed to "'off'"...
 }
 }
 },
 "radio": {
 "type": "radio",
 "label": "radio",
 "values": {
 "first": "first option",
 "second": "second option",
 "third": "third option",
 "fourth": "fourth option",
 "fifth": "fifth option"
 }
 },
 "button": {
 "type": "button",
 "label": "button"
 },
 "hidden": {
 "type": "hidden",
 "label": "hidden",
 "val": "hidden"
 },
 "image": {
 "type": "image",
 "label": "image",
 "source": "http://angularjs.org/img/AngularJS-large.png"
 },
 "legend": {
 "type": "legend",
 "label": "legend"
 },
 "reset": {
 "type": "reset",
 "label": "reset"
 },
 "submit": {
 "type": "submit",
 "label": "submit"
 },
 "bogus": {
 "type": "bogus",
 "label": "bogus"
 }
 };
 */
