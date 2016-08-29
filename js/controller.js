/**
 * Created by Administrator on 2016/8/23 0023.
 */
angular.module('myApp.controller', ['myApp.services', 'ngResource'])
    .controller('homeController', function ($scope, $rootScope, $state, $ionicSlideBoxDelegate, $ionicActionSheet, $ionicPopup, $timeout, $resource, homeServices) {
        /*------------------------------------------------------------------*/
        /*ng-Resource的跨域请求*/
        var ApiUrl = 'http://www.phonegap100.com/appapi.php';

        var resource = $resource(ApiUrl, {}, {
            getData: {
                method: 'get',
                params: {
                    a: 'getPortalList',
                    catid: '@catid', /*值可变*/
                    page: '@page'      /*值可变*/

                },
                timeout: 20000
            }, getCateData: {
                method: 'get',
                params: {
                    a: 'getPortalCate'

                },
                timeout: 20000
            }, getThreadCate: {
                method: 'get',
                params: {
                    a: 'getThreadCate'

                },
                timeout: 20000
            }

        });

        resource.getData({catid: 20, page: 1}, function (r) {
            console.log(r.result[2].title);
        });


        resource.getCateData({}, function (r) {
            console.log(r.result[1].catid);
        });


        /*ng-Resource的跨域请求*/

        /*------------------------------------------------------------------*/
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = '';
            /*显示下边的 tab菜单*/
            console.log('beforeEnter');

        });

        $scope.$on('$ionicView.afterEnter', function () {

            console.log('afterEnter');

        }, false);

        $scope.$on('homeServiceUpdate', function (event, data) {   /*接收广播*/
            $scope.lists = homeServices.getAll();
        });

        $scope.go_next = function (index) {
            $ionicSlideBoxDelegate.next();
        };
        //轮播图

        $timeout(function () {

            $scope.items = [
                'img/01.png',
                'img/02.png',
                'img/03.png',
                'img/04.png',
                'img/05.png'

            ];
            $ionicSlideBoxDelegate.update();      //更新ionic SlideBox
            console.log($scope.items);
            //delegate-handle="slideBox"
            $ionicSlideBoxDelegate.$getByHandle("slideBox").loop(true);

        }, 300);


        $scope.flag = {
            showDelete: false,
            showReorder: false

        };

        $scope.item_Delete = function (key) {
            $scope.lists.splice(key, 1)
        };

        /*调整item的位置*/
        $scope.move_item = function (list, fromIndex, toIndex) {

            $scope.lists.splice(fromIndex, 1);
            $scope.lists.splice(toIndex, 0, list);

        };


        //底部弹出菜单

        $scope.show = function () {

            // 显示操作表
            $ionicActionSheet.show({
                buttons: [
                    {text: '<b>分享文章</b>'},
                    {text: '移动...'},
                    {text: '添加...'},
                    {text: '删除..'}
                ],
                destructiveText: 'Delete',
                titleText: '操作当前内容',
                cancelText: '取消',
                buttonClicked: function (index) {
                    console.log('执行了操作' + index);
                    return true;
                }
            });

        };

        $scope.showPopup = function () {
            $scope.data = {};

            // 一个精心制作的自定义弹窗
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.wifi) {
                                //不允许用户关闭，除非他键入wifi密码
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //由于某种原因3秒后关闭弹出
            }, 3000);

        }


        //这是另外一个弹窗

        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Consume Ice Cream',
                template: 'Are you sure you want to eat this ice cream?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // 一个提示对话框
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Don\'t eat that!',
                template: 'It might taste good'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };


    })
    .controller('newsController', function ($scope, $rootScope, $state, newsServices) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = '';
            /*显示下边的 tab菜单*/
            console.log('beforeEnter');

        });

        $scope.$on('$ionicView.afterEnter', function () {

            console.log('afterEnter');

        }, false);


        $scope.$on('newsSevicesUpdata', function (event, data) {

            $scope.list = newsServices.getData();
            /*数据*/

            /*广播要放在数据绑定以后*/
            $scope.$broadcast('scroll.infiniteScrollComplete');

        })

        //加载更多

        $scope.loadMore = function () {
            newsServices.requesData();
            /*异步请求   所以$broadcast需要写到数据绑定以后*/
        };

        //判断是否有数据
        $scope.hasListData = function () {
            return newsServices.hasListData();
        };

        $scope.toHome = function () {
            $state.go('tab.home')
        };

        $scope.toforum = function () {
            $state.go('tab.forum')
        };

    })
    .controller('newsContentController', function ($scope, $rootScope, $state, $stateParams, NewsContentService, $sce) {
        $rootScope.hideTabs = 'tabs-item-hide';
        /*隐藏下边的 tab菜单*/

        //$scope.$on('$destroy',function(){
        //    console.log('$destroy');
        //    $rootScope.hideTabs = ' ';
        //
        //})

        var aid = $stateParams.aid;
        $scope.isLoading = true;
        NewsContentService.getOne(aid);

        $scope.$on('NewsContentServiceUpdate', function (event, data) {   /*接收广播*/

            $scope.item = data;

            $scope.item.content = $sce.trustAsHtml($scope.item.content);

            $scope.isLoading = false;
        });
        $scope.goHome = function () {
            $state.go('tab.home');
        };


        $scope.swipeRight = function () {
            $state.go('tab.news')
        }

    })

    .controller('forumController', function ($scope, $rootScope, $state, forumServices) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.hideTabs = '';
            /*显示下边的 tab菜单*/
            console.log('beforeEnter');

        });

        $scope.$on('$ionicView.afterEnter', function () {

            console.log('afterEnter');

        }, false);

        forumServices.requesData();

        $scope.$on('forumServiceUpdate', function (event, data) {   /*接收广播*/
            $scope.forums = forumServices.getForum();

        });

        $scope.toNews = function () {
            $state.go('tab.news')
        };

        $scope.toUser = function () {
            $state.go('tab.user')
        };
    })
    .controller('forumDetailController', function ($scope, $rootScope, $state, $stateParams, forumDetailServices, $sce) {
        $rootScope.hideTabs = 'tabs-item-hide';
        /*隐藏下边的 tab菜单*/
        /*传入每个回帖的参数*/
        var tid = $stateParams.tid;
        $scope.isLoading = true;
        forumDetailServices.getTwo(tid);

        $scope.$on('forumDetailServicesUpdate', function (event, data) {   /*接收广播*/

            //$scope.item=JSON.stringify(data);
            $scope.item = data;
            $scope.subject = data.subject;

            $scope.item = $sce.trustAsHtml($scope.item.message);

            $scope.isLoading = false;
        });
        $scope.goHome = function () {
            $state.go('tab.home');
        };

        $scope.swipeRight = function () {
            $state.go('tab.news')
        };

    })

    .controller('userController', function ($scope, $state, $ionicPopup, $ionicPopover, $ionicModal, loginStorage) {
        //注册页面
        $ionicModal.fromTemplateUrl('templates/create.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModalc = function () {
            $scope.modal.show();
        };

        $scope.closeModalc = function () {
            $scope.modal.hide();
        };

        //登录页面
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalz = modal;
        });

        $scope.openModalz = function () {
            $scope.modalz.show();
        };
        $scope.closeModalz = function () {
            $scope.modalz.hide();
        };


        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // 当隐藏的模型时执行动作
        $scope.$on('modalc.hide', function () {

        });
        // 当移动模型时执行动作
        $scope.$on('modalc.removed', function () {
            // 执行动作
        });

        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // 当隐藏的模型时执行动作
        $scope.$on('modal.hide', function () {
            // 执行动作
        });
        // 当移动模型时执行动作
        $scope.$on('modal.removed', function () {
            // 执行动作
        });

        //$ionicPopover.fromTemplateUrl("ez-popover.html", {
        //        scope: $scope
        //    })
        //    .then(function(popover){
        //        $scope.popover = popover;
        //    })
        //
        //
        ////$event
        //$scope.openPopover = function($event) {
        //
        //    // console.log($event);
        //    $scope.popover.show($event);
        //};
        //$scope.closePopover = function() {
        //    $scope.popover.hide();
        //};
        ////销毁事件回调处理：清理popover对象
        //$scope.$on("$destroy", function() {
        //    $scope.popover.remove();
        //});
        //// 隐藏事件回调处理
        //$scope.$on("popover.hidden", function() {
        //    // Execute action
        //
        //
        //});
        ////删除事件回调处理
        //$scope.$on("popover.removed", function() {
        //    // Execute action
        //});


        $scope.status = "点击上面的上栏目，有彩蛋！！";

        $scope.toForum = function () {
            $state.go('tab.forum')
        };

        //输入提示框
        $scope.showPrompt = function () {

            $ionicPopup.prompt({
                    title: "据说注册之后能涨姿势",
                    template: "不管你信不信，反正我是信了！"
                })
                .then(function (res) {
                    $scope.status = "真的是哦，不注册你就要后悔啊！";
                });
        };

        // 确认弹出框
        $scope.showConfirm = function () {
            $ionicPopup.confirm({
                    title: "美女客服正在接通",
                    template: "你确定只要美女客服吗？",
                    okText: "OK"
                })
                .then(function (res) {
                    if (res) {
                        $scope.status = "这里的美女正忙，候着吧！";
                    } else {
                        $scope.status = "我们这全是美女哦！";
                    }
                });

        };

        // 显示定制弹出框
        $scope.showPopup = function () {
            $scope.data = {}

            // 调用$ionicPopup弹出定制弹出框
            $ionicPopup.show({
                    template: "<input type='text' ng-model='data.txt'>",
                    title: "请输入意见",
                    subTitle: "帅哥美女来服务你",
                    scope: $scope,
                    buttons: [
                        {text: "取消"},
                        {
                            text: "<b>保存</b>",
                            type: "button-positive",
                            onTap: function (e) {
                                return $scope.data.txt;
                            }
                        }
                    ]
                })
                .then(function (res) {

                    if (!res) {
                        $scope.status = "你没有输入反馈，重新输入—_~";
                    } else {
                        $scope.status = ["您的反馈内容是", ":", res].join(" ");
                    }

                });
        };

        //初始化登录的键值对
        var user = {};
        $scope.user = {
            'userName': '',
            'passWord': ''
        };

        var newUser = {};
        $scope.newUser = {
            'userName': '',
            'email': '',
            'pwd': '',
            'repwd': ''
        };

        //注册时存储键值对到localStrorage
        $scope.create = function (user) {

            newUser.userName = $scope.newUser.userName;
            newUser.email = $scope.newUser.email;
            newUser.pwd = $scope.newUser.pwd;
            newUser.repwd = $scope.newUser.repwd;
            console.log(newUser);
            loginStorage.set('', newUser);
        };
        //设置登录前后的显示状态
        $scope.noLogin = true;
        $scope.isLogin = false;
        //登录时存储键值对到localStrorage
        $scope.login = function () {
            //获取输入的账号密码的值
            user.userName = $scope.user.userName;
            user.passWord = $scope.user.passWord;
            loginStorage.get('', newUser);
            console.log(newUser);
            if (user.userName == newUser.userName && newUser.pwd == user.passWord) {
                $scope.noLogin = false;
                $scope.isLogin = true;
            } else {
                alert('请重新登录！');
            }
        };

        //退出登录

        $scope.logout = function () {
            $scope.noLogin = true;
            $scope.isLogin = false;
        }
    });


