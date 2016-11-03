/**
 * Created by phuongnguyen on 23/02/16.
 */

/**
 * Created by phuongnguyen on 23/02/16.
 */
function DetailWithTableBaseCtrl(Services,row,$log,toastr,DetailModal,DeleteModal,controllerName) {
    $log = $log.getInstance(controllerName);
    $log.debug("I am  new or edit position controller.",row);

    var that = this;
    this.form = {};
    this.row = {};
    this.windowTitle = "This is 'this.windowTitle' variable, Please set for the widow title";
    if(row){
        this.row = row;
    }
    this.isSubmitted = false;
    this.formDefines = {};
    this.tableDefines = {};

    this.closeModalAfterSave = function(){
        //$uibModalInstance.close({});
    };

    this.setHeader = function(columnName){
        that.currentColumnName = columnName;
        that.currentSortReverse = !that.currentSortReverse;
    };

    this.isUp = function(columnName){
        return that.currentColumnName == columnName && that.currentSortReverse;
    };

    this.isDown = function(columnName){
        return that.currentColumnName == columnName && !that.currentSortReverse;
    };

    //////////////

    this.setDetailTemplateUrl = function(detailTemplateUrl){
        DetailModal.setTemplateUrl(detailTemplateUrl);
    };

    this.setDetailController = function(detailController){
        DetailModal.setControllerName(detailController);
    };

    this.setDetailWindowSize = function(detailWindowSize){
        DetailModal.setSize(detailWindowSize);
    };

    this.setCloseDetailModal = function(closeFun){
        DetailModal.setCloseModalFunc(closeFun);
    };

    this.setDismissDetailModal = function(dismissFun){
        DetailModal.setDismissModalFunc(dismissFun);
    };

    this.setDetailWindowTitle = function(resolveName,detailWindowTitle){
        DetailModal.setResolve(resolveName,detailWindowTitle);
    };
    ////////////////////
    this.setDeleteTemplateUrl = function(detailTemplateUrl){
        DeleteModal.setTemplateUrl(detailTemplateUrl);
    };

    this.setDeleteController = function(detailController){
        DeleteModal.setControllerName(detailController);
    };

    this.setDeleteWindowSize = function(detailWindowSize){
        DeleteModal.setSize(detailWindowSize);
    };

    this.setCloseDeleteModal = function(closeFun){
        DeleteModal.setCloseModalFunc(closeFun);
    };

    this.setDismissDeleteModal = function(dismissFun){
        DeleteModal.setDismissModalFunc(dismissFun);
    };


    this.newOrEditRow = DetailModal.newOrEditRow;

    this.deleteRow = DeleteModal.deleteRow;

    this.saveRow = function(){
        $log.debug("This is  'this.saveRow()' function, Please override ! Remember to close modal by 'this.closeModalAfterSave()'");
        Services.saveMaster(that.row);
        that.closeModalAfterSave();
    };

    this.ok = function () {
        that.isSubmitted = true;

        if(that.form.$valid){
            that.saveRow();
        }else{
            toastr.error("Please re-check all their fields again !","error");
            $log.error("Save postion err ",that.form.$error);
        }
    };

    this.cancel = function () {
        //$uibModalInstance.dismiss('cancel');
    };

};


/**
 * Created by phuongnguyen on 23/02/16.
 */
function TableBaseCtrl($scope,$log,Services,DeleteModal,controllerName){

    $log = $log.getInstance(controllerName);
    $log.debug("controller is running....");
    var that = this;
    this.selectedRow = {};
    this.detailResolve = {};
    this.currentColumnName = '';
    this.currentSortReverse = false;
    this.rows = [];

    this.getDataFromService = function(){
        Services.getMasterRows(function(data){
            that.rows = data;
        });
    }

    this.getDataFromService();

    $scope.$on('MasterDetailBroadcast', function() {
        var msg = Services.getMessage();
        $log.debug("Received a message from detail = " + msg);
        if(msg.indexOf("Insert Master Successfully")>= 0 || msg.indexOf("Update Master Successfully")>= 0|| msg.indexOf("Delete Master Successfully")>= 0){
            that.getDataFromService();
        }
    });

    this.detailResolve.row = function(){
        $log.debug("Please override 'detailResolve.row' object to process the resolve data for the detail modal");
        return that.selectedRow;
    };

    this.setHeader = function(columnName){
        that.currentColumnName = columnName;
        that.currentSortReverse = !that.currentSortReverse;
    };

    this.isUp = function(columnName){
        return that.currentColumnName == columnName && that.currentSortReverse;
    };

    this.isDown = function(columnName){
        return that.currentColumnName == columnName && !that.currentSortReverse;
    };

    ////////////////////
    this.setDeleteTemplateUrl = function(detailTemplateUrl){
        DeleteModal.setTemplateUrl(detailTemplateUrl);
    };

    this.setDeleteController = function(detailController){
        DeleteModal.setControllerName(detailController);
    };

    this.setDeleteWindowSize = function(detailWindowSize){
        DeleteModal.setSize(detailWindowSize);
    };

    this.setCloseDeleteModal = function(closeFun){
        DeleteModal.setCloseModalFunc(closeFun);
    };

    this.setDismissDeleteModal = function(dismissFun){
        DeleteModal.setDismissModalFunc(dismissFun);
    };

    this.deleteRow = DeleteModal.deleteRow;

}


angular.module('TableBaseController',[]).controller('tableBaseController',['$uibModal','$log',TableBaseCtrl]);

/**
 * Created by phuongnguyen on 23/02/16.
 */
/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('DynamicForm',['toastr'])
    .directive('myDynamicForm', ['$q', '$parse', '$compile', '$document', function ($q, $parse, $compile, $document) {
        return {
            restrict: 'E', // supports using directive as element only
            terminal:true,
            link: function (scope ,element, attrs) {
                //console.log("attrs = ",attrs);
                //console.log("before attrs.formDefine = ",attrs.formdefine);
                var formDefine = attrs.formdefine


                formDefine = formDefine.replace(/\u00a0/g, " ");

                //console.log("after formDefine = ",formDefine);

                var supported = {
                    //  Text-based elements
                    'div': {element: 'div'},
                    'h1': {element: 'h1'},
                    'h2': {element: 'h2'},
                    'h3': {element: 'h3'},
                    'span': {element: 'span'},
                    'form': {element: 'form', editable: false, textBased: false},
                    'table': {element: 'table', editable: false, textBased: false},
                    'text': {element: 'input', type: 'text', editable: true, textBased: true},
                    'date': {element: 'input', type: 'date', editable: true, textBased: true},
                    'datetime': {element: 'input', type: 'datetime', editable: true, textBased: true},
                    'datetime-local': {element: 'input', type: 'datetime-local', editable: true, textBased: true},
                    'email': {element: 'input', type: 'email', editable: true, textBased: true},
                    'month': {element: 'input', type: 'month', editable: true, textBased: true},
                    'number': {element: 'input', type: 'number', editable: true, textBased: true},
                    'password': {element: 'input', type: 'password', editable: true, textBased: true},
                    'search': {element: 'input', type: 'search', editable: true, textBased: true},
                    'tel': {element: 'input', type: 'tel', editable: true, textBased: true},
                    'textarea': {element: 'textarea', editable: true, textBased: true},
                    'time': {element: 'input', type: 'time', editable: true, textBased: true},
                    'url': {element: 'input', type: 'url', editable: true, textBased: true},
                    'week': {element: 'input', type: 'week', editable: true, textBased: true},
                    //  Specialized editables
                    'checkbox': {element: 'input', type: 'checkbox', editable: true, textBased: false},
                    'color': {element: 'input', type: 'color', editable: true, textBased: false},
                    'file': {element: 'input', type: 'file', editable: true, textBased: false},
                    'range': {element: 'input', type: 'range', editable: true, textBased: false},
                    'select': {element: 'select', editable: true, textBased: false},
                    //  Pseudo-non-editables (containers)
                    'checklist': {element: 'div', editable: false, textBased: false},
                    'horizontalFieldGroup': {element: 'div', editable: false, textBased: false},
                    'radio': {element: 'div', editable: false, textBased: false},
                    //  Non-editables (mostly buttons)
                    'button': {element: 'button', type: 'button', editable: false, textBased: false},
                    'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
                    'image': {element: 'input', type: 'image', editable: false, textBased: false},
                    'legend': {element: 'legend', editable: false, textBased: false},
                    'reset': {element: 'button', type: 'reset', editable: false, textBased: false},
                    'submit': {element: 'button', type: 'submit', editable: false, textBased: false}
                };
                //var newElement = angular.element('<p>Hello world !</p>');

                //convert String to Object/Array...
                $q.when($parse(formDefine)(scope)).then(function (template) {
                    //console.log(template);
                    var optGroups = {};
                    var controllerAs = "";
                    var formName = "";
                    var isSubmitedVar = "";

                    var buildFields = function (field, id) {
                        //console.log("field = ",field);
                        var newElement = angular.element($document[0].createElement(supported[field.type].element));

                        if(field.controllerAs){
                            controllerAs = field.controllerAs + ".";
                        }

                        if(field.isSubmitedVar){
                            isSubmitedVar = field.controllerAs + "." + field.isSubmitedVar;
                        }

                        if (angular.isDefined(supported[field.type].type)) {
                            newElement.attr('type', supported[field.type].type);
                        }

                        //  Editable fields (those that can feed models)
                        if (angular.isDefined(supported[field.type].editable) && supported[field.type].editable) {

                            if(field.field){
                                newElement.attr('name',field.field);
                            }

                            if(field.ngModel){
                                if(field.isAttachControllerAs){
                                    if(field.isAttachControllerAs == false){
                                        newElement.attr('ng-model',field.ngModel);
                                    }else{
                                        newElement.attr('ng-model',controllerAs + field.ngModel);
                                    }
                                }else{
                                    newElement.attr('ng-model',controllerAs + field.ngModel);
                                }

                            }

                            if(field.isRequire){
                                newElement.attr('ng-required', field.isRequire);
                            }

                            if (angular.isDefined(field.readonly)) {
                                newElement.attr('ng-readonly', field.readonly);
                            }

                            if (angular.isDefined(field.val)) {
                                newElement.attr('value', field.val);
                            }
                        }

                        //  Fields based on input type=text
                        if (angular.isDefined(supported[field.type].textBased) && supported[field.type].textBased) {
                            if (angular.isDefined(field.minLength)) {newElement.attr('ng-minlength', field.minLength);}
                            if (angular.isDefined(field.maxLength)) {newElement.attr('ng-maxlength', field.maxLength);}
                            if (angular.isDefined(field.validate)) {newElement.attr('ng-pattern', field.validate);}
                            if(field.placeholder){
                                if(field.placeholder.length > 0){
                                    newElement.attr('placeholder',field.placeholder);
                                }
                            }
                            if(field.isReadOnly){
                                newElement.attr('ng-readonly',field.isReadOnly);
                            }
                        }

                        if(field.name){
                            formName = field.name;
                            newElement.attr('name',controllerAs + field.name);
                        }

                        if(field.fieldClass){
                            newElement.addClass(field.fieldClass);
                        }

                        if(field.type.indexOf("form")>=0){
                            newElement.attr('action', '#');
                        }

                        if(field.ngClick){
                            if (["button", "legend", "reset", "submit"].indexOf(field.type) > -1) {
                                newElement.attr('ng-click',controllerAs + field.ngClick);
                            }
                        }

                        if(field.ngShow){
                            newElement.attr('ng-show',field.ngShow);
                        }

                        if(field.uiView){
                            newElement.attr('ui-view',field.uiView);
                        }

                        if (field.type === 'checkbox') {
                            if (angular.isDefined(field.isOn)) {newElement.attr('ng-true-value', field.isOn);}
                            if (angular.isDefined(field.isOff)) {newElement.attr('ng-false-value', field.isOff);}
                            if (angular.isDefined(field.slaveTo)) {newElement.attr('ng-checked', field.slaveTo);}
                        }else if (field.type === 'select') {
                            if (angular.isDefined(field.multiple) && field.multiple !== false) {newElement.attr('multiple', 'multiple');}
                            if (angular.isDefined(field.empty) && field.empty !== false) {newElement.append(angular.element($document[0].createElement('option')).attr('value', '').html(field.empty));}

                            if (angular.isDefined(field.ngOptions)) {
                                newElement.attr('ng-options', field.ngOptions);
                            }
                            else if (angular.isDefined(field.options)) {
                                angular.forEach(field.options, function (option, childId) {
                                    newChild = angular.element($document[0].createElement('option'));
                                    newChild.attr('value', childId);
                                    if (angular.isDefined(option.disabled)) {newChild.attr('ng-disabled', option.disabled);}
                                    if (angular.isDefined(option.slaveTo)) {newChild.attr('ng-selected', option.slaveTo);}
                                    if (angular.isDefined(option.label)) {newChild.html(option.label);}
                                    if (angular.isDefined(option.group)) {
                                        if (!angular.isDefined(optGroups[option.group])) {
                                            optGroups[option.group] = angular.element($document[0].createElement('optgroup'));
                                            optGroups[option.group].attr('label', option.group);
                                        }
                                        optGroups[option.group].append(newChild);
                                    }
                                    else {
                                        newElement.append(newChild);
                                    }
                                });

                                if (!angular.equals(optGroups, {})) {
                                    angular.forEach(optGroups, function (optGroup) {
                                        newElement.append(optGroup);
                                    });
                                    optGroups = {};
                                }
                            }
                        }

                        //  If there's a label, add it.
                        if (angular.isDefined(field.label)) {
                            //  Button elements get their labels from their contents.
                            if (["button", "legend", "reset", "submit","h1","h2","h3","span"].indexOf(field.type) > -1) {
                                newElement.html(field.label);
                                this.append(newElement);
                            }
                            //  Everything else should be wrapped in a label tag.
                            else {
                                var formGroupElement =  angular.element('<div></div>');
                                if(field.formGroupClass){
                                    formGroupElement.attr('class',field.formGroupClass);
                                }
                                //var formGroupElement =  angular.element('<ng-form name="form"></ng-form>');
                                var labelElement =   angular.element('<label>'+field.label+':</label>');

                                if(field.labelClass){
                                    labelElement.attr('class',field.labelClass);
                                }

                                var fieldGroupElement = angular.element('<div></div>');
                                if(field.fieldGroupClass){
                                    fieldGroupElement.attr('class',field.fieldGroupClass);
                                }
                                fieldGroupElement.append(newElement);

                                if(field.isRequire){
                                    labelElement.append(angular.element('<span class="required"> * </span>'));
                                    if(field.requiredHelpBlock){
                                        fieldGroupElement.append(angular.element('<span for="' + field.field + '" class="help-block" ng-show=" ' + isSubmitedVar + ' && '+ controllerAs + formName + '.' + field.field + '.$error.required">' + field.requiredHelpBlock + '</span>'));
                                    }
                                    formGroupElement.attr("ng-class","{'has-error' : " + isSubmitedVar + " && " + controllerAs + formName + '.' + field.field + ".$invalid}");
                                }

                                if(field.type.indexOf("email") > -1 && field.emailHelpBlock){
                                    fieldGroupElement.append(angular.element('<span for="' + field.field + '" class="help-block" ng-show=" ' + isSubmitedVar + ' && '+ controllerAs + formName + '.' + field.field + '.$error.email">' + field.emailHelpBlock + '</span>'));
                                }

                                formGroupElement.append(labelElement);
                                formGroupElement.append(fieldGroupElement);
                                this.append(formGroupElement);
                            }
                        }else{
                            this.append(newElement);
                        }


                        if(field.fields){
                            if(field.type.indexOf('table')>-1){
                                var tHeader = angular.element('<thead></thead>');
                                var tBody = angular.element('<tbody></tbody>');
                                var trHeader = angular.element('<tr></tr>');
                                var trHeaderSearch = angular.element('<tr></tr>');
                                var trData = angular.element('<tr></tr>');
                                var filter = "";
                                var rangeFilter = "";
                                var printRawData = angular.element('<p> ' + controllerAs + field.dataSource + '= {{controllerAs + field.dataSource}}</p>');

                                var ngClick = null;

                                if(field.ngClick){
                                    ngClick = controllerAs + field.ngClick;
                                }

                                angular.forEach(field.fields,function(value,key){
                                    var th = angular.element('<th></th>');
                                    var td = angular.element('<td></td>');

                                    
                                    if(value.type){
                                        //build component for table like : button, textbox, number,...
                                        console.log("value = ",value);
                                        var obj = {};
                                        obj.element = value;
                                        angular.forEach(obj,buildFields,td);                                        
                                    }else{
                                        
                                        var fieldFilter = "";
                                        if(value.filter){
                                            fieldFilter = value.filter;
                                        }
                                        
                                        //console.log('{{row.' + value.field + filter +'}}');
                                        td.html('{{row.' + value.field + fieldFilter +'}}');
                                    }
                                    
                                    //if field of table not set TYPE : will attach search
                                    if(field.isSearch && !value.type){
                                        if(value.rangeFilter){
                                            console.log("range filter");
                                            var tdSearch = angular.element('<td></td>');
                                            angular.forEach(value.rangeFilter.template,buildFields,tdSearch);
                                            tdSearch.append(searchInput);
                                            trHeaderSearch.append(tdSearch);

                                            rangeFilter = rangeFilter + value.rangeFilter.filter;

                                        }else{
                                            console.log(" filter");
                                            var tdSearch = angular.element('<td></td>');
                                            var searchInput = angular.element('<input type="text" class="form-control" ng-model="' + controllerAs + 'search.' + value.field + '"></input>');
                                            tdSearch.append(searchInput);
                                            trHeaderSearch.append(tdSearch);
                                            if(filter.length > 0){
                                                filter = filter + ',' + value.field + ':' + controllerAs + 'search.' + value.field;
                                            }else{
                                                filter =  value.field + ':' + controllerAs + 'search.' + value.field;
                                            }
                                            console.log(" filter = " + filter);
                                        }
                                    }else{
                                        var tdSearch = angular.element('<td></td>');
                                        trHeaderSearch.append(tdSearch);
                                    }

                                    //if field of table not set TYPE : will attach sort
                                    if(field.isSort && !value.type){
                                        var ngClickFun = controllerAs + "setHeader('" + value.field + "')";
                                        var thLink = angular.element('<a ng-click="' + ngClickFun + '">' + value.displayName + '</a>');
                                        var ngShowFun = controllerAs + "isDown('" + value.field + "')";
                                        var span1 = angular.element('<span></span>');
                                        span1.attr("ng-show",ngShowFun);
                                        span1.addClass("fa fa-caret-down");

                                        ngShowFun = controllerAs + "isUp('" + value.field + "')";
                                        var span2 = angular.element('<span></span>');
                                        span2.attr("ng-show",ngShowFun);
                                        span2.addClass("fa fa-caret-up");

                                        thLink.append(span1);
                                        thLink.append(span2);

                                        th.append(thLink);

                                    }else{
                                        th.html(value.displayName);
                                    }

                                    //if field of table not set TYPE : will attach click Row to view detail
                                    if(ngClick && !value.type){
                                        td.attr('ng-click',ngClick);
                                    }
                                    trHeader.append(th);
                                    trData.append(td);
                                });

                                if(field.dataSource){
                                    trData.attr('ng-repeat','row in ' + controllerAs + field.dataSource + '|orderBy:' + controllerAs + 'currentColumnName:'+ controllerAs + 'currentSortReverse|filter:{' + filter + '}');
                                    
                                }

                                tHeader.append(trHeader);

                                if(field.isSearch){
                                    tHeader.append(trHeaderSearch);
                                };

                                tBody.append(trData);
                                //newElement.append(printRawData);
                                newElement.append(tHeader);
                                newElement.append(tBody);
                            }else{
                                angular.forEach(field.fields,buildFields,newElement);
                            }
                        }
                    };


                    var newElement = angular.element('<div></div>');

                    angular.forEach(template,buildFields,newElement);

                    //console.log("compile........");
                    $compile(newElement)(scope);
                    element.replaceWith(newElement);
                });
            }
        };
    }]);

/**
 * Created by phuongnguyen on 10/03/16.
 */
var module = angular.module("$dynamicState", [])
.provider('$dynamicState', function($stateProvider){
    this.$get = function( $state){
        return {
            /**
             * @function app.dashboard.dashboardStateProvider.addState
             * @memberof app.dashboard
             * @param {string} title - the title used to build state, url & find template
             * @param {string} controllerAs - the controller to be used, if false, we don't add a controller (ie. 'UserController as user')
             * @param {string} templatePrefix - either 'content', 'presentation' or null
             * @author Alex Boisselle
             * @description adds states to the dashboards state provider dynamically
             * @returns {object} user - token and id of user
             */
            addState: function(pstateName,purl, controllerAs, templatePrefix,view) {


                var viewObject = {};

                if(templatePrefix.indexOf('.html') > 0){
                    viewObject[view] = {
                        templateUrl: templatePrefix,
                        controller: controllerAs,
                        controllerAs: controllerAs
                    };
                }else{
                    viewObject[view] = {
                        template: templatePrefix,
                        controller: controllerAs,
                        controllerAs: controllerAs
                    };
                }

                var states = $state.get();
                var stateIndex = _.findIndex(states,'name',pstateName);

                console.log("states = ",states,stateIndex);
                //Only add state when no state in array => prevent duplicate Error
                if( stateIndex == -1 ){
                    if(view){
                        $stateProvider.state(pstateName, {
                            url: '/' + purl,
                            abstract:false,
                            sticky: true ,
                            views: viewObject
                        });
                    }else{
                        if(templatePrefix.indexOf('.html') > 0){
                            $stateProvider.state(pstateName, {
                                url: '/' + purl,
                                abstract:false,
                                sticky: true ,
                                templateUrl: templatePrefix,
                                controller: controllerAs,
                                controllerAs: controllerAs
                            });
                        }else{
                            $stateProvider.state(pstateName, {
                                url: '/' + purl,
                                abstract:false,
                                sticky: true ,
                                template: templatePrefix,
                                controller: controllerAs,
                                controllerAs: controllerAs
                            });
                        }
                    }
                }
            }
        }
    }
});

/**
 * Created by phuongnguyen on 7/12/15.
 */
var module = angular.module("$logServices", ['helper']);

module.config(['$provide',function ($provide) {

    var buildTimeString = function (date, format)
    {
        format = format || "%Y/%M/%d %h:%m:%s.%z";

        function pad(value, isMilliSeconds)
        {
            if(typeof (isMilliSeconds) === "undefined")
            {
                isMilliSeconds = false;
            }
            if(isMilliSeconds)
            {
                if(value < 10)
                {
                    value = "00" + value;
                }
                else if(value < 100)
                {
                    value = "0" + value;
                }
            }
            return(value.toString().length < 2) ? "0" + value : value;
        }

        return format.replace(/%([a-zA-Z])/g, function (_, fmtCode)
        {
            switch(fmtCode)
            {
                case "Y":
                    return date.getFullYear();
                case "M":
                    return pad(date.getMonth() + 1);
                case "d":
                    return pad(date.getDate());
                case "h":
                    return pad(date.getHours());
                case "m":
                    return pad(date.getMinutes());
                case "s":
                    return pad(date.getSeconds());
                case "z":
                    return pad(date.getMilliseconds(), true);
                default:
                    throw new Error("Unsupported format code: " + fmtCode);
            }
        });
    };


    var supplant =  function( template, values, pattern ) {
        pattern = pattern || /\{([^\{\}]*)\}/g;

        return template.replace(pattern, function(a, b) {
            var p = b.split('.'),
                r = values;

            try {
                for (var s in p) { r = r[p[s]];  }
            } catch(e){
                r = a;
            }

            return (typeof r === 'string' || typeof r === 'number') ? r : a;
        });
    };




    //enhance $log so, it can log everything to the server
    /* Information about AngularJS decorator can be found at:
     * https://docs.angularjs.org/api/auto/service/$provide
     */

    $provide.decorator('$log', ['$delegate','$window','LocationOfClientFactory','apiServerUrl',function ($delegate,$window,LocationOfClientFactory,apiServerUrl){
        // delegate is the original instance of $log
        var logBuffer = [];
        var levels = ['debug', 'info', 'warn', 'error'];
        var contentType = 'application/json; charset=UTF-8';
        var user = {};
        var accessToken = "";
        var locationData = {};
        LocationOfClientFactory.getLocation(function(data){
            locationData = data;
            //console.log(">>$provide.decorator",locationData);
        });


        _.each(levels, function (level) {
            //console.log("$log-services.level = ",level);

            // storing the original function
            var original = $delegate[level];

            // creating a wrapped version of each $log level function
            // _.wrap is from the underscore.js library
            $delegate[level] = _.wrap(original, function (original) {

                // logger data to be sent/logged to console
                var data = Array.prototype.slice.call(arguments, 1);
                // call to the original function which will write to the console
                original.apply($delegate, data);

                /* The angular $http service cannot be used in the $log
                 * decorator because it will cause a circular dependecy.
                 * To overcome this  a direct ajax call should be made.
                 */
                //console.log(">>>log = ",data);
                var logRecord = {
                    userid: user.id,
                    logtime:  buildTimeString(new Date()),
                    content1: data[0],
                    browser: locationData.browser,
                    country: locationData.country,
                    fingerprint: locationData.fingerprint,
                    ip: locationData.ip,
                    loc: locationData.loc,
                    region: locationData.region
                };

                if(data.length > 1){
                    logRecord.content2 = CircularJSON.stringify(data[1]);///JSON.stringify(data[1]) + ".";
                    //console.log("logRecord.content2="+logRecord.content2);
                }

                logBuffer.push(logRecord);

                //console.log(" >>>>>>>>> $log:",logBuffer.length,logBuffer);
                //saving logs
                if(logBuffer.length > 10){
                    /*
                    $.ajax({
                        url: "http://localhost:3000/api/AngularLogs/insertLogs",
                        crossDomain: true
                        method: 'POST',
                        data:{logs:logBuffer},
                        success: function(data){
                            //console.log('succes: '+data);
                            logBuffer = [];
                        }
                    });
                    */
                    save();
                }
            });
        });

        var save = function(){
            //console.log(" >>>>>>>>> $log: saving.....",logBuffer);
            var tempLogBuffer = logBuffer;
            logBuffer = [];
            $.post(apiServerUrl + "/AngularLogs/insertLogs?access_token="+accessToken, {logs:tempLogBuffer}).then(function(succ){

            },
            function(err){
                //console.log("Insert into logs fail ",err);
            });
        };

        var getBrowser = function() {

            var userAgent = $window.navigator.userAgent;

            var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

            for(var key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            };

            return 'unknown';
        };

        colorify = function (message, colorCSS)
        {
            var isChrome = (getBrowser() == "chrome") || (getBrowser() == "phantomjs") ,
                canColorize = isChrome && (colorCSS !== undefined);

            return canColorize ? ["%c" + message, colorCSS] : [message];
        };

        var prepareLogFn = function (logFn,logName, className, colorCSS)
        {
            /**
             * Invoke the specified `logFn` with the supplant functionality...
             */
            var enhancedLogFn = function ()
            {
                try
                {
                    var args = Array.prototype.slice.call(arguments),
                        now = buildTimeString(new Date());

                    // prepend a timestamp and optional classname to the original output message
                    //console.log(" >>>>>>>>>>>>prepareLogFn.args = ", args);
                    args[0] = supplant("{0} - {1}{2}", [now, className, args[0]]);
                    //console.log("args[0] = ",args[0]);
                    //console.log("args = ",args);
                    //args = colorify( args[0], colorCSS);
                    //console.log("args = ",args);
                    //console.log(" >>>>>>>>>>>>prepareLogFn.args = ", args);
                    logFn.apply(null, args);
                    if(logName.indexOf('error') >= 0){
                        save();
                    }

                }
                catch(error)
                {
                    console.log("LogEnhancer ERROR: " + error);
                }

            };

            // Only needed to support angular-mocks expectations
            enhancedLogFn.logs = [];

            return enhancedLogFn;
        };

        var getInstance = function (className, colorCSS, customSeparator)
        {
            //console.log("$log.getInstance ok");

            var separator = "::";

            className = (className !== undefined) ? className + (customSeparator || separator) : "";

            //Add setUser meothod to $log
            $delegate.setUser = function(userObj){
                user = userObj;
                //console.log("$log.setUser = ",userObj);
            };

            $delegate.setAccessToken = function(tk){
                accessToken = tk;
                //console.log("$log.setAccessToken = ",accessToken);
            };

            $delegate.save = save;

            var instance = {
                log: prepareLogFn($delegate.log,'log', className, colorCSS),
                info: prepareLogFn($delegate.info,'info', className, colorCSS),
                warn: prepareLogFn($delegate.warn,'warn', className, colorCSS),
                debug: prepareLogFn($delegate.debug,'debug', className, colorCSS),
                error: prepareLogFn($delegate.error,'error', className), // NO styling of ERROR messages
                setAccessToken : $delegate.setAccessToken,
                setUser : $delegate.setUser,
                save: $delegate.save
            };

            return instance;
        };

        // Add special method to AngularJS $log
        $delegate.getInstance = getInstance;

        //Add setUser meothod to $log
        $delegate.setUser = function(userObj){
            user = userObj;
            //console.log("$log.setUser = ",userObj);
        };

        $delegate.save = save;

        // returning to $log object with the new wrapped log-level functions
        return $delegate;
    }
    ]);
}
]);

/**
 * Created by phuongnguyen on 18/01/16.
 */

var getPort = function(){
    console.log("Current length port is : " +(window.location.port.length   + ""));
    if(window.location.port.length ==0)
    {
        console.log('api port = 443');
        return 443;
    }else{
        console.log('api port = 2000');
        return 8181;
    }
};

angular
    .module('helper', [
    ])
    .factory("apiServerUrl",function() {
        // "printStackTrace" is a global object.
        return "https://medicalbookings.redimed.com.au:"+getPort()+"/api";
    })
    .factory("serverUrl",function() {
        // "printStackTrace" is a global object.
        return "https://medicalbookings.redimed.com.au:"+getPort();
    })
    //  Fingerprint library is the global scope, but we want use as service in angular
    // this is used to indentify the computer of the user
    .service("fingerPrint",function() {
        // "Fingerprint" is a global object.
        return function(){
            var fingerPrint = new Fingerprint().get();
            return fingerPrint;
        };
    })
    /// This service is used to provide the browser name of the client
    .service('browser', ['$window', function($window) {

        var userAgent = $window.navigator.userAgent;
        var browser = 'unknow';
        console.log("userAgent = ",userAgent);
        var browsers = {edge:/Edge/i,chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie11: /Trident/i, ie10: /MSIE 10/i, ie9: /MSIE 9/i, ie8: /MSIE 8/i, ie7: /MSIE 7/i, ie6: /MSIE 6/i};

        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                browser = key;
                break;
            }
        };

        return function() {
            console.log("browser = ",browser);
            return browser;
        }

    }])
    .factory('LocationOfClientFactory',['browser','fingerPrint','$window',function(browser,fingerPrint,$window){

        var location;
        return{
            getLocation: function(cb){
                //console.log("LocationOfClientFactory 1",location);
                if(location){
                    location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');
                    //console.log("LocationOfClientFactory 5",location);
                    cb(location);
                }else{
                    // by default, use the service from http://ipinfo.io/json , however, this service just allow to call 1000 api per day
                    // so, if excess the limit, will call http://api.ipify.org/?format=json to get the IP

                    /*
                    $.get("http://ipinfo.io/json")
                        .success(function(ipData){
                            //console.log("LocationOfClientFactory 2",ipData);
                            location = {};
                            location.ip = ipData.ip;
                            location.hostname = ipData.hostname;
                            location.region = ipData.region;
                            location.country = ipData.country;
                            location.loc = ipData.loc;
                            location.org = ipData.org;
                            location.postal = ipData.postal;
                            location.browser =browser();
                            location.fingerprint = fingerPrint();
                            location.errorurl = $window.location.href;
                            location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');
                            console.log(">>LocationOfClientFactory",location);
                            cb(location);
                        })
                        .error(function(e){
                            //console.log("LocationOfClientFactory 4",e);
                            $.get("https://api.ipify.org/?format=json").success(function(ipData){
                                    //console.log("LocationOfClientFactory 3",ipData);
                                    location = {};
                                    location.ip = ipData.ip;
                                    location.browser =browser();
                                    location.fingerprint = fingerPrint();
                                    location.errorurl = $window.location.href;
                                    location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');

                                    console.log(">>LocationOfClientFactory",location);
                                    cb(location);
                                });
                        });
                    */
                    $.get("https://api.ipify.org/?format=json").success(function(ipData){
                            //console.log("LocationOfClientFactory 3",ipData);
                            location = {};
                            location.ip = ipData.ip;
                            location.browser =browser();
                            location.fingerprint = fingerPrint();
                            location.errorurl = $window.location.href;
                            location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');

                            //console.log(">>LocationOfClientFactory",location);
                            cb(location);
                        });
                }
            }
        }

    }])
    // Converts MySQL datetime into readable format
    /*
     Converts 2013-10-18T18:47:15.00 into 1382122035000 so angular can format date
     */
    .filter('dateFilter', function() {
        return function(dateSTR) {
            if(dateSTR){
                var t = dateSTR.split(/[- : T .]/);
                // Apply each element to the Date function
                var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                //console.log(t,"   ",d);
                return d; // No TZ subtraction on this sample
            }
            return "";
        }
    })
    .factory('mysqlDate',function(){
        return function(dateSTR) {
            if(dateSTR){
                //console.log(dateSTR);
                var t = dateSTR.split(/[- : T .]/);
                // Apply each element to the Date function
                if(t.length >=6){
                    var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                    //console.log(t,"   ",d);
                    return d; // No TZ subtraction on this sample
                }else{
                    var d = new Date(t[0], t[1]-1, t[2]);
                    //console.log(t,"   ",d);
                    return d; // No TZ subtraction on this sample
                }

            }
            return "";
        }
    })
    .factory('storeToken',function(){
        var accessToken = "";

        return {
            setAccessToken: function(tk){
                accessToken = tk;
            },
            getAccessToken: function(){
                return accessToken;
            }
        };
    });

