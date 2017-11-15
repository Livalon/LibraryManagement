(function () {
    var app, deps;
    deps = ['treeGrid'];
    app = angular.module('treeGridTest', deps);
     // alert("before controller");
   // console.log(app)
    app.controller('treeGridController',function($scope) {
        // alert("in controller");
        //console.log(app);
        var tree;
        $scope.metalId = 1;
        $scope.my_tree = tree = {};
        $scope.expanding_property = {
            field: "Name",
            displayName: "矿体名称"
        };
        if (type == 1) {
            $scope.col_defs = [
                {
                    field: "OreAmountReCalc",
                    displayName: "矿石量"
                },
                {
                    field: "GradeReCalc",
                    displayName: "品位"
                },
                {
                    field: "ReCalculate",
                    //field:"重算增减"
                    displayName: "重算增减"
                }
            ];
        }
        else if (type == 2) {
            $scope.col_defs = [
                {
                    field: "OreAmountExp",
                    displayName: "矿石量"
                },
                {
                    field: "GradeExp",
                    displayName: "品位"
                },
                {
                    field: "Exploration",
                    displayName: "勘探增减"
                }
            ];
        }
        else if (type == 3) {
            $scope.col_defs = [
                {
                    field: "OreAmountMined",
                    displayName: "矿石量"
                },
                {
                    field: "GradeMined",
                    displayName: "品位"
                },
                {
                    //field: "Mined",
                    field: "Exploitation",
                    displayName: "开采量"
                }
            ];
        }
        else if (type == 4) {
            $scope.col_defs = [
                {
                    field: "OreAmountLoss",
                    displayName: "矿石量"
                },
                {
                    field: "GradeLoss",
                    displayName: "品位"
                },
                {
                    field: "Loss",
                    displayName: "损失量"
                }
            ];
        }
        else if (type == 5) {
            $scope.col_defs = [
                {
                    field: "OreAmountRetain",
                    displayName: "矿石量"
                },
                {
                    field: "GradeRetain",
                    displayName: "品位"
                },
                {
                    field: "MetalAmount2",
                    displayName: "保有资源储量"
                }
            ];
        }
        else if (type == 6) {
            $scope.col_defs = [
                {
                    field: "OreAmountAscertain",
                    displayName: "矿石量"
                },
                {
                    field: "GradeAscertain",
                    displayName: "品位"
                },
                {
                    // field: "Ascertain",
                    field: "Accumulative_ascertain2",
                    displayName: "探明资源储量"
                }
            ];
        }
        console.log(type);

        refreshGrid();



        $scope.change = function () {

           refreshGrid();

        };


        $scope.my_tree_handler = function (branch) {
            console.log('you clicked on', branch)
        }


        function getTree(data, primaryIdName, parentIdName) {
            if (!data || data.length == 0 || !primaryIdName || !parentIdName)
                return [];

            var tree = [],
                rootIds = [],
                item = data[0],
                primaryKey = item[primaryIdName],
                treeObjs = {},
                parentId,
                parent,
                len = data.length,
                i = 0;

            while (i < len) {
                item = data[i++];
                primaryKey = item[primaryIdName];
                treeObjs[primaryKey] = item;
                parentId = item[parentIdName];

                if (parentId) {
                    parent = treeObjs[parentId];

                    if (parent.children) {
                        parent.children.push(item);
                    } else {
                        parent.children = [item];
                    }
                } else {
                    rootIds.push(primaryKey);
                }
            }

            for (var i = 0; i < rootIds.length; i++) {
                tree.push(treeObjs[rootIds[i]]);
            };

            return tree;
        }


        function refreshGrid() {
            var rawTreeData = [];
            var myTreeData = [];
            console.log("获取批次呀："+batchId);
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/SixEstimate", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                //url: "./json/data-2.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                //data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                //data: { data: 1, objectId: objectId, objectType: objectType, option: 1, MetalId: $scope.metalId }, //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                data: { type: type, option: 1, MetalId: 4,batchId:batchId},
                async: false,
                success: function (res) { //回调函数
                    if (res != null) {
                       // console.log(res);
                        if (res.length == 0) {
                            alert("该批次不存在块段或者没有估值");
                        }
                        rawTreeData = res;
                        myTreeData = getTree(rawTreeData, 'ObjectId', 'ParentId');
                        $scope.tree_data = myTreeData;
                    }
                },
                error: function () {
                    alert("error")
                }
            });
        }
    });
    // alert("after controller");
}).call(this);


function changeBatch() {
    batchId=timeId.options[timeId.selectedIndex].value;
    var batch=timeId.options[timeId.selectedIndex].text;
    console.log(batchId+"选中的批次");
    angular.element(document).ready(function() {
        angular.bootstrap(document.getElementsByClassName("box-body"), ['treeGridTest']);

    });

}






