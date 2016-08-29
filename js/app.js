/**
 * 这是模板
 */
var app= angular.module('myApp', ['ionic','myApp.controller',"myApp.services"]);
//配置路由
    app.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
        /*不同平台的默认样式配置*/

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        $ionicConfigProvider.backButton.previousTitleText(false);

        /*配置路由*/

        $stateProvider.state('tab',{
            url: '/tab',
            templateUrl: 'templates/tabs.html',
            abstract: true
        })
            .state('tab.home',{
                url: '/home',
                views: {    /*定义视图展示的页面*/
                    'tab-home': {
                        templateUrl: 'templates/home.html',
                        controller: 'homeController'
                    }
                }
            })

            .state('tab.news',{
                url: '/news',
                views: {    /*定义视图展示的页面*/
                    'tab-news': {
                        templateUrl: 'templates/news.html',
                        controller: 'newsController'
                    }
                }
            })

            .state('tab.news_content',{
                url: '/news_content/:aid',
                views: {    /*定义视图展示的页面*/
                    'tab-news': {
                        templateUrl: 'templates/news_content.html',
                        controller:'newsContentController'
                    }
                }
            })
            /*论坛*/
            .state('tab.forum',{
                url: '/forum',
                views: {    /*定义视图展示的页面*/
                    'tab-forum': {
                        templateUrl: 'templates/forum.html',
                        controller:'forumController'
                    }
                }
            })

            .state('tab.forum_detail',{
                url: '/forum_detail/:tid',
                views: {    /*定义视图展示的页面*/
                    'tab-forum': {
                        templateUrl: 'templates/forum_detail.html',
                        controller:'forumDetailController'
                    }
                }
            })

            .state('tab.user',{
                url: '/user',
                views: {    /*定义视图展示的页面*/
                    'tab-user': {
                        templateUrl: 'templates/user.html',
                        controller:'userController'
                    }
                }
            });
        /*找不到路由跳转的默认*/
            $urlRouterProvider.otherwise('/tab/home')


    });

