/**
 * Created by Administrator on 2016/8/23 0023.
 */
angular.module('myApp.services', [])
    .service('homeServices', function ($http, $rootScope) {
        var lists = '';

        var myUrl = "http://www.phonegap100.com/appapi.php?a=getPortalList&catid=10&callback=JSON_CALLBACK";
        $http.jsonp(myUrl).success(
            function (data) {

                lists = data.result;
                $rootScope.$broadcast('homeServiceUpdate', lists);
            }
        ).error(function () {
            alert('失败');

        });

        return {
            getAll: function () {
                return lists;
            }

        };

        //$scope.showPopup = function() {
        //    $scope.data = {}
        //
        //    // 一个精心制作的自定义弹窗
        //    var myPopup = $ionicPopup.show({
        //        template: '<input type="password" ng-model="data.wifi">',
        //        title: 'Enter Wi-Fi Password',
        //        subTitle: 'Please use normal things',
        //        scope: $scope,
        //        buttons: [
        //            {text: 'Cancel'},
        //            {
        //                text: '<b>Save</b>',
        //                type: 'button-positive',
        //                onTap: function (e) {
        //                    if (!$scope.data.wifi) {
        //                        //不允许用户关闭，除非他键入wifi密码
        //                        e.preventDefault();
        //                    } else {
        //                        return $scope.data.wifi;
        //                    }
        //                }
        //            },
        //        ]
        //    });
        //    myPopup.then(function (res) {
        //        console.log('Tapped!', res);
        //    });
        //    $timeout(function () {
        //        myPopup.close(); //由于某种原因3秒后关闭弹出
        //    }, 3000);
        //
        //}


    })

    .service('newsServices', function ($http, $state, $rootScope) {
        var lists = '';
        var page = 1;
        var hasData = true;
        return {
            requesData: function () {
                /*jsonP请求*/
                var myUrl = "http://www.phonegap100.com/appapi.php?a=getPortalList&catid=20&page=" + page + "&callback=JSON_CALLBACK";
                $http.jsonp(myUrl).success(
                    function (data) {

                        if (data.result == '' || data.result.length < 20) {    /*判断数据是否请求完成*/
                            hasData = false;
                        }
                        if (lists != '') {
                            lists = lists.concat(data.result);
                            /*链接两个数组*/
                        } else {
                            lists = data.result;

                        }
                        //广播告诉 controller数据请求完成  你可以拿数据了
                        $rootScope.$broadcast('newsSevicesUpdata', lists);


                        page++;
                    }
                ).error(function () {
                    alert('shibai');

                });
            },

            getData: function () {
                return lists;
            },
            hasListData: function () { /*判断是否还有数据*/
                return hasData;
            }
        }


    })
    .service('NewsContentService', function ($http, $rootScope) {

        return {
            getOne: function (aid) {
                var item = '';

                var myUrl = "http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=" + aid + "&callback=JSON_CALLBACK";
                console.log(myUrl)
                $http.jsonp(myUrl).success(
                    function (data) {
                        item = data.result[0];
                        $rootScope.$broadcast('NewsContentServiceUpdate', item);
                    }
                ).error(function () {
                    alert('shibai');

                });

            }

        }

    })

    .service('forumServices', function ($http, $rootScope) {
        var forums = '';
        return {
            requesData: function () {
                /*jsonP请求*/
                var myUrl = "http://www.phonegap100.com/appapi.php?a=getThreadList&fid=2&page=1&callback=JSON_CALLBACK";
                $http.jsonp(myUrl).success(
                    function (data) {
                        forums = data.result;
                        console.log(data);
                        $rootScope.$broadcast('forumServiceUpdate', forums);
                    }
                ).error(function () {

                    alert('失败');

                });
            },
            getForum: function () {
                return forums;
            }

        }

    })

    .service('forumDetailServices', function ($http, $rootScope) {


        return {
            getTwo: function (tid) {
                var item = '';

                var myUrl = "http://www.phonegap100.com/appapi.php?a=getThreadContent&tid=" + tid + "&callback=JSON_CALLBACK";
                console.log(myUrl);

                $http.jsonp(myUrl).success(
                    function (data) {
                        item = data.result[0];
                        $rootScope.$broadcast('forumDetailServicesUpdate', item);
                    }
                ).error(function () {
                    alert('失败');

                });

            }

        }

    })

    .factory('loginStorage', function () {
        return {
            set: function (key, data) {
                return window.localStorage.setItem(key, window.JSON.stringify(data));
            },
            get: function (key) {

                return window.JSON.parse(window.localStorage.getItem(key));
            },
            remove: function (key) {
                return window.localStorage.removeItem(key);
            }
        };
    })