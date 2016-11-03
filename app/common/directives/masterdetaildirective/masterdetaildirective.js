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