(function(window, angular, undefined) {'use strict';

var getPort = function(){
    console.log("Current length port is : " +(window.location.port.length   + ""));
    if(window.location.port.length ==0)
    {
        console.log('api port = 443');
        return 443;
    }else{
        console.log('api port = 2000');
        return 2000;
    }
};

var urlBase = "https://medicalbookings.redimed.com.au:" + getPort() + "/api";
var authHeader = 'authorization';

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.User
 * @header lbServices.User
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `User` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "User",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Users/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use User.accessTokens.findById() instead.
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "GET"
        },

        // INTERNAL. Use User.accessTokens.destroyById() instead.
        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use User.accessTokens.updateById() instead.
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use User.accessTokens() instead.
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/Users/:id/accessTokens",
          method: "GET"
        },

        // INTERNAL. Use User.accessTokens.create() instead.
        "prototype$__create__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "POST"
        },

        // INTERNAL. Use User.accessTokens.destroyAll() instead.
        "prototype$__delete__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "DELETE"
        },

        // INTERNAL. Use User.accessTokens.count() instead.
        "prototype$__count__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#create
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#createMany
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#upsert
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Users",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#exists
         * @methodOf lbServices.User
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Users/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#findById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Users/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#find
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Users",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#findOne
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Users/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#updateAll
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Users/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#deleteById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Users/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#count
         * @methodOf lbServices.User
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Users/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$updateAttributes
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Users/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#createChangeStream
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Users/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#login
         * @methodOf lbServices.User
         *
         * @description
         *
         * Login a user with username/email and password.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         *
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         *
         *
         */
        "login": {
          params: {
            include: [{relation:'user',scope:{include:['AccountCompanies']}}]
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/Users/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#logout
         * @methodOf lbServices.User
         *
         * @description
         *
         * Logout a user with access token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/Users/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#confirm
         * @methodOf lbServices.User
         *
         * @description
         *
         * Confirm a user registration with email verification token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` -
         *
         *  - `token` – `{string}` -
         *
         *  - `redirect` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/Users/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#resetPassword
         * @methodOf lbServices.User
         *
         * @description
         *
         * Reset password for a user with email.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/Users/reset",
          method: "POST"
        },

        // INTERNAL. Use AccessToken.user() instead.
        "::get::AccessToken::user": {
          url: urlBase + "/AccessTokens/:id/user",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#getCurrent
         * @methodOf lbServices.User
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/Users" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.User#updateOrCreate
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.User#update
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.User#destroyById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.User#removeById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.User#getCachedCurrent
         * @methodOf lbServices.User
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.User#login} or
         * {@link lbServices.User#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A User instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.User#isAuthenticated
         * @methodOf lbServices.User
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.User#getCurrentId
         * @methodOf lbServices.User
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name lbServices.User#modelName
    * @propertyOf lbServices.User
    * @description
    * The name of the model represented by this $resource,
    * i.e. `User`.
    */
    R.modelName = "User";

    /**
     * @ngdoc object
     * @name lbServices.User.accessTokens
     * @header lbServices.User.accessTokens
     * @object
     * @description
     *
     * The object `User.accessTokens` groups methods
     * manipulating `AccessToken` instances related to `User`.
     *
     * Call {@link lbServices.User#accessTokens User.accessTokens()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.User#accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Queries accessTokens of User.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::get::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#count
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Counts accessTokens of User.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.accessTokens.count = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::count::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#create
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.create = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::create::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#createMany
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.createMany = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::createMany::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#destroyAll
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.accessTokens.destroyAll = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::delete::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#destroyById
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Delete a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.accessTokens.destroyById = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::destroyById::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#findById
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Find a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.findById = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::findById::User::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.accessTokens#updateById
         * @methodOf lbServices.User.accessTokens
         *
         * @description
         *
         * Update a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.updateById = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::updateById::User::accessTokens"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.AccessToken
 * @header lbServices.AccessToken
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `AccessToken` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "AccessToken",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/AccessTokens/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use AccessToken.user() instead.
        "prototype$__get__user": {
          url: urlBase + "/AccessTokens/:id/user",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#create
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/AccessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#createMany
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/AccessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#upsert
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/AccessTokens",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#exists
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/AccessTokens/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#findById
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/AccessTokens/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#find
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/AccessTokens",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#findOne
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/AccessTokens/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#updateAll
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/AccessTokens/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#deleteById
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/AccessTokens/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#count
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/AccessTokens/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#prototype$updateAttributes
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/AccessTokens/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#createChangeStream
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/AccessTokens/change-stream",
          method: "POST"
        },

        // INTERNAL. Use User.accessTokens.findById() instead.
        "::findById::User::accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "GET"
        },

        // INTERNAL. Use User.accessTokens.destroyById() instead.
        "::destroyById::User::accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use User.accessTokens.updateById() instead.
        "::updateById::User::accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use User.accessTokens() instead.
        "::get::User::accessTokens": {
          isArray: true,
          url: urlBase + "/Users/:id/accessTokens",
          method: "GET"
        },

        // INTERNAL. Use User.accessTokens.create() instead.
        "::create::User::accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "POST"
        },

        // INTERNAL. Use User.accessTokens.createMany() instead.
        "::createMany::User::accessTokens": {
          isArray: true,
          url: urlBase + "/Users/:id/accessTokens",
          method: "POST"
        },

        // INTERNAL. Use User.accessTokens.destroyAll() instead.
        "::delete::User::accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "DELETE"
        },

        // INTERNAL. Use User.accessTokens.count() instead.
        "::count::User::accessTokens": {
          url: urlBase + "/Users/:id/accessTokens/count",
          method: "GET"
        },

        // INTERNAL. Use Accounts.accessTokens.findById() instead.
        "::findById::accounts::accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/accounts/:id/accessTokens/:fk",
          method: "GET"
        },

        // INTERNAL. Use Accounts.accessTokens.destroyById() instead.
        "::destroyById::accounts::accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/accounts/:id/accessTokens/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Accounts.accessTokens.updateById() instead.
        "::updateById::accounts::accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/accounts/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Accounts.accessTokens() instead.
        "::get::accounts::accessTokens": {
          isArray: true,
          url: urlBase + "/accounts/:id/accessTokens",
          method: "GET"
        },

        // INTERNAL. Use Accounts.accessTokens.create() instead.
        "::create::accounts::accessTokens": {
          url: urlBase + "/accounts/:id/accessTokens",
          method: "POST"
        },

        // INTERNAL. Use Accounts.accessTokens.createMany() instead.
        "::createMany::accounts::accessTokens": {
          isArray: true,
          url: urlBase + "/accounts/:id/accessTokens",
          method: "POST"
        },

        // INTERNAL. Use Accounts.accessTokens.destroyAll() instead.
        "::delete::accounts::accessTokens": {
          url: urlBase + "/accounts/:id/accessTokens",
          method: "DELETE"
        },

        // INTERNAL. Use Accounts.accessTokens.count() instead.
        "::count::accounts::accessTokens": {
          url: urlBase + "/accounts/:id/accessTokens/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.AccessToken#updateOrCreate
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#update
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#destroyById
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.AccessToken#removeById
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.AccessToken#modelName
    * @propertyOf lbServices.AccessToken
    * @description
    * The name of the model represented by this $resource,
    * i.e. `AccessToken`.
    */
    R.modelName = "AccessToken";


        /**
         * @ngdoc method
         * @name lbServices.AccessToken#user
         * @methodOf lbServices.AccessToken
         *
         * @description
         *
         * Fetches belongsTo relation user.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R.user = function() {
          var TargetResource = $injector.get("User");
          var action = TargetResource["::get::AccessToken::user"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Accounts
 * @header lbServices.Accounts
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Accounts` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Accounts",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/accounts/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Accounts.accessTokens.findById() instead.
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/accounts/:id/accessTokens/:fk",
          method: "GET"
        },

        // INTERNAL. Use Accounts.accessTokens.destroyById() instead.
        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/accounts/:id/accessTokens/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Accounts.accessTokens.updateById() instead.
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/accounts/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Accounts.company() instead.
        "prototype$__get__company": {
          url: urlBase + "/accounts/:id/company",
          method: "GET"
        },

        // INTERNAL. Use Accounts.accessTokens() instead.
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/accounts/:id/accessTokens",
          method: "GET"
        },

        // INTERNAL. Use Accounts.accessTokens.create() instead.
        "prototype$__create__accessTokens": {
          url: urlBase + "/accounts/:id/accessTokens",
          method: "POST"
        },

        // INTERNAL. Use Accounts.accessTokens.destroyAll() instead.
        "prototype$__delete__accessTokens": {
          url: urlBase + "/accounts/:id/accessTokens",
          method: "DELETE"
        },

        // INTERNAL. Use Accounts.accessTokens.count() instead.
        "prototype$__count__accessTokens": {
          url: urlBase + "/accounts/:id/accessTokens/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#create
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/accounts",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#createMany
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/accounts",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#upsert
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/accounts",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#exists
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/accounts/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#findById
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/accounts/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#find
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/accounts",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#findOne
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/accounts/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#updateAll
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/accounts/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#deleteById
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/accounts/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#count
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/accounts/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#prototype$updateAttributes
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/accounts/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#createChangeStream
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/accounts/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#login
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Login a user with username/email and password.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         *
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         *
         *
         */
        "login": {
          params: {
            include: 'user'
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/accounts/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#logout
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Logout a user with access token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/accounts/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#confirm
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Confirm a user registration with email verification token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` -
         *
         *  - `token` – `{string}` -
         *
         *  - `redirect` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/accounts/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#resetPassword
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Reset password for a user with email.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/accounts/reset",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#updateAccount
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `users` – `{*=}` -
         */
        "updateAccount": {
          url: urlBase + "/accounts/updateAccount",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#updatePassword
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `users` – `{*=}` -
         */
        "updatePassword": {
          url: urlBase + "/accounts/updatePassword",
          method: "POST"
        },
        "setCompany": {
          url: urlBase + "/accounts/setCompany",
          method: "POST"
        },
        // INTERNAL. Use Companies.accounts.findById() instead.
        "::findById::Companies::accounts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/accounts/:fk",
          method: "GET"
        },

        // INTERNAL. Use Companies.accounts.destroyById() instead.
        "::destroyById::Companies::accounts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/accounts/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.accounts.updateById() instead.
        "::updateById::Companies::accounts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/accounts/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Companies.accounts() instead.
        "::get::Companies::accounts": {
          isArray: true,
          url: urlBase + "/Companies/:id/accounts",
          method: "GET"
        },

        // INTERNAL. Use Companies.accounts.create() instead.
        "::create::Companies::accounts": {
          url: urlBase + "/Companies/:id/accounts",
          method: "POST"
        },

        // INTERNAL. Use Companies.accounts.createMany() instead.
        "::createMany::Companies::accounts": {
          isArray: true,
          url: urlBase + "/Companies/:id/accounts",
          method: "POST"
        },

        // INTERNAL. Use Companies.accounts.destroyAll() instead.
        "::delete::Companies::accounts": {
          url: urlBase + "/Companies/:id/accounts",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.accounts.count() instead.
        "::count::Companies::accounts": {
          url: urlBase + "/Companies/:id/accounts/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Accounts#getCurrent
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/accounts" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Accounts#updateOrCreate
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Accounts#update
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Accounts#destroyById
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Accounts#removeById
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Accounts#getCachedCurrent
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.Accounts#login} or
         * {@link lbServices.Accounts#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A Accounts instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts#isAuthenticated
         * @methodOf lbServices.Accounts
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts#getCurrentId
         * @methodOf lbServices.Accounts
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name lbServices.Accounts#modelName
    * @propertyOf lbServices.Accounts
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Accounts`.
    */
    R.modelName = "Accounts";

    /**
     * @ngdoc object
     * @name lbServices.Accounts.accessTokens
     * @header lbServices.Accounts.accessTokens
     * @object
     * @description
     *
     * The object `Accounts.accessTokens` groups methods
     * manipulating `AccessToken` instances related to `Accounts`.
     *
     * Call {@link lbServices.Accounts#accessTokens Accounts.accessTokens()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Accounts#accessTokens
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Queries accessTokens of accounts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::get::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#count
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Counts accessTokens of accounts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.accessTokens.count = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::count::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#create
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.create = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::create::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#createMany
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.createMany = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::createMany::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#destroyAll
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.accessTokens.destroyAll = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::delete::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#destroyById
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Delete a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.accessTokens.destroyById = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::destroyById::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#findById
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Find a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.findById = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::findById::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts.accessTokens#updateById
         * @methodOf lbServices.Accounts.accessTokens
         *
         * @description
         *
         * Update a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AccessToken` object.)
         * </em>
         */
        R.accessTokens.updateById = function() {
          var TargetResource = $injector.get("AccessToken");
          var action = TargetResource["::updateById::accounts::accessTokens"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Accounts#company
         * @methodOf lbServices.Accounts
         *
         * @description
         *
         * Fetches belongsTo relation company.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        R.company = function() {
          var TargetResource = $injector.get("Companies");
          var action = TargetResource["::get::accounts::company"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.BookingHeaders
 * @header lbServices.BookingHeaders
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `BookingHeaders` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "BookingHeaders",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/BookingHeaders/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use BookingHeaders.candidates.findById() instead.
        "prototype$__findById__candidates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/BookingHeaders/:id/candidates/:fk",
          method: "GET"
        },

        // INTERNAL. Use BookingHeaders.candidates.destroyById() instead.
        "prototype$__destroyById__candidates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/BookingHeaders/:id/candidates/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use BookingHeaders.candidates.updateById() instead.
        "prototype$__updateById__candidates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/BookingHeaders/:id/candidates/:fk",
          method: "PUT"
        },

        // INTERNAL. Use BookingHeaders.candidates() instead.
        "prototype$__get__candidates": {
          isArray: true,
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "GET"
        },

        // INTERNAL. Use BookingHeaders.candidates.create() instead.
        "prototype$__create__candidates": {
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "POST"
        },

        // INTERNAL. Use BookingHeaders.candidates.destroyAll() instead.
        "prototype$__delete__candidates": {
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "DELETE"
        },

        // INTERNAL. Use BookingHeaders.candidates.count() instead.
        "prototype$__count__candidates": {
          url: urlBase + "/BookingHeaders/:id/candidates/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#create
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/BookingHeaders",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#createMany
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/BookingHeaders",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#upsert
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/BookingHeaders",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#exists
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/BookingHeaders/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#findById
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/BookingHeaders/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#find
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/BookingHeaders",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#findOne
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/BookingHeaders/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#updateAll
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/BookingHeaders/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#deleteById
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/BookingHeaders/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#count
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/BookingHeaders/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#prototype$updateAttributes
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/BookingHeaders/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#createChangeStream
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/BookingHeaders/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#submitBooking
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `booking` – `{*=}` -
         */
        "submitBooking": {
          url: urlBase + "/BookingHeaders/submitBooking",
          method: "POST"
        },

        "emailBookingForm": {
          url: urlBase + "/BookingHeaders/emailBookingForm",
          method: "POST"
        },

        "submitPhoneBooking": {
          url: urlBase + "/BookingHeaders/submitPhoneBooking",
          method: "POST"
        },

      }
    );



        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#updateOrCreate
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#update
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#destroyById
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#removeById
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingHeaders` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.BookingHeaders#modelName
    * @propertyOf lbServices.BookingHeaders
    * @description
    * The name of the model represented by this $resource,
    * i.e. `BookingHeaders`.
    */
    R.modelName = "BookingHeaders";

    /**
     * @ngdoc object
     * @name lbServices.BookingHeaders.candidates
     * @header lbServices.BookingHeaders.candidates
     * @object
     * @description
     *
     * The object `BookingHeaders.candidates` groups methods
     * manipulating `BookingCandidates` instances related to `BookingHeaders`.
     *
     * Call {@link lbServices.BookingHeaders#candidates BookingHeaders.candidates()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders#candidates
         * @methodOf lbServices.BookingHeaders
         *
         * @description
         *
         * Queries candidates of BookingHeaders.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R.candidates = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::get::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#count
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Counts candidates of BookingHeaders.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.candidates.count = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::count::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#create
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Creates a new instance in candidates of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R.candidates.create = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::create::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#createMany
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Creates a new instance in candidates of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R.candidates.createMany = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::createMany::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#destroyAll
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Deletes all candidates of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.candidates.destroyAll = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::delete::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#destroyById
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Delete a related item by id for candidates.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for candidates
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.candidates.destroyById = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::destroyById::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#findById
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Find a related item by id for candidates.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for candidates
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R.candidates.findById = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::findById::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.BookingHeaders.candidates#updateById
         * @methodOf lbServices.BookingHeaders.candidates
         *
         * @description
         *
         * Update a related item by id for candidates.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for candidates
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R.candidates.updateById = function() {
          var TargetResource = $injector.get("BookingCandidates");
          var action = TargetResource["::updateById::BookingHeaders::candidates"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.BookingCandidates
 * @header lbServices.BookingCandidates
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `BookingCandidates` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "BookingCandidates",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/BookingCandidates/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#create
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/BookingCandidates",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#createMany
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/BookingCandidates",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#upsert
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/BookingCandidates",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#exists
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/BookingCandidates/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#findById
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/BookingCandidates/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#find
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/BookingCandidates",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#findOne
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/BookingCandidates/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#updateAll
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/BookingCandidates/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#deleteById
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/BookingCandidates/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#count
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/BookingCandidates/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#prototype$updateAttributes
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/BookingCandidates/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#createChangeStream
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/BookingCandidates/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#sendConfirmationEmail
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{number=}` -
         *
         *  - `type` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `sentEmailStatus` – `{*=}` -
         */
        "sendConfirmationEmail": {
          url: urlBase + "/BookingCandidates/sendConfirmationEmail",
          method: "GET"
        },

        // INTERNAL. Use BookingHeaders.candidates.findById() instead.
        "::findById::BookingHeaders::candidates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/BookingHeaders/:id/candidates/:fk",
          method: "GET"
        },

        // INTERNAL. Use BookingHeaders.candidates.destroyById() instead.
        "::destroyById::BookingHeaders::candidates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/BookingHeaders/:id/candidates/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use BookingHeaders.candidates.updateById() instead.
        "::updateById::BookingHeaders::candidates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/BookingHeaders/:id/candidates/:fk",
          method: "PUT"
        },

        // INTERNAL. Use BookingHeaders.candidates() instead.
        "::get::BookingHeaders::candidates": {
          isArray: true,
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "GET"
        },

        // INTERNAL. Use BookingHeaders.candidates.create() instead.
        "::create::BookingHeaders::candidates": {
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "POST"
        },

        // INTERNAL. Use BookingHeaders.candidates.createMany() instead.
        "::createMany::BookingHeaders::candidates": {
          isArray: true,
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "POST"
        },

        // INTERNAL. Use BookingHeaders.candidates.destroyAll() instead.
        "::delete::BookingHeaders::candidates": {
          url: urlBase + "/BookingHeaders/:id/candidates",
          method: "DELETE"
        },

        // INTERNAL. Use BookingHeaders.candidates.count() instead.
        "::count::BookingHeaders::candidates": {
          url: urlBase + "/BookingHeaders/:id/candidates/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#updateOrCreate
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#update
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#destroyById
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidates#removeById
         * @methodOf lbServices.BookingCandidates
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidates` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.BookingCandidates#modelName
    * @propertyOf lbServices.BookingCandidates
    * @description
    * The name of the model represented by this $resource,
    * i.e. `BookingCandidates`.
    */
    R.modelName = "BookingCandidates";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Positions
 * @header lbServices.Positions
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Positions` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Positions",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Positions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.Positions#create
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Positions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#createMany
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Positions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#upsert
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Positions",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#exists
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Positions/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#findById
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Positions/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#find
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Positions",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#findOne
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Positions/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#updateAll
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Positions/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#deleteById
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Positions/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#count
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Positions/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#prototype$updateAttributes
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Positions/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Positions#createChangeStream
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Positions/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Companies.positions.findById() instead.
        "::findById::Companies::positions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/positions/:fk",
          method: "GET"
        },

        // INTERNAL. Use Companies.positions.destroyById() instead.
        "::destroyById::Companies::positions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/positions/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.positions.updateById() instead.
        "::updateById::Companies::positions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/positions/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Companies.positions() instead.
        "::get::Companies::positions": {
          isArray: true,
          url: urlBase + "/Companies/:id/positions",
          method: "GET"
        },

        // INTERNAL. Use Companies.positions.create() instead.
        "::create::Companies::positions": {
          url: urlBase + "/Companies/:id/positions",
          method: "POST"
        },

        // INTERNAL. Use Companies.positions.createMany() instead.
        "::createMany::Companies::positions": {
          isArray: true,
          url: urlBase + "/Companies/:id/positions",
          method: "POST"
        },

        // INTERNAL. Use Companies.positions.destroyAll() instead.
        "::delete::Companies::positions": {
          url: urlBase + "/Companies/:id/positions",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.positions.count() instead.
        "::count::Companies::positions": {
          url: urlBase + "/Companies/:id/positions/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Positions#updateOrCreate
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Positions#update
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Positions#destroyById
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Positions#removeById
         * @methodOf lbServices.Positions
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Positions#modelName
    * @propertyOf lbServices.Positions
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Positions`.
    */
    R.modelName = "Positions";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Packages
 * @header lbServices.Packages
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Packages` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Packages",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Packages/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__findById__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Find a related item by id for Assessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Assessments
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__findById__Assessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/Assessments/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__destroyById__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Delete a related item by id for Assessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Assessments
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__Assessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/Assessments/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__updateById__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update a related item by id for Assessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Assessments
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__updateById__Assessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/Assessments/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__link__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Add a related item by id for Assessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Assessments
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__link__Assessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/Assessments/rel/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__unlink__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Remove the Assessments relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Assessments
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__unlink__Assessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/Assessments/rel/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__exists__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Check the existence of Assessments relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Assessments
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__exists__Assessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/Assessments/rel/:fk",
          method: "HEAD"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__findById__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Find a related item by id for packagesAssessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for packagesAssessments
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__findById__packagesAssessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/packagesAssessments/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__destroyById__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Delete a related item by id for packagesAssessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for packagesAssessments
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__packagesAssessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/packagesAssessments/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__updateById__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update a related item by id for packagesAssessments.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for packagesAssessments
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__updateById__packagesAssessments": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/packagesAssessments/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__findById__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Find a related item by id for AssessmentHeaders.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for AssessmentHeaders
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__findById__AssessmentHeaders": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/AssessmentHeaders/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__destroyById__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Delete a related item by id for AssessmentHeaders.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for AssessmentHeaders
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__AssessmentHeaders": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/AssessmentHeaders/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__updateById__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update a related item by id for AssessmentHeaders.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for AssessmentHeaders
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__updateById__AssessmentHeaders": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Packages/:id/AssessmentHeaders/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__get__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Queries Assessments of Packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__get__Assessments": {
          isArray: true,
          url: urlBase + "/Packages/:id/Assessments",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__create__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Creates a new instance in Assessments of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__create__Assessments": {
          url: urlBase + "/Packages/:id/Assessments",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__delete__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Deletes all Assessments of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__Assessments": {
          url: urlBase + "/Packages/:id/Assessments",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__count__Assessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Counts Assessments of Packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__Assessments": {
          url: urlBase + "/Packages/:id/Assessments/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__get__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Queries packagesAssessments of Packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__get__packagesAssessments": {
          isArray: true,
          url: urlBase + "/Packages/:id/packagesAssessments",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__create__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Creates a new instance in packagesAssessments of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__create__packagesAssessments": {
          url: urlBase + "/Packages/:id/packagesAssessments",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__delete__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Deletes all packagesAssessments of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__packagesAssessments": {
          url: urlBase + "/Packages/:id/packagesAssessments",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__count__packagesAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Counts packagesAssessments of Packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__packagesAssessments": {
          url: urlBase + "/Packages/:id/packagesAssessments/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__get__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Queries AssessmentHeaders of Packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__get__AssessmentHeaders": {
          isArray: true,
          url: urlBase + "/Packages/:id/AssessmentHeaders",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__create__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Creates a new instance in AssessmentHeaders of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$__create__AssessmentHeaders": {
          url: urlBase + "/Packages/:id/AssessmentHeaders",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__delete__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Deletes all AssessmentHeaders of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__AssessmentHeaders": {
          url: urlBase + "/Packages/:id/AssessmentHeaders",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$__count__AssessmentHeaders
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Counts AssessmentHeaders of Packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__AssessmentHeaders": {
          url: urlBase + "/Packages/:id/AssessmentHeaders/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#create
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Packages",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#createMany
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Packages",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#upsert
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Packages",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#exists
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Packages/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#findById
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Packages/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#find
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Packages",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#findOne
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Packages/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#updateAll
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Packages/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#deleteById
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Packages/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#count
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Packages/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#prototype$updateAttributes
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Packages/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#createChangeStream
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Packages/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#upsertPackage
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `upsertPackage` – `{*=}` -
         */
        "upsertPackage": {
          url: urlBase + "/Packages/upsertPackage",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Packages#listAssessments
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{number=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `packages` – `{*=}` -
         */
        "listAssessments": {
          url: urlBase + "/Packages/assessments",
          method: "GET"
        },

        // INTERNAL. Use Companies.packages.findById() instead.
        "::findById::Companies::packages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/packages/:fk",
          method: "GET"
        },

        // INTERNAL. Use Companies.packages.destroyById() instead.
        "::destroyById::Companies::packages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/packages/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.packages.updateById() instead.
        "::updateById::Companies::packages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/packages/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Companies.packages() instead.
        "::get::Companies::packages": {
          isArray: true,
          url: urlBase + "/Companies/:id/packages",
          method: "GET"
        },

        // INTERNAL. Use Companies.packages.create() instead.
        "::create::Companies::packages": {
          url: urlBase + "/Companies/:id/packages",
          method: "POST"
        },

        // INTERNAL. Use Companies.packages.createMany() instead.
        "::createMany::Companies::packages": {
          isArray: true,
          url: urlBase + "/Companies/:id/packages",
          method: "POST"
        },

        // INTERNAL. Use Companies.packages.destroyAll() instead.
        "::delete::Companies::packages": {
          url: urlBase + "/Companies/:id/packages",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.packages.count() instead.
        "::count::Companies::packages": {
          url: urlBase + "/Companies/:id/packages/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Packages#updateOrCreate
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Packages#update
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Packages#destroyById
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Packages#removeById
         * @methodOf lbServices.Packages
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Packages#modelName
    * @propertyOf lbServices.Packages
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Packages`.
    */
    R.modelName = "Packages";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Companies
 * @header lbServices.Companies
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Companies` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Companies",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Companies/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Companies.packages.findById() instead.
        "prototype$__findById__packages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/packages/:fk",
          method: "GET"
        },

        // INTERNAL. Use Companies.packages.destroyById() instead.
        "prototype$__destroyById__packages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/packages/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.packages.updateById() instead.
        "prototype$__updateById__packages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/packages/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Companies.positions.findById() instead.
        "prototype$__findById__positions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/positions/:fk",
          method: "GET"
        },

        // INTERNAL. Use Companies.positions.destroyById() instead.
        "prototype$__destroyById__positions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/positions/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.positions.updateById() instead.
        "prototype$__updateById__positions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/positions/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Companies.accounts.findById() instead.
        "prototype$__findById__accounts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/accounts/:fk",
          method: "GET"
        },

        // INTERNAL. Use Companies.accounts.destroyById() instead.
        "prototype$__destroyById__accounts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/accounts/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.accounts.updateById() instead.
        "prototype$__updateById__accounts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/accounts/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__findById__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Find a related item by id for subsidiaries.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for subsidiaries
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__findById__subsidiaries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/subsidiaries/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__destroyById__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Delete a related item by id for subsidiaries.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for subsidiaries
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__subsidiaries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/subsidiaries/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__updateById__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update a related item by id for subsidiaries.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for subsidiaries
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__updateById__subsidiaries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/subsidiaries/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__findById__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Find a related item by id for bookings.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for bookings
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__findById__bookings": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/bookings/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__destroyById__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Delete a related item by id for bookings.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for bookings
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__bookings": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/bookings/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__updateById__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update a related item by id for bookings.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for bookings
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__updateById__bookings": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Companies/:id/bookings/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Companies.packages() instead.
        "prototype$__get__packages": {
          isArray: true,
          url: urlBase + "/Companies/:id/packages",
          method: "GET"
        },

        // INTERNAL. Use Companies.packages.create() instead.
        "prototype$__create__packages": {
          url: urlBase + "/Companies/:id/packages",
          method: "POST"
        },

        // INTERNAL. Use Companies.packages.destroyAll() instead.
        "prototype$__delete__packages": {
          url: urlBase + "/Companies/:id/packages",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.packages.count() instead.
        "prototype$__count__packages": {
          url: urlBase + "/Companies/:id/packages/count",
          method: "GET"
        },

        // INTERNAL. Use Companies.positions() instead.
        "prototype$__get__positions": {
          isArray: true,
          url: urlBase + "/Companies/:id/positions",
          method: "GET"
        },

        // INTERNAL. Use Companies.positions.create() instead.
        "prototype$__create__positions": {
          url: urlBase + "/Companies/:id/positions",
          method: "POST"
        },

        // INTERNAL. Use Companies.positions.destroyAll() instead.
        "prototype$__delete__positions": {
          url: urlBase + "/Companies/:id/positions",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.positions.count() instead.
        "prototype$__count__positions": {
          url: urlBase + "/Companies/:id/positions/count",
          method: "GET"
        },

        // INTERNAL. Use Companies.accounts() instead.
        "prototype$__get__accounts": {
          isArray: true,
          url: urlBase + "/Companies/:id/accounts",
          method: "GET"
        },

        // INTERNAL. Use Companies.accounts.create() instead.
        "prototype$__create__accounts": {
          url: urlBase + "/Companies/:id/accounts",
          method: "POST"
        },

        // INTERNAL. Use Companies.accounts.destroyAll() instead.
        "prototype$__delete__accounts": {
          url: urlBase + "/Companies/:id/accounts",
          method: "DELETE"
        },

        // INTERNAL. Use Companies.accounts.count() instead.
        "prototype$__count__accounts": {
          url: urlBase + "/Companies/:id/accounts/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__get__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Queries subsidiaries of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__get__subsidiaries": {
          isArray: true,
          url: urlBase + "/Companies/:id/subsidiaries",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__create__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Creates a new instance in subsidiaries of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__create__subsidiaries": {
          url: urlBase + "/Companies/:id/subsidiaries",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__delete__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Deletes all subsidiaries of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__subsidiaries": {
          url: urlBase + "/Companies/:id/subsidiaries",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__count__subsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Counts subsidiaries of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__subsidiaries": {
          url: urlBase + "/Companies/:id/subsidiaries/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__get__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Queries bookings of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__get__bookings": {
          isArray: true,
          url: urlBase + "/Companies/:id/bookings",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__create__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Creates a new instance in bookings of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$__create__bookings": {
          url: urlBase + "/Companies/:id/bookings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__delete__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Deletes all bookings of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__bookings": {
          url: urlBase + "/Companies/:id/bookings",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$__count__bookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Counts bookings of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__bookings": {
          url: urlBase + "/Companies/:id/bookings/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#create
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Companies",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#createMany
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Companies",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#upsert
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Companies",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#exists
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Companies/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#findById
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Companies/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#find
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Companies",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#findOne
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Companies/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#updateAll
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Companies/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#deleteById
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Companies/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#count
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Companies/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#prototype$updateAttributes
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Companies/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#createChangeStream
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Companies/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#getRediSubsidiaries
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `subsidiaries` – `{*=}` -
         */
        "getRediSubsidiaries": {
          url: urlBase + "/Companies/getRediSubsidiaries",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#initData
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `initData` – `{*=}` -
         */
        "initData": {
          url: urlBase + "/Companies/initData",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#getPackages
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `packages` – `{*=}` -
         */
        "getPackages": {
          url: urlBase + "/Companies/getPackages",
          method: "GET"
        },

        "getAssessments": {
          url: urlBase + "/Companies/getAssessments",
          method: "GET"
        },

        "getPhoneBookingHeader": {
          url: urlBase + "/Companies/getPhoneBookingHeader",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#listBookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `bookings` – `{*=}` -
         */
        "listBookings": {
          url: urlBase + "/Companies/listBookings",
          method: "GET"
        },
        "listTelehealthBookings": {
          url: urlBase + "/Companies/listTelehealthBookings",
          method: "GET"
        },
        /**
         * @ngdoc method
         * @name lbServices.Companies#countBookings
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{*=}` -
         */
        "countBookings": {
          url: urlBase + "/Companies/countBookings",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#listUser
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `users` – `{*=}` -
         */
        "listUser": {
          url: urlBase + "/Companies/list-user",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#getSites
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `sites` – `{*=}` -
         */
        "getSites": {
          url: urlBase + "/Companies/getSites",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#getCalendars
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `calendars` – `{*=}` -
         */
        "getCalendars": {
          url: urlBase + "/Companies/getCalendars",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Companies#getStatus
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `status` – `{*=}` -
         */
        "getStatus": {
          url: urlBase + "/Companies/getStatus",
          method: "GET"
        },

        // INTERNAL. Use Accounts.company() instead.
        "::get::accounts::company": {
          url: urlBase + "/accounts/:id/company",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Companies#updateOrCreate
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Companies#update
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Companies#destroyById
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Companies#removeById
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Companies` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Companies#modelName
    * @propertyOf lbServices.Companies
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Companies`.
    */
    R.modelName = "Companies";

    /**
     * @ngdoc object
     * @name lbServices.Companies.packages
     * @header lbServices.Companies.packages
     * @object
     * @description
     *
     * The object `Companies.packages` groups methods
     * manipulating `Packages` instances related to `Companies`.
     *
     * Call {@link lbServices.Companies#packages Companies.packages()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Companies#packages
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Queries packages of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R.packages = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::get::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#count
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Counts packages of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.packages.count = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::count::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#create
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Creates a new instance in packages of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R.packages.create = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::create::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#createMany
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Creates a new instance in packages of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R.packages.createMany = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::createMany::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#destroyAll
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Deletes all packages of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.packages.destroyAll = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::delete::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#destroyById
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Delete a related item by id for packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for packages
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.packages.destroyById = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::destroyById::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#findById
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Find a related item by id for packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for packages
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R.packages.findById = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::findById::Companies::packages"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.packages#updateById
         * @methodOf lbServices.Companies.packages
         *
         * @description
         *
         * Update a related item by id for packages.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for packages
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Packages` object.)
         * </em>
         */
        R.packages.updateById = function() {
          var TargetResource = $injector.get("Packages");
          var action = TargetResource["::updateById::Companies::packages"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Companies.positions
     * @header lbServices.Companies.positions
     * @object
     * @description
     *
     * The object `Companies.positions` groups methods
     * manipulating `Positions` instances related to `Companies`.
     *
     * Call {@link lbServices.Companies#positions Companies.positions()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Companies#positions
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Queries positions of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R.positions = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::get::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#count
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Counts positions of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.positions.count = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::count::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#create
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Creates a new instance in positions of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R.positions.create = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::create::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#createMany
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Creates a new instance in positions of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R.positions.createMany = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::createMany::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#destroyAll
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Deletes all positions of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.positions.destroyAll = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::delete::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#destroyById
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Delete a related item by id for positions.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for positions
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.positions.destroyById = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::destroyById::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#findById
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Find a related item by id for positions.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for positions
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R.positions.findById = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::findById::Companies::positions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.positions#updateById
         * @methodOf lbServices.Companies.positions
         *
         * @description
         *
         * Update a related item by id for positions.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for positions
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Positions` object.)
         * </em>
         */
        R.positions.updateById = function() {
          var TargetResource = $injector.get("Positions");
          var action = TargetResource["::updateById::Companies::positions"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Companies.accounts
     * @header lbServices.Companies.accounts
     * @object
     * @description
     *
     * The object `Companies.accounts` groups methods
     * manipulating `Accounts` instances related to `Companies`.
     *
     * Call {@link lbServices.Companies#accounts Companies.accounts()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Companies#accounts
         * @methodOf lbServices.Companies
         *
         * @description
         *
         * Queries accounts of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R.accounts = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::get::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#count
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Counts accounts of Companies.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.accounts.count = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::count::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#create
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Creates a new instance in accounts of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R.accounts.create = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::create::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#createMany
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Creates a new instance in accounts of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R.accounts.createMany = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::createMany::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#destroyAll
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Deletes all accounts of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.accounts.destroyAll = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::delete::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#destroyById
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Delete a related item by id for accounts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for accounts
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.accounts.destroyById = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::destroyById::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#findById
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Find a related item by id for accounts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for accounts
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R.accounts.findById = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::findById::Companies::accounts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Companies.accounts#updateById
         * @methodOf lbServices.Companies.accounts
         *
         * @description
         *
         * Update a related item by id for accounts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for accounts
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Accounts` object.)
         * </em>
         */
        R.accounts.updateById = function() {
          var TargetResource = $injector.get("Accounts");
          var action = TargetResource["::updateById::Companies::accounts"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Redimedsites
 * @header lbServices.Redimedsites
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Redimedsites` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Redimedsites",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Redimedsites/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__findById__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Find a related item by id for States.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for States
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__findById__States": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/States/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__destroyById__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Delete a related item by id for States.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for States
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__States": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/States/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__updateById__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update a related item by id for States.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for States
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__updateById__States": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/States/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__findById__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Find a related item by id for AdminCalendars.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for AdminCalendars
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__findById__AdminCalendars": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/AdminCalendars/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__destroyById__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Delete a related item by id for AdminCalendars.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for AdminCalendars
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__AdminCalendars": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/AdminCalendars/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__updateById__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update a related item by id for AdminCalendars.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for AdminCalendars
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__updateById__AdminCalendars": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/AdminCalendars/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__findById__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Find a related item by id for Calendars.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Calendars
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__findById__Calendars": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/Calendars/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__destroyById__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Delete a related item by id for Calendars.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Calendars
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__Calendars": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/Calendars/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__updateById__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update a related item by id for Calendars.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for Calendars
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__updateById__Calendars": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Redimedsites/:id/Calendars/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__get__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Queries States of Redimedsites.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__get__States": {
          isArray: true,
          url: urlBase + "/Redimedsites/:id/States",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__create__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Creates a new instance in States of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__create__States": {
          url: urlBase + "/Redimedsites/:id/States",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__delete__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Deletes all States of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__States": {
          url: urlBase + "/Redimedsites/:id/States",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__count__States
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Counts States of Redimedsites.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__States": {
          url: urlBase + "/Redimedsites/:id/States/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__get__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Queries AdminCalendars of Redimedsites.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__get__AdminCalendars": {
          isArray: true,
          url: urlBase + "/Redimedsites/:id/AdminCalendars",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__create__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Creates a new instance in AdminCalendars of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__create__AdminCalendars": {
          url: urlBase + "/Redimedsites/:id/AdminCalendars",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__delete__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Deletes all AdminCalendars of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__AdminCalendars": {
          url: urlBase + "/Redimedsites/:id/AdminCalendars",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__count__AdminCalendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Counts AdminCalendars of Redimedsites.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__AdminCalendars": {
          url: urlBase + "/Redimedsites/:id/AdminCalendars/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__get__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Queries Calendars of Redimedsites.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__get__Calendars": {
          isArray: true,
          url: urlBase + "/Redimedsites/:id/Calendars",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__create__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Creates a new instance in Calendars of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$__create__Calendars": {
          url: urlBase + "/Redimedsites/:id/Calendars",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__delete__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Deletes all Calendars of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__Calendars": {
          url: urlBase + "/Redimedsites/:id/Calendars",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$__count__Calendars
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Counts Calendars of Redimedsites.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__Calendars": {
          url: urlBase + "/Redimedsites/:id/Calendars/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#create
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Redimedsites",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#createMany
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Redimedsites",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#upsert
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Redimedsites",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#exists
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Redimedsites/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#findById
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Redimedsites/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#find
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Redimedsites",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#findOne
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Redimedsites/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#updateAll
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Redimedsites/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#deleteById
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Redimedsites/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#count
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Redimedsites/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#prototype$updateAttributes
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Redimedsites/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#createChangeStream
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Redimedsites/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#updateOrCreate
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#update
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#destroyById
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Redimedsites#removeById
         * @methodOf lbServices.Redimedsites
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Redimedsites` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Redimedsites#modelName
    * @propertyOf lbServices.Redimedsites
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Redimedsites`.
    */
    R.modelName = "Redimedsites";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Calendar
 * @header lbServices.Calendar
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Calendar` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Calendar",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Calendars/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.Calendar#create
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Calendars",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#createMany
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Calendars",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#upsert
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Calendars",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#exists
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Calendars/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#findById
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Calendars/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#find
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Calendars",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#findOne
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Calendars/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#updateAll
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Calendars/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#deleteById
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Calendars/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#count
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Calendars/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#prototype$updateAttributes
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Calendars/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Calendar#createChangeStream
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Calendars/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Calendar#updateOrCreate
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Calendar#update
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Calendar#destroyById
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Calendar#removeById
         * @methodOf lbServices.Calendar
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Calendar` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Calendar#modelName
    * @propertyOf lbServices.Calendar
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Calendar`.
    */
    R.modelName = "Calendar";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Email
 * @header lbServices.Email
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Email` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Email",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Emails/:id",
      { 'id': '@id' },
      {
      }
    );




    /**
    * @ngdoc property
    * @name lbServices.Email#modelName
    * @propertyOf lbServices.Email
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Email`.
    */
    R.modelName = "Email";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ClientLogs
 * @header lbServices.ClientLogs
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ClientLogs` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ClientLogs",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ClientLogs/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#create
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ClientLogs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#createMany
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/ClientLogs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#upsert
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/ClientLogs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#exists
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/ClientLogs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#findById
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ClientLogs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#find
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/ClientLogs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#findOne
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ClientLogs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#updateAll
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/ClientLogs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#deleteById
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/ClientLogs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#count
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/ClientLogs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#prototype$updateAttributes
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ClientLogs/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#createChangeStream
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/ClientLogs/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#updateOrCreate
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#update
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#destroyById
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.ClientLogs#removeById
         * @methodOf lbServices.ClientLogs
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ClientLogs` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.ClientLogs#modelName
    * @propertyOf lbServices.ClientLogs
    * @description
    * The name of the model represented by this $resource,
    * i.e. `ClientLogs`.
    */
    R.modelName = "ClientLogs";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.AngularLog
 * @header lbServices.AngularLog
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `AngularLog` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "AngularLog",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/AngularLogs/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#create
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/AngularLogs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#createMany
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/AngularLogs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#upsert
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/AngularLogs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#exists
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/AngularLogs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#findById
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/AngularLogs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#find
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/AngularLogs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#findOne
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/AngularLogs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#updateAll
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/AngularLogs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#deleteById
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/AngularLogs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#count
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/AngularLogs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#prototype$updateAttributes
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/AngularLogs/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#createChangeStream
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/AngularLogs/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#insertLogs
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `logs` – `{*=}` -
         */
        "insertLogs": {
          url: urlBase + "/AngularLogs/insertLogs",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.AngularLog#updateOrCreate
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#update
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#destroyById
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.AngularLog#removeById
         * @methodOf lbServices.AngularLog
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AngularLog` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.AngularLog#modelName
    * @propertyOf lbServices.AngularLog
    * @description
    * The name of the model represented by this $resource,
    * i.e. `AngularLog`.
    */
    R.modelName = "AngularLog";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.BookingCandidateByApptDateV
 * @header lbServices.BookingCandidateByApptDateV
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `BookingCandidateByApptDateV` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "BookingCandidateByApptDateV",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/BookingCandidateByApptDateVs/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#create
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/BookingCandidateByApptDateVs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#createMany
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/BookingCandidateByApptDateVs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#upsert
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/BookingCandidateByApptDateVs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#exists
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/BookingCandidateByApptDateVs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#findById
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/BookingCandidateByApptDateVs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#find
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/BookingCandidateByApptDateVs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#findOne
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/BookingCandidateByApptDateVs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#updateAll
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/BookingCandidateByApptDateVs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#deleteById
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/BookingCandidateByApptDateVs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#count
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/BookingCandidateByApptDateVs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#prototype$updateAttributes
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/BookingCandidateByApptDateVs/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#createChangeStream
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/BookingCandidateByApptDateVs/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#updateOrCreate
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#update
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#destroyById
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByApptDateV#removeById
         * @methodOf lbServices.BookingCandidateByApptDateV
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByApptDateV` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.BookingCandidateByApptDateV#modelName
    * @propertyOf lbServices.BookingCandidateByApptDateV
    * @description
    * The name of the model represented by this $resource,
    * i.e. `BookingCandidateByApptDateV`.
    */
    R.modelName = "BookingCandidateByApptDateV";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.BookingCandidateByBookingDateV
 * @header lbServices.BookingCandidateByBookingDateV
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `BookingCandidateByBookingDateV` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "BookingCandidateByBookingDateV",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/BookingCandidateByBookingDateVs/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#create
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/BookingCandidateByBookingDateVs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#createMany
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/BookingCandidateByBookingDateVs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#upsert
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/BookingCandidateByBookingDateVs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#exists
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/BookingCandidateByBookingDateVs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#findById
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/BookingCandidateByBookingDateVs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#find
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/BookingCandidateByBookingDateVs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#findOne
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/BookingCandidateByBookingDateVs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#updateAll
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/BookingCandidateByBookingDateVs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#deleteById
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/BookingCandidateByBookingDateVs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#count
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/BookingCandidateByBookingDateVs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#prototype$updateAttributes
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/BookingCandidateByBookingDateVs/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#createChangeStream
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/BookingCandidateByBookingDateVs/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#updateOrCreate
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#update
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#destroyById
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.BookingCandidateByBookingDateV#removeById
         * @methodOf lbServices.BookingCandidateByBookingDateV
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `BookingCandidateByBookingDateV` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.BookingCandidateByBookingDateV#modelName
    * @propertyOf lbServices.BookingCandidateByBookingDateV
    * @description
    * The name of the model represented by this $resource,
    * i.e. `BookingCandidateByBookingDateV`.
    */
    R.modelName = "BookingCandidateByBookingDateV";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CalendarHoldings
 * @header lbServices.CalendarHoldings
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CalendarHoldings` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CalendarHoldings",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CalendarHoldings/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#create
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CalendarHoldings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#createMany
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CalendarHoldings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#upsert
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CalendarHoldings",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#exists
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/CalendarHoldings/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#findById
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CalendarHoldings/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#find
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CalendarHoldings",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#findOne
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CalendarHoldings/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#updateAll
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CalendarHoldings/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#deleteById
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CalendarHoldings/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#count
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/CalendarHoldings/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#prototype$updateAttributes
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CalendarHoldings/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#createChangeStream
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/CalendarHoldings/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#updateOrCreate
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#update
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#destroyById
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CalendarHoldings#removeById
         * @methodOf lbServices.CalendarHoldings
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CalendarHoldings` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CalendarHoldings#modelName
    * @propertyOf lbServices.CalendarHoldings
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CalendarHoldings`.
    */
    R.modelName = "CalendarHoldings";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.TelehealthBookings
 * @header lbServices.TelehealthBookings
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `TelehealthBookings` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "TelehealthBookings",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/TelehealthBookings/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#create
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/TelehealthBookings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#createMany
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/TelehealthBookings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#upsert
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/TelehealthBookings",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#exists
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/TelehealthBookings/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#findById
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/TelehealthBookings/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#find
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/TelehealthBookings",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#findOne
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/TelehealthBookings/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#updateAll
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/TelehealthBookings/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#deleteById
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/TelehealthBookings/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#count
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/TelehealthBookings/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#prototype$updateAttributes
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/TelehealthBookings/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#createChangeStream
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/TelehealthBookings/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#sendConfirmationEmail
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{number=}` -
         *
         *  - `type` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `sentEmailStatus` – `{*=}` -
         */
        "sendConfirmationEmail": {
          url: urlBase + "/TelehealthBookings/sendConfirmationEmail",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#updateOrCreate
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#update
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#destroyById
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.TelehealthBookings#removeById
         * @methodOf lbServices.TelehealthBookings
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `TelehealthBookings` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.TelehealthBookings#modelName
    * @propertyOf lbServices.TelehealthBookings
    * @description
    * The name of the model represented by this $resource,
    * i.e. `TelehealthBookings`.
    */
    R.modelName = "TelehealthBookings";


    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.rememberMe = undefined;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out non urlBase requests
          if (config.url.substr(0, urlBase.length) !== urlBase) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name lbServices.LoopBackResourceProvider
   * @header lbServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#getUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @description
     * Get the URL of the REST API server. The URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('MasterDetailDirective',['toastr','DynamicForm','$logServices'])
    .directive('mainMasterDetailDirective', ['$dynamicState','$q', '$parse', '$compile', '$document','$state','$log', function ($dynamicState,$q, $parse, $compile, $document,$state,$log) {
        return {
            restrict : 'E',
            scope: {
            },
            link : function (scope, element , attrs) {

                var convertToText = function(obj) {
                    var str = '\{';
                    if(typeof obj=='object')
                    {

                        for (var p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                str += p + ':' + convertToText (obj[p]) + ',';
                            }
                        }
                    }
                    else
                    {
                        if(typeof obj=='string')
                        {
                            //console.log('\"'+obj.replace(/ /g,'&nbsp;') +'\"');
                            return '&quot;'+obj.replace(/ /g,'&nbsp;') +'&quot;';
                        }
                        else
                        {
                            //console.log(obj+'');
                            return obj+'';
                        }
                    }


                    return str.substring(0,str.length-1)+"\}";
                };

                /*
                This directive will recive the 'setup atttribute to build up its children components:
                    - child route for list (master)
                    - child route for detail
                After building the component, it will go to master state.
                * */
                //$log = $log.getInstance("MasterDetailDirective.mainMasterDetailDirective");
                //,attrs.setup
                $log.debug("direcgive setup = ");

                var currentState = $state.current;
                $log.debug("currentState = ",currentState);

                $q.when($parse(attrs.setup)(scope)).then(function (setup) {
                    $log.debug("setup object = ",setup);
                    scope.formDefines = {};

                    if(setup.master){
                        //$log.debug('setup.master.layout = ',setup.master.layout);
                        //$log.debug('string setup.master.layout = ',convertToText(setup.master.layout));

                        scope.formDefines.div1 = {type:'div', uiView: setup.master.name, ngShow: "$root.$state.includes('" + currentState.name + '.' + setup.master.name + "')"};
                        $dynamicState.addState(
                                currentState.name + '.' + setup.master.name,
                                "list",
                                setup.master.controller,
                                //'<list-directive controller-name=\'' + setup.master.controller + '\'></list-directive>',
                                '<my-dynamic-form formdefine = ' + convertToText(setup.master.layout) + ' ></my-dynamic-form>',
                                setup.master.name);
                    }

                    if(setup.detail){

                        scope.formDefines.div2 = {type:'div', uiView: setup.detail.name, ngShow: " $root.$state.includes('" + currentState.name + '.' + setup.detail.name + "')" };
                        $dynamicState.addState(
                                currentState.name + '.' + setup.detail.name,
                                "/:row",
                                setup.detail.controller,
                                '<my-dynamic-form formdefine = "' + convertToText(setup.detail.layout) + '" ></my-dynamic-form>',
                                setup.detail.name);
                        console.log("states = ",$state.get());
                    }

                    if(setup.master) {
                        var parentElem = angular.element('<my-dynamic-form formdefine = "{{formDefines}}" ></my-dynamic-form>');
                        $compile(parentElem)(scope);
                        element.replaceWith(parentElem);
                        $state.go(currentState.name + '.' + setup.master.name);
                    }else{

                        var parentElem = angular.element('<p>'+convertToText(setup.detail.layout)+'</p>');
                        //var parentElem = angular.element('<p>Please define "setup" attribute in main-master-detail-directive with format masterDetailDefs = {master: {name: "list", controller: "MainCtrl"}, detail: {name: "detail", controller: "NewCtrl"} \n Please note that: Master is required; Detail is optional</p>');
                        $compile(parentElem)(scope);
                        element.replaceWith(parentElem);
                    }

                });
            }
        };
    }])
    .directive('listDirective', ['$q', '$parse', '$compile', '$document', function ($q, $parse, $compile, $document) {
        return {
            restrict : 'E',
            scope: {
            },
            controller : "@",
            name : "controllerName",
            controllerAs : "MainCtrl",
            link : function (scope, element , attrs) {
                //console.log(">>>>>>>>",attrs,scope);
                scope[attrs.controllerName] = scope['MainCtrl'];
                //console.log(">>>>>>>>",attrs,scope);
                var parentElem = angular.element('<my-dynamic-form formdefine = "{{MainCtrl.tableDefines}}" ></my-dynamic-form>');
                $compile(parentElem)(scope);
                element.replaceWith(parentElem);
            }
        };
    }]);
/**
 * Created by phuongnguyen on 23/02/16.
 */
angular.module('MasterDetailDirective')
    .factory('DetailModal', ['$uibModal','$log', function ($uibModal,$log) {
        $log = $log.getInstance("MasterDetailDirective.DetailModal");
        var pTemplateUrl = '';
        var pControllerName = '';
        var pSize = '';
        var pResolve = {};
        var closeModal = function(rs){
            $log.debug("this is 'closeModal' function, please override by setCloseModalFunc() ",rs);
        };
        var dismissModal = function(rs){
            $log.info('Modal dismissed at: ' + new Date());
            $log.debug("this is 'dismissModal' function, please override by setDismissModalFunc() ",rs);
        };


        return{
            setTemplateUrl : function(templateUrl){
                pTemplateUrl = templateUrl;
            },
            setControllerName : function(controllerName){
                pControllerName = controllerName;
            },
            setSize : function(size){
                pSize = size;
            },
            setCloseModalFunc : function(func){
                closeModal = func;
            },
            setDismissModalFunc : function(func){
                dismissModal = func;
            },
            setResolve : function(resolveName,func){
                pResolve[resolveName] = func;
                console.log("pResolve=",pResolve);
            },
            newOrEditRow: function(value){
                console.log('DetailModal',pTemplateUrl);
                //open modal to enter new candidate
                pResolve.row = function(){
                    return value;
                };
                console.log("pResolve=",pResolve);

                var modalInstance = $uibModal.open({
                    animation: true,
                    template: pTemplateUrl,
                    controller: pControllerName,
                    controllerAs: pControllerName,
                    size: pSize,
                    resolve: pResolve
                });

                modalInstance.result.then(function (rs) {
                    closeModal(rs);
                }, function (rs) {
                    dismissModal(rs);
                });
            }
        };
    }])
    .factory('DetailModal2', ['$uibModal','$log', function ($uibModal,$log) {
        $log = $log.getInstance("MasterDetailDirective.DetailModal");
        var pTemplateUrl = '';
        var pControllerName = '';
        var pSize = '';
        var pResolve = {};
        var closeModal = function(rs){
            $log.debug("this is 'closeModal' function, please override by setCloseModalFunc() ",rs);
        };
        var dismissModal = function(rs){
            $log.info('Modal dismissed at: ' + new Date());
            $log.debug("this is 'dismissModal' function, please override by setDismissModalFunc() ",rs);
        };


        return{
            setTemplateUrl : function(templateUrl){
                pTemplateUrl = templateUrl;
            },
            setControllerName : function(controllerName){
                pControllerName = controllerName;
            },
            setSize : function(size){
                pSize = size;
            },
            setCloseModalFunc : function(func){
                closeModal = func;
            },
            setDismissModalFunc : function(func){
                dismissModal = func;
            },
            setResolve : function(resolveName,func){
                pResolve[resolveName] = func;
                console.log("pResolve=",pResolve);
            },
            newOrEditRow: function(value){
                console.log('DetailModal',pTemplateUrl);
                //open modal to enter new candidate
                pResolve.row = function(){
                    return value;
                };
                console.log("pResolve=",pResolve);

                var modalInstance = $uibModal.open({
                    animation: true,
                    template: pTemplateUrl,
                    controller: pControllerName,
                    controllerAs: pControllerName,
                    size: pSize,
                    resolve: pResolve
                });

                modalInstance.result.then(function (rs) {
                    closeModal(rs);
                }, function (rs) {
                    dismissModal(rs);
                });
            }
        };
    }])
    .factory('DeleteModal', ['$uibModal','$log', function ($uibModal,$log) {
        $log = $log.getInstance("MasterDetailDirective.DeleteModal");
        var pTemplateUrl = '';
        var pControllerName = '';
        var pSize = '';
        var pResolve = {};
        var closeModal = function(rs){
            $log.debug("this is 'closeModal' function, please override by setCloseModalFunc() ",rs);
        };
        var dismissModal = function(rs){
            $log.info('Modal dismissed at: ' + new Date());
            $log.debug("this is 'dismissModal' function, please override by setDismissModalFunc() ",rs);
        };


        return{
            setTemplateUrl : function(templateUrl){
                pTemplateUrl = templateUrl;
            },
            setControllerName : function(controllerName){
                pControllerName = controllerName;
            },
            setSize : function(size){
                pSize = size;
            },
            setCloseModalFunc : function(func){
                closeModal = func;
            },
            setDismissModalFunc : function(func){
                dismissModal = func;
            },
            setResolve : function(resolveName,func){
                pResolve[resolveName] = func;
                console.log("pResolve=",pResolve);
            },
            deleteRow: function(value){
                console.log('DetailModal',pTemplateUrl);
                //open modal to enter new candidate
                pResolve.row = function(){
                    return value;
                };
                console.log("pResolve=",pResolve);

                var modalInstance = $uibModal.open({
                    animation: true,
                    template: pTemplateUrl,
                    controller: pControllerName,
                    controllerAs: pControllerName,
                    size: pSize,
                    resolve: pResolve
                });

                modalInstance.result.then(function (rs) {
                    closeModal(rs);
                }, function (rs) {
                    dismissModal(rs);
                });
            }
        };
    }]);


/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Authentication',
    [
        'toastr',
        'lbServices',
        'ocsApp.Navigator'
    ])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("authentication",{
                abstract:true,
                views:{
                    "root":{
                        templateUrl: "modules/Authentication/views/authen.main.html",
                        controller: "AuthenMainCtrl"
                    }
                }
            })
            //main page of login
            .state("authentication.login",{
                url: "/",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.login.html",
                        controller: "LoginCtrl",
                        controllerAs: "loginCtrl"
                    }
                }
            })
            //forgot password page
            .state("authentication.forgotpass",{
                url: "/forgotpass",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.forgotpass.html",
                        controller: "ForgotPasswordCtrl",
                        controllerAs: "forgotPasswordCtrl"
                    }
                }
            })
            //reset password page
            .state("authentication.resetpass",{
                url: "/reset-pass/:token",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.resetpass.html",
                        controller: "ResetPasswordCtrl",
                        controllerAs: "resetPasswordCtrl"
                    }
                }
            })
            .state("authentication.bookingreportsdirectly",{
                url: "/bookingreports",
                views:{
                    "main-content":{
                        templateUrl: "modules/BookingReports/views/bookingreports.main.html",
                        controller: "BookingReportsMainCtrl",
                        controllerAs: "BookingReportsMainCtrl"

                    }
                }
            })
            //Registration page
            .state("authentication.registration",{
                url: "/registration",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.registration.html"
                    }
                }
            })
    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.BookingReports',['toastr','zingchart-angularjs'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.bookingreports",{
                abstract:false,
                url:"/bookingreports",
                templateUrl: "modules/BookingReports/views/bookingreports.main.html",
                controller: "BookingReportsMainCtrl",
                controllerAs: "BookingReportsMainCtrl"
            });

    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Bookings',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.bookings",{
                abstract:false,
                url:"/bookings",
                templateUrl: "modules/Bookings/views/bookings.main.html",
                controller: "BookingsMainCtrl",
                controllerAs: "BookingsMainCtrl"
            });

    }]);

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

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.MakeBooking',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.makeBooking",{
                abstract:false,
                url:"/makeBooking",
                templateUrl: "modules/MakeBooking/views/makeBooking.main.html",
                controller: "MakeBookingMainCtrl",
                controllerAs: "MakeBookingMainCtrl"
            });

    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.MakePEMPhoneBooking',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.makePEMPhoneBooking",{
                abstract:false,
                url:"/makePEMPhoneBooking",
                templateUrl: "modules/MakePEMPhoneBooking/views/makePEMPhoneBooking.main.html",
                controller: "MakePEMPhoneBookingMainCtrl",
                controllerAs: "MakePEMPhoneBookingMainCtrl"
            })
            .state("authentication.bookingForm",{
                url: "/bookingForm/:token",
                views:{
                    "main-content":{
                        templateUrl: "modules/MakePEMPhoneBooking/views/makePEMPhoneBooking.bookingForm.html",
                        controller: "BookingFormCtrl",
                        controllerAs: "BookingFormCtrl"
                    }
                }
            });

    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.MakeTelehealthBooking',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.makeTelehealthBooking",{
                abstract:false,
                url:"/makeTelehealthBooking",
                templateUrl: "modules/MakeTelehealthBooking/views/makeTelehealthBooking.main.html",
                controller: "MakeTelehealthBookingMainCtrl",
                controllerAs: "MakeTelehealthBookingMainCtrl"
            });

    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Navigator',
    [
        'toastr',
        'ocsApp.MakeBooking',
        'ocsApp.MakePEMPhoneBooking',
        'ocsApp.MakeTelehealthBooking',
        'ocsApp.TelehealthBookings',
        'ocsApp.Bookings',
        'ocsApp.Positions',
        'ocsApp.Packages',
        'ocsApp.Settings',
        'ocsApp.BookingReports',
        'ocsApp.Companies',
        'ocsApp.Sites',
        'ngIdle',
        'ui.bootstrap',
    ])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator",{
                abstract:false,
                url:"/navigator",
                views:{
                    "root":{
                        templateUrl: "modules/Navigator/views/navigator.main.html",
                        controller: "NavigatorMainCtrl",
                        controllerAs: "NavigatorMainCtrl"
                    }
                }
            });

    }])
    .config(['IdleProvider', 'KeepaliveProvider',function(IdleProvider, KeepaliveProvider) {
        //configue idle to logout the system after a period time
        IdleProvider.idle(60*15);
        IdleProvider.timeout(10);
        KeepaliveProvider.interval(10);
    }])
    .run(['Idle',function(Idle){
        Idle.watch();//start idle to manage the session of the user
    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Packages',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.packages",{
                abstract:false,
                url:"/packages",
                templateUrl: "modules/Packages/views/packages.main.html",
                controller: "PackagesMainCtrl",
                controllerAs: "PackagesMainCtrl"
            });

    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Positions',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.positions",{
                abstract:false,
                url:"/positions",
                templateUrl: "modules/Positions/views/positions.main.html",
                controller: "PositionsMainCtrl",
                controllerAs: "PositionsMainCtrl"
            });

    }]);

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Settings',['lbServices','toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.settings",{
                abstract:false,
                url:"/settings",
                templateUrl: "modules/Settings/views/settings.main.html",
                controller: "SettingsMainCtrl",
                controllerAs: "SettingsMainCtrl"
            });
    }]);

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

