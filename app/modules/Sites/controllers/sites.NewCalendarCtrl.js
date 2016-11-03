/**
 * Created by phuongnguyen on 24/02/16.
 *//**
 * Created by phuongnguyen on 27/11/15.
 */

angular.module('ocsApp.Sites')
    .controller('NewCalendarCtrl',['Calendar','row','$log','toastr','SiteModuleFactory','$uibModalInstance','DetailModal','DeleteModal','toastr',function (Calendar,row,$log,toastr,SiteModuleFactory,$uibModalInstance,DetailModal,DeleteModal,toastr) {

        DetailWithTableBaseCtrl.call(this,$uibModalInstance,row,$log,toastr,DetailModal,DeleteModal,'NewSubCompanyCtrl');
        var that = this;
        this.row.defaultStatusObject = {};
        this.bookingStatus = [];
        var allCalendars = row.Calendars;

        if(row){
            this.windowTitle = "Update Sub Company";
        }else{
            this.windowTitle = "New Sub Company";
        }


        $log.debug("modalTitle = ",this.windowTitle);


        this.saveRow = function(){
            if(row){
                $log.debug("will update calendar",row.available);
                var currentAvailable = 0;
                if(row.available){
                    if(row.available.length > 0){
                        currentAvailable = Number(row.available.substr(1,2));
                    }else{
                        currentAvailable = 0;
                    }

                }else{
                    currentAvailable = 0;
                }

                Calendar.findById({id:row.calId},function(data){


                    var originalAvai = data.available;
                    var newAvailable = Number(that.row.newAvailable);
                    var diff = originalAvai  - currentAvailable;
                    var newSlot = Number(newAvailable) + Number(diff);
                    $log.debug("will update calendar",data,'currentAvailable = ' + currentAvailable + ' newSlot = ' + newSlot);
                    //console.log(newAvailable,originalAvai,currentAvailable,newSlot,diff);

                    Calendar.update({where:{calId:row.calId}},{available:newSlot},function(data){
                        $log.debug("updated calendar successfully",data);
                        $log.save();
                        toastr.success('update calendar successfully');
                        $uibModalInstance.close({});
                    },function(err){
                        $log.error("fail to update calendar",err);
                        toastr.error('Fail to update calendar, Please contact Phuong', 'Error');
                    });
                })

            }else{

            }
        }

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        this.formDefines = {
            "div1": {
                type: "div",
                fieldClass: "modal-header",
                "controllerAs": "NewCalendarCtrl",
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
                            "fromTime": { field: 'fromTime', ngModel : 'row.fromTime', label: "Appointment Time", width: "100", isList: true, isNew: true, isReadOnly: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
                            "available": { field: 'available', ngModel : 'row.available', label: "Available", width: "100", isList: true, isNew: true, isReadOnly: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
                            'newAvailable': { field: 'newAvailable', ngModel : 'row.newAvailable', label: "New Available", placeholder: "New Available", width: "100", isList: true, isNew: true, isUpdate: true, type: 'text', fieldClass:'form-control', isRequire: false, labelClass:'col-md-4 control-label', fieldGroupClass:'col-md-6', formGroupClass:'form-group', requiredHelpBlock : "Company name is required"},
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
