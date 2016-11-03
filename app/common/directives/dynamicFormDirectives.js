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