/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.TelehealthBookings',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.telehealthBookings",{
                abstract:false,
                url:"/telehealthBookings",
                templateUrl: "modules/TelehealthBookings/views/telehealthBookings.main.html",
                controller: "TelehealthBookingsMainCtrl",
                controllerAs: "TelehealthBookingsMainCtrl"
            });

    }]);

/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.Authentication').controller('ForgotPasswordCtrl',['$state','Accounts','toastr','$log',function ($state,Accounts,toastr,$log) {
    
    $log = $log.getInstance("ocsApp.Authentication.ForgotPasswordCtrl");    
    $log.debug("Hello, I am ForgotPasswordCtrl");

    var that = this;
    this.loading1 = false;
    this.loading2 = false;

    this.showClickedValidation = false;

    this.goBackLogin = function(){
        $log.debug("go back login...");
        $state.go('authentication.login');        
    };

    this.forgotPassword = function() {
        $log.debug("forgot password function");
        that.showClickedValidation = true;

        if(this.form.username.$error.required){
            toastr.error('Please enter username', 'Error');
        }
        if(this.form.email.$error.required){
            toastr.error('Please enter email', 'Error');
        }

        if(that.form.$valid){
            $log.debug( "login", this.username );
            Accounts.resetPassword({username: this.username, email: this.email}, function(succ) {
                that.showClickedValidation = false;
                $log.debug("Send an email to reset pass successfully !",succ);
                $log.save();
                toastr.success('Sent an email to reset the password in your email, Please check the email');       
                that.username = "";
                that.email = "";
            },function(err){
                $log.error("Send an email to reset pass  failed !",err);
                //$log.save();
                toastr.error("Wrong username or password. Please check your username or password",'Error');
            });
        }else{
            $log.error("ForgotPasswordCtrl invalid",that.form.$error);
        }

    };
}]);


