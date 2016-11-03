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