/**
/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.Authentication').controller('LoginCtrl',['$state','Accounts','toastr','$cookieStore','CompanyFactory','RedimedSiteFactory','$log','mySharedService','storeToken','mySocket',function ($state,Accounts,toastr,$cookieStore,CompanyFactory,RedimedSiteFactory, $log,sharedService,storeToken,mySocket) {
    $log = $log.getInstance("ocsApp.Authentication.LoginCtrl");
    $log.debug( "Starting main application");
    $log.debug("Hello, I am login controller");

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
                    $log.debug("After login, get company info = ");
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

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Authentication')
    .controller('AuthenMainCtrl', function () {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });


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


/**
 * Created by phuongnguyen on 13/01/16.
 */
angular.module('ocsApp.Authentication')
    .factory('CompanyFactory', ['Companies','$log','CalendarHoldings', function (Companies,$log,CalendarHoldings) {
        ///this factory use to get all information include dependency like Subsidiary/position/packages... of company and store in local, and then can be used later without connect to the server
        var companyData;
        var currentCompany = null;
        var currentUser = null;

        $log = $log.getInstance("ocsApp.Authentication.CompanyFactory");
        function init(callback) {
            Companies.initData(function(data,responseHeaders){
                console.log('>initData',data);
                companyData = data.initData;
                //console.log('>companyData',companyData);
                $log.debug("init company data get data from server");
                callback(companyData);

            },
            function(err){
                $log.error("init company failed",err);
            });
        };

        return {
            init: function (callback) {
                init(callback);
            },
            setCurrentCompany: function(company){
                currentCompany = company;
            },
            getCurrentCompany: function(){
                return currentCompany;
            },
            setCurrentUser: function(user){
                currentUser = user;
            },
            getCurrentUser: function(){
                return currentUser;
            },
            refreshSubsidiaryList: function(callback){
                //refresh the subsidiary list for Redimed Admin
                //get bookings
                Companies.getRediSubsidiaries(function(data){
                    $log.debug("refreshSubsidiaryList from server");
                    companyData.subsidiaries = data.subsidiaries;
                    callback(companyData);
                },
                function(err){
                    $log.error("init company failed",err);
                });
            },
            refreshBookingList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.listBookings(function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshBookingList from server");
                    companyData.allBookings = data.bookings;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshBookingList failed",err);
                });
            },
            refreshTelehealthBookingList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.listTelehealthBookings(function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshBookingList from server");
                    companyData.telehealthBookings = data.bookings;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshBookingList failed",err);
                });
            },
            refreshPositionList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                init(callback);
                /*
                Companies.positions({id:0},function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshPositionList from server");
                    companyData.positions = data;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshPositionList failed",err);
                });*/
            },
            refreshPackageList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                init(callback);
                /*
                Companies.packages({id:0},function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshPackageList from server");
                    console.log("refreshPackageList = ",data);
                    companyData.packages = data;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshPackageList failed",err);
                });
                */
            },
            refreshAllPackageList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.getPackages(function(data){
                        //,filter:{where:{candidatesName:'test'}}
                        $log.debug("refreshAllPackageList from server");
                        //console.log("refreshAllPackageList = ",data);
                        companyData.allViewPackages = data.packages;
                        callback(companyData);
                    },
                    function(err){
                        $log.error("refreshPackageList failed",err);
                    });
            },
            refreshAccountList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.accounts({id:0},function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshAccountList from server");
                    companyData.accounts = data;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshAccountList failed",err);
                });
            },
            getCompanyId: function(){
                //console.log("getCompanyId=",companyData);
                return companyData == null ? null :companyData.id;
            },
            getCompany: function (callback) {
                if(companyData) {
                    $log.debug("getCompany from memory");
                    callback(companyData);
                } else {
                    init(callback);
                }
            }
        };
    }])
    .factory('RedimedSiteFactory', ['Companies','$log','CalendarHoldings', function (Companies,$log,CalendarHoldings) {
        //this factory use to get all information of RedimedSites for Pre-employment booking
        //Also get the states and subsurb for each site if having
        var siteData;
        $log = $log.getInstance("RedimedSiteFactory");
        return {
            getSite: function (callback) {
                if(siteData) {
                    $log.debug("getSite from memory");
                    callback(siteData);
                } else {
                    //Get Sites
                    Companies.getSites(function(data){
                        $log.debug("getSite from server");
                        //console.log(data);
                        siteData = data.sites;
                        callback(siteData);
                    },
                    function(err){
                        $log.error("getSite from server failed",err);
                    });
                }
            },
            getCalendar: function(siteID,fromDate,toDate,callback){
                Companies.getCalendars({id:siteID,from:fromDate,to:toDate},function(data){
                    $log.debug("getCalendar from server");
                    callback(data.calendars);
                },
                function(err){
                    $log.error("getCalendar from server failed",err);
                });
            },
            setHolding: function(pCalendarID,callback){
                $log.debug("Will set holding calID = " + pCalendarID );
                CalendarHoldings.create({holdingId:0,calendarId:pCalendarID},function(data){
                    $log.debug("Hold the calendar =",data);
                    callback(data);
                },
                function(err){
                    $log.error("Holding from server failed",err);
                });
            },
            removeHolding: function(pHoldingId,pCalendarID,callback){
                $log.debug("Will remove holding calID = " + pCalendarID );
                CalendarHoldings.deleteById({id:pHoldingId},function(data){
                    $log.debug("Remove the calendar =",data);
                    callback(data);
                },
                function(err){
                    $log.error("Holding from server failed",err);
                });
            }
        };
    }])
    .factory('BookingStatusFactory', ['Companies','$log', function (Companies,$log) {
        //this factory use to get all information of RedimedSites for Pre-employment booking
        //Also get the states and subsurb for each site if having
        var statusData;
        $log = $log.getInstance("BookingStatusFactory");
        return {
            getStatus: function (callback) {
                if(statusData) {
                    $log.debug("getStatus from memory");
                    callback(statusData);
                } else {
                    //Get Sites
                    Companies.getStatus(function(data){
                        $log.debug("getStatus from server",data);
                        statusData = data.status;
                        callback(statusData);
                    },
                    function(err){
                        $log.error("getStatus from server failed",err);
                    });
                }
            }
        };
    }]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('ConfirmToDeletePositionCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.BookingReports')
    .controller('BookingReportsMainCtrl',['BookingCandidateByApptDateV','BookingCandidateByBookingDateV','mysqlDate','mySocket', function (BookingCandidateByApptDateV,BookingCandidateByBookingDateV,mysqlDate,mySocket) {

        console.log("I am booking report controller.");
        var that = this;
        this.positions = [];
        this.myJson = {};
        this.myJson2 = {};
        this.dateStatus = {};
        this.dateStatus.fromDateOpened = false;
        this.dateStatus.toDateOpened = false;
        this.format = "dd/MM/yyyy";
        this.apptSumary = [];
        this.totalApptToday = 0;
        this.bookingTodaySumary = [];
        this.totalBookingToday = 0;
        this.todayDate = moment(new Date()).format('DD MMM');
        this.fromDate = new Date();
        this.toDate = new Date();
        this.fromDate.setDate(this.fromDate.getDate() - 7);
        this.toDate.setDate(this.toDate.getDate() + 7);
        ////Online Users Begin////

        var columnDefs = [
            { field: 'onlineAt', displayName: "loginAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'loginAt', displayName: "loginAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'logoutAt', displayName: "logoutAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'offlineAt', displayName: "offlineAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'userName', displayName: "userName", width: "100"},
            { field: 'socketId', displayName: "socketId", width: "100"},
            { field: 'ip', displayName: "ip", width: "170"},
            { field: 'companyName', displayName: "companyName", width: "100"},
            { field: 'pid', displayName: "pid", width: "100"},
            { field: 'worker', displayName: "worker", width: "100"}
        ];

        this.gridOptions = {
            enableSorting: true,
            enableColumnResizing: true,
            enableFiltering: true,
            appScopeProvider: this,
            columnDefs: columnDefs,
            enableGridMenu: true,
            enableRowSelection: false,
            enableSelectAll: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'myFile.csv',
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };

        mySocket.on('OnlineUsersData',function(data){
            console.log('Receive OnlineUsers = ');
            that.gridOptions.data = data;
        });
        mySocket.emit('GetOnlineUsers');
        //////Online Users End/////

        getDataForReports();

        this.openFromDate = function($event) {
          console.log('emitting data');
            that.dateStatus.fromDateOpened = true;
        };

        this.openToDate = function($event) {
            that.dateStatus.toDateOpened = true;
        };

        this.fromOrToDateChanged = function(){
            getDataForReports();
        };

        function dateformat(date,format){


            var dateAfterFormat = moment(mysqlDate(date)).format(format);
            if(dateAfterFormat =="Invalid date")
                return "";
            else
                return dateAfterFormat;
        };

        function getDataForReports(){

            that.apptSumary = [];
            that.totalApptToday = 0;
            that.bookingTodaySumary = [];
            that.totalBookingToday = 0;

            BookingCandidateByApptDateV.find({filter:{where:{apptDate:{between:[that.fromDate,that.toDate]}},order:"apptDate"}},function(data){
                //console.log("fromDate = ",fromDate,"toDate = ",toDate,data);
                var dateArray = [];
                var siteArray = [];
                var currentDate = "";
                var currentSite = ""
                var index = -1;
                var xArray = [];
                var dataArray = [];
                var seriesArray = [];
                var colorArray = ['#1c8d62','#2c9ff2','#3cadd2','#4dba62','#5cc162','#61d5b2','#74e4b2','#81fd67','#f91264'];
                var labelsArray = [];

                for(var i in data){
                    var tempSiteIndex =  _.indexOf(siteArray, data[i].siteName);
                    if(tempSiteIndex == -1 && data[i].siteName != undefined){
                        siteArray.push(data[i].siteName);
                        dataArray.push([]);
                    }
                }

                siteArray = siteArray.sort();

                for(var i in data){
                    if(currentDate != data[i].apptDate + ""){
                        var element = {};
                        for(var j in siteArray){
                            element[siteArray[j]] = 0;
                        }
                        index++;
                        currentDate = data[i].apptDate + "";

                        element.apptDate = (data[i].apptDate+"").substr(0,10);
                        element[data[i].siteName] = data[i].quantity;
                        dateArray.push(element);
                    }else{
                        dateArray[index][data[i].siteName] = data[i].quantity;
                    }
                }

                ///total array
                dataArray.push([]);

                for(var i in dateArray){
                    dateFortmat = dateformat(dateArray[i].apptDate,'DD MMM');
                    xArray.push(dateFortmat);
                    if(dateFortmat+"" == that.todayDate+""){
                        //get today infor to display on the summary
                        var total = 0;
                        for(var j in siteArray){
                            var q =  dateArray[i][siteArray[j]];
                            dataArray[j].push(q);
                            total = total + q;
                            that.apptSumary.push({site:siteArray[j],quantity:q});
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                        that.totalApptToday = total;
                    }else{
                        var total = 0;
                        for(var j in siteArray){
                            dataArray[j].push(dateArray[i][siteArray[j]]);
                            total = total + dateArray[i][siteArray[j]];
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                    }
                }

                siteArray.push("Total");
                //console.log(xArray,dataArray,that.apptSumary);

                for(var j in siteArray){
                    var e =
                    {
                        "values":dataArray[j],
                        "line-color": colorArray[j],
                        "aspect": "spline",
                        "background-color": "#fc8d62",
                        "alpha-area": ".3",
                        "font-family": "Roboto",
                        "font-size": "14px",
                        "text": siteArray[j]
                    }
                    seriesArray.push(e);

                    var l =
                    {
                        "text": siteArray[j] + ": %plot-" + j + "-value",
                        "default-value": "",
                        "color": colorArray[j],
                        "x": (5 + j*15) + "%",
                        "y": 50,
                        "width": 120,
                        "text-align": "left",
                        "bold": 0,
                        "font-size": "12px",
                        "font-weight": "bold"
                    };

                    labelsArray.push(l);
                }

                ////////////////////
                that.myJson =  {
                    "globals":{
                        "font-family": "Roboto"
                    },
                    "graphset": [
                        {
                            "type": "area",
                            "background-color": "#fff",
                            "utc": true,
                            "title": {
                                "y": "15px",
                                "text": "Patient Attending Today",
                                "background-color": "none",
                                "font-color": "#05636c",
                                "font-size": "24px",
                                "height": "25px",
                                "adjust-layout":true
                            },
                            "plotarea": {
                                "margin-top":"10%",
                                "margin-right":"dynamic",
                                "margin-bottom":"dynamic",
                                "margin-left":"dynamic",
                                "adjust-layout":true
                            },
                            "labels": labelsArray,
                            "scale-x": {
                                "label": {
                                    "text":"Date Range",
                                    "font-size": "14px",
                                    "font-weight": "normal",
                                    "offset-x": "10%",
                                    "font-angle": 360
                                },
                                "item": {
                                    "text-align": "center",
                                    "font-color": "#05636c"
                                },
                                "zooming": 1,

                                "labels": xArray,

                                "items-overlap": true,
                                "guide": {
                                    "line-width": "0px"
                                },
                                "tick": {
                                    "line-width": "2px"
                                },
                            },
                            "crosshair-x": {
                                "line-color":"#fff",
                                "line-width":1,
                                "plot-label": {
                                    "visible": false
                                }
                            },
                            "scale-y": {
                                "item": {
                                    "font-color": "#05636c",
                                    "font-weight": "normal"
                                },
                                "label":{
                                    "text":"Metrics",
                                    "font-size":"14px"
                                },
                                "guide": {
                                    "line-width": "0px",
                                    "alpha": 0.2,
                                    "line-style": "dashed"
                                }
                            },
                            "plot": {
                                "line-width": 2,
                                "marker": {
                                    "size": 1,
                                    "visible": false
                                },
                                "tooltip": {
                                    "font-family": "Roboto",
                                    "font-size": "14px",
                                    "text": "There were %v %t on %data-days",
                                    "text-align": "left"
                                }
                            },
                            "series": seriesArray
                        }
                    ]
                };
                ////////////////////
            });


            BookingCandidateByBookingDateV.find({filter:{where:{bookingDate:{between:[(new Date(that.fromDate)),(new Date(that.toDate))]}},order:"bookingDate"}},function(data){

                var dateArray = [];
                var siteArray = [];
                var currentDate = "";
                var currentSite = ""
                var index = -1;
                var xArray = [];
                var dataArray = [];
                var seriesArray = [];
                var colorArray = ['#1c8d62','#2c9ff2','#3cadd2','#4dba62','#5cc162','#61d5b2','#74e4b2','#81fd67','#f91264'];
                var labelsArray = [];

                for(var i in data){
                    var tempSiteIndex =  _.indexOf(siteArray, data[i].siteName);
                    if(tempSiteIndex == -1 && data[i].siteName != undefined){
                        siteArray.push(data[i].siteName);
                        dataArray.push([]);
                    }
                }

                siteArray = siteArray.sort();

                for(var i in data){
                    if(currentDate != data[i].bookingDate + ""){
                        var element = {};
                        for(var j in siteArray){
                            element[siteArray[j]] = 0;
                        }
                        index++;
                        currentDate = data[i].bookingDate + "";

                        element.bookingDate = (data[i].bookingDate+"").substr(0,10);
                        element[data[i].siteName] = data[i].quantity;
                        dateArray.push(element);
                    }else{
                        dateArray[index][data[i].siteName] = data[i].quantity;
                    }
                }

                ///total array
                dataArray.push([]);

                for(var i in dateArray){
                    /*
                    xArray.push(dateformat(dateArray[i].bookingDate,'DD MMM'));
                    var total = 0;
                    for(var j in siteArray){
                        dataArray[j].push(dateArray[i][siteArray[j]]);
                        total = total + dateArray[i][siteArray[j]];
                    }
                    //calculate total of all sites
                    dataArray[siteArray.length].push(total);
                    */
                    ///////////////
                    dateFortmat = dateformat(dateArray[i].bookingDate,'DD MMM');
                    xArray.push(dateFortmat);

                    if(dateFortmat+"" == that.todayDate+""){
                        //get today infor to display on the summary
                        var total = 0;
                        for(var j in siteArray){
                            var q =  dateArray[i][siteArray[j]];
                            dataArray[j].push(q);
                            total = total + q;
                            that.bookingTodaySumary.push({site:siteArray[j],quantity:q});
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                        that.totalBookingToday = total;
                    }else{
                        var total = 0;
                        for(var j in siteArray){
                            dataArray[j].push(dateArray[i][siteArray[j]]);
                            total = total + dateArray[i][siteArray[j]];
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                    }
                }

                siteArray.push("Total");
                //console.log(xArray,dataArray);


                for(var j in siteArray){
                    var e =
                    {
                        "values":dataArray[j],
                        "line-color": colorArray[j],
                        "aspect": "spline",
                        "background-color": "#fc8d62",
                        "alpha-area": ".3",
                        "font-family": "Roboto",
                        "font-size": "14px",
                        "text": siteArray[j]
                    }
                    seriesArray.push(e);

                    var l =
                    {
                        "text": siteArray[j] + ": %plot-" + j + "-value",
                        "default-value": "",
                        "color": colorArray[j],
                        "x": (5 + j*15) + "%",
                        "y": 50,
                        "width": 120,
                        "text-align": "left",
                        "bold": 0,
                        "font-size": "12px",
                        "font-weight": "bold"
                    };

                    labelsArray.push(l);
                }

                ////////////////////
                that.myJson2 =  {
                    "globals":{
                        "font-family": "Roboto"
                    },
                    "graphset": [
                        {
                            "type": "area",
                            "background-color": "#fff",
                            "utc": true,
                            "title": {
                                "y": "15px",
                                "text": "New Booking Today",
                                "background-color": "none",
                                "font-color": "#05636c",
                                "font-size": "24px",
                                "height": "25px",
                                "adjust-layout":true
                            },
                            "plotarea": {
                                "margin-top":"10%",
                                "margin-right":"dynamic",
                                "margin-bottom":"dynamic",
                                "margin-left":"dynamic",
                                "adjust-layout":true
                            },
                            "labels": labelsArray,
                            "scale-x": {
                                "label": {
                                    "text":"Date Range",
                                    "font-size": "14px",
                                    "font-weight": "normal",
                                    "offset-x": "10%",
                                    "font-angle": 360
                                },
                                "item": {
                                    "text-align": "center",
                                    "font-color": "#05636c"
                                },
                                "zooming": 1,

                                "labels": xArray,

                                "items-overlap": true,
                                "guide": {
                                    "line-width": "0px"
                                },
                                "tick": {
                                    "line-width": "2px"
                                },
                            },
                            "crosshair-x": {
                                "line-color":"#fff",
                                "line-width":1,
                                "plot-label": {
                                    "visible": false
                                }
                            },
                            "scale-y": {
                                "item": {
                                    "font-color": "#05636c",
                                    "font-weight": "normal"
                                },
                                "label":{
                                    "text":"Metrics",
                                    "font-size":"14px"
                                },
                                "guide": {
                                    "line-width": "0px",
                                    "alpha": 0.2,
                                    "line-style": "dashed"
                                }
                            },
                            "plot": {
                                "line-width": 2,
                                "marker": {
                                    "size": 1,
                                    "visible": false
                                },
                                "tooltip": {
                                    "font-family": "Roboto",
                                    "font-size": "14px",
                                    "text": "There were %v %t on %data-days",
                                    "text-align": "left"
                                }
                            },
                            "series": seriesArray
                        }
                    ]
                };
                ////////////////////
            });
        };


    }]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('NewPositionCtrl',['Positions','$uibModalInstance','position','CompanyFactory','$log','toastr', function (Positions,$uibModalInstance,position,CompanyFactory,$log,toastr) {
        $log = $log.getInstance("ocsApp.Positions.NewPositionCtrl");
        $log.debug("I am  new or edit position controller.",position);

        var that = this;
        this.form = {};
        this.companyId = CompanyFactory.getCompanyId();
        if(position){
            this.positionName = position.positionName;
        }

        this.ok = function () {
            that.isSubmitted = true;

            if(that.form.$valid){
                //Update Position if position is an object
                //If position = null, it means that it is new object
                if(position){
                    $log.debug("will update position",position);
                    Positions.update({where:{"id":position.id}},{"positionName":that.positionName},function(res){
                        $log.debug("updated position",res);
                        toastr.success('Position was updated successfully', '');
                        $uibModalInstance.close({});
                    },function(err){
                        $log.error("Fail to update position",err);
                        toastr.error('Fail to update Position', 'Error');
                        $uibModalInstance.close({});
                    });
                }else{
                    var newPositionObj = {};
                    newPositionObj.positionName = that.positionName;
                    newPositionObj.companyId = that.companyId;
                    newPositionObj.id = 0;
                    console.log(newPositionObj);

                    Positions.create(newPositionObj,function(rs){
                        $log.debug("created position",rs);
                        toastr.success('Position was created successfully', '');
                        $uibModalInstance.close({});
                    },function(err){
                        toastr.error('Fail to create Position', 'Error');
                        $log.error("failt to create position",err);
                    })
                }               
            }else{
                 $log.error("Save postion err ",that.form.$error);
            }

        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 3/01/16.
 */
angular.module('ocsApp.Bookings').controller('AdminEditBookingCtrl',[
                                    'candidate',
                                    'RedimedSiteFactory',
                                    'BookingStatusFactory',
                                    'BookingCandidates',
                                    'toastr',
                                    '$uibModalInstance',
                                    'mysqlDate',
                                    '$log',
                                    'CompanyFactory',
                                    'mySharedService',
                                    'mysqlDate',
                                    '$cookieStore',
                                    '$uibModal',
                                    '$scope',
                                    'mySocket',
                                    function (candidate,RedimedSiteFactory,BookingStatusFactory,
                                      BookingCandidates,toastr,$uibModalInstance,mysqlDate,
                                      $log,CompanyFactory,sharedService,
                                      mysqlDate,
                                      $cookieStore,
                                      $uibModal,
                                      $scope,
                                      mySocket
                                    ) {
    $log = $log.getInstance("ocsApp.Bookings.AdminEditBookingCtrl");
    $log.debug("I am admin edit booking ctrl");
    $log.debug("Candidate = ",candidate);
    var that = this;
    var prevStatus = candidate.appointmentStatus;
    var currentHolingId = 0;
    this.candidate = candidate;
    this.user = CompanyFactory.getCurrentUser();
    this.sites = [];
    this.states = [];
    this.suburbs = [];
    this.site = {};
    this.state = {};
    this.suburb = {};
    this.calendars = [];
    this.calendar = {};
    this.statuses = [];
    this.isSubmitted = false;
    this.form = {};
    this.dateStatus = {};
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.dateStatus.timeOpened = false;
    this.isCalendarList = false;
    this.isAppointmentTime = false;
    this.apptTimeAfterConvert = null;
    this.format = "dd/MM/yyyy HH:mm";

    this.apptDateAfterConvert = mysqlDate(this.candidate.appointmentTime);

    if(this.candidate.appointmentTime){
      this.apptTimeAfterConvert = mysqlDate(this.candidate.appointmentTime);
    }

    this.isAppointmentTimeChange = false;

    if(this.apptTimeAfterConvert == ""){
      this.apptTimeAfterConvert = "00:00";
    }
    //console.log("apptTimeAfterConvert=",this.apptTimeAfterConvert);

    //server will send message to client to notify that the appt has occupied by another user, so the client can re-load the calendars
    mySocket.on('UpdateCalendar',function(data){
        $log.debug('refresh calendars by server');
        if(that.site.id){
          //if(!that.BookingCandidate.calendar){
              getCalendarForSocket();
          //}
        }
    });

    $scope.$watch(
       "AdminEditBookingCtrl.calendar",
       function( newValue, oldValue ) {
           // Ignore initial setup.
           if ( newValue === oldValue ) {
               return;
           }

           if(oldValue){
               RedimedSiteFactory.removeHolding(currentHolingId,oldValue.calId,function(holdingData){
                   console.log(' holdingData = ',holdingData);
               });
           }

           if(newValue){
               RedimedSiteFactory.setHolding(newValue.calId,function(holdingData){
                   console.log(' holdingData = ',holdingData);
                   currentHolingId = holdingData.holdingId;
                   //that.BookingCandidate.holdingId = holdingData.holdingId;
                   //notify the server the appt that the client has occupied, so the server can let other users know
                   mySocket.emit('OccupyAppt',newValue);
               });
           }

           console.log( "$watch: that.BookingCandidate.calendar changed.",newValue, oldValue);
       }
   );


    this.appointmentTimeChanged = function(){
        that.isAppointmentTimeChange = true;
        console.log(this.apptTimeAfterConvert);
    }

    this.openTime = function() {
        that.dateStatus.timeOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    BookingStatusFactory.getStatus(function(data){
        that.statuses = data;
        $log.debug(" status = ",that.statuses);
    });

    RedimedSiteFactory.getSite(function(data){
        $log.debug("get sites...");
        that.sites = data;
        that.site =  that.sites[_.findIndex(that.sites, 'id', that.candidate.siteId)];

        if(that.site.States.length > 0){
            that.states = that.site.States;
            that.state =  that.states[_.findIndex(that.states, 'stateName', that.candidate.stateName)];
            if(that.state.SubStates.length > 0){
                that.suburbs = that.state.SubStates;
                that.suburb =  that.suburbs[_.findIndex(that.suburbs, 'suburbName', that.candidate.suburbName)];
            }
        }

        if(that.site){
            getCalendar();
        }
    });

    this.selectedSite = function(){
        $log.debug("Get calendar from the factory");
        that.states = that.site.States;
        that.suburb = null;
        that.state = null;
        that.suburbs = null;
        getCalendar();
    };

    this.selectedState = function(){
        if(that.state){
            that.suburb = null;
            that.suburbs = that.state.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    this.isSendEmailDisabled = function(){
        if(this.candidate.appointmentStatus =='Confirmed'||this.candidate.appointmentStatus =='Pending'){
            return !that.isNotSave();
        }else{
            return false;
        }
    };

    this.isNotSave = function(){
        return that.form.$pristine
    };

    this.isAttended = function(){

        if((that.candidate.appointmentStatus == 'Reschedule' || that.candidate.appointmentStatus == 'Confirmed') ){
            return true;
        }else{
            return false;
        }

    };

    this.isShowAttendedButton = function(){
        if(that.user.userType.indexOf("RediMed") == -1 ){
            // this is a Redimed user, will go booking first
            return false;
        }else{
            return true;
        }
    };

    this.attended = function(){

                var updateValue = {};
                updateValue.appointmentStatus = 'Attended';

                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();

                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
    };

    this.sendConfirmationEmail = function(){
        $log.debug("> Will send email to ",that.candidate);
        if(that.candidate.appointmentStatus.indexOf('Pending')>=0 )
        {

            BookingCandidates.sendConfirmationEmail({id:that.candidate.candidateId,type:"pending"},function(rs){
                $log.debug(">>sendConfirmationEmail",rs);
                if(rs.sentEmailStatus.indexOf('Error')>=0){
                    toastr.error(rs.sentEmailStatus, 'Error');
                    $log.error("> Fail to send email to ",candidate);
                }else{
                    toastr.success(rs.sentEmailStatus, '');
                    $log.debug("> Send email successfullt ",rs.sentEmailStatus);
                }

            });

        }else{
            BookingCandidates.sendConfirmationEmail({id:that.candidate.candidateId,type:"new"},function(rs){
                $log.debug(">>sendConfirmationEmail",rs);
                if(rs.sentEmailStatus.indexOf('Error')>=0){
                    toastr.error(rs.sentEmailStatus, 'Error');
                    $log.error("> Fail to send email to ",candidate);
                }else{
                    toastr.success(rs.sentEmailStatus, '');
                    $log.debug("> Send email successfullt ",rs.sentEmailStatus);
                }

            });
        }

    };

    this.save = function (isSendEmail) {
        that.isSubmitted = true;
        var isSendConfirmationEmail = false;
        if((!that.candidate.appointmentTime && that.calendars.length > 0 && ( that.calendar == undefined || that.calendar == null)) && isSendEmail) {
            toastr.error("Please select the calendar", 'Error');
        }else{
            if(that.form.$valid){
                var updateValue = {};

                if(prevStatus.indexOf('Pending')>=0 && (that.calendar || that.apptTimeAfterConvert)){
                    updateValue.appointmentStatus = 'Confirmed';
                    that.candidate.appointmentStatus = 'Confirmed';
                    isSendConfirmationEmail = true;
                }

                if(that.calendar){
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && (that.calendar.calId != candidate.calendarId)){
                        updateValue.appointmentStatus = 'Reschedule';
                        that.candidate.appointmentStatus = 'Reschedule';
                        isSendConfirmationEmail = true;
                    }
                }else{
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && that.apptTimeAfterConvert && that.isAppointmentTimeChange){
                        updateValue.appointmentStatus = 'Reschedule';
                        that.candidate.appointmentStatus = 'Reschedule';
                        isSendConfirmationEmail = true;
                    }
                }




                updateValue.appointmentNotes = that.candidate.appointmentNotes;
                updateValue.siteId = that.site.id;
                updateValue.siteName = that.site.siteName;
                //If WA and Eastern stated => do not send email automatically
                if(updateValue.siteName.indexOf('Eastern States') >= 0 || updateValue.siteName.indexOf('WA') >= 0 || !isSendEmail){
                    isSendConfirmationEmail = false;
                }

                if(that.state){
                    updateValue.stateName = that.state.stateName;
                    updateValue.stateId = that.state.id;
                }else{
                    updateValue.stateName = null;
                    updateValue.stateId = null;
                }

                if(that.suburb){
                    updateValue.suburbName = that.suburb.suburbName;
                    updateValue.suburbId = that.suburb.id;
                }else{
                    updateValue.suburbName = null;
                    updateValue.suburbId = null;
                }

                console.log("that.calendar = ",that.calendar);
                if(that.calendar){
                    updateValue.appointmentTime =  moment(mysqlDate(that.calendar.fromTime)).format("YYYY-MM-DD hh:mm");
                    updateValue.calendarId = that.calendar.calId;
                }else{

                    if(that.apptTimeAfterConvert){
                        //in case there is no calendar list i.e: in VIC,.....
                        //admin enter the appt time directly
                        updateValue.appointmentTime =  moment(that.apptDateAfterConvert).format("YYYY-MM-DD") + " " + moment(that.apptTimeAfterConvert).format("hh:mm");
                    }

                }

                $log.debug("will update",updateValue);
                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();
                        //$uibModalInstance.close(that.BookingCandidate);
                        if(isSendConfirmationEmail){
                            that.sendConfirmationEmail();
                        }


                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
            }
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    this.canCancelAppt = function(){
        if( that.candidate.appointmentStatus.indexOf('Confirmed') >= 0 ||  that.candidate.appointmentStatus.indexOf('Reschedule') >= 0){
            return true;
        }else{
            return false;
        }
    }

    this.cancelAppt = function () {
                    //open modal to enter new candidate
            $uibModalInstance.dismiss('cancel');
            var modalInstance = $uibModal.open({
                templateUrl: 'modules/Bookings/views/booking.ConfirmToCancelAppt.html',
                controller: 'ConfirmToCancelApptCtrl',
                controllerAs: 'ConfirmToCancelApptCtrl'
            });

            modalInstance.result.then(function (position) {
                var updateValue = {};

                updateValue.appointmentNotes = that.candidate.appointmentNotes;
                updateValue.appointmentStatus = 'Cancel';

                updateValue.calendarId = -1;

                $log.debug("will cancel the booking ",updateValue);

                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        //$uibModalInstance.close(that.BookingCandidate);
                        that.sendConfirmationEmail();
                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    function getCalendarForSocket(){
        //Plus toDate one date before query calendar because of time
        var fromDate = new Date();
        var toDate = new Date();
        toDate.setDate(toDate.getDate() + 60);
        RedimedSiteFactory.getCalendar(that.site.id,fromDate,toDate,function(data){
            that.calendars = data;
            $log.debug('received data from server getCalendar with current calendar =',that.calendar);
            if(that.calendar){
              that.calendars.unshift(that.calendar);
            }
        });
    };

    function getCalendar(){
        $log.debug("will getCalendar....",that.user);
        //Plus toDate one date before query calendar because of time
        var fromDate = new Date();
        var toDate = new Date();
        toDate.setDate(toDate.getDate() + 60);
        RedimedSiteFactory.getCalendar(that.site.id,fromDate,toDate,function(data){
            $log.debug("finished getCalendar....", that.user);
            console.log(" RedimedSiteFactory.getCalendar = ",data)
            that.calendars = data;
            that.calendar =  that.calendars[_.findIndex(that.calendars, 'calId', that.candidate.calendarId)];

            if(that.calendars.length > 0){
                that.isCalendarList = true;
                that.isAppointmentTime = false;
            }else{
                that.isCalendarList = false;
                that.isAppointmentTime = true;
            }


            //if user is not an admin, not allow to select time and date ; only select in calendar list
            if(that.user.userType.indexOf("RediMed") == -1 ){
                // this is a Redimed user, will go booking first
                that.isAppointmentTime = false;
            }

            console.log("that.calendars = ",that.calendars,"that.calendar = ", that.calendar);
        });
    };

    this.isAdmin = function(){
        return that.user.userType.indexOf("RediMed") >= 0 ? true :false;
    };

}]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Bookings')
    .controller('ConfirmToCancelApptCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Bookings')
    .controller('BookingsMainCtrl',['uiGridConstants','$scope','$window','CompanyFactory','$uibModal','$cookieStore','$log','mysqlDate','mySharedService','Packages','$q', function (uiGridConstants,$scope,$window,CompanyFactory,$uibModal,$cookieStore,$log, mysqlDate,sharedService,Packages,$q) {
        $log = $log.getInstance("ocsApp.Bookings.BookingsMainCtrl");
        $log.debug("I am booking list controller.");

        var that = this;
        this.window = $window;
        var packages = [];
        this.loading = false;
        this.user = CompanyFactory.getCurrentUser();

        var docDefinition = {
          content: [

                    ],
          styles: {
            header: {
              bold: true,
              color: '#000',
              fontSize: 11
            },
            demoTable: {
              color: '#666',
              fontSize: 10
            }
          }
        };

        this.openPdf = function(entity,isDownload) {
          //console.log(" entity.packageId = ",entity.packageId);
          var package = _.where(packages, {id:entity.packageId})[0];

          function getPackage(packId) {
            // perform some asynchronous operation, resolve or reject the promise when appropriate.
            return $q(function(resolve, reject) {

              var package = _.where(packages, {id:packId})[0];

              if(package){
                  printForm(that.window,entity,package);
                  resolve(package);
              }else{
                  Packages.findById({id:packId},function(res){
                      //console.log("finded the package = ",res);
                      resolve(res);
                  },function(err){
                      reject(err);
                  });
              }
            });
          }

          var promise = getPackage(entity.packageId);

          promise.then(function(greeting) {
              printForm(entity,greeting);
          }, function(reason) {
              printForm(entity,'');
              $log.error('Failed: ' + reason);
          });




      var printForm = function(entity,package){
          var packageView = "";
          var pdfPackageView = [];
          $log.debug(" printBookingForm has package = ",package);

          for(var i in package.AssessmentHeaders){
              var header = package.AssessmentHeaders[i];
              packageView = packageView + "<b>" + header.headerName + "</b><br>";
              pdfPackageView.push({text:header.headerName,bold:true});
              var pdfAss = [];
              for(var j in header.Assessments){
                  var ass = header.Assessments[j];
                  packageView = packageView + " - " + ass.assName + "<br>";
                  pdfAss.push(" - " +ass.assName);
              }
              pdfPackageView.push(pdfAss);
          }

          $log.debug(" pdf printBookingForm has package view = ",pdfPackageView);

          var siteName = entity.siteName;
          if(entity.stateName){
              siteName = siteName + ' - ' + entity.stateName;
          }
          if(entity.suburbName){
              siteName = siteName + ' - ' + entity.suburbName;
          }

          docDefinition = {
            content: [
              {
               text: 'Booking Form',
               style: 'header',
               alignment: 'center'
             },
              {
                 style: 'tableExample',
                 color: '#444',
                 table: {
                     widths: [ 200, 300],
                     headerRows: 5,
                     // keepWithHeaderRows: 1,
                     body: [
                         [{ text: 'Company Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          ['Company', entity.fatherCompanyName],
                          ['Subsidiary', entity.companyName],
                          ['PO Number', entity.poNumber],
                          ['Project Identification', entity.projectIdentofication],
                          ['Booking Person', entity.bookingPerson],
                          ['Booking Person Contact Number', entity.contactNumber],
                          ['Results to', entity.resultEmail],
                          ['Invoices to', entity.invoiceEmail],
                          ['Comments', entity.comments],
                          [{ text: 'Worker Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          ['Candidate Name', entity.candidatesName],
                          ['Date Of Birth', dateformat(entity.dob,"DD/MM/YYYY")],
                          ['Phone', entity.phone],
                          ['Email', entity.email],
                          ['Position Applied For', entity.position],
                          [{ text: 'Paperwork', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          [{ colSpan: 2, text:  entity.paperwork}, '' ],
                          [{ text: 'Assessment Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          [ { colSpan: 2,
                              stack: pdfPackageView
                            },
                            ''
                          ],
                          [{ text: 'Appointment Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          ['Appointment location', siteName],
                          ['Appointment time', dateformat(entity.appointmentTime,"DD/MM/YYYY HH:mm")],
                          ['Appointment Notes', entity.appointmentNotes],
                          ['Appointment status', entity.appointmentStatus],

                     ]
                 }
             }
            ],
            styles: {
              header: {
               fontSize: 18,
               bold: true,
               margin: [0, 0, 0, 10]
             },
             subheader: {
               fontSize: 16,
               bold: true,
               margin: [0, 10, 0, 5]
             },
             tableExample: {
               margin: [0, 5, 0, 15],
                fontSize: 9,
             },
             tableHeader: {
               bold: true,
               fontSize: 11,
               color: 'black'
             }
            }
          };

          $log.debug("Print candidate pdf form",docDefinition);
          if(isDownload){
            pdfMake.createPdf(docDefinition).download();
          }else{
            pdfMake.createPdf(docDefinition).open();
          }

       };
     }

       this.downloadPdf = function() {
         pdfMake.createPdf(docDefinition).download();
       };

       //<button ng-click="grid.appScope.openPdf(row.entity)" class="blue">Pdf Form</button>

        var columnDefs = [
            {
                field: 'viewCandidate',
                displayName: 'Action',
                width: "300",
                enableFiltering: false,
                enableCellEdit: false,
                cellTemplate:'<button ng-click="grid.appScope.adminEditBooking(row.entity)" class="blue">View Details</button><button ng-click="grid.appScope.openPdf(row.entity,1)" class="blue">Download Form</button>'
            },
            { field: 'fatherCompanyName', displayName: "Company Name", width: "150"},
            { field: 'companyName', displayName: "Subsidiary", width: "150"},
            //{ field: 'subCompanyName', displayName: "Company Name", width: "150"},
            {
                field: 'candidatesName',
                displayName: 'Candidate Name',
                width: "200",
                enableCellEdit: false,
                cellTemplate:'<a ng-click="grid.appScope.printBookingForm(row.entity)" class="blue">{{row.entity.candidatesName}}</a>'
            },
            { field: 'appointmentTime', displayName: "Appointment Time", width: "250",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm\'' ,
                filters:[
                    {condition:checkStart},
                    {condition:checkEnd}],
                filterHeaderTemplate: '<div class="ui-grid-filter-container">from: <input style="display:inline; width:35%"  class="ui-grid-filter-input" date-picker type="text" ng-model="col.filters[0].term"/> - <input style="display:inline; width:35%" class="ui-grid-filter-input" date-picker type="text" ng-model="col.filters[1].term"/></div>'
            },
            { field: 'siteName', displayName: "Site", width: "100"},
            { field: 'stateName', displayName: "State", width: "100"},
            { field: 'suburbName', displayName: "Suburb", width: "100"},
            { field: 'bookingPerson', displayName: "Booking Person", width: "150"},
            { field: 'comments', displayName: "Booking Comments", width: "200"},
            { field: 'appointmentNotes', displayName: "Notes", width: "200"},

            { field: 'appointmentStatus', displayName: "Status", width: "100"},
            { field: 'projectIdentofication', displayName: "Project Indentification", width: "120"},
            { field: 'poNumber', displayName: "PO Number", width: "120"},
            { field: 'packageName', displayName: "Package Name", width: "200"},
            { field: 'paperwork', displayName: "Paperwork", width: "100"},
            { field: 'email', displayName: "Email", width: "150"},
            { field: 'dob', displayName: "DOB", width: "100",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy\''},
            { field: 'creationDate', displayName: "Creation Date",  width: "200",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm\''},
            { field: 'createdBy', displayName: "By",  width: "50"},
            { field: 'headerCandidateId', displayName: "Link ID",  width: "50"},
            { field: 'issendemail', displayName: "Send Email",  width: "50"}
        ];



        this.isAdmin = function(){
            return that.user.userType.indexOf("RediMed") >= 0;
        };

        function dateformat(date,format){

            //console.log(mysqlDate(date));
            var dateAfterFormat = moment(mysqlDate(date)).format(format);
            if(dateAfterFormat =="Invalid date")
                return "";
            else
                return dateAfterFormat;
        };

        this.adminEditBooking = function(entity){

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'modules/Bookings/views/bookings.adminEditBooking.html',
                controller: 'AdminEditBookingCtrl',
                controllerAs: 'AdminEditBookingCtrl',
                size: 'lg',
                resolve : {
                    candidate:function(){return entity;}
                }
            });

            modalInstance.result.then(function (rs) {
                //console.log(rs);
                $log.debug('Modal closed at: ' + new Date());
            }, function (rs) {
                //console.log(rs);
                $log.debug('Modal dismissed at: ' + new Date());
            });
        }


        this.printBookingForm = function(entity){
            //console.log(" entity.packageId = ",entity.packageId);
            var package = _.where(packages, {id:entity.packageId})[0];

            function getPackage(packId) {
              // perform some asynchronous operation, resolve or reject the promise when appropriate.
              return $q(function(resolve, reject) {

                var package = _.where(packages, {id:packId})[0];

                if(package){
                    printForm(that.window,entity,package);
                    resolve(package);
                }else{
                    Packages.findById({id:packId},function(res){
                        //console.log("finded the package = ",res);
                        resolve(res);
                    },function(err){
                        reject(err);
                    });
                }
              });
            }

            var promise = getPackage(entity.packageId);

            promise.then(function(greeting) {
                printForm(that.window,entity,greeting);
            }, function(reason) {
                printForm(that.window,entity,'');
                $log.error('Failed: ' + reason);
            });


        };

        var printForm = function(w,entity,package){
            var packageView = "";
            var pdfPackageView = [];
            $log.debug(" printBookingForm has package = ",package);



            for(var i in package.AssessmentHeaders){
                var header = package.AssessmentHeaders[i];
                packageView = packageView + "<b>" + header.headerName + "</b><br>";
                pdfPackageView.push({text:header.headerName,bold:true});
                var pdfAss = [];
                for(var j in header.Assessments){
                    var ass = header.Assessments[j];
                    packageView = packageView + " - " + ass.assName + "<br>";
                    pdfAss.push(" - " +ass.assName);
                }
                pdfPackageView.push(pdfAss);
            }

            $log.debug(" printBookingForm has package view = ",packageView);

            var siteName = entity.siteName;
            if(entity.stateName){
                siteName = siteName + ' - ' + entity.stateName;
            }
            if(entity.suburbName){
                siteName = siteName + ' - ' + entity.suburbName;
            }

            var templateHTML =
                '<table cellspacing="0" cellpadding="4" align="center" style="border-collapse: collapse"> \n' +
                '<tbody><tr><td colspan="4" bgcolor="Silver"><b>Booking Details</b></td></tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Company</td> \n' + '<td style="border:1px solid gray" colspan="3">'+entity.fatherCompanyName+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Subsidiary</td> \n' + '<td style="border:1px solid gray" colspan="3">'+entity.companyName+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">PO Number</td> \n' + '<td style="border:1px solid gray" colspan="3">'+entity.poNumber+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Project Identification</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.projectIdentofication+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Booking Person</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.bookingPerson+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Booking Person Contact Number</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.contactNumber+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Results to</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.resultEmail+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Invoices to</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.invoiceEmail+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Comments</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.comments+'</td> \n' +
                '</tr> \n' +

                '<tr><td colspan="4" bgcolor="Silver"><b>Worker Details</b></td></tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Name</td> \n' +
                '<td style="border:1px solid gray">'+entity.candidatesName+'</td> \n' +
                '<td style="border:1px solid gray">DOB</td> \n' +
                '<td style="border:1px solid gray">'+ dateformat(entity.dob,"DD/MM/YYYY")+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Phone</td> \n' +
                '<td style="border:1px solid gray">'+entity.phone+'</td> \n' +
                '<td style="border:1px solid gray">Email</td> \n' +
                '<td style="border:1px solid gray">'+entity.email+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Position applied for</td> \n' +
                '<td style="border:1px solid gray" colspan="3">'+entity.position+'</td> \n' +
                '</tr> \n' +
                '<tr><td colspan="4" bgcolor="Silver"><b>Paperwork</b></td></tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray" colspan="4"> \n' +
                ''+ entity.paperwork +'</td></tr> \n' +

                '<tr><td colspan="4" bgcolor="Silver"><b>Assessment Details</b></td></tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray" colspan="4"> \n' +
                ''+ packageView +'</td></tr> \n' +


                '<tr><td colspan="4" bgcolor="Silver"><b>Appointment Details</b></td></tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Appointment location</td> \n' +
                '<td style="border:1px solid gray" colspan="3">' + siteName + '</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Appointment time</td> \n' +
                '<td style="border:1px solid gray" colspan="3">'+ dateformat(entity.appointmentTime,"DD/MM/YYYY HH:mm")+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Appointment Notes</td> \n' +
                '<td style="border:1px solid gray" colspan="3">'+entity.appointmentNotes+'</td> \n' +
                '</tr> \n' +
                '<tr> \n' +
                '<td style="border:1px solid gray">Appointment status</td> \n' +
                '<td style="border:1px solid gray" colspan="3">'+entity.appointmentStatus+'</td> \n' +
                '</tr> \n' +
                '</tbody></table>';

            $log.debug("Print candidate form",templateHTML);
            var OpenWindow = w.open('modules/Bookings/views/bookingform.html', '','');
            OpenWindow.dataFromParent = templateHTML;

        };

        function checkStart(term, value, row, column) {

            term = term.replace(/\\/g,"")
            var now = moment(value);
            if(term) {
                var startDate = moment(term, "DD/MM/YYYY");
                var isAfter = startDate.isAfter(now, 'day');
                if(isAfter) return false;
            }
            return true;
        }

        function checkEnd(term, value, row, column) {
            term = term.replace(/\\/g,"")
            var now = moment(value);
            if(term) {
                var endDate = moment(term, "DD/MM/YYYY");
                var isBefore = endDate.isBefore(now, 'day');
                if(isBefore) return false;
            }
            return true;
        }


        var rowtpl = '<div ng-class="{ red: row.entity.issendemail == null }"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

        this.gridOptions = {
            enableSorting: true,
            rowTemplate:rowtpl,
            enableColumnResizing: true,
            enableFiltering: true,
            appScopeProvider: this,
            columnDefs: columnDefs,
            onRegisterApi: function( gridApi ) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {

                    //console.log(sortColumns);
                });
            },
            enableGridMenu: true,
            enableRowSelection: false,
            enableSelectAll: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'myFile.csv',
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from AdminEditBookingCtrl = " + msg);
            if( msg.indexOf("Refresh booking list successfully") >= 0 ){
                CompanyFactory.getCompany(function(data){
                    $log.debug("Refresh bookings, get company info");
                    toastr.success('The booking list has been refreshed !');
                    that.gridOptions.data = data.allBookings;
                });
            }
        });

        this.refreshBooking = function(){
            $log.debug("will refresh booking ; get data from DB......");
            that.loading = true;
            CompanyFactory.refreshBookingList(function(data){
                    $log.debug("refreshed booking ; get data from DB......");
                    that.gridOptions.data = data.allBookings;
                    that.loading = false;
            });
        }

        CompanyFactory.getCompany(function(data){

            $log.debug("Make booking, get company info");
           // console.log(data);
            that.gridOptions.data = data.allBookings;
            that.loading = false;
            packages = data.packages;// ==null? data.packages:data.allPackages;

        });

    }]);

/**
 * Created by phuongnguyen on 17/02/16.
 */
/**
 * DynamicForms - Build Forms in AngularJS From Nothing But JSON
 * @version v0.0.4 - 2014-11-16
 * @link http://github.com/danhunsaker/angular-dynamic-forms
 * @license MIT, http://opensource.org/licenses/MIT
 */

/**
 * Dynamically build an HTML form using a JSON array/object as a template.
 *
 * @todo Properly describe this directive.
 * @param {mixed} [template] - The form template itself, as an array or object.
 * @param {string} [templateUrl] - The URL to retrieve the form template from; template overrides.
 * @param {Object} ngModel - An object in the current scope where the form data should be stored.
 * @example <dynamic-form template-url="form-template.js" ng-model="formData"></dynamic-form>
 */
angular.module('dynform', [])
    .directive('dynamicForm', ['$q', '$parse', '$http', '$templateCache', '$compile', '$document', '$timeout', function ($q, $parse, $http, $templateCache, $compile, $document, $timeout) {
        var supported = {
            //  Text-based elements
            'text': {element: 'input', type: 'text', editable: true, textBased: true},
            'date': {element: 'input', type: 'date', editable: true, textBased: true},
            'datetime': {element: 'input', type: 'datetime', editable: true, textBased: true},
            'datetime-local': {element: 'input', type: 'datetime-local', editable: true, textBased: true},
            'email': {element: 'input', type: 'email', editable: true, textBased: true},
            'month': {element: 'input', type: 'month', editable: true, textBased: true},
            'number': {element: 'input', type: 'number', editable: true, textBased: true},
            'password': {element: 'input', type: 'password', editable: true, textBased: true},
            'search': {element: 'input', type: 'search', editable: true, textBased: true},
            'tel': {element: 'input', type: 'tel', editable: true, textBased: true},
            'textarea': {element: 'textarea', editable: true, textBased: true},
            'time': {element: 'input', type: 'time', editable: true, textBased: true},
            'url': {element: 'input', type: 'url', editable: true, textBased: true},
            'week': {element: 'input', type: 'week', editable: true, textBased: true},
            //  Specialized editables
            'checkbox': {element: 'input', type: 'checkbox', editable: true, textBased: false},
            'color': {element: 'input', type: 'color', editable: true, textBased: false},
            'file': {element: 'input', type: 'file', editable: true, textBased: false},
            'range': {element: 'input', type: 'range', editable: true, textBased: false},
            'select': {element: 'select', editable: true, textBased: false},
            //  Pseudo-non-editables (containers)
            'checklist': {element: 'div', editable: false, textBased: false},
            'fieldset': {element: 'fieldset', editable: false, textBased: false},
            'radio': {element: 'div', editable: false, textBased: false},
            //  Non-editables (mostly buttons)
            'button': {element: 'button', type: 'button', editable: false, textBased: false},
            'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
            'image': {element: 'input', type: 'image', editable: false, textBased: false},
            'legend': {element: 'legend', editable: false, textBased: false},
            'reset': {element: 'button', type: 'reset', editable: false, textBased: false},
            'submit': {element: 'button', type: 'submit', editable: false, textBased: false}
        };

        return {
            restrict: 'E', // supports using directive as element only
            link: function ($scope, element, attrs) {
                //  Basic initialization
                var newElement = null,
                    newChild = null,
                    optGroups = {},
                    cbAtt = '',
                    foundOne = false,
                    iterElem = element,
                    model = null;

                console.log("> 1  element =",element,"attrs=",attrs);
                //  Check that the required attributes are in place
                if (angular.isDefined(attrs.ngModel) && (angular.isDefined(attrs.template) || angular.isDefined(attrs.templateUrl)) && !element.hasClass('dynamic-form')) {
                    model = $parse(attrs.ngModel)($scope);
                    //  Grab the template. either from the template attribute, or from the URL in templateUrl
                    (attrs.template ? $q.when($parse(attrs.template)($scope)) :
                        $http.get(attrs.templateUrl, {cache: $templateCache}).then(function (result) {
                            return result.data;
                        })
                        ).then(function (template) {

                            console.log("> 2  template =",template);

                            var setProperty = function (obj, props, value, lastProp, buildParent) {
                                    props = props.split('.');
                                    lastProp = lastProp || props.pop();

                                    for (var i = 0; i < props.length; i++) {
                                        obj = obj[props[i]] = obj[props[i]] || {};
                                    }

                                    if (!buildParent) {
                                        obj[lastProp] = value;
                                    }
                                },
                                bracket = function (model, base) {
                                    props = model.split('.');
                                    return (base || props.shift()) + (props.length ? "['" + props.join("']['") + "']" : '');
                                },
                                buildFields = function (field, id) {

                                    console.log("> 3  field =",field," id =",id);

                                    if (String(id).charAt(0) == '$') {
                                        // Don't process keys added by Angular...  See GitHub Issue #29
                                        return;
                                    }
                                    else if (!angular.isDefined(supported[field.type]) || supported[field.type] === false) {
                                        //  Unsupported.  Create SPAN with field.label as contents
                                        newElement = angular.element('<span></span>');
                                        if (angular.isDefined(field.label)) {angular.element(newElement).html(field.label);}
                                        angular.forEach(field, function (val, attr) {
                                            if (["label", "type"].indexOf(attr) > -1) {return;}
                                            newElement.attr(attr, val);
                                        });
                                        this.append(newElement);
                                        newElement = null;
                                    }
                                    else {
                                        //  Supported.  Create element (or container) according to type
                                        if (!angular.isDefined(field.model)) {
                                            field.model = id;
                                        }

                                        newElement = angular.element($document[0].createElement(supported[field.type].element));
                                        if (angular.isDefined(supported[field.type].type)) {
                                            newElement.attr('type', supported[field.type].type);
                                        }




                                        //  Editable fields (those that can feed models)
                                        if (angular.isDefined(supported[field.type].editable) && supported[field.type].editable) {
                                            //newElement.attr('name', bracket(field.model));
                                            newElement.attr('ng-model', bracket(field.model, attrs.ngModel));
                                            console.log("ng-model",bracket(field.model, attrs.ngModel));
                                            // Build parent in case of a nested model
                                            //setProperty(model, field.model, {}, null, true);

                                            //if (angular.isDefined(field.readonly)) {newElement.attr('ng-readonly', field.readonly);}
                                            if (angular.isDefined(field.required)) {newElement.attr('ng-required', field.required);}
                                            /*
                                            if (angular.isDefined(field.val)) {
                                                setProperty(model, field.model, angular.copy(field.val));
                                                newElement.attr('value', field.val);
                                            }
                                            */
                                        }

                                        //  Fields based on input type=text
                                        if (angular.isDefined(supported[field.type].textBased) && supported[field.type].textBased) {
                                            if (angular.isDefined(field.minLength)) {newElement.attr('ng-minlength', field.minLength);}
                                            if (angular.isDefined(field.maxLength)) {newElement.attr('ng-maxlength', field.maxLength);}
                                            if (angular.isDefined(field.validate)) {newElement.attr('ng-pattern', field.validate);}
                                            if (angular.isDefined(field.placeholder)) {newElement.attr('placeholder', field.placeholder);}
                                        }


                                        // Add the element to the page
                                        console.log("> 4  newElement =",newElement);
                                        this.append(newElement);
                                        newElement = null;
                                    }
                                };

                            angular.forEach(template, buildFields, element);

                            //  Determine what tag name to use (ng-form if nested; form if outermost)
                            while (!angular.equals(iterElem.parent(), $document) && !angular.equals(iterElem[0], $document[0].documentElement)) {
                                if (['form','ngForm','dynamicForm'].indexOf(attrs.$normalize(angular.lowercase(iterElem.parent()[0].nodeName))) > -1) {
                                    foundOne = true;
                                    break;
                                }
                                iterElem = iterElem.parent();
                            }
                            if (foundOne) {
                                newElement = angular.element($document[0].createElement('ng-form'));
                            }
                            else {
                                newElement = angular.element("<form></form>");
                            }

                            //  Psuedo-transclusion
                            angular.forEach(attrs.$attr, function(attName, attIndex) {
                                console.log("adding into form = ",attName,attrs[attIndex]);
                                newElement.attr(attName, attrs[attIndex]);
                            });
                            newElement.attr('model', attrs.ngModel);
                            newElement.removeAttr('ng-model');
                            angular.forEach(element[0].classList, function(clsName) {
                                console.log("adding into form = ",clsName);
                                newElement[0].classList.add(clsName);
                            });
                            newElement.addClass('dynamic-form');
                            newElement.append(element.contents());

                            //  onReset logic
                            newElement.data('$_cleanModel', angular.copy(model));
                            newElement.bind('reset', function () {
                                $timeout(function () {
                                    $scope.$broadcast('reset', arguments);
                                }, 0);
                            });
                            $scope.$on('reset', function () {
                                $scope.$apply(function () {
                                    $scope[attrs.ngModel] = {};
                                });
                                $scope.$apply(function () {
                                    $scope[attrs.ngModel] = angular.copy(newElement.data('$_cleanModel'));
                                });
                            });

                            //  Compile and update DOM
                            $compile(newElement)($scope);
                            element.replaceWith(newElement);
                        });
                }
            }
        };
    }])
    //  Not a fan of how Angular's ngList is implemented, so here's a better one (IMO).  It will ONLY
    //  apply to <dynamic-form> child elements, and replaces the ngList that ships with Angular.
    .directive('ngList', [function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attr, ctrl) {
                var match = /\/(.*)\//.exec(element.attr(attr.$attr.ngList)),
                    separator = match && new RegExp(match[1]) || element.attr(attr.$attr.ngList) || ',';

                if (element[0].form !== null && !angular.element(element[0].form).hasClass('dynamic-form')) {
                    return;
                }

                ctrl.$parsers.splice(0, 1);
                ctrl.$formatters.splice(0, 1);

                ctrl.$parsers.push(function(viewValue) {
                    var list = [];

                    if (angular.isString(viewValue)) {
                        //  Don't have Angular's trim() exposed, so let's simulate it:
                        if (String.prototype.trim) {
                            angular.forEach(viewValue.split(separator), function(value) {
                                if (value) list.push(value.trim());
                            });
                        }
                        else {
                            angular.forEach(viewValue.split(separator), function(value) {
                                if (value) list.push(value.replace(/^\s*/, '').replace(/\s*$/, ''));
                            });
                        }
                    }

                    return list;
                });

                ctrl.$formatters.push(function(val) {
                    var joinBy = angular.isString(separator) && separator || ', ';

                    if (angular.isArray(val)) {
                        return val.join(joinBy);
                    }

                    return undefined;
                });
            }
        };
    }])
    //  Following code was adapted from http://odetocode.com/blogs/scott/archive/2013/07/05/a-file-input-directive-for-angularjs.aspx
    .directive('input', ['$parse', function ($parse) {
        return {
            restrict: 'E',
            require: '?ngModel',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    // Doesn't have an ng-model attribute; nothing to do here.
                    return;
                }

                if (attrs.type === 'file') {
                    var modelGet = $parse(attrs.ngModel),
                        modelSet = modelGet.assign,
                        onChange = $parse(attrs.onChange),
                        updateModel = function () {
                            scope.$apply(function () {
                                modelSet(scope, element[0].files);
                                onChange(scope);
                            });
                        };

                    ctrl.$render = function () {
                        element[0].files = this.$viewValue;
                    };
                    element.bind('change', updateModel);
                }
                else if (attrs.type === 'range') {
                    ctrl.$parsers.push(function (val) {
                        if (val) {
                            return parseFloat(val);
                        }
                    });
                }
            }
        };
    }])
    //  Following code was adapted from http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
    .factory('fileReader', ['$q', function ($q) {
        var onLoad = function(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            },
            onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.error);
                    });
                };
            },
            onProgress = function(reader, scope) {
                return function (event) {
                    scope.$broadcast('fileProgress',
                        {
                            total: event.total,
                            loaded: event.loaded,
                            status: reader.readyState
                        });
                };
            },
            getReader = function(deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };

        return {
            readAsArrayBuffer: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsArrayBuffer(file);
                return deferred.promise;
            },
            readAsBinaryString: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsBinaryString(file);
                return deferred.promise;
            },
            readAsDataURL: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            },
            readAsText: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsText(file);
                return deferred.promise;
            }
        };
    }]);

/*  End of dynamic-forms.js */

/**
 * Created by phuongnguyen on 17/02/16.
 */
/**
 * DynamicForms - Build Forms in AngularJS From Nothing But JSON
 * @version v0.0.4 - 2014-11-16
 * @link http://github.com/danhunsaker/angular-dynamic-forms
 * @license MIT, http://opensource.org/licenses/MIT
 */

/**
 * Dynamically build an HTML form using a JSON array/object as a template.
 *
 * @todo Properly describe this directive.
 * @param {mixed} [template] - The form template itself, as an array or object.
 * @param {string} [templateUrl] - The URL to retrieve the form template from; template overrides.
 * @param {Object} ngModel - An object in the current scope where the form data should be stored.
 * @example <dynamic-form template-url="form-template.js" ng-model="formData"></dynamic-form>
 */
angular.module('dynform', [])
    .directive('dynamicForm', ['$q', '$parse', '$http', '$templateCache', '$compile', '$document', '$timeout', function ($q, $parse, $http, $templateCache, $compile, $document, $timeout) {
        var supported = {
            //  Text-based elements
            'text': {element: 'input', type: 'text', editable: true, textBased: true},
            'date': {element: 'input', type: 'date', editable: true, textBased: true},
            'datetime': {element: 'input', type: 'datetime', editable: true, textBased: true},
            'datetime-local': {element: 'input', type: 'datetime-local', editable: true, textBased: true},
            'email': {element: 'input', type: 'email', editable: true, textBased: true},
            'month': {element: 'input', type: 'month', editable: true, textBased: true},
            'number': {element: 'input', type: 'number', editable: true, textBased: true},
            'password': {element: 'input', type: 'password', editable: true, textBased: true},
            'search': {element: 'input', type: 'search', editable: true, textBased: true},
            'tel': {element: 'input', type: 'tel', editable: true, textBased: true},
            'textarea': {element: 'textarea', editable: true, textBased: true},
            'time': {element: 'input', type: 'time', editable: true, textBased: true},
            'url': {element: 'input', type: 'url', editable: true, textBased: true},
            'week': {element: 'input', type: 'week', editable: true, textBased: true},
            //  Specialized editables
            'checkbox': {element: 'input', type: 'checkbox', editable: true, textBased: false},
            'color': {element: 'input', type: 'color', editable: true, textBased: false},
            'file': {element: 'input', type: 'file', editable: true, textBased: false},
            'range': {element: 'input', type: 'range', editable: true, textBased: false},
            'select': {element: 'select', editable: true, textBased: false},
            //  Pseudo-non-editables (containers)
            'checklist': {element: 'div', editable: false, textBased: false},
            'fieldset': {element: 'fieldset', editable: false, textBased: false},
            'radio': {element: 'div', editable: false, textBased: false},
            //  Non-editables (mostly buttons)
            'button': {element: 'button', type: 'button', editable: false, textBased: false},
            'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
            'image': {element: 'input', type: 'image', editable: false, textBased: false},
            'legend': {element: 'legend', editable: false, textBased: false},
            'reset': {element: 'button', type: 'reset', editable: false, textBased: false},
            'submit': {element: 'button', type: 'submit', editable: false, textBased: false}
        };

        return {
            restrict: 'E', // supports using directive as element only
            link: function ($scope, element, attrs) {
                //  Basic initialization
                var newElement = null,
                    newChild = null,
                    optGroups = {},
                    cbAtt = '',
                    foundOne = false,
                    iterElem = element,
                    model = null;

                console.log("> 1  element =",element,"attrs=",attrs);
                //  Check that the required attributes are in place
                if (angular.isDefined(attrs.ngModel) && (angular.isDefined(attrs.template) || angular.isDefined(attrs.templateUrl)) && !element.hasClass('dynamic-form')) {
                    model = $parse(attrs.ngModel)($scope);
                    //  Grab the template. either from the template attribute, or from the URL in templateUrl
                    (attrs.template ? $q.when($parse(attrs.template)($scope)) :
                        $http.get(attrs.templateUrl, {cache: $templateCache}).then(function (result) {
                            return result.data;
                        })
                        ).then(function (template) {

                            console.log("> 2  template =",template);

                            var setProperty = function (obj, props, value, lastProp, buildParent) {
                                    props = props.split('.');
                                    lastProp = lastProp || props.pop();

                                    for (var i = 0; i < props.length; i++) {
                                        obj = obj[props[i]] = obj[props[i]] || {};
                                    }

                                    if (!buildParent) {
                                        obj[lastProp] = value;
                                    }
                                },
                                bracket = function (model, base) {
                                    props = model.split('.');
                                    return (base || props.shift()) + (props.length ? "['" + props.join("']['") + "']" : '');
                                },
                                buildFields = function (field, id) {

                                    console.log("> 3  field =",field," id =",id);

                                    if (String(id).charAt(0) == '$') {
                                        // Don't process keys added by Angular...  See GitHub Issue #29
                                        return;
                                    }
                                    else if (!angular.isDefined(supported[field.type]) || supported[field.type] === false) {
                                        //  Unsupported.  Create SPAN with field.label as contents
                                        newElement = angular.element('<span></span>');
                                        if (angular.isDefined(field.label)) {angular.element(newElement).html(field.label);}
                                        angular.forEach(field, function (val, attr) {
                                            if (["label", "type"].indexOf(attr) > -1) {return;}
                                            newElement.attr(attr, val);
                                        });
                                        this.append(newElement);
                                        newElement = null;
                                    }
                                    else {
                                        //  Supported.  Create element (or container) according to type
                                        if (!angular.isDefined(field.model)) {
                                            field.model = id;
                                        }

                                        newElement = angular.element($document[0].createElement(supported[field.type].element));
                                        if (angular.isDefined(supported[field.type].type)) {
                                            newElement.attr('type', supported[field.type].type);
                                        }

                                        //  Editable fields (those that can feed models)
                                        if (angular.isDefined(supported[field.type].editable) && supported[field.type].editable) {
                                            newElement.attr('name', bracket(field.model));
                                            newElement.attr('ng-model', bracket(field.model, attrs.ngModel));
                                            // Build parent in case of a nested model
                                            setProperty(model, field.model, {}, null, true);

                                            if (angular.isDefined(field.readonly)) {newElement.attr('ng-readonly', field.readonly);}
                                            if (angular.isDefined(field.required)) {newElement.attr('ng-required', field.required);}
                                            if (angular.isDefined(field.val)) {
                                                setProperty(model, field.model, angular.copy(field.val));
                                                newElement.attr('value', field.val);
                                            }
                                        }

                                        //  Fields based on input type=text
                                        if (angular.isDefined(supported[field.type].textBased) && supported[field.type].textBased) {
                                            if (angular.isDefined(field.minLength)) {newElement.attr('ng-minlength', field.minLength);}
                                            if (angular.isDefined(field.maxLength)) {newElement.attr('ng-maxlength', field.maxLength);}
                                            if (angular.isDefined(field.validate)) {newElement.attr('ng-pattern', field.validate);}
                                            if (angular.isDefined(field.placeholder)) {newElement.attr('placeholder', field.placeholder);}
                                        }

                                        //  Special cases
                                        if (field.type === 'number' || field.type === 'range') {
                                            if (angular.isDefined(field.minValue)) {newElement.attr('min', field.minValue);}
                                            if (angular.isDefined(field.maxValue)) {newElement.attr('max', field.maxValue);}
                                            if (angular.isDefined(field.step)) {newElement.attr('step', field.step);}
                                        }
                                        else if (['text', 'textarea'].indexOf(field.type) > -1) {
                                            if (angular.isDefined(field.splitBy)) {newElement.attr('ng-list', field.splitBy);}
                                        }
                                        else if (field.type === 'checkbox') {
                                            if (angular.isDefined(field.isOn)) {newElement.attr('ng-true-value', field.isOn);}
                                            if (angular.isDefined(field.isOff)) {newElement.attr('ng-false-value', field.isOff);}
                                            if (angular.isDefined(field.slaveTo)) {newElement.attr('ng-checked', field.slaveTo);}
                                        }
                                        else if (field.type === 'checklist') {
                                            if (angular.isDefined(field.val)) {
                                                setProperty(model, field.model, angular.copy(field.val));
                                            }
                                            if (angular.isDefined(field.options)) {
                                                if (! (angular.isDefined(model[field.model]) && angular.isObject(model[field.model]))) {
                                                    setProperty(model, field.model, {});
                                                }
                                                angular.forEach(field.options, function (option, childId) {
                                                    newChild = angular.element('<input type="checkbox" />');
                                                    newChild.attr('name', bracket(field.model + '.' + childId));
                                                    newChild.attr('ng-model', bracket(field.model + "." + childId, attrs.ngModel));
                                                    if (angular.isDefined(option['class'])) {newChild.attr('ng-class', option['class']);}
                                                    if (angular.isDefined(field.disabled)) {newChild.attr('ng-disabled', field.disabled);}
                                                    if (angular.isDefined(field.readonly)) {newChild.attr('ng-readonly', field.readonly);}
                                                    if (angular.isDefined(field.required)) {newChild.attr('ng-required', field.required);}
                                                    if (angular.isDefined(field.callback)) {newChild.attr('ng-change', field.callback);}
                                                    if (angular.isDefined(option.isOn)) {newChild.attr('ng-true-value', option.isOn);}
                                                    if (angular.isDefined(option.isOff)) {newChild.attr('ng-false-value', option.isOff);}
                                                    if (angular.isDefined(option.slaveTo)) {newChild.attr('ng-checked', option.slaveTo);}
                                                    if (angular.isDefined(option.val)) {
                                                        setProperty(model, field.model, angular.copy(option.val), childId);
                                                        newChild.attr('value', option.val);
                                                    }

                                                    if (angular.isDefined(option.label)) {
                                                        newChild = newChild.wrap('<label></label>').parent();
                                                        newChild.append(document.createTextNode(' ' + option.label));
                                                    }
                                                    newElement.append(newChild);
                                                });
                                            }
                                        }
                                        else if (field.type === 'radio') {
                                            if (angular.isDefined(field.val)) {
                                                setProperty(model, field.model, angular.copy(field.val));
                                            }
                                            if (angular.isDefined(field.values)) {
                                                angular.forEach(field.values, function (label, val) {
                                                    newChild = angular.element('<input type="radio" />');
                                                    newChild.attr('name', bracket(field.model));
                                                    newChild.attr('ng-model', bracket(field.model, attrs.ngModel));
                                                    if (angular.isDefined(field['class'])) {newChild.attr('ng-class', field['class']);}
                                                    if (angular.isDefined(field.disabled)) {newChild.attr('ng-disabled', field.disabled);}
                                                    if (angular.isDefined(field.callback)) {newChild.attr('ng-change', field.callback);}
                                                    if (angular.isDefined(field.readonly)) {newChild.attr('ng-readonly', field.readonly);}
                                                    if (angular.isDefined(field.required)) {newChild.attr('ng-required', field.required);}
                                                    newChild.attr('value', val);
                                                    if (angular.isDefined(field.val) && field.val === val) {newChild.attr('checked', 'checked');}

                                                    if (label) {
                                                        newChild = newChild.wrap('<label></label>').parent();
                                                        newChild.append(document.createTextNode(' ' + label));
                                                    }
                                                    newElement.append(newChild);
                                                });
                                            }
                                        }
                                        else if (field.type === 'select') {
                                            if (angular.isDefined(field.multiple) && field.multiple !== false) {newElement.attr('multiple', 'multiple');}
                                            if (angular.isDefined(field.empty) && field.empty !== false) {newElement.append(angular.element($document[0].createElement('option')).attr('value', '').html(field.empty));}

                                            if (angular.isDefined(field.autoOptions)) {
                                                newElement.attr('ng-options', field.autoOptions);
                                            }
                                            else if (angular.isDefined(field.options)) {
                                                angular.forEach(field.options, function (option, childId) {
                                                    newChild = angular.element($document[0].createElement('option'));
                                                    newChild.attr('value', childId);
                                                    if (angular.isDefined(option.disabled)) {newChild.attr('ng-disabled', option.disabled);}
                                                    if (angular.isDefined(option.slaveTo)) {newChild.attr('ng-selected', option.slaveTo);}
                                                    if (angular.isDefined(option.label)) {newChild.html(option.label);}
                                                    if (angular.isDefined(option.group)) {
                                                        if (!angular.isDefined(optGroups[option.group])) {
                                                            optGroups[option.group] = angular.element($document[0].createElement('optgroup'));
                                                            optGroups[option.group].attr('label', option.group);
                                                        }
                                                        optGroups[option.group].append(newChild);
                                                    }
                                                    else {
                                                        newElement.append(newChild);
                                                    }
                                                });

                                                if (!angular.equals(optGroups, {})) {
                                                    angular.forEach(optGroups, function (optGroup) {
                                                        newElement.append(optGroup);
                                                    });
                                                    optGroups = {};
                                                }
                                            }
                                        }
                                        else if (field.type === 'image') {
                                            if (angular.isDefined(field.label)) {newElement.attr('alt', field.label);}
                                            if (angular.isDefined(field.source)) {newElement.attr('src', field.source);}
                                        }
                                        else if (field.type === 'hidden') {
                                            newElement.attr('name', bracket(field.model));
                                            newElement.attr('ng-model', bracket(field.model, attrs.ngModel));
                                            if (angular.isDefined(field.val)) {
                                                setProperty(model, field.model, angular.copy(field.val));
                                                newElement.attr('value', field.val);
                                            }
                                        }
                                        else if (field.type === 'file') {
                                            if (angular.isDefined(field.multiple)) {
                                                newElement.attr('multiple', field.multiple);
                                            }
                                        }
                                        else if (field.type === 'fieldset') {
                                            if (angular.isDefined(field.fields)) {
                                                var workingElement = newElement;
                                                angular.forEach(field.fields, buildFields, newElement);
                                                newElement = workingElement;
                                            }
                                        }

                                        //  Common attributes; radio already applied these...
                                        if (field.type !== "radio") {
                                            if (angular.isDefined(field['class'])) {newElement.attr('ng-class', field['class']);}
                                            //  ...and checklist has already applied these.
                                            if (field.type !== "checklist") {
                                                if (angular.isDefined(field.disabled)) {newElement.attr('ng-disabled', field.disabled);}
                                                if (angular.isDefined(field.callback)) {
                                                    //  Some input types need listeners on click...
                                                    if (["button", "fieldset", "image", "legend", "reset", "submit"].indexOf(field.type) > -1) {
                                                        cbAtt = 'ng-click';
                                                    }
                                                    //  ...the rest on change.
                                                    else {
                                                        cbAtt = 'ng-change';
                                                    }
                                                    newElement.attr(cbAtt, field.callback);
                                                }
                                            }
                                        }

                                        //  If there's a label, add it.
                                        if (angular.isDefined(field.label)) {
                                            //  Some elements have already applied their labels.
                                            if (["image", "hidden"].indexOf(field.type) > -1) {
                                                angular.noop();
                                            }
                                            //  Fieldset elements put their labels in legend child elements.
                                            else if (["fieldset"].indexOf(field.type) > -1) {
                                                newElement.prepend(angular.element($document[0].createElement('legend')).html(field.label));
                                            }
                                            //  Button elements get their labels from their contents.
                                            else if (["button", "legend", "reset", "submit"].indexOf(field.type) > -1) {
                                                newElement.html(field.label);
                                            }
                                            //  Everything else should be wrapped in a label tag.
                                            else {
                                                newElement = newElement.wrap('<label></label>').parent();
                                                newElement.prepend(document.createTextNode(field.label + ' '));
                                            }
                                        }

                                        // Arbitrary attributes
                                        if (angular.isDefined(field.attributes)) {
                                            angular.forEach(field.attributes, function (val, attr) {
                                                newElement.attr(attr, val);
                                            });
                                        }

                                        // Add the element to the page
                                        console.log("> 4  newElement =",newElement);
                                        this.append(newElement);
                                        newElement = null;
                                    }
                                };

                            angular.forEach(template, buildFields, element);

                            //  Determine what tag name to use (ng-form if nested; form if outermost)
                            while (!angular.equals(iterElem.parent(), $document) && !angular.equals(iterElem[0], $document[0].documentElement)) {
                                if (['form','ngForm','dynamicForm'].indexOf(attrs.$normalize(angular.lowercase(iterElem.parent()[0].nodeName))) > -1) {
                                    foundOne = true;
                                    break;
                                }
                                iterElem = iterElem.parent();
                            }
                            if (foundOne) {
                                newElement = angular.element($document[0].createElement('ng-form'));
                            }
                            else {
                                newElement = angular.element("<form></form>");
                            }

                            //  Psuedo-transclusion
                            angular.forEach(attrs.$attr, function(attName, attIndex) {
                                console.log("adding into form = ",attName,attrs[attIndex]);
                                newElement.attr(attName, attrs[attIndex]);
                            });
                            newElement.attr('model', attrs.ngModel);
                            newElement.removeAttr('ng-model');
                            angular.forEach(element[0].classList, function(clsName) {
                                console.log("adding into form = ",clsName);
                                newElement[0].classList.add(clsName);
                            });
                            newElement.addClass('dynamic-form');
                            newElement.append(element.contents());

                            //  onReset logic
                            newElement.data('$_cleanModel', angular.copy(model));
                            newElement.bind('reset', function () {
                                $timeout(function () {
                                    $scope.$broadcast('reset', arguments);
                                }, 0);
                            });
                            $scope.$on('reset', function () {
                                $scope.$apply(function () {
                                    $scope[attrs.ngModel] = {};
                                });
                                $scope.$apply(function () {
                                    $scope[attrs.ngModel] = angular.copy(newElement.data('$_cleanModel'));
                                });
                            });

                            //  Compile and update DOM
                            $compile(newElement)($scope);
                            element.replaceWith(newElement);
                        });
                }
            }
        };
    }])
    //  Not a fan of how Angular's ngList is implemented, so here's a better one (IMO).  It will ONLY
    //  apply to <dynamic-form> child elements, and replaces the ngList that ships with Angular.
    .directive('ngList', [function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attr, ctrl) {
                var match = /\/(.*)\//.exec(element.attr(attr.$attr.ngList)),
                    separator = match && new RegExp(match[1]) || element.attr(attr.$attr.ngList) || ',';

                if (element[0].form !== null && !angular.element(element[0].form).hasClass('dynamic-form')) {
                    return;
                }

                ctrl.$parsers.splice(0, 1);
                ctrl.$formatters.splice(0, 1);

                ctrl.$parsers.push(function(viewValue) {
                    var list = [];

                    if (angular.isString(viewValue)) {
                        //  Don't have Angular's trim() exposed, so let's simulate it:
                        if (String.prototype.trim) {
                            angular.forEach(viewValue.split(separator), function(value) {
                                if (value) list.push(value.trim());
                            });
                        }
                        else {
                            angular.forEach(viewValue.split(separator), function(value) {
                                if (value) list.push(value.replace(/^\s*/, '').replace(/\s*$/, ''));
                            });
                        }
                    }

                    return list;
                });

                ctrl.$formatters.push(function(val) {
                    var joinBy = angular.isString(separator) && separator || ', ';

                    if (angular.isArray(val)) {
                        return val.join(joinBy);
                    }

                    return undefined;
                });
            }
        };
    }])
    //  Following code was adapted from http://odetocode.com/blogs/scott/archive/2013/07/05/a-file-input-directive-for-angularjs.aspx
    .directive('input', ['$parse', function ($parse) {
        return {
            restrict: 'E',
            require: '?ngModel',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    // Doesn't have an ng-model attribute; nothing to do here.
                    return;
                }

                if (attrs.type === 'file') {
                    var modelGet = $parse(attrs.ngModel),
                        modelSet = modelGet.assign,
                        onChange = $parse(attrs.onChange),
                        updateModel = function () {
                            scope.$apply(function () {
                                modelSet(scope, element[0].files);
                                onChange(scope);
                            });
                        };

                    ctrl.$render = function () {
                        element[0].files = this.$viewValue;
                    };
                    element.bind('change', updateModel);
                }
                else if (attrs.type === 'range') {
                    ctrl.$parsers.push(function (val) {
                        if (val) {
                            return parseFloat(val);
                        }
                    });
                }
            }
        };
    }])
    //  Following code was adapted from http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
    .factory('fileReader', ['$q', function ($q) {
        var onLoad = function(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            },
            onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.error);
                    });
                };
            },
            onProgress = function(reader, scope) {
                return function (event) {
                    scope.$broadcast('fileProgress',
                        {
                            total: event.total,
                            loaded: event.loaded,
                            status: reader.readyState
                        });
                };
            },
            getReader = function(deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };

        return {
            readAsArrayBuffer: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsArrayBuffer(file);
                return deferred.promise;
            },
            readAsBinaryString: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsBinaryString(file);
                return deferred.promise;
            },
            readAsDataURL: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            },
            readAsText: function (file, scope) {
                var deferred = $q.defer(),
                    reader = getReader(deferred, scope);
                reader.readAsText(file);
                return deferred.promise;
            }
        };
    }]);

/*  End of dynamic-forms.js */

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Companies')
    .controller('ConfirmToDeleteCompanyCtrl',['$uibModalInstance','row', function ($uibModalInstance,row) {

        this.formDefines = {
            div1: {type:"div", fieldClass: "modal-header", fields: {h3:{type:"h3", fieldClass: "modal-title", label: "Delete Company", controllerAs:"ConfirmToDeleteCompanyCtrl"}}},
            div2: {type:"div", fieldClass: "modal-body", fields: {h3:{type:"h3", fieldClass: "modal-title", label: "Do you want to delete company ?"}}},
            div3: {type:"div", fieldClass: "modal-footer", fields: {
                    btn1: {type:"button", fieldClass: "btn btn-primary", ngClick: "ok()",label: "Save"},
                    btn2: {type:"button", fieldClass: "btn btn-warning", ngClick: "cancel()",label: "Cancel"}
                }
            }
        };


        this.ok = function () {
            $uibModalInstance.close(row);
        };

        this.cancel = function () {
            $uibModalInstance.dismiss(row);
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */


angular.module('ocsApp.Companies')
    .controller('CompaniesMainCtrl',['$uibModal','Companies','$log','DetailModal','DeleteModal','$state','CompanyModuleFactory','$scope', function ($uibModal,Companies,$log,DetailModal,DeleteModal,$state,CompanyModuleFactory,$scope) {

        TableBaseCtrl.call(this,$scope,$log,CompanyModuleFactory,DeleteModal,"CompaniesMainCtrl");

        var that = this;

        this.isSubmitted = false;
        this.form = {};
        this.company = {};

        this.setDeleteTemplateUrl('<my-dynamic-form formdefine = "{{ConfirmToDeleteCompanyCtrl.formDefines}}" ></my-dynamic-form>');
        this.setDeleteController('ConfirmToDeleteCompanyCtrl');
        this.setDeleteWindowSize('md');

        this.setCloseDeleteModal(function(row){
            CompanyModuleFactory.deleteCompany(row);
        });


        this.detail = function(rowData){
            console.log("rowData",rowData);
            if(rowData){
                $state.go('navigator.companies.detail',{row:rowData.id});
            }else{
                $state.go('navigator.companies.detail',{row:null});
            }

        };

    }]);




/**
 * Created by phuongnguyen on 24/02/16.
 *//**
 * Created by phuongnguyen on 27/11/15.
 */

angular.module('ocsApp.Companies')
    .controller('NewCompanyCtrl',['$state','$stateParams','Companies','$log','toastr','BookingStatusFactory','DetailModal2','DeleteModal','CompanyModuleFactory',function ($state,$stateParams,Companies,$log,toastr,BookingStatusFactory,DetailModal2,DeleteModal,CompanyModuleFactory) {

        var id = parseInt($stateParams.row);
        var row = CompanyModuleFactory.getMasterRow(id);
        var that = this;

        DetailWithTableBaseCtrl.call(this,CompanyModuleFactory,row,$log,toastr,DetailModal2,DeleteModal,'NewCompanyCtrl');

        this.row.defaultStatusObject = {};
        this.bookingStatus = [];

        this.setDetailTemplateUrl('<my-dynamic-form formdefine = "{{NewSubCompanyCtrl.formDefines}}" ></my-dynamic-form>');
        this.setDetailController('NewSubCompanyCtrl');
        this.setDetailWindowSize('lg');

        this.cancel = function () {
            //$uibModalInstance.dismiss('cancel');
            $state.go("navigator.companies.list");
        };

        if(row){
            this.windowTitle = "Update Company";
        }else{
            this.windowTitle = "New Company";
        }


        $log.debug("modalTitle = ",this.windowTitle);

        BookingStatusFactory.getStatus(function(data){
            that.bookingStatus = data;
            that.row.defaultStatusObject =  that.bookingStatus[_.findIndex(that.bookingStatus, 'bookingStatus', that.row.defaultStatus)];
            console.log(" get status = ",data,that.row.defaultStatusObject);
        });

    }]);

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
/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp')
    .controller('IndexMainCtrl',['$log','mySharedService','$scope','SetClassService','$location', function ($log,sharedService,$scope,SetClassService,$location) {
        $log = $log.getInstance("ocsApp.IndexMainCtrl");
        $log.debug("Hello, I am index controller and url = " + $location.path());
        this.className = 0;
        var that = this;

        this.className = SetClassService.getClass();

        //if the link is the booking form => set class of main page 
        if($location.path().indexOf('bookingForm') > 0){
          this.className = 2;
        }
        //listen to the mainCtrl and navigator.MainCtrl , if login/logout successfully, the mainCtrl will send a msg to the indexCtrl.
        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from LoginCrtl/navigator.MainCtrl = " + msg);
            if(msg.indexOf("Login successfully")>= 0 || msg.indexOf("Logout successfully")>= 0){
                //change body class if login successfully
                that.changeIt();
            }
        });

        this.changeIt = function(){
            if(this.className == 1){
                this.className = 0;
            }
            else {
                this.className = 1;
            }
            $log.debug("changeIt className to  " + this.className );
        };
        //{0:'login', 1:'page-container-bg-solid page-boxed',2:'three'}[indexCtrl.className]
    }]);

/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeBooking').controller('CustomPackageCtrl',['$uibModalInstance','CompanyFactory','$log',function ( $uibModalInstance, CompanyFactory,$log) {
    $log = $log.getInstance("ocsApp.MakeBooking.CustomPackageCtrl");
    $log.debug("I am CustomPackageCtrl");
    var that = this
    this.companyObject = null;
    this.assessments = [];

    CompanyFactory.getCompany(function(data){
        that.companyObject = data;
    });

    this.selectedAss = function(){
        $log.debug("assessments = ",that.assessments);
    };

    this.ok = function () {
        $uibModalInstance.close(that.assessments);
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.MakeBooking')
    .controller('MakeBookingMainCtrl',['CompanyFactory','$scope','$cookieStore','$uibModal','$log','toastr','mysqlDate','MakeBookingFactory','mySharedService', function (CompanyFactory,$scope,$cookieStore,$uibModal,$log,toastr,mysqlDate,MakeBookingFactory,sharedService) {
        $log = $log.getInstance("ocsApp.MakeBooking.MakeBookingMainCtrl");
        $log.debug("I am make booking controller.");
        var user = CompanyFactory.getCurrentUser();
        this.user = CompanyFactory.getCurrentUser();
        this.companyObject = null;
        this.newBooking = {};
        this.newBooking.poNumber = "";
        this.newBooking.newCandidates = [];
        this.subsidiary = {};
        this.subsidiary2 = {};
        this.viewPackage = "";
        this.form = {};
        this.isSubmitted = false;
        this.isSubmitingToTheServer = false;
        this.isSubsidiary2 = false;
        this.isNoCandidate = false;//to display err if no candidate when submit the form
        this.paperworkList = ["Redimed","Gorgon","BP","Company Specific","CPPC","Rail","Wheatstone","MACA Mining","Aerison paperwork","Newmont","Shell"];
        this.newBooking.paperwork = "Redimed";
        var that = this;

        var initData = function(){
          CompanyFactory.getCompany(function(data){
              that.companyObject = data;
              updateUI(that.companyObject,that.companyObject);
              $log.debug("Make booking, get company info");
          });
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh make booking") >= 0 ){
              initData();
            }
        });

        this.getAllSubsidiaries = function (callback) {
            $log.debug("getAllSubsidiaries.Loading subsidiaries......",that.companyObject.subsidiaries);
            callback(that.companyObject.subsidiaries);
        };

        this.isAdminLogin = function(){
            return user.userType.indexOf("RediMed")>=0 ? true:false;
        };

        this.newCompany = function(){
            // add new sub company for Redimed when admin make a booking on behalf
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/MakeBooking/views/makeBooking.NewCompany.html',
                controller: 'NewCompanyCtrl',
                controllerAs: 'NewCompanyCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (newCompany) {
                //$scope.selected = selectedItem;
                $log.debug("newCompany = ",newCompany);
                MakeBookingFactory.newSubsidiaryForRedimed(newCompany).then(function(succ){
                    $log.debug("created new company sucessfully = ",succ);
                    that.newBooking.subsidiary = succ;
                    that.subsidiary = succ;
                    that.companyObject.subsidiaries.push(succ);
                });
            }, function () {
                $log.debug('Modal New company dismissed at: ' + new Date());
            });
        };

        this.submitForm = function(){

            that.isSubmitted = true;

            if(!that.newBooking.subsidiary && that.isAdminLogin()){
                that.form.company.$invalid = true;
            }

            if(that.newBooking.newCandidates.length > 0){
                that.isNoCandidate = false;
            }else{
                that.isNoCandidate = true;
                toastr.error('Please enter candidate information', 'Error');
                $log.error('Please enter candidate information');
                that.newCandidate();
            }

            if(that.form.$invalid || that.form.company.$invalid ){
                toastr.error('Please enter all required fields of booking information', 'Error');
                $log.error('Please enter all required fields of booking information',that.form.$error);
            }else{
                that.isSubmitingToTheServer = true;
                MakeBookingFactory.submitBooking(that.newBooking,that.companyObject,user).then(
                    function(succ){
                        that.isSubmitingToTheServer = false;
                        $log.debug("Submit booking successfully",succ);
                        toastr.success('Successfully submitted');
                        toastr.success('The booking list will be updated shortly. Please wait !');
                        //clear all data
                        that.newBooking = {};
                        that.newBooking.newCandidates = [];
                        that.isSubmitted = false;

                    },
                    function(err){
                        that.isSubmitingToTheServer = false;
                        $log.error("Fail to submit booking",err);

                    });
            }
        }

        this.selectedSubsidiary = function(value){
            $log.debug("selectedSubsidiary = ",value);
            that.newBooking.subsidiary = value;
            that.subsidiary2 = {};
            if(that.newBooking.subsidiary.subsidiaries){
                this.isSubsidiary2 = that.newBooking.subsidiary.subsidiaries.length > 0 ? true:false;
            }else{
                this.isSubsidiary2 = false;
            }
            updateUI(that.companyObject,that.newBooking.subsidiary);
        };

        this.isShowSubsidiary2 = function(){
            return this.isSubsidiary2;
        }

        this.selectedPackage = function(){
            $log.debug("Package =",that.newBooking.package);

            if(that.newBooking.package.packageName.indexOf("Custom") >= 0 ){
                that.viewPackage = "";
                //open modal to select assessments
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modules/MakeBooking/views/makeBooking.CustomPackage.html',
                    controller: 'CustomPackageCtrl',
                    controllerAs: 'CustomPackageCtrl',
                    size: 'lg'
                });

                modalInstance.result.then(function (selectedItem) {
                    //$scope.selected = selectedItem;
                    that.newBooking.customPackage = selectedItem;
                    that.newCandidate();

                }, function () {
                    $log.debug('Modal Package dismissed at: ' + new Date());
                });
            }else{
                that.viewPackage = "";
                for(var i in that.newBooking.package.AssessmentHeaders){
                    that.viewPackage = that.viewPackage +"<br><b>"+  that.newBooking.package.AssessmentHeaders[i].headerName + "</b>";
                    for(var j in that.newBooking.package.AssessmentHeaders[i].Assessments){
                        that.viewPackage = that.viewPackage +"<br> - "+  that.newBooking.package.AssessmentHeaders[i].Assessments[j].assName + "";
                    }
                }
                $log.debug("View package:",that.viewPackage);
                that.newCandidate();
            }

        };

        this.isPO = function(){
            return that.companyObject.ispo == 1 ? true:false;
        };

        this.isProjectIdentification = function(){
            return that.companyObject.isproject == 1 ? true:false;
        };

        this.deleteCandidate = function(index,candidate){
            $log.debug("Remove candidate at " + index,candidate);
            that.newBooking.newCandidates.splice(index, 1);
        }

        this.newCandidate = function(index,candidate){
            //if edit the new candidate, we must have the index of the candidate in the array, so we can replace the old value with the new one
            $log.debug("New/replace candidate ",candidate," index = ",index);
            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/MakeBooking/views/makeBooking.NewCandidate.html',
                controller: 'NewCandidateCtrl',
                controllerAs: 'NewCandidateCtrl',
                size: 'lg',
                resolve: {
                    candidate: function () {
                        return candidate;
                    },
                    indexOfCandidate: function(){
                        return index;
                    }
                }
            });

            modalInstance.result.then(function (obj) {
                //$scope.selected = selectedItem;
                //if edit the new candidate, we must have the index of the candidate in the array, so we can replace the old value with the new one
                var index = obj.index;
                var candidate = obj.candidate;
                if(index >= 0){
                    $log.debug("repleace the candidate in the array with index = "+index,candidate);
                    that.newBooking.newCandidates[index] = candidate;
                }else{
                    $log.debug("add candidate into array",candidate);
                    that.newBooking.newCandidates.push(candidate);
                }
            }, function () {
                $log.debug('Modal Candidate dismissed at: ' + new Date());
            });
        };

        function updateUI(conditionOnCompany,companyOrSubsidiary){

            $log.debug("Update PO,Emails,...");

            if(companyOrSubsidiary.poNumber){
                that.newBooking.poNumber = companyOrSubsidiary.poNumber;
            }

            if(companyOrSubsidiary.invoiceEmail){
                if(conditionOnCompany.isinvoiceemailtouser == 1){
                    that.newBooking.invoiceEmail = companyOrSubsidiary.invoiceEmail;+"; "+that.user.contactEmail;
                }else{
                    that.newBooking.invoiceEmail = companyOrSubsidiary.invoiceEmail;
                }
            }else{
                if(conditionOnCompany.isinvoiceemailtouser == 1){
                    that.newBooking.invoiceEmail = that.user.contactEmail;
                }
            }

            if(companyOrSubsidiary.resultEmail){
                if(conditionOnCompany.isaddcontactemailtoresult == 1){
                    that.newBooking.resultEmail = companyOrSubsidiary.resultEmail+"; "+that.user.contactEmail;
                }else{
                    that.newBooking.resultEmail = companyOrSubsidiary.resultEmail;
                }
            }else{
                if(conditionOnCompany.isaddcontactemailtoresult == 1){
                    that.newBooking.resultEmail = that.user.contactEmail;
                }
            }
        };
    }]);

/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeBooking').controller('NewCandidateCtrl',[
            '$uibModalInstance',
            'CompanyFactory',
            'RedimedSiteFactory',
            'mysqlDate',
            '$log','candidate',
            'indexOfCandidate',
            '$scope',
            'mySocket',
            function ( $uibModalInstance, CompanyFactory,RedimedSiteFactory,mysqlDate,$log,candidate,indexOfCandidate,$scope,mySocket) {
    $log = $log.getInstance("ocsApp.MakeBooking.NewCandidateCtrl");
    $log.debug("I am NewCandidateCtrl");
    var that = this
    this.status = {};
    this.BookingCandidate = {};
    this.dateStatus = {};
    this.dateStatus.dobOpened = false;
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.format = "dd/MM/yyyy";
    this.BookingCandidate.dob = new Date(1990,0,1);

    var today = new Date();
    var tomorrow = new Date();
    var currentHolingId = 0;
    tomorrow.setDate(today.getDate()+7);

    this.BookingCandidate.preferredFromDate = today;
    this.BookingCandidate.preferredToDate = tomorrow;
    this.BookingCandidate.holdingId = 0;
    this.companyObject = null;
    this.sites = null;
    this.states = null;
    this.suburbs = null;
    this.calendars = [{id:1},{id:2}];
    this.isSubmitted = false;
    this.newCandidateForm = {};

    if(candidate){
        this.BookingCandidate = candidate;
        getCalendar();
    }

    CompanyFactory.getCompany(function(data){
        that.companyObject = data;
    });

    RedimedSiteFactory.getSite(function(data){
        that.sites = data;
        $log.debug("sites",that.sites);
    });
    //server will send message to client to notify that the appt has occupied by another user, so the client can re-load the calendars
    mySocket.on('UpdateCalendar',function(data){
        $log.debug('refresh calendars by server',data);
        if(that.BookingCandidate.site.id){
          //if(!that.BookingCandidate.calendar){
              getCalendar();
          //}
        }
    });

    function getCalendar(){
        //Plus toDate one date before query calendar because of time
        var newDate = new Date(that.BookingCandidate.preferredToDate);
        console.log('newDate = ',newDate);
        if(isNaN(newDate)){
          newDate = new Date(that.BookingCandidate.preferredFromDate);
        }
        newDate.setDate(newDate.getDate() + 2);
        console.log('newDate = ',newDate);
        $log.debug('will getCalendar with current calendar =',that.BookingCandidate.calendar);
        if(that.BookingCandidate.site.id){
          RedimedSiteFactory.getCalendar(that.BookingCandidate.site.id,that.BookingCandidate.preferredFromDate,newDate,function(data){
              that.calendars = data;
              $log.debug('received data from server getCalendar with current calendar =',that.BookingCandidate.calendar);
              if(that.BookingCandidate.calendar){
                that.calendars.unshift(that.BookingCandidate.calendar);
              }
          });
        }
    };

     $scope.$watch(
        "NewCandidateCtrl.BookingCandidate.calendar",
        function( newValue, oldValue ) {
            // Ignore initial setup.
            if ( newValue === oldValue ) {
                return;
            }

            if(oldValue){
                RedimedSiteFactory.removeHolding(currentHolingId,oldValue.calId,function(holdingData){
                    console.log(' holdingData = ',holdingData);
                });
            }

            if(newValue){
                RedimedSiteFactory.setHolding(newValue.calId,function(holdingData){
                    console.log(' holdingData = ',holdingData);
                    currentHolingId = holdingData.holdingId;
                    that.BookingCandidate.holdingId = holdingData.holdingId;
                    //notify the server the appt that the client has occupied, so the server can let other users know
                    mySocket.emit('OccupyAppt',newValue);
                });
            }

            console.log( "$watch: that.BookingCandidate.calendar changed.",newValue, oldValue);
        }
    );


    this.calendarChanged = function(){
    }

    this.fromOrToDateChanged = function(){
        getCalendar();
    };

    this.selectedSite = function(){
        that.states = that.BookingCandidate.site.States;
        that.BookingCandidate.suburb = null;
        that.BookingCandidate.state = null;
        that.suburbs = null;
        that.BookingCandidate.calendar = null;
        getCalendar();
    };

    this.selectedState = function(){
        if(that.BookingCandidate.state){
            that.suburbs = that.BookingCandidate.state.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    this.openDOB = function($event) {
        that.dateStatus.dobOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    this.openToDate = function($event) {
        that.dateStatus.toDateOpened = true;
    };

    this.ok = function () {
        that.isSubmitted = true;
        if(that.newCandidateForm.$valid){
            $log.debug("Exit candidate valid",that.BookingCandidate);
            var returnO = {};
            returnO.index =  indexOfCandidate;
            returnO.candidate = that.BookingCandidate;
            $uibModalInstance.close(returnO);
        }else{
            $log.error("Exit candidate error",that.newCandidateForm.$error);
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeBooking').controller('NewCompanyCtrl',['$uibModalInstance','$log',function ( $uibModalInstance,$log) {
    $log = $log.getInstance("ocsApp.MakeBooking.NewCompanyCtrl");
    $log.debug("NewCompanyCtrl is running...");
    var that = this;
    this.company = {};
    this.companyObject = null;
    this.isSubmitted = false;
    this.form = {};

    this.ok = function () {
        that.isSubmitted = true;
        $log.debug("OK to exit modal valid=",that.form.$valid);
        $log.debug("OK to exit modal invalid=",that.form.$invalid);
        $log.debug("OK to exit modal error=",that.form.$error);
        if(that.form.$valid){
            $uibModalInstance.close(that.company);
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * Created by phuongnguyen on 8/01/16.
 */
angular.module('ocsApp.MakeBooking')
.factory('MakeBookingFactory', ['BookingHeaders','toastr','BookingCandidates','$q','CompanyFactory','mysqlDate','Companies','$log','mySharedService', function (BookingHeaders,toastr,BookingCandidates,$q,CompanyFactory,mysqlDate,Companies,$log,sharedService) {
    $log = $log.getInstance("ocsApp.MakeBooking.MakeBookingFactory");
    return {
        submitBooking:function(newBookingObj,companyObject,user){
             $log.debug("will submit the booking");   
            ///submit the online booking is here !
            var deferred = $q.defer();
            var bookingHeader = {};
            bookingHeader.bookingId = 0;
            bookingHeader.poNumber = newBookingObj.poNumber;
            bookingHeader.resultEmail = newBookingObj.resultEmail;
            bookingHeader.invoiceEmail = newBookingObj.invoiceEmail;
            bookingHeader.projectIdentofication = newBookingObj.projectIdentification;
            bookingHeader.comments = newBookingObj.comments;
            bookingHeader.packageId = newBookingObj.package.id;
            bookingHeader.siteId = null;
            bookingHeader.companyId = companyObject.id;
            bookingHeader.period = null;
            bookingHeader.isbookingatredimed = companyObject.id;
            bookingHeader.paperwork = newBookingObj.paperwork;

            if(newBookingObj.bookingPerson){
                bookingHeader.bookingPerson = newBookingObj.bookingPerson;
                bookingHeader.contactNumber = newBookingObj.contactNumber;
            }else{
                bookingHeader.bookingPerson = user.bookingPerson;
                bookingHeader.contactNumber = user.contactNumber;
            }

            if(newBookingObj.customPackage){
                bookingHeader.customPackage = newBookingObj.customPackage;
            }

            if(newBookingObj.subsidiary){
                if(newBookingObj.subsidiary.fatherId==null){
                    //if admin books for the stand alone company on behalf
                    bookingHeader.companyId = newBookingObj.subsidiary.id;
                }else{
                    bookingHeader.subCompanyId = newBookingObj.subsidiary.id;
                }

            }

            if(newBookingObj.subsidiary2){
                //if admin books for the stand alone company on behalf
                bookingHeader.subCompanyId = newBookingObj.subsidiary2.id;
            }

            bookingHeader.contactEmail = user.contactEmail;
            bookingHeader.createdBy = null;
            bookingHeader.creationDate = null;
            bookingHeader.lastUpdatedBy = null;
            bookingHeader.lastUpdateDate = null;

            

            var candidates = [];
            for(var i in newBookingObj.newCandidates){
                candidates[i] = {};
                candidates[i].bookingId = 0;
                candidates[i].candidateId = 0;
                candidates[i].candidatesName  = newBookingObj.newCandidates[i].candidateName;
                candidates[i].dob = moment(newBookingObj.newCandidates[i].dob).format("YYYY-MM-DD");
                candidates[i].phone = newBookingObj.newCandidates[i].phone;
                candidates[i].email = newBookingObj.newCandidates[i].email;
                candidates[i].position = newBookingObj.newCandidates[i].position;
                //If have Appointment time + date => appt status = 'confirmed' otherwise: 'pending': so send diffirent email template and receiver
                candidates[i].appointmentStatus = "Pending";//companyObject.defaultStatus;
                candidates[i].fromDate = moment(newBookingObj.newCandidates[i].preferredFromDate).format("YYYY-MM-DD");
                candidates[i].toDate = moment(newBookingObj.newCandidates[i].preferredToDate).format("YYYY-MM-DD");
                ///candidate.fromDate = newBookingObj.newCandidates[i].preferredFromDate;
                ///candidate.toDate = newBookingObj.newCandidates[i].preferredToDate;

                candidates[i].siteId = newBookingObj.newCandidates[i].site.id;
                candidates[i].siteName = newBookingObj.newCandidates[i].site.siteName;

                if(newBookingObj.newCandidates[i].calendar){
                    candidates[i].calendarId = newBookingObj.newCandidates[i].calendar.calId;
                    candidates[i].appointmentTime = moment(mysqlDate(newBookingObj.newCandidates[i].calendar.fromTime)).format("YYYY-MM-DD HH:mm ");
                    candidates[i].appointmentStatus = "Confirmed";
                    candidates[i].holdingId = newBookingObj.newCandidates[i].holdingId;
                }

                if (newBookingObj.newCandidates[i].state){
                    candidates[i].stateId = newBookingObj.newCandidates[i].state.id;
                    candidates[i].stateName = newBookingObj.newCandidates[i].state.stateName;
                }
                if(newBookingObj.newCandidates[i].suburb) {
                    candidates[i].suburbId = newBookingObj.newCandidates[i].suburb.suburbId;
                    candidates[i].suburbName = newBookingObj.newCandidates[i].suburb.suburbName;
                }
            }

            bookingHeader.candidates = candidates;
            $log.debug("Will add this booking into the DB",bookingHeader);

            BookingHeaders.submitBooking(bookingHeader,function(data,d2){
                $log.debug("Submitted and data return",data);
                //after submit the booking, refresh the booking list
                CompanyFactory.refreshBookingList(function(data){
                    $log.debug("refresh bookinglist successfully");
                   
                    sharedService.prepForBroadcast("Refresh booking list successfully");
                });
                CompanyFactory.refreshAllPackageList(function(data){

                });


                for(var i in data.booking.bookingCandidates){
                    var candidate = data.booking.bookingCandidates[i];
                    if(candidate.candidateId){
                        $log.debug("> Will send email to ",candidate);
                        BookingCandidates.sendConfirmationEmail({id:candidate.candidateId,type:"new"},function(rs){
                            $log.debug(">>sendConfirmationEmail",rs);
                            if(rs.sentEmailStatus.indexOf('Error')>=0){
                                toastr.error(rs.sentEmailStatus, 'Error');
                            }else{
                                toastr.success(rs.sentEmailStatus, '');
                                $log.save();
                            }

                        });
                    }
                }

                deferred.resolve("Created Booking");
            },
            function(err){
                $log.error("Fail to Submit the booking",err);
                toastr.error("Fail to submit the booking, please contact Redimed to assit", 'Error');
                deferred.reject("Created Booking");                
            });

            return deferred.promise;
        },
        newSubsidiaryForRedimed : function(newSubsidiaryRedimed){
            $log.debug(">>newSubsidiaryForRedimed");
            var deferred = $q.defer();
            newSubsidiaryRedimed.id = 0;
            newSubsidiaryRedimed.fatherId = 112;
            $log.debug("Will add new company = ",newSubsidiaryRedimed);
            Companies.create(newSubsidiaryRedimed,function(data){
                $log.debug("new company created",data);
                deferred.resolve(data);
            },
            function(err){
                $log.error(" fail to create the new company Error = ",err)
            });

            return deferred.promise;
        }
    }
}]);

/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.MakePEMPhoneBooking').controller('BookingFormCtrl',['$state','RedimedSiteFactory','MakePEMPhoneBookingFactory','toastr','$log','$stateParams','LoopBackAuth',function ($state,RedimedSiteFactory,MakePEMPhoneBookingFactory,toastr,$log,$stateParams,LoopBackAuth) {

    $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.BookingFormCtrl");
    $log.debug("Hello, I am BookingFormCtrl",$stateParams.token);

    var that = this;
    this.token = $stateParams.token;
    this.loading1 = false;
    this.loading2 = false;
    this.token = $stateParams.token;
    this.showClickedValidation = false;
    this.allAssessments = [];
    this.allSites = [];
    this.states = null;
    this.suburbs = null;
    this.assessments = [];
    this.isAuth = false;
    this.isShowNotice = false;
    this.isSubmitted = false;
    this.isGettingAssessments = true;
    this.isSubmitBookingSuccess = false;

    this.format = "dd/MM/yyyy";
    this.dateStatus = {};
    this.dateStatus.dobOpened = false;
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;

    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    today.setDate(today.getDate()+1);
    this.paperworkList = ["Redimed","Gorgon","BP","Company Specific","CPPC","Rail","Wheatstone","MACA Mining","Aerison paperwork","Newmont","Shell"];
    this.timeList = ["AM","PM"];

    this.BookingCandidate = {};
    this.BookingCandidate.preferredFromDate = today;
    this.BookingCandidate.preferredToDate = tomorrow;
    this.BookingCandidate.dob = new Date(1990,0,1);
    this.BookingCandidate.bookingDate = new Date();
    this.BookingCandidate.paperwork = "Redimed";
    this.BookingCandidate.preferredTime = "AM";

    $log.debug(" accessToken = ",this.token);

    LoopBackAuth.setUser(this.token, 1, 'phoneBooking');
    LoopBackAuth.save();

    this.openDOB = function($event) {
        that.dateStatus.dobOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    this.openToDate = function($event) {
        that.dateStatus.toDateOpened = true;
    };

    this.selectedSite = function(){
        that.states = that.BookingCandidate.site.States;
        that.BookingCandidate.preferredSuburb = null;
        that.BookingCandidate.preferredState = null;
        that.suburbs = null;
    };

    this.selectedState = function(){
        if(that.BookingCandidate.preferredState){
            that.suburbs = that.BookingCandidate.preferredState.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    MakePEMPhoneBookingFactory.getAssessments().then(function(succ){
        that.allAssessments = succ.assessments;
        $log.debug("assessments = ",that.allAssessments);
        that.isAuth = true;
        that.isGettingAssessments = false;

        MakePEMPhoneBookingFactory.getPhoneBookingHeader().then(function(bookingHeader){
          $log.debug("bookingHeader = ",bookingHeader);
          that.BookingCandidate.bookingId = bookingHeader.bookingId;
          that.BookingCandidate.companyId = bookingHeader.companyId;
          that.BookingCandidate.companyName = bookingHeader.companyName;
          that.BookingCandidate.subCompanyId = bookingHeader.subCompanyId;
          that.BookingCandidate.bookingPerson = bookingHeader.bookingPerson;
          that.BookingCandidate.bookingPersonNumber = bookingHeader.contactNumber;
          that.BookingCandidate.bookingPersonEmail = bookingHeader.contactEmail;
        });

        RedimedSiteFactory.getSite(function(sites){
          $log.debug("getSites = ",sites);
          that.allSites = sites;
        });
    },function(err){
        console.log('MakePEMPhoneBookingFactory.getAssessment = ',err);
        that.isAuth = false;
        that.isShowNotice = true;
        that.isGettingAssessments = false;
    });


    this.submit = function() {

        that.isSubmitted = true;
        console.log(' that.BookingCandidate = ',that.BookingCandidate,that.assessments);

        if(that.assessments.length == 0){
          toastr.error('Please select the assessments', 'Error');
        }
        else if(that.form.$valid){

            MakePEMPhoneBookingFactory.submitBooking(that.BookingCandidate,that.assessments).then(function(data){
              that.isSubmitBookingSuccess = true;
            });

        }else{
            $log.error("ForgotPasswordCtrl invalid",that.form.$error);
        }

    };

}]);


angular.module('ocsApp.MakePEMPhoneBooking')
    .controller('MakePEMPhoneBookingMainCtrl',['CompanyFactory','$cookieStore','$uibModal','$log','toastr','mysqlDate','MakePEMPhoneBookingFactory','mySharedService', function (CompanyFactory,$cookieStore,$uibModal,$log,toastr,mysqlDate,MakePEMPhoneBookingFactory,sharedService) {
        $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.MakePEMPhoneBookingMainCtrl");
        $log.debug("I am make MakePEMPhoneBookingMainCtrl controller.");
        this.user = CompanyFactory.getCurrentUser();
        this.companyObject = null;
        this.newBooking = {};
        this.subsidiary = {};
        this.subsidiary2 = {};

        this.form = {};
        this.isSubmitted = false;
        this.isSubmitingToTheServer = false;
        this.isSubsidiary2 = false;
        this.isNoCandidate = false;//to display err if no candidate when submit the form

        var that = this;
        var user = $cookieStore.get('user');

        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
            console.log("getCompany = ",data);
            $log.debug("Make booking, get company info");
        });

        this.getAllSubsidiaries = function (callback) {
            $log.debug("getAllSubsidiaries.Loading subsidiaries......",that.companyObject.subsidiaries);
            callback(that.companyObject.subsidiaries);
        };

        this.isAdminLogin = function(){
            return user.userType.indexOf("RediMed")>=0 ? true:false;
        };

        this.newCompany = function(){
            // add new sub company for Redimed when admin make a booking on behalf
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/MakePEMPhoneBooking/views/makePEMPhoneBooking.NewCompany.html',
                controller: 'NewPEMPhoneCompanyCtrl',
                controllerAs: 'NewPEMPhoneCompanyCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (newCompany) {
                //$scope.selected = selectedItem;
                $log.debug("newCompany = ",newCompany);
                MakePEMPhoneBookingFactory.newSubsidiaryForRedimed(newCompany).then(function(succ){
                    $log.debug("created new company sucessfully = ",succ);
                    that.newBooking.subsidiary = succ;
                    that.subsidiary = succ;
                    that.companyObject.subsidiaries.push(succ);
                });
            }, function () {
                $log.debug('Modal New company dismissed at: ' + new Date());
            });
        };

        this.emailBookingForm = function(){

            that.isSubmitted = true;

            if(!that.newBooking.subsidiary && that.isAdminLogin()){
                that.form.company.$invalid = true;
            }

            if(that.form.$invalid || that.form.company.$invalid ){
                toastr.error('Please enter all required fields of booking information', 'Error');
                $log.error('Please enter all required fields of booking information',that.form.$error);
            }else{
                that.isSubmitingToTheServer = true;
                $log.debug('will send email the booking form',that.newBooking);
                MakePEMPhoneBookingFactory.emailBookingForm(that.newBooking).then(
                    function(succ){
                        that.isSubmitingToTheServer = false;
                        $log.debug("Submit booking successfully",succ);
                        toastr.success('Successfully submitted');
                        toastr.success('The booking list will be updated shortly. Please wait !');
                        //clear all data
                        that.newBooking = {};
                        that.newBooking.newCandidates = [];
                        that.isSubmitted = false;

                    },
                    function(err){
                        $log.err("Fail to submit booking",err);
                    });
            }
        }

        this.selectedSubsidiary = function(value){
            $log.debug("selectedSubsidiary = ",value);
            that.newBooking.subsidiary = value;
            that.subsidiary2 = {};
            if(that.newBooking.subsidiary.subsidiaries){
                this.isSubsidiary2 = that.newBooking.subsidiary.subsidiaries.length > 0 ? true:false;
            }else{
                this.isSubsidiary2 = false;
            }
        };

        this.isShowSubsidiary2 = function(){
            return this.isSubsidiary2;
        }

    }]);

/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakePEMPhoneBooking').controller('NewPEMPhoneCompanyCtrl',['$uibModalInstance','$log',function ( $uibModalInstance,$log) {
    $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.NewPEMPhoneCompanyCtrl");
    $log.debug("NewCompanyCtrl is running...");
    var that = this;
    this.company = {};
    this.companyObject = null;
    this.isSubmitted = false;
    this.form = {};

    this.ok = function () {
        that.isSubmitted = true;
        $log.debug("OK to exit modal valid=",that.form.$valid);
        $log.debug("OK to exit modal invalid=",that.form.$invalid);
        $log.debug("OK to exit modal error=",that.form.$error);
        if(that.form.$valid){
            $uibModalInstance.close(that.company);
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * Created by phuongnguyen on 8/01/16.
 */
angular.module('ocsApp.MakePEMPhoneBooking')
.factory('MakePEMPhoneBookingFactory', ['BookingHeaders','BookingCandidates','Companies','toastr','$log','$q', function (BookingHeaders,BookingCandidates,Companies,toastr,$log,$q) {
    $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.MakePEMPhoneBookingFactory");
    return {
        emailBookingForm:function(bookingInfo){
            $log.debug("will send the booking form");
            var deferred = $q.defer();
            BookingHeaders.emailBookingForm(bookingInfo,function(data,d2){
                $log.debug("Submitted and data return",data);
                deferred.resolve("Created Booking");
            },
            function(err){
                $log.error("Fail to Submit the booking",err);
                toastr.error("Fail to submit the booking, please contact Redimed to assit", 'Error');
                deferred.reject("Created Booking");
            });

            return deferred.promise;
        },

        getAssessments:function(){
            $log.debug("will get assessments for the booking form");
            var deferred = $q.defer();

            Companies.getPhoneBookingHeader(function(data,d2){
                $log.debug("getPhoneBookingHeader",data);
            },
            function(err){
                $log.error("Fail to get assessments",err);
            });

            Companies.getAssessments(function(data,d2){
                $log.debug("get assessments from server",data);
                deferred.resolve(data);
            },
            function(err){
              if(err.data.error.message == "Authorization Required" || err.data.error.message == "Invalid Access Token"){
                $log.error("Fail to get assessments",err);
                toastr.error("Session is expired. Please contact Redimed to receive the new booking form", 'Error');
                deferred.reject("Fail to get assessments");
              }else{
                $log.error("Fail to get assessments",err);
                toastr.error("Fail to get assessments, please contact Redimed to assit (" + err + ")" , 'Error');
                deferred.reject("Fail to get assessments");
              }

            });

            return deferred.promise;
        },

        getPhoneBookingHeader:function(){
            $log.debug("will get getPhoneBookingHeader for the booking form");
            var deferred = $q.defer();

            Companies.getPhoneBookingHeader(function(data,d2){
                $log.debug("getPhoneBookingHeader",data);
                deferred.resolve(data.phoneBookingHeader);
            },
            function(err){
                $log.error("Fail to get getPhoneBookingHeader",err);
                deferred.reject("Fail to get getPhoneBookingHeader",err);
            });

            return deferred.promise;
        },

        newSubsidiaryForRedimed : function(newSubsidiaryRedimed){
            $log.debug(">>newSubsidiaryForRedimed");
            var deferred = $q.defer();
            newSubsidiaryRedimed.id = 0;
            newSubsidiaryRedimed.fatherId = 112;
            $log.debug("Will add new company = ",newSubsidiaryRedimed);
            Companies.create(newSubsidiaryRedimed,function(data){
                $log.debug("new company created",data);
                deferred.resolve(data);
            },
            function(err){
                $log.error(" fail to create the new company Error = ",err)
            });

            return deferred.promise;
        },

        submitBooking:function(bookingCandidate,assessments){
            var deferred = $q.defer();
            var data = {
                        bookingId: bookingCandidate.bookingId,
                        poNumber: bookingCandidate.po,
                        resultEmail: bookingCandidate.resultEmail,
                        invoiceEmail: bookingCandidate.bookingPersonEmail,
                        packageId: 0,
                        siteId: null,
                        companyId: bookingCandidate.companyId,
                        subCompanyId: bookingCandidate.subCompanyId,
                        period: null,
                        paperwork: 'Redimed',
                        bookingPerson: bookingCandidate.bookingPerson,
                        customPackage: assessments,
                        contactEmail: bookingCandidate.bookingPersonEmail,
                        comments: bookingCandidate.comment,
                        candidates:
                         [ { bookingId: bookingCandidate.bookingId,
                             candidateId: 0,
                             candidatesName: bookingCandidate.candidateName,
                             dob: moment(bookingCandidate.dob).format("YYYY-MM-DD"),
                             phone: bookingCandidate.number,
                             email: bookingCandidate.email,
                             position: bookingCandidate.position,
                             appointmentStatus: 'Pending',
                             fromDate: moment(bookingCandidate.preferredFromDate).format("YYYY-MM-DD"),
                             toDate: moment(bookingCandidate.preferredToDate).format("YYYY-MM-DD"),
                             siteId: bookingCandidate.site.id,
                             siteName: bookingCandidate.site.siteName,
                             preferredTime: bookingCandidate.preferredTime,
                             isRedimedCallCandidate: bookingCandidate.isRedimedCallCandidate
                           }
                         ]
                      };

            if (bookingCandidate.preferredState){
                data.candidates[0].stateId = bookingCandidate.preferredState.id;
                data.candidates[0].stateName = bookingCandidate.preferredState.siteName;
            }

            if(bookingCandidate.preferredSuburb) {
              data.candidates[0].suburbId = bookingCandidate.preferredSuburb.id;
              data.candidates[0].suburbName = bookingCandidate.preferredSuburb.siteName;
            }

            $log.debug('will submit phone booking = ',data);
            BookingHeaders.submitPhoneBooking(data,function(data){
                $log.debug(' after submitPhoneBooking = ',data);
                deferred.resolve(data);

            },
            function(err){
                deferred.reject(err);
                $log.error(" fail to submitPhoneBooking = ",err)
                toastr.error("Fail to submit the booking (err = " + err + ")", 'Error');
            });

            return deferred.promise;
        }
    }
}]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.MakeTelehealthBooking')
    .controller('MakeTelehealthBookingMainCtrl',['CompanyFactory','$cookieStore','$uibModal','$log','toastr','mysqlDate','MakeTelehealthBookingFactory','mySharedService', function (CompanyFactory,$cookieStore,$uibModal,$log,toastr,mysqlDate,MakeTelehealthBookingFactory,sharedService) {
        var that = this;
        $log = $log.getInstance("ocsApp.MakeTelehealthBooking.MakeTelehealthBookingMainCtrl");
        $log.debug("I am make telehealth booking controller.");
        this.user = CompanyFactory.getCurrentUser();
        console.log(this.user);
        this.companyObject = null;
        this.newBooking = {
          "companyId" : that.user.companyId,
          "employerId": null,
          "patientName": null,
          "dob": null,
          "address": null,
          "postcode": null,
          "state": null,
          "suburb": null,
          "facetime": null,
          "skype": null,
          "contactNumber": null,
          "occupation": null,
          "employer": null,
          "supervisor": null,
          "medicalState": null,
          "emailForDoc": null,
          "injuryCrush": false,
          "injuryFall": false,
          "injuryLaceration": false,
          "injuryOther": false,
          "injurySprain": false,
          "descriptionOfInjury": null,
          "bodyPart": null,
          "injuryDate": null,
          "medicalHistory": null,
          "allergies": null,
          "serviceRequired": null,
          "apptDate": null,
          "preferredTime": null,
          "consent": false,
          "bookingPerson": that.user.bookingPerson
        };

        this.subsidiary = {};
        this.subsidiary2 = {};
        this.viewPackage = "";
        this.form = {};
        this.isSubmitted = false;
        this.isSubmitingToTheServer = false;
        this.isSubsidiary2 = false;
        this.isNoCandidate = false;//to display err if no candidate when submit the form
        this.stateList = ["WA","NSW","VIC","SA","TAS","NT","QLD"];
        this.bodyPartList = ["Foot-L","Foot-R","Lower Leg-L","Lower Leg-R","Upper Leg-L","Upper Leg-R","Shoulder-L","Shoulder-R","Arm-L","Arm-R","Wrist-L","Wrist-R","Hand-L","Hand-R","Lower Back","Upper Back","Chest","Abdomen","Head"];
        this.serviceList = ["1st Medical certificate","Progress Medical Certificate","Fitness for Duty","Referral"];

        this.dateStatus = {};
        this.dateStatus.dobOpened = false;
        this.dateStatus.apptDateOpened = false;
        this.dateStatus.timeOpened = false;
        this.dateStatus.injuryDateOpened = false;
        this.format = "dd/MM/yyyy";
        this.openDOB = function($event) {
            that.dateStatus.dobOpened = true;
        };
        this.timechanged = function() {
             console.log('Time changed to: ' , that.newBooking.preferredTime);
        };

        this.openApptDate = function($event) {
            that.dateStatus.apptDateOpened = true;
        };
        this.openInjuryDate = function($event) {
            that.dateStatus.injuryDateOpened = true;
        };


        this.isShowOtherInjyryDesc = false;
        that.descriptionOfInjuryInvalid = true;
        this.injuryDescChange = function(){

            if(that.newBooking.injuryOther || that.newBooking.injuryLaceration || that.newBooking.injuryCrush || that.newBooking.injurySprain || that.newBooking.injuryFall ){
                that.descriptionOfInjuryInvalid = false;
            }else{
              that.descriptionOfInjuryInvalid = true;
            }

            if(that.newBooking.injuryOther){
              that.isShowOtherInjyryDesc = true;
            }else{
              that.isShowOtherInjyryDesc = false;
            }
        }


        var user = $cookieStore.get('user');

        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
            $log.debug("Make booking, get company info");
        });

        this.getAllSubsidiaries = function (callback) {
            $log.debug("getAllSubsidiaries.Loading subsidiaries......",that.companyObject.subsidiaries);
            callback(that.companyObject.subsidiaries);
        };

        this.isAdminLogin = function(){
            return user.userType.indexOf("RediMed")>=0 ? true:false;
        };

        this.newCompany = function(){
            // add new sub company for Redimed when admin make a booking on behalf
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/MakeTelehealthBooking/views/makeTelehealthBooking.NewCompany.html',
                controller: 'NewTelehealthCompanyCtrl',
                controllerAs: 'NewTelehealthCompanyCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (newCompany) {
                //$scope.selected = selectedItem;
                $log.debug("newCompany = ",newCompany);
                MakeTelehealthBookingFactory.newSubsidiaryForRedimed(that.user.companyId,newCompany).then(function(succ){
                    $log.debug("created new company sucessfully = ",succ);
                    that.newBooking.employer = succ;
                    that.newBooking.email = succ.resultEmail;
                    that.companyObject.subsidiaries.push(succ);
                });
            }, function () {
                $log.debug('Modal New company dismissed at: ' + new Date());
            });
        };

        this.submitForm = function(){

            that.isSubmitted = true;
            console.log(this.newBooking);

            if(that.form.$invalid){
                toastr.error('Please enter all required fields of booking information', 'Error');
                $log.error('Please enter all required fields of booking information',that.form.$error);
            }else{
                that.isSubmitingToTheServer = true;

                MakeTelehealthBookingFactory.submitBooking(that.newBooking,that.companyObject,user).then(
                    function(succ){
                        that.isSubmitingToTheServer = false;
                        $log.debug("Submit booking successfully",succ);
                        toastr.success('Successfully submitted');
                        toastr.success('The booking list will be updated shortly. Please wait !');
                        //clear all data
                        that.newBooking = {
                          "companyId" : that.user.companyId,
                          "employerId": null,
                          "patientName": null,
                          "dob": null,
                          "address": null,
                          "postcode": null,
                          "state": null,
                          "suburb": null,
                          "facetime": null,
                          "skype": null,
                          "contactNumber": null,
                          "occupation": null,
                          "employer": null,
                          "supervisor": null,
                          "medicalState": null,
                          "emailForDoc": null,
                          "injuryCrush": false,
                          "injuryFall": false,
                          "injuryLaceration": false,
                          "injuryOther": false,
                          "injurySprain": false,
                          "descriptionOfInjury": null,
                          "bodyPart": null,
                          "injuryDate": null,
                          "medicalHistory": null,
                          "allergies": null,
                          "serviceRequired": null,
                          "apptDate": null,
                          "preferredTime": null,
                          "consent": false,
                          "bookingPerson": that.user.bookingPerson
                        };

                        that.isSubmitted = false;
                    },
                    function(err){
                        $log.err("Fail to submit booking",err);
                    });

            }

        }

        this.selectedSubsidiary = function(value){
            $log.debug("selectedSubsidiary = ",value);
            that.newBooking.email = value.resultEmail;
        };

        this.isShowSubsidiary2 = function(){
            return this.isSubsidiary2;
        }



    }]);

/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeTelehealthBooking').controller('NewTelehealthCompanyCtrl',['$uibModalInstance','$log',function ( $uibModalInstance,$log) {
    $log = $log.getInstance("ocsApp.MakeTelehealthBooking.NewTelehealthCompanyCtrl");
    $log.debug("NewCompanyCtrl is running...");
    var that = this;
    this.company = {};
    this.companyObject = null;
    this.isSubmitted = false;
    this.form = {};

    this.ok = function () {
        that.isSubmitted = true;
        $log.debug("OK to exit modal valid=",that.form.$valid);
        $log.debug("OK to exit modal invalid=",that.form.$invalid);
        $log.debug("OK to exit modal error=",that.form.$error);
        if(that.form.$valid){
            $uibModalInstance.close(that.company);
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/**
 * Created by phuongnguyen on 8/01/16.
 */
angular.module('ocsApp.MakeBooking')
.factory('MakeTelehealthBookingFactory', ['TelehealthBookings','toastr','$q','CompanyFactory','mysqlDate','Companies','$log','mySharedService', function (TelehealthBookings,toastr,$q,CompanyFactory,mysqlDate,Companies,$log,sharedService) {
    $log = $log.getInstance("ocsApp.MakeBooking.MakeBookingFactory");
    return {
        submitBooking:function(newBookingObj,companyObject,user){

            ///submit the online booking is here !
            var deferred = $q.defer();

            var booking = {
                "bookingId": 0,
                "companyId":  newBookingObj.companyId,
                "patientName": newBookingObj.patientName,
                "dob": moment(newBookingObj.dob).format("YYYY-MM-DD"),
                "address": newBookingObj.address,
                "postcode": newBookingObj.postcode,
                "state": newBookingObj.state,
                "suburb": newBookingObj.suburb,
                "facetime": newBookingObj.facetime,
                "skype": newBookingObj.skype,
                "contactNumber": newBookingObj.contactNumber,
                "occupation": newBookingObj.occupation,
                "employer": newBookingObj.employer.companyName,
                "employerId": newBookingObj.employer.id,
                "supervisor": newBookingObj.supervisor,
                "medicalState": newBookingObj.medicalState,
                "emailForDoc": newBookingObj.email,
                "injuryCrush": (newBookingObj.injuryCrush?1:0),
                "injuryFall": (newBookingObj.injuryFall?1:0),
                "injuryLaceration": (newBookingObj.injuryLaceration?1:0),
                "injuryOther": (newBookingObj.injuryOther?1:0),
                "injurySprain": (newBookingObj.injurySprain?1:0),
                "descriptionOfInjury": newBookingObj.descriptionOfInjury,
                "bodyPart": newBookingObj.bodyPart,
                "injuryDate": moment(newBookingObj.injuryDate).format("YYYY-MM-DD"),
                "medicalHistory": newBookingObj.medicalHistory,
                "allergies": newBookingObj.allergies,
                "serviceRequired": newBookingObj.serviceRequired,
                "apptDate": moment(newBookingObj.apptDate).format("YYYY-MM-DD") + ' ' + moment(newBookingObj.preferredTime).format("HH:mm"),
                "preferredTime": moment(newBookingObj.preferredTime).format("HH:mm"),
                "consent": (newBookingObj.consent?1:0),
                "bookingPerson": newBookingObj.bookingPerson,
                "apptStatus": "Confirmed"
            };

            $log.debug("will submit the telehealth booking",booking);

            TelehealthBookings.create(booking,function(data){
                $log.debug("Submitted and data return",data);
                //after submit the booking, refresh the booking list

                deferred.resolve("Created Booking");
            },
            function(err){
                $log.error("Fail to Submit the booking",err);
                toastr.error("Fail to submit the booking, please contact Redimed to assit", 'Error');
                deferred.reject("Created Booking");
            });

            return deferred.promise;
        },
        newSubsidiaryForRedimed : function(fatherCompany,newSubsidiaryRedimed){
            $log.debug(">>newSubsidiaryForRedimed");
            var deferred = $q.defer();
            newSubsidiaryRedimed.id = 0;
            newSubsidiaryRedimed.fatherId = fatherCompany;
            $log.debug("Will add new company = ",newSubsidiaryRedimed);
            Companies.create(newSubsidiaryRedimed,function(data){
                $log.debug("new company created",data);
                deferred.resolve(data);
            },
            function(err){
                $log.error(" fail to create the new company Error = ",err)
            });

            return deferred.promise;
        }
    }
}]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Navigator')
    .controller('IdleAlertCtrl',[ '$uibModalInstance','$scope',function ($uibModalInstance,$scope) {

/*
        $scope.$on('IdleEnd', function() {
            console.log(">idleAlertCtrl IdleEnd");
            $uibModalInstance.close({});
        });

        $scope.$on('IdleTimeout', function() {
            console.log(">idleAlertCtrl IdleTimeout");
            $uibModalInstance.close({});
        });
*/
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Navigator')
    .controller('NavigatorMainCtrl',['CompanyFactory','Accounts','$state','$cookieStore','$uibModal','Idle', 'Keepalive','$scope','$uibModalStack','mySharedService','$log','mySocket', function (CompanyFactory,Accounts,$state,$cookieStore,$uibModal,Idle, Keepalive,$scope,$uibModalStack,sharedService,$log,mySocket) {
        $log = $log.getInstance("ocsApp.Navigator.NavigatorMainCtrl");
        $log.debug("I am navigator controller.");
        //start Idle
        Idle.watch();
        //get User information
        var that = this;
        this.user = CompanyFactory.getCurrentUser();
        this.currentCompany = null;
        $log.debug("user = ",this.user);

        var initData = function(){
          that.currentCompany = CompanyFactory.getCurrentCompany();
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh navigator") >= 0 ){
                initData();
            }
        });

        if(this.user.userType.indexOf("RediMed") >= 0 ){
            // this is a Redimed user, will go booking first
            $log.debug("I am admin");
            $state.go("navigator.bookings");
        }else{
            /// this is a normal user (company user), will go make booking first
            $log.debug("I am company");
            if(that.user.istelehealthBooking == 1){
                $state.go("navigator.makeTelehealthBooking");
            }else{
                $state.go("navigator.makeBooking");
            }
        }

        $scope.$on('IdleStart', function() {
            $log.debug("IdleStart");
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Navigator/views/navigator.idleAlert.html',
                controller: 'IdleAlertCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;

            }, function () {
                $log.debug('Modal Idle dismissed at: ' + new Date());
            });
        });

        $scope.$on('IdleEnd', function() {
            $log.debug("IdleEnd");
            $uibModalStack.dismissAll();
        });

        $scope.$on('IdleTimeout', function() {
            $log.debug("IdleTimeout");
            $uibModalStack.dismissAll();
            that.logout();
        });

        this.isPackage = function(){
            return that.user.isall ==1 ? true : (that.user.ispackage == 1 ? true : false);
        };

        this.isPosition = function(){
            return that.user.isall ==1 ? true : ( that.user.isposition == 1 ? true : false);
        };

        this.isSetting = function(){
            return that.user.isall ==1 ? true : (that.user.issetting == 1 ? true : false);
        };

        this.isBookingList = function(){
            return that.user.isall ==1 ? true : (that.user.isbooking == 1 ? true : false);
        };

        this.isMakeBooking = function(){
            return that.user.isall ==1 ? true : (that.user.ismakebooking == 1 ? true : false);
        };

        this.isTelehealthBooking = function(){
            return that.user.isall ==1 ? true : (that.user.istelehealthBooking == 1 ? true : false);
        };

        this.isReports = function(){
            return this.user.userType.indexOf("RediMed") >= 0  ? true : false;
        };


        this.logout = function(){
            $log.debug("NavigatorMainCtrl.logout runs......");
            //let IndexMainCtrl know I logout so it can change its className for the index.html page
            Accounts.logout(function(value,header){
                mySocket.emit('logout');
                sharedService.prepForBroadcast("Logout successfully");
                $log.debug("Logout : ",value);
                $log.debug("Logout : ",header);
                $state.go('init');
            },
            function(err){
                $log.error("Logout failed: ",err);
            });
        }

        this.myProfile = function(){
            //borrow new or edit account from settings module to use at here
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Settings/views/settings.NewAccount.html',
                controller: 'NewAccountCtrl',
                controllerAs: 'NewAccountCtrl',
                size: 'lg',
                resolve:{
                    account : function(){
                        return that.user;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;

            }, function () {
                $log.debug('Modal profile dismissed at: ' + new Date());
            });
        };

        this.changeCompany = function(){
            //borrow new or edit account from settings module to use at here
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Settings/views/settings.ChangeCompany.html',
                controller: 'ChangeCompanyCtrl',
                controllerAs: 'ChangeCompanyCtrl',
                size: 'md',
                resolve:{
                    account : function(){
                        return that.user;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;

            }, function () {
                $log.debug('Modal profile dismissed at: ' + new Date());
            });
        };

    }]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('ConfirmToDeletePackageCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Packages')
    .controller('PackagesMainCtrl',['$uibModal','$scope','CompanyFactory','Packages','$log','mySharedService', function ($uibModal,$scope,CompanyFactory,Packages,$log,sharedService) {
        $log = $log.getInstance("ocsApp.Packages.PackagesMainCtrl");
        $log.debug("I am package list controller.");
        var that = this;
        this.packages = [];

        var getPackageData = function(){
            CompanyFactory.getCompany(function(data){
                $log.debug("Get company info");
                that.packages = data.packages;
            });
        }

        getPackageData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh packages") >= 0 ){
              getPackageData();
            }
        });

        this.deletePackage = function(packageId){

            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Packages/views/packages.ConfirmToDeletePackage.html',
                controller: 'ConfirmToDeletePackageCtrl',
                controllerAs: 'ConfirmToDeletePackageCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                Packages.deleteById({id:packageId},function(result){
                    console.log(result);
                    CompanyFactory.refreshPackageList(function(data){
                        console.log("Make booking, get company info = ",data);
                        that.packages = data.packages;
                    });
                });

            }, function () {
                $log.debug('Modal delete package dismissed at: ' + new Date());
            });
        }

        this.newOrEditPackage = function(value){
            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Packages/views/packages.NewPackage.html',
                controller: 'NewPackageCtrl',
                controllerAs: 'NewPackageCtrl',
                size: 'lg',
                resolve:{
                    package : function(){
                        return value;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;
                getPackageData();
            }, function () {
                $log.debug('Modal New or edit package dismissed at: ' + new Date());
            });
        };

    }]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('NewPackageCtrl',['Packages','$uibModalInstance','package','CompanyFactory','$log','toastr', function (Packages,$uibModalInstance,package,CompanyFactory,$log,toastr) {
        $log = $log.getInstance("ocsApp.Positions.Packages");
        $log.debug("I am  new or edit position controller.",package);

        var that = this;
        this.form = {};
        this.assessments = [];
        this.companyObject = {};
        this.companyId = CompanyFactory.getCompanyId();

        if(package){
            this.packageName = package.packageName;
            for(var i in package.AssessmentHeaders){
                var assessmentHeader = package.AssessmentHeaders[i];
                for(var j in assessmentHeader.Assessments){
                    this.assessments.push(assessmentHeader.Assessments[j].assId)
                }
            }
        }
        $log.debug("Assessments = ",this.assessments);
        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
        });
        this.ok = function () {
            that.isSubmitted = true;
            if(that.form.$valid){
                //Update Position if position is an object
                //If position = null, it means that it is new object
                var upsertData = {};
                upsertData.package = package;
                upsertData.assessments = that.assessments;
                upsertData.packageName = that.packageName;
                upsertData.companyId = that.companyId;

                $log.debug("will insert/update upsertData = ",upsertData);
                Packages.upsertPackage(upsertData,
                    function(succ){
                        $log.debug("New/update package successfully ",succ);
                        toastr.success('Successfully submitted');
                        CompanyFactory.refreshPackageList(function(data){
                            $log.debug(">>>>>>Refesh packages after insert or edit",data.packages);
                            $uibModalInstance.close({});
                        });
                    },
                    function(err){
                        $log.error("Fail to new/update package",err);
                        toastr.error('Fail to save the package', 'Error');
                    }
                );
            }else{
                $log.error("Data error",that.form.$error)
                toastr.error('Please check the input data', 'Error');
            }

        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('ConfirmToDeletePositionCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('PositionsMainCtrl',['$uibModal','$scope','CompanyFactory','Positions','$log','mySharedService', function ($uibModal,$scope,CompanyFactory,Positions,$log,sharedService) {
        $log = $log.getInstance("ocsApp.Packages.PackagesMainCtrl");
        $log.debug("I am position list controller.");

        var that = this;
        this.positions = [];
        this.show = false;

        var initData = function(){
            CompanyFactory.getCompany(function(data){
                console.log("Make booking, get company info = ",data);
                that.positions = data.positions;
            });
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh positions") >= 0 ){
              initData();
            }
        });

        this.deletePosition = function(positionId){

            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Positions/views/positions.ConfirmToDeletePosition.html',
                controller: 'ConfirmToDeletePositionCtrl',
                controllerAs: 'ConfirmToDeletePositionCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                Positions.deleteById({id:positionId},function(result){
                    console.log(result);
                    CompanyFactory.refreshPositionList(function(data){
                        console.log("Make booking, get company info = ",data);
                        that.positions = data.positions;
                    });
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.newOrEditPosition = function(value){
            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Positions/views/positions.NewPosition.html',
                controller: 'NewPositionCtrl',
                controllerAs: 'NewPositionCtrl',
                size: 'md',
                resolve:{
                    position : function(){
                        return value;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;
                CompanyFactory.refreshPositionList(function(data){
                    console.log("Make booking, get company info = ",data);
                    that.positions = data.positions;
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('NewPositionCtrl',['Positions','$uibModalInstance','position','CompanyFactory','$log','toastr', function (Positions,$uibModalInstance,position,CompanyFactory,$log,toastr) {
        $log = $log.getInstance("ocsApp.Positions.NewPositionCtrl");
        $log.debug("I am  new or edit position controller.",position);

        var that = this;
        this.form = {};
        this.companyId = CompanyFactory.getCompanyId();
        if(position){
            this.positionName = position.positionName;
        }

        this.ok = function () {
            that.isSubmitted = true;

            if(that.form.$valid){
                //Update Position if position is an object
                //If position = null, it means that it is new object
                if(position){
                    $log.debug("will update position",position);
                    Positions.update({where:{"id":position.id}},{"positionName":that.positionName},function(res){
                        $log.debug("updated position",res);
                        toastr.success('Position was updated successfully', '');
                        $uibModalInstance.close({});
                    },function(err){
                        $log.error("Fail to update position",err);
                        toastr.error('Fail to update Position', 'Error');
                        $uibModalInstance.close({});
                    });
                }else{
                    var newPositionObj = {};
                    newPositionObj.positionName = that.positionName;
                    newPositionObj.companyId = that.companyId;
                    newPositionObj.id = 0;
                    console.log(newPositionObj);

                    Positions.create(newPositionObj,function(rs){
                        $log.debug("created position",rs);
                        toastr.success('Position was created successfully', '');
                        $uibModalInstance.close({});
                    },function(err){
                        toastr.error('Fail to create Position', 'Error');
                        $log.error("failt to create position",err);
                    })
                }               
            }else{
                 $log.error("Save postion err ",that.form.$error);
            }

        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('ConfirmToDeletePackageCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


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

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Settings')
    .controller('SettingsMainCtrl',['$uibModal','$scope','CompanyFactory','Packages','$log','mySharedService', function ($uibModal,$scope,CompanyFactory,Packages,$log,sharedService) {
        $log = $log.getInstance('ocsApp.Settings.SettingsMainCtrl');
        $log.debug("I am package list controller.");
        var that = this;
        this.accounts = [];
        this.companies = [];


        var initData = function(){
            CompanyFactory.getCompany(function(data){
                that.accounts = data.accounts;
                that.companies = data.subsidiaries;
                for(var i in that.accounts){
                    if(that.accounts[i].company){
                        that.accounts[i].companyName = that.accounts[i].company.companyName;
                    }
                }
            });
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh settings") >= 0 ){
              initData();
            }
        });

        this.deletePackage = function(packageId){

            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Packages/views/packages.ConfirmToDeletePackage.html',
                controller: 'ConfirmToDeletePackageCtrl',
                controllerAs: 'ConfirmToDeletePackageCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                Packages.deleteById({id:packageId},function(result){
                    console.log(result);
                    CompanyFactory.refreshPackageList(function(data){
                        console.log("Make booking, get company info = ",data);
                        that.packages = data.packages;
                    });
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.newOrEditPackage = function(value){
            var acc = value;

            //open modal to enter new account
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Settings/views/settings.NewAccount.html',
                controller: 'NewAccountCtrl',
                controllerAs: 'NewAccountCtrl',
                size: 'lg',
                resolve:{
                    account : function(){
                        return value;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;
                CompanyFactory.refreshAccountList(function(data){
                    console.log(">>>>>>Refesh packages after insert or edit= ",data);
                    that.accounts = data.accounts;
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Settings')
    .controller('NewAccountCtrl',['Accounts','$uibModalInstance','account','CompanyFactory','$cookieStore','$log','toastr', function (Accounts,$uibModalInstance,account,CompanyFactory,$cookieStore,$log,toastr) {

        $log = $log.getInstance('ocsApp.Settings.NewAccountCtrl');
        $log.debug("I am  new or edit account controller.",account);

        var that = this;
        this.user = CompanyFactory.getCurrentUser();
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

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Companies')
    .controller('ConfirmToDeleteCompanyCtrl',['$uibModalInstance','row', function ($uibModalInstance,row) {

        this.formDefines = {
            div1: {type:"div", fieldClass: "modal-header", fields: {h3:{type:"h3", fieldClass: "modal-title", label: "Delete Company", controllerAs:"ConfirmToDeleteCompanyCtrl"}}},
            div2: {type:"div", fieldClass: "modal-body", fields: {h3:{type:"h3", fieldClass: "modal-title", label: "Do you want to delete company ?"}}},
            div3: {type:"div", fieldClass: "modal-footer", fields: {
                    btn1: {type:"button", fieldClass: "btn btn-primary", ngClick: "ok()",label: "Save"},
                    btn2: {type:"button", fieldClass: "btn btn-warning", ngClick: "cancel()",label: "Cancel"}
                }
            }
        };


        this.ok = function () {
            $uibModalInstance.close(row);
        };

        this.cancel = function () {
            $uibModalInstance.dismiss(row);
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */


angular.module('ocsApp.Sites')
    .controller('SitesMainCtrl',['$uibModal','$log','DetailModal','DeleteModal','$state','SiteModuleFactory','$scope', function ($uibModal,$log,DetailModal,DeleteModal,$state,SiteModuleFactory,$scope) {

        TableBaseCtrl.call(this,$scope,$log,SiteModuleFactory,DeleteModal,"SitesMainCtrl");

        var that = this;

        this.isSubmitted = false;
        this.form = {};
        this.company = {};

        this.setDeleteTemplateUrl('<my-dynamic-form formdefine = "{{ConfirmToDeleteCompanyCtrl.formDefines}}" ></my-dynamic-form>');
        this.setDeleteController('ConfirmToDeleteCompanyCtrl');
        this.setDeleteWindowSize('md');

        this.setCloseDeleteModal(function(row){
            CompanyModuleFactory.deleteCompany(row);
        });


        this.detail = function(rowData){
            console.log(" prepare to go to detail with rowData",rowData);
            if(rowData){
                $state.go('navigator.sites.detail',{row:rowData.id});
            }else{
                $state.go('navigator.sites.detail',{row:null});
            }

        };

    }]);




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

/**
 * Created by phuongnguyen on 24/02/16.
 *//**
 * Created by phuongnguyen on 27/11/15.
 */

angular.module('ocsApp.Sites')
    .controller('NewSiteCtrl',['$state','$stateParams','Companies','$log','toastr','BookingStatusFactory','DetailModal2','DeleteModal','SiteModuleFactory','mysqlDate',function ($state,$stateParams,Companies,$log,toastr,BookingStatusFactory,DetailModal2,DeleteModal,SiteModuleFactory,mysqlDate) {

        var id = parseInt($stateParams.row);
        var row = SiteModuleFactory.getMasterRow(id);
        var that = this;
        var allCalendars = row.AdminCalendars;

        DetailWithTableBaseCtrl.call(this,SiteModuleFactory,row,$log,toastr,DetailModal2,DeleteModal,'NewCompanyCtrl');

        this.row.defaultStatusObject = {};
        this.bookingStatus = [];

        this.setDetailTemplateUrl('<my-dynamic-form formdefine = "{{NewCalendarCtrl.formDefines}}" ></my-dynamic-form>');
        this.setDetailController('NewCalendarCtrl');
        this.setDetailWindowSize('lg');
        this.setCloseDetailModal(function(){
            

            SiteModuleFactory.getCalendars(row.id,function(data){
                that.row.AdminCalendars = data[0].AdminCalendars;
            });
        });

        this.cancel = function () {
            //$uibModalInstance.dismiss('cancel');
            $state.go("navigator.companies.list");
        };

        if(row){
            this.windowTitle = "Update Company";
            
            SiteModuleFactory.getCalendars(row.id,function(data){
                that.row.AdminCalendars = data[0].AdminCalendars;
            });

        }else{
            this.windowTitle = "New Company";
        }

        this.saveDetail = function(){
            console.log(row.Calendars);
        };

        this.filterDetail = function(from,to){
            //var df = parseDate(from);
            //var dt = parseDate(to);
            var arrayToReturn = [];
            if(allCalendars){
                for (var i = 0; i < allCalendars.length; i++) {

                    var appointmentDate = mysqlDate(allCalendars[i].fromTime);
                    //console.log(appointmentDate,from,to);
                    if(from && to){
                        if (appointmentDate >= from && appointmentDate <= to) {
                            arrayToReturn.push(allCalendars[i]);
                        }
                    }

                }
            }
            row.AdminCalendars = arrayToReturn;
            console.log(row.AdminCalendars);
            //return arrayToReturn;
            //return arrayToReturn;
        };

        $log.debug("modalTitle = ",this.windowTitle);


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
/**
 * Created by phuongnguyen on 3/01/16.
 */
angular.module('ocsApp.Bookings').controller('AdminEditBookingCtrl',['candidate','RedimedSiteFactory','BookingStatusFactory','BookingCandidates','toastr','$uibModalInstance','mysqlDate','$log','CompanyFactory','mySharedService','mysqlDate','$cookieStore','$uibModal', function (candidate,RedimedSiteFactory,BookingStatusFactory,BookingCandidates,toastr,$uibModalInstance,mysqlDate,$log,CompanyFactory,sharedService,mysqlDate,$cookieStore,$uibModal) {
    $log = $log.getInstance("ocsApp.Bookings.AdminEditBookingCtrl");
    $log.debug("I am admin edit booking ctrl");
    $log.debug("Candidate = ",candidate);
    var that = this;
    var prevStatus = candidate.appointmentStatus;
    this.candidate = candidate;
    this.user = CompanyFactory.getCurrentUser();
    this.sites = [];
    this.states = [];
    this.suburbs = [];
    this.site = {};
    this.state = {};
    this.suburb = {};
    this.calendars = [];
    this.calendar = {};
    this.statuses = [];
    this.isSubmitted = false;
    this.form = {};
    this.dateStatus = {};
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.dateStatus.timeOpened = false;
    this.isCalendarList = false;
    this.isAppointmentTime = false;

    this.format = "dd/MM/yyyy HH:mm";

    this.apptDateAfterConvert = mysqlDate(this.candidate.appointmentTime);
    this.apptTimeAfterConvert = mysqlDate(this.candidate.appointmentTime);
    this.isAppointmentTimeChange = false;

    //console.log("apptTimeAfterConvert=",this.apptTimeAfterConvert);

    this.appointmentTimeChanged = function(){
        that.isAppointmentTimeChange = true;
        console.log(this.apptTimeAfterConvert);
    }

    this.openTime = function() {
        that.dateStatus.timeOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    BookingStatusFactory.getStatus(function(data){
        that.statuses = data;
        $log.debug(" status = ",that.statuses);
    });

    RedimedSiteFactory.getSite(function(data){
        $log.debug("get sites...");
        that.sites = data;
        that.site =  that.sites[_.findIndex(that.sites, 'id', that.candidate.siteId)];

        if(that.site.States.length > 0){
            that.states = that.site.States;
            that.state =  that.states[_.findIndex(that.states, 'stateName', that.candidate.stateName)];
            if(that.state.SubStates.length > 0){
                that.suburbs = that.state.SubStates;
                that.suburb =  that.suburbs[_.findIndex(that.suburbs, 'suburbName', that.candidate.suburbName)];
            }
        }

        if(that.site){
            getCalendar();
        }
    });

    this.selectedSite = function(){
        $log.debug("Get calendar from the factory");
        that.states = that.site.States;
        that.suburb = null;
        that.state = null;
        that.suburbs = null;
        getCalendar();
    };

    this.selectedState = function(){
        if(that.state){
            that.suburb = null;
            that.suburbs = that.state.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    this.isSendEmailDisabled = function(){
        if(this.candidate.appointmentStatus =='Confirmed'||this.candidate.appointmentStatus =='Pending'){
            return !that.isNotSave();
        }else{
            return false;
        }
    };

    this.isNotSave = function(){
        return that.form.$pristine
    };

    this.isAttended = function(){

        if((that.candidate.appointmentStatus == 'Reschedule' || that.candidate.appointmentStatus == 'Confirmed') ){
            return true;
        }else{
            return false;
        }

    };

    this.isShowAttendedButton = function(){
        if(that.user.userType.indexOf("RediMed") == -1 ){
            // this is a Redimed user, will go booking first
            return false;
        }else{
            return true;
        }
    };

    this.attended = function(){

                var updateValue = {};
                updateValue.appointmentStatus = 'Attended';

                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();

                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
    };

    this.sendConfirmationEmail = function(){
        $log.debug("> Will send email to ",that.candidate);
        if(that.candidate.appointmentStatus.indexOf('Pending')>=0 )
        {

            BookingCandidates.sendConfirmationEmail({id:that.candidate.candidateId,type:"pending"},function(rs){
                $log.debug(">>sendConfirmationEmail",rs);
                if(rs.sentEmailStatus.indexOf('Error')>=0){
                    toastr.error(rs.sentEmailStatus, 'Error');
                    $log.error("> Fail to send email to ",candidate);
                }else{
                    toastr.success(rs.sentEmailStatus, '');
                    $log.debug("> Send email successfullt ",rs.sentEmailStatus);
                }

            });

        }else{
            BookingCandidates.sendConfirmationEmail({id:that.candidate.candidateId,type:"new"},function(rs){
                $log.debug(">>sendConfirmationEmail",rs);
                if(rs.sentEmailStatus.indexOf('Error')>=0){
                    toastr.error(rs.sentEmailStatus, 'Error');
                    $log.error("> Fail to send email to ",candidate);
                }else{
                    toastr.success(rs.sentEmailStatus, '');
                    $log.debug("> Send email successfullt ",rs.sentEmailStatus);
                }

            });
        }

    };

    this.save = function (isSendEmail) {
        that.isSubmitted = true;
        var isSendConfirmationEmail = false;
        if((!that.candidate.appointmentTime && that.calendars.length > 0 && ( that.calendar == undefined || that.calendar == null)) && isSendEmail) {
            toastr.error("Please select the calendar", 'Error');
        }else{
            if(that.form.$valid){
                var updateValue = {};

                if(prevStatus.indexOf('Pending')>=0 && (that.calendar || that.apptTimeAfterConvert)){
                    updateValue.appointmentStatus = 'Confirmed';
                    that.candidate.appointmentStatus = 'Confirmed';
                    isSendConfirmationEmail = true;
                }

                if(that.calendar){
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && (that.calendar.calId != candidate.calendarId)){
                        updateValue.appointmentStatus = 'Reschedule';
                        that.candidate.appointmentStatus = 'Reschedule';
                        isSendConfirmationEmail = true;
                    }
                }else{
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && that.apptTimeAfterConvert && that.isAppointmentTimeChange){
                        updateValue.appointmentStatus = 'Reschedule';
                        that.candidate.appointmentStatus = 'Reschedule';
                        isSendConfirmationEmail = true;
                    }
                }




                updateValue.appointmentNotes = that.candidate.appointmentNotes;
                updateValue.siteId = that.site.id;
                updateValue.siteName = that.site.siteName;
                //If WA and Eastern stated => do not send email automatically
                if(updateValue.siteName.indexOf('Eastern States') >= 0 || updateValue.siteName.indexOf('WA') >= 0 || !isSendEmail){
                    isSendConfirmationEmail = false;
                }

                if(that.state){
                    updateValue.stateName = that.state.stateName;
                    updateValue.stateId = that.state.id;
                }else{
                    updateValue.stateName = null;
                    updateValue.stateId = null;
                }

                if(that.suburb){
                    updateValue.suburbName = that.suburb.suburbName;
                    updateValue.suburbId = that.suburb.id;
                }else{
                    updateValue.suburbName = null;
                    updateValue.suburbId = null;
                }

                console.log("that.calendar = ",that.calendar);
                if(that.calendar){
                    updateValue.appointmentTime =  moment(mysqlDate(that.calendar.fromTime)).format("YYYY-MM-DD hh:mm");
                    updateValue.calendarId = that.calendar.calId;
                }else{

                    if(that.apptTimeAfterConvert){
                        //in case there is no calendar list i.e: in VIC,.....
                        //admin enter the appt time directly
                        updateValue.appointmentTime =  moment(that.apptDateAfterConvert).format("YYYY-MM-DD") + " " + moment(that.apptTimeAfterConvert).format("hh:mm");
                    }

                }

                $log.debug("will update",updateValue);
                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();
                        //$uibModalInstance.close(that.BookingCandidate);
                        if(isSendConfirmationEmail){
                            that.sendConfirmationEmail();
                        }


                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
            }
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    this.canCancelAppt = function(){
        if( that.candidate.appointmentStatus.indexOf('Confirmed') >= 0 ||  that.candidate.appointmentStatus.indexOf('Reschedule') >= 0){
            return true;
        }else{
            return false;
        }
    }

    this.cancelAppt = function () {
                    //open modal to enter new candidate
            $uibModalInstance.dismiss('cancel');
            var modalInstance = $uibModal.open({
                templateUrl: 'modules/Bookings/views/booking.ConfirmToCancelAppt.html',
                controller: 'ConfirmToCancelApptCtrl',
                controllerAs: 'ConfirmToCancelApptCtrl'
            });

            modalInstance.result.then(function (position) {
                var updateValue = {};

                updateValue.appointmentNotes = that.candidate.appointmentNotes;
                updateValue.appointmentStatus = 'Cancel';

                updateValue.calendarId = -1;

                $log.debug("will cancel the booking ",updateValue);

                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        //$uibModalInstance.close(that.BookingCandidate);
                        that.sendConfirmationEmail();
                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    function getCalendar(){
        $log.debug("will getCalendar....",that.user);
        //Plus toDate one date before query calendar because of time
        var fromDate = new Date();
        var toDate = new Date();
        toDate.setDate(toDate.getDate() + 60);
        RedimedSiteFactory.getCalendar(that.site.id,fromDate,toDate,function(data){
            $log.debug("finished getCalendar....", that.user);
            console.log(" RedimedSiteFactory.getCalendar = ",data)
            that.calendars = data;
            that.calendar =  that.calendars[_.findIndex(that.calendars, 'calId', that.candidate.calendarId)];

            if(that.calendars.length > 0){
                that.isCalendarList = true;
                that.isAppointmentTime = false;
            }else{
                that.isCalendarList = false;
                that.isAppointmentTime = true;
            }


            //if user is not an admin, not allow to select time and date ; only select in calendar list
            if(that.user.userType.indexOf("RediMed") == -1 ){
                // this is a Redimed user, will go booking first
                that.isAppointmentTime = false;
            }

            console.log("that.calendars = ",that.calendars,"that.calendar = ", that.calendar);
        });
    };

    this.isAdmin = function(){
        return that.user.userType.indexOf("RediMed") >= 0 ? true :false;
    };

}]);

/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Bookings')
    .controller('ConfirmToCancelApptCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.TelehealthBookings')
    .controller('TelehealthBookingsMainCtrl',['uiGridConstants','$scope','$window','CompanyFactory','$uibModal','$cookieStore','$log','mysqlDate','mySharedService','Packages','$q', function (uiGridConstants,$scope,$window,CompanyFactory,$uibModal,$cookieStore,$log, mysqlDate,sharedService,Packages,$q) {
        $log = $log.getInstance("ocsApp.TelehealthBookings.TelehealthBookingsMainCtrl");
        $log.debug("I am telehealth booking list controller.");

        var that = this;
        this.window = $window;
        var packages = [];
        this.loading = false;
        this.user = CompanyFactory.getCurrentUser();
        var columnDefs = [
            { field: 'employer', displayName: "Employer Name", width: "150"},
            //{ field: 'subCompanyName', displayName: "Company Name", width: "150"},
            {
                field: 'patientName',
                displayName: 'Patient Name',
                width: "200"
            },
            { field: 'dob', displayName: "DOB", width: "100",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy\''},
            { field: 'apptDate', displayName: "Appointment Date", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy\''},
            { field: 'preferredTime', displayName: "Preferred Time", width: "100"},
            { field: 'address', displayName: "Address", width: "100"},
            { field: 'suburb', displayName: "Suburb", width: "100"},
            { field: 'state', displayName: "State", width: "100"},
            { field: 'facetime', displayName: "Facetime", width: "100"},
            { field: 'skype', displayName: "Skype", width: "100"},
            { field: 'contactNumber', displayName: "Contact Number", width: "100"},
            { field: 'bookingPerson', displayName: "Booking Person", width: "150"},
            { field: 'creationDate', displayName: "Creation Date",  width: "200",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm\''},
            { field: 'createdBy', displayName: "By",  width: "50"},
            { field: 'linkId', displayName: "Link ID",  width: "50"}
        ];



        this.isAdmin = function(){
            return this.user.userType.indexOf("RediMed") >= 0;
        };

        function dateformat(date,format){

            //console.log(mysqlDate(date));
            var dateAfterFormat = moment(mysqlDate(date)).format(format);
            if(dateAfterFormat =="Invalid date")
                return "";
            else
                return dateAfterFormat;
        };

        this.gridOptions = {
            enableSorting: true,
            enableColumnResizing: true,
            enableFiltering: true,
            appScopeProvider: this,
            columnDefs: columnDefs,
            onRegisterApi: function( gridApi ) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {

                    //console.log(sortColumns);
                });
            },
            enableGridMenu: true,
            enableRowSelection: false,
            enableSelectAll: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'myFile.csv',
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from AdminEditBookingCtrl = " + msg);
            if( msg.indexOf("Refresh booking list successfully") >= 0 ){
                CompanyFactory.getCompany(function(data){
                    $log.debug("Refresh bookings, get company info");
                    toastr.success('The booking list has been refreshed !');
                    that.gridOptions.data = data.telehealthBookings;
                });
            }
        });

        this.refreshBooking = function(){
            $log.debug("will refresh booking ; get data from DB......");
            that.loading = true;
            CompanyFactory.refreshTelehealthBookingList(function(data){
                    $log.debug("refreshed booking ; get data from DB......");
                    that.gridOptions.data = data.telehealthBookings;
                    that.loading = false;
            });
        }

        CompanyFactory.getCompany(function(data){

            $log.debug("Make booking, get company info");
           // console.log(data);
            that.gridOptions.data = data.telehealthBookings;
            that.loading = false;
            packages = data.packages;// ==null? data.packages:data.allPackages;

        });

    }]);
