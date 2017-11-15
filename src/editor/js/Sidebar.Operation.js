Sidebar.Operation = function (editor) {

    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setDisplay('none');

    container.addStatic(new UI.Text('操作'));
    container.add(new UI.Break());

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add(buttons);
    container.add(params);

    //////////////////////////////////////////////////////////////////////////////////////郭佳宁：修改选定物体的操作
    signals.objectSelected.add(function (object) {
        var objectType = editor.getObjectType(object);
        if (objectType == "auline") {
            container.setDisplay('none');
        }
        else {
            updateUI();
        }

    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function updateUI() {
        container.setDisplay('none');
        buttons.clear();
        params.clear();
        var object = editor.selected;
        var p_object = editor.p_selected;
        if (object !== null) {

            container.setDisplay('block');

            if (editor.getObjectType(object) === 'scene') {
                var delete_object = new UI.Button('删除全部辅助面').onClick(function () {
                    var shallowCopy = $.extend({}, object.children);
                    $.each(shallowCopy, function (i, v) {
                        if (v.obj_type === 'helper_plane') {
                            editor.removeObject(v);
                        }
                    });
                });
                buttons.add(delete_object);
            } else if (editor.getObjectType(object) === 'helper_plane') {
                var delete_object = new UI.Button('删除辅助面').onClick(function () {
                    editor.removeObject(object);
                });
                buttons.add(delete_object);
            } else {
                var delete_object = new UI.Button('删除').onClick(function () {
                    var post_data = {};
                    post_data.type = editor.getObjectType(object);
                    post_data.name = object.name;
                    post_data.cur_batch = editor.cur_batch + "";
                    post_data.id = object.obj_id || 0;
                    if (object.ori == undefined) {
                        object.ori = false;
                    }
                    post_data.ori = object.ori;
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/DeleteObject", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (res) {
                            if (res.result) {
                                editor.removeObject(object);
                                editor.select(null);
                            } else {
                                alert(res.message);
                            }

                        }
                    });

                });
                buttons.add(delete_object);
                var unload_object = new UI.Button('卸载').onClick(function () {
                    editor.removeObject(object);
                    editor.select(null);
                });
                buttons.add(unload_object);
            }
            //2016-04-25
            var delete_wells = new UI.Button('批量删除').onClick(function () {
                var post_data = {};
                post_data.name = editor.name;
                post_data.cur_batch = editor.cur_batch + "";
                $.ajax({
                    type: "POST",
                    contentType: "application/json", //WebService 会返回Json类型
                    url: "../getdata/WellInfo2.asmx/DeleteWells", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                    data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                    dataType: 'json',
                    success: function (res) {
                        if (res.deleted) {
                            $.each(res.ids, function (i, w) {
                                var well = editor.findByid(w);
                                editor.removeObject(well);
                            });

                        }
                        else {
                            alert(res.mess);
                        }
                    }
                });
            });
            buttons.add(delete_wells);
            if (editor.getObjectType(object) === 'line') {
                var line_type = editor.lineType(object);
                if (p_object != null && editor.getObjectType(p_object) === 'line' && p_object != object) {
                    var create_object = new UI.Button('最小面积法').onClick(function () {
                        var post_data = {};
                        post_data.alg = 1;
                        post_data.name = "link(" + p_object.name + "-" + object.name + ")_面";
                        post_data.line1 = p_object.geometry.vertices;
                        post_data.line2 = object.geometry.vertices;
                        post_data.cur_batch = editor.cur_batch + "";
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/WellInfo2.asmx/ConnectLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (object) {
                                var loader = new THREE.JSONLoader();
                                var geom = loader.parse(object);
                                var loadedMesh = editor.createMesh("0x999999", geom.geometry);
                                loadedMesh.ori_name = object.metadata.ori_name;
                                loadedMesh.name = object.metadata.object_name;
                                loadedMesh.obj_type = 'object';
                                loadedMesh.des = '';
                                loadedMesh.ori = true;
                                loadedMesh.leaf = true;
                                loadedMesh.obj_id = object.metadata.object_id;
                                //////////////////////////////////////////////////删除基础名相同的对象
                                var shallowCopy = $.extend({}, editor.scene.children);
                                $.each(shallowCopy, function (i, v) {
                                    if (v.obj_type === 'object' && v.ori_name.split("_")[0] === object.metadata.ori_name.split("_")[0]) {
                                        editor.removeObject(v);
                                    }
                                });
                                //////////////////////////////////////////////////
                                editor.addObject(loadedMesh);
                            }
                        });
                    });
                    buttons.add(create_object);

                    var create_object1 = new UI.Button('最小周长法').onClick(function () {
                        var post_data = {};
                        post_data.alg = 0;
                        post_data.name = "link(" + p_object.name + "-" + object.name + ")_周";
                        post_data.line1 = p_object.geometry.vertices;
                        post_data.line2 = object.geometry.vertices;
                        post_data.cur_batch = editor.cur_batch + "";
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/WellInfo2.asmx/ConnectLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (object) {
                                var loader = new THREE.JSONLoader();
                                var geom = loader.parse(object);
                                var loadedMesh = editor.createMesh("0x999999", geom.geometry);
                                loadedMesh.ori_name = object.metadata.ori_name;
                                loadedMesh.name = object.metadata.object_name;
                                loadedMesh.obj_type = 'object';
                                loadedMesh.des = '';
                                loadedMesh.ori = true;
                                loadedMesh.leaf = true;
                                loadedMesh.obj_id = object.metadata.object_id;
                                //////////////////////////////////////////////////删除基础名相同的对象
                                var shallowCopy = $.extend({}, editor.scene.children);
                                $.each(shallowCopy, function (i, v) {
                                    if (v.obj_type === 'object' && v.ori_name.split("_")[0] === object.metadata.ori_name.split("_")[0]) {
                                        editor.removeObject(v);
                                    }
                                });
                                //////////////////////////////////////////////////
                                editor.addObject(loadedMesh);
                            }
                        });
                    });
                    buttons.add(create_object1);

                }
                var end_close = new UI.Button('封闭').onClick(function () {
                    var post_data = {};
                    post_data.type = 0;
                    post_data.name = "close(" + object.name + ")_封";
                    post_data.line = object.geometry.vertices;
                    post_data.p_director = director_pl.getValue();
                    post_data.f_distance = start_size.getValue();
                    post_data.b_distance = end_size.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.angle = angle.getValue();
                    post_data.pitch = pitch.getValue();
                    post_data.closed = closed.getValue();
                    post_data.taper_Line = taper_Line.getValue();
                    post_data.num_point = num_point.getValue();
                    post_data.cur_batch = editor.cur_batch + "";
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/CloseLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (object) {
                            var loader = new THREE.JSONLoader();
                            var geom = loader.parse(object);
                            var loadedMesh = editor.createMesh("0x999999", geom.geometry);
                            loadedMesh.ori_name = object.metadata.ori_name;
                            loadedMesh.name = object.metadata.object_name;
                            loadedMesh.obj_type = 'object';
                            loadedMesh.des = '';
                            loadedMesh.ori = true;
                            loadedMesh.leaf = true;
                            loadedMesh.obj_id = object.metadata.object_id;
                            //////////////////////////////////////////////////删除基础名相同的对象
                            var shallowCopy = $.extend({}, editor.scene.children);
                            $.each(shallowCopy, function (i, v) {
                                if (v.obj_type === 'object' && v.ori_name.split("_")[0] === object.metadata.ori_name.split("_")[0]) {
                                    editor.removeObject(v);
                                }
                            });
                            //////////////////////////////////////////////////
                            editor.addObject(loadedMesh);

                        }
                    });
                });
                buttons.add(end_close);
                var end_plane = new UI.Button('平推').onClick(function () {
                    var post_data = {};
                    post_data.type = 1;
                    post_data.name = "close(" + object.name + ")_平";
                    post_data.line = object.geometry.vertices;
                    post_data.p_director = director_pl.getValue();
                    post_data.f_distance = start_size.getValue();
                    post_data.b_distance = end_size.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.angle = angle.getValue();
                    post_data.pitch = pitch.getValue();
                    post_data.closed = closed.getValue();
                    post_data.taper_Line = taper_Line.getValue();
                    post_data.num_point = num_point.getValue();
                    post_data.cur_batch = editor.cur_batch + "";
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/CloseLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (object) {
                            var loader = new THREE.JSONLoader();
                            var geom = loader.parse(object);
                            var loadedMesh = editor.createMesh("0x999999", geom.geometry);
                            loadedMesh.ori_name = object.metadata.ori_name;
                            loadedMesh.name = object.metadata.object_name;
                            loadedMesh.obj_type = 'object';
                            loadedMesh.des = '';
                            loadedMesh.ori = true;
                            loadedMesh.leaf = true;
                            loadedMesh.obj_id = object.metadata.object_id;
                            //////////////////////////////////////////////////删除基础名相同的对象
                            var shallowCopy = $.extend({}, editor.scene.children);
                            $.each(shallowCopy, function (i, v) {
                                if (v.obj_type === 'object' && v.ori_name.split("_")[0] === object.metadata.ori_name.split("_")[0]) {
                                    editor.removeObject(v);
                                }
                            });
                            //////////////////////////////////////////////////
                            editor.addObject(loadedMesh);

                        }
                    });
                });
                buttons.add(end_plane);
                var end_point = new UI.Button('尖推').onClick(function () {
                    var post_data = {};
                    post_data.type = 2;
                    post_data.name = "close(" + object.name + ")_尖";
                    post_data.line = object.geometry.vertices;
                    post_data.p_director = director_pl.getValue();
                    post_data.f_distance = start_size.getValue();
                    post_data.b_distance = end_size.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.angle = angle.getValue();
                    post_data.pitch = pitch.getValue();
                    post_data.closed = closed.getValue();
                    post_data.taper_Line = taper_Line.getValue();
                    post_data.num_point = num_point.getValue();
                    post_data.cur_batch = editor.cur_batch + "";
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/CloseLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (object) {
                            var loader = new THREE.JSONLoader();
                            var geom = loader.parse(object);
                            var loadedMesh = editor.createMesh("0x999999", geom.geometry);
                            loadedMesh.ori_name = object.metadata.ori_name;
                            loadedMesh.name = object.metadata.object_name;
                            loadedMesh.obj_type = 'object';
                            loadedMesh.des = '';
                            loadedMesh.ori = true;
                            loadedMesh.leaf = true;
                            loadedMesh.obj_id = object.metadata.object_id;
                            //////////////////////////////////////////////////删除基础名相同的对象
                            var shallowCopy = $.extend({}, editor.scene.children);
                            $.each(shallowCopy, function (i, v) {
                                if (v.obj_type === 'object' && v.ori_name.split("_")[0] === object.metadata.ori_name.split("_")[0]) {
                                    editor.removeObject(v);
                                }
                            });
                            //////////////////////////////////////////////////
                            editor.addObject(loadedMesh);

                        }
                    });
                });
                buttons.add(end_point);
                var end_line = new UI.Button('楔推').onClick(function () {
                    var post_data = {};
                    post_data.type = 3;
                    post_data.name = "close(" + object.name + ")_楔";
                    post_data.line = object.geometry.vertices;
                    post_data.p_director = director_pl.getValue();
                    post_data.f_distance = start_size.getValue();
                    post_data.b_distance = end_size.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.director = director_pl.getValue();
                    post_data.angle = angle.getValue();
                    post_data.pitch = pitch.getValue();
                    post_data.closed = closed.getValue();
                    post_data.taper_Line = taper_Line.getValue();
                    post_data.num_point = num_point.getValue();
                    post_data.cur_batch = editor.cur_batch + "";
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/CloseLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (object) {
                            var loader = new THREE.JSONLoader();
                            var geom = loader.parse(object);
                            var loadedMesh = editor.createMesh("0x999999", geom.geometry);
                            loadedMesh.ori_name = object.metadata.ori_name;
                            loadedMesh.name = object.metadata.object_name;
                            loadedMesh.obj_type = 'object';
                            loadedMesh.des = '';
                            loadedMesh.ori = true;
                            loadedMesh.leaf = true;
                            loadedMesh.obj_id = object.metadata.object_id;
                            //////////////////////////////////////////////////删除基础名相同的对象
                            var shallowCopy = $.extend({}, editor.scene.children);
                            $.each(shallowCopy, function (i, v) {
                                if (v.obj_type === 'object' && v.ori_name.split("_")[0] === object.metadata.ori_name.split("_")[0]) {
                                    editor.removeObject(v);
                                }
                            });
                            //////////////////////////////////////////////////
                            editor.addObject(loadedMesh);

                        }
                    });
                });
                buttons.add(end_line);
                if (line_type == 'close' && p_object != null && editor.getObjectType(p_object) === 'object' && editor.objectType(p_object) == 'leaf') {
                    var create_plane = new UI.Button('剪裁矿体"' + p_object.name + '"').onClick(function () {
                        var post_data = {};
                        post_data.linetype = line_type;
                        post_data.block_id = p_object.obj_id || 0;
                        post_data.line = object.geometry.vertices;
                        post_data.cur_batch = editor.cur_batch + "";
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/WellInfo2.asmx/SplitBlock", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (objects) {
                                editor.removeObject(p_object);
                                ////////////////////////////////////////////////////////////
                                var loader = new THREE.JSONLoader();
                                $.each(objects, function (i, object) {
                                    var geom = loader.parse(object);
                                    var loadedMesh = editor.createMesh(object.metadata.object_color, geom.geometry);
                                    loadedMesh.ori_name = object.metadata.ori_name;
                                    loadedMesh.name = object.metadata.object_name;
                                    loadedMesh.obj_type = 'object';
                                    loadedMesh.ori = (object.metadata.ori === 'true');
                                    loadedMesh.leaf = (object.metadata.leaf === 'true');
                                    loadedMesh.des = object.metadata.object_des;
                                    loadedMesh.obj_id = object.metadata.object_id;
                                    editor.addObject(loadedMesh);
                                    if (object.metadata.parent != undefined) {
                                        editor.parent(loadedMesh, editor.findByObjId(object.metadata.parent));
                                        //editor.signals.objectChanged.dispatch(loadedMesh);
                                    }
                                });
                            }
                        });
                    });
                    buttons.add(create_plane);
                }
                //////////////////////////////////////////////////////////////////////////郭佳宁：增加节点
                var add_point = new UI.Button('增加节点').onClick(function () {
                    signals.operModeChanged.dispatch('add_point'); //发送增加节点的信号，在viewport中定义具体的操作
                });
                buttons.add(add_point);
                ////////////////////////////////////////////////////////////////////////////////////////////

                //////////////////////////////////////////////////////////////////////////郭佳宁:删除节点
                var delete_point = new UI.Button('删除节点').onClick(function () {
                    signals.operModeChanged.dispatch('dele_point'); //发送删除节点的信号，在viewport中定义具体的操作
                });
                buttons.add(delete_point);
                ////////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////郭佳宁:移动节点


                var drag_point = new UI.Button('移动节点').onClick(function () {
                    signals.operModeChanged.dispatch('drag_point'); //发送移动节点的信号，在viewport中定义具体的操作
                });
                buttons.add(drag_point);
                ////////////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////郭佳宁：删除线段
                if (editor.lineType(object) != "segment") {
                    //删除线段
                    var delete_line = new UI.Button('删除线段').onClick(function () {
                        signals.operModeChanged.dispatch('dele_line'); //发送删除节点的信号，在viewport中定义具体的操作
                    });
                    buttons.add(delete_line);
                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                }
                ///////////////////////////////////////////////////////////////////////////郭佳宁：点隔断模式
                var cut_point = new UI.Button('点隔断').onClick(function () {
                    signals.operModeChanged.dispatch('cut_point');
                });
                buttons.add(cut_point);
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////郭佳宁：线隔断模式
                var cut_line = new UI.Button('线隔断').onClick(function () {
                    signals.operModeChanged.dispatch('cut_line');
                });
                buttons.add(cut_line);
                ////////////////////////////////////////////////////////////////////////////////////////////
                if (editor.lineType(object) == "open" || editor.lineType(object) == "segment") {
                    //////////////////////////////////////////////////////////////////////////郭佳宁：线延续模式
                    var continue_line = new UI.Button('线延续').onClick(function () {

                        signals.operModeChanged.dispatch('draw_line');
                    });
                    buttons.add(continue_line);
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////////////////////////////////////////////////////郭佳宁：线闭合模式
                    var close_line = new UI.Button('线闭合').onClick(function () {
                        if (object.geometry.vertices.length < 2) {
                            editor.removeObject(object);
                        } else {
                            object.geometry.vertices.push(object.geometry.vertices[0]);
                            object.geometry.computeBoundingSphere();

                            //saveNewLine
                            var post_data = {};
                            post_data.id = object.obj_id || 0;
                            post_data.line_name = object.name;
                            post_data.cur_batch = editor.cur_batch + "";
                            post_data.points = object.geometry.vertices;
                            $.ajax({
                                type: "POST", //访问WebService使用Post方式请求
                                contentType: "application/json", //WebService 会返回Json类型
                                url: "../getdata/WellInfo2.asmx/SaveLine", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                                data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                                dataType: 'json',
                                success: function (res) {
                                    if (res.result) {
                                        if (res.line_id != undefined) {
                                            object.obj_id = res.line_id;
                                        }
                                        editor.setObjectName(object, res.line_name);
                                        object.name = res.line_name;
                                    } else {
                                        editor.removeObject(object);
                                        alert(res.message);
                                    }

                                },
                                error: function (res) {

                                },
                                complete: function (res) {

                                }
                            });
                        }
                    });
                    buttons.add(close_line);
                    ////////////////////////////////////////////////////////////////////////////////////////////////////// 
                }

                //添加连接线圈正反向
                //////////////////////////////////////////////////////////////////////////郭佳宁：非闭合线圈正方向操作
                var isReverseFlag = false;
                var line_director = new UI.Panel();
                if (editor.getObjectType(object) === 'line' && (editor.lineType(object) == "open" || editor.lineType(object) == "segment") && (p_object != null && (editor.lineType(p_object) == "open" || editor.lineType(p_object) == "segment")) && editor.keyPressCode == 17) {
                    var forward = new UI.Checkbox(true).onChange(function () {
                        if (forward.dom.checked == true) {
                            isReverseFlag = false;
                            opposite.dom.checked = false;
                        }
                        else {
                            isReverseFlag = true;
                            opposite.dom.checked = true;
                        }
                        console.log("forward");
                        console.log(forward.dom.checked);
                        console.log("opposite");
                        console.log(opposite.dom.checked);
                        isReverseFlag = false;
                    });
                    line_director.add(forward);
                    line_director.add(new UI.Text('正向'));

                    var opposite = new UI.Checkbox(false).onChange(function () {
                        if (opposite.dom.checked == true) {
                            forward.dom.checked = false;
                            isReverseFlag = true;
                        }
                        else {
                            isReverseFlag = false;
                            forward.dom.checked = true;
                        }

                        console.log("opposite");
                        console.log(opposite.dom.checked);
                        console.log("forward");
                        console.log(forward.dom.checked);
                    });
                    line_director.add(opposite);
                    line_director.add(new UI.Text('反向'));
                    params.add(line_director);
                    ////////////////////////////////////////////////////////////////////////郭佳宁：非闭合线圈连接
                    var combine_line = new UI.Button('合并').onClick(function () {
                        var geomType = 0;
                        if (isReverseFlag == true) {
                            geomType = 1;
                        }
                        else {
                            geomType = 0;
                        }
                        signals.lineCombined.dispatch(geomType);
                    });
                    buttons.add(combine_line);
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////郭佳宁：非闭合线圈连接
                    var link_line = new UI.Button('连接').onClick(function () {
                        var geomType = 0;
                        if (isReverseFlag == true) {
                            geomType = 1;
                        }
                        else {
                            geomType = 0;
                        }
                        signals.lineConnected.dispatch(geomType);
                    });
                    buttons.add(link_line);
                    ////////////////////////////////////////////////////////////////////////////////////////////
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////

                //添加参数面板
                var options = ['双向', '正向', '反向'];
                var director_panel = new UI.Panel();
                var director_pl = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px');
                director_panel.add(new UI.Text('方向').setWidth('90px'));
                director_panel.add(director_pl);
                params.add(director_panel);

                var start_size_panel = new UI.Panel();
                var start_size = new UI.Number().setWidth('150px');
                start_size_panel.add(new UI.Text('正向距离：').setWidth('90px'));
                start_size.setValue(20);
                start_size_panel.add(start_size);
                params.add(start_size_panel);

                var end_size_panel = new UI.Panel();
                var end_size = new UI.Number().setWidth('150px');
                end_size_panel.add(new UI.Text('反向距离：').setWidth('90px'));
                end_size.setValue(20);
                end_size_panel.add(end_size);
                params.add(end_size_panel);

                var angle_panel = new UI.Panel();
                var angle = new UI.Number().setWidth('150px');
                angle.setValue(90);
                angle_panel.add(new UI.Text('方位角：').setWidth('90px'));
                angle_panel.add(angle);
                params.add(angle_panel);

                var pitch_panel = new UI.Panel();
                var pitch = new UI.Number().setWidth('150px');
                pitch_panel.add(new UI.Text('倾角：').setWidth('90px'));
                pitch.setValue(0);
                pitch_panel.add(pitch);
                params.add(pitch_panel);


                var create_pl_panel = new UI.Panel();
                var closed = new UI.Checkbox();
                create_pl_panel.add(new UI.Text('是否封闭外推端：').setWidth('150px'));
                closed.setValue(true);
                create_pl_panel.add(closed);
                params.add(create_pl_panel);

                //                var scale_panel = new UI.Panel();
                //                var scale_v = new UI.Number().setWidth('150px');
                //                scale_panel.add(new UI.Text('缩放比例：').setWidth('90px'));
                //                scale_panel.add(scale_v);
                //                params.add(scale_panel);

                var short_panel = new UI.Panel();
                var taper_Line = new UI.Checkbox();
                short_panel.add(new UI.Text('是否短轴（楔推）：').setWidth('150px'));
                taper_Line.setValue(true);
                short_panel.add(taper_Line);
                params.add(short_panel);

                var point_num_panel = new UI.Panel();
                var num_point = new UI.Integer().setWidth('150px');
                num_point.setValue(2);
                point_num_panel.add(new UI.Text('楔推点数：').setWidth('90px'));
                point_num_panel.add(num_point);
                params.add(point_num_panel);



            } else if (editor.getObjectType(object) === 'object') {
                if (!object.ori && object.leaf) {
                    //////////////////////////////////////////////郭佳宁：删除矿体的面
                    //删除所选矿体的某个面
                    var delete_face = new UI.Button('删除面').onClick(function () {
                        signals.operModeChanged.dispatch('dele_face'); //发送删除节点的信号，在viewport中定义具体的操作
                    });
                    buttons.add(delete_face);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////郭佳宁：隐藏矿体的面
                    //删除所选矿体的某个面
                    var hide_face = new UI.Button('隐藏面').onClick(function () {
                        signals.operModeChanged.dispatch('hide_face'); //发送删除节点的信号，在viewport中定义具体的操作
                    });
                    buttons.add(hide_face);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////提取开口线
                    var open_line = new UI.Button('提取开口线').onClick(function () {
                        editor.getOpenLine(object);
                    });
                    buttons.add(open_line);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////有效性检查
                    var check_block = new UI.Button('矿体有效性检查').onClick(function () {
                        editor.checkBlock(object);
                    });
                    buttons.add(check_block);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////有效性检查
                    var export_dmf = new UI.Button('导出dmf文件').onClick(function () {
                        editor.exportDmf(object);
                    });
                    buttons.add(export_dmf);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////矿体优化
                    var clean_data = new UI.Button('矿体优化').onClick(function () {
                        editor.CleanData(object,jingdu_input.getValue());
                    });
                    buttons.add(clean_data);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////方向一致化
                    var normalize_data = new UI.Button('方向一致化').onClick(function () {
                        editor.NormalizeData(object);
                    });
                    buttons.add(normalize_data);
                    //////////////////////////////////////////////
                    //////////////////////////////////////////////打散
                    var dasan_object = new UI.Button('打散块段').onClick(function () {
                        editor.ExplodeObject(object);
                    });
                    buttons.add(dasan_object);
                    //////////////////////////////////////////////
                    var mesh_panel = new UI.Panel();
                    var mesh = new UI.Checkbox().onChange(function () {
                        object.children[1].visible = this.getValue();
                        signals.sceneGraphChanged.dispatch();
                    });
                    mesh_panel.add(new UI.Text('只显示框架：').setWidth('150px'));
                    mesh.setValue(object.children[1].visible);
                    mesh_panel.add(mesh);
                    params.add(mesh_panel);

                    var jingdu_panel = new UI.Panel();
                    var jingdu_input = new UI.Number().setWidth('90px');
                    jingdu_panel.add(new UI.Text('优化精度：').setWidth('150px'));
                    jingdu_input.setValue(0.01);
                    jingdu_panel.add(jingdu_input);
                    params.add(jingdu_panel);
                    /////////////////////////////////////////////////周静：添加勘探增减标志  20150713
                    var explored_panel = new UI.Panel();
                    var explored = new UI.Checkbox().onChange(function () {
                        var post_data = {};
                        post_data.explored = explored.getValue();
                        console.log("writeIsExplored:" + explored.getValue());
                        console.log("object:" + object.name);
                        post_data.cur_blockName = object.name;
                        post_data.cur_batch = editor.cur_batch;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "../getdata/WellInfo2.asmx/SetExplored",
                            data: $.toJSON(post_data),
                            dataType: 'json',
                            async: false,
                            success: function (res) {

                            },
                            error: function (res) {

                            }
                        });
                    });

                    function initExplored() {
                        var resIsExplored = {};
                        var post_data = {};
                        post_data.cur_blockName = object.name;
                        post_data.cur_batch = editor.cur_batch;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "../getdata/WellInfo2.asmx/GetExplored",
                            data: $.toJSON(post_data),
                            dataType: 'json',
                            async: false,
                            success: function (res) {
                                console.log("readIsExplored:" + res.Explored);
                                if (res.Explored == 0)
                                    resIsExplored = false;
                                else
                                    resIsExplored = true;
                            },
                            error: function (res) {

                            }
                        });
                        return resIsExplored;
                    }
                    explored_panel.add(new UI.Text('重新勘探：').setWidth('150px'));
                    var isExplored = initExplored();
                    console.log(isExplored);
                    explored.setValue(isExplored);
                    //console.log("initExplored: " + initExplored());
                    explored_panel.add(explored);
                    params.add(explored_panel);
                    //////////////////////////////////////////////////////////
                }
            } else if (editor.getObjectType(object) === 'helper_plane') {
                var focus_plane = new UI.Button('投影到工作面').onClick(function () {
                    var target = [object.position.x, object.position.y, object.position.z];
                    signals.helpPlaneChanged.dispatch(target, object.obj_width, object.obj_point1, object.obj_point2, plane_front.getValue(), plane_back.getValue());
                });
                buttons.add(focus_plane);
                var back_plane = new UI.Button('反向查看工作面').onClick(function () {
                    //var target = [object.position.x, object.position.y, object.position.z];
                    //signals.helperPlaneReverse.dispatch(object.obj_height, object.obj_point1, object.obj_point2);
                    ////////////////////////////////////////////////////////////////周静：修改反向查看工作面bug 20150601
                    signals.helperPlaneReverse.dispatch();
                    /////////////////////////////////////////////////////////////////////////////////////////////////////
                });
                buttons.add(back_plane);
                var exit_plane = new UI.Button('退出工作面').onClick(function () {
                    //var target = [object.position.x, object.position.y, object.position.z];
                    signals.helperPlaneReturn.dispatch();
                });
                buttons.add(exit_plane);

                var helper_plane_up = new UI.Button('工作面↑移动').onClick(function () {
                    var obj = editor.selected;
                    if (obj.obj_type === 'helper_plane') {
                        obj.position.y = obj.position.y + helper_plane_dis.getValue();
                        signals.helperPlaneUpDown.dispatch('up', helper_plane_dis.getValue());
                    }
                });
                buttons.add(helper_plane_up);
                var helper_plane_down = new UI.Button('工作面↓移动').onClick(function () {
                    var obj = editor.selected;
                    if (obj.obj_type === 'helper_plane') {
                        obj.position.y = obj.position.y - helper_plane_dis.getValue();
                        signals.helperPlaneUpDown.dispatch('down', helper_plane_dis.getValue());
                    }
                });
                buttons.add(helper_plane_down);
                //                var helper_plane_add = new UI.Button('工作面+宽度').onClick(function () {
                //                    var obj = editor.selected;
                //                    if (obj.obj_type === 'helper_plane') {
                //                        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width + helper_plane_change.getValue(), obj.geometry.parameters.height, obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
                //                        var material = obj.material;
                //                        var mesh = new THREE.Mesh(geometry, material);
                //                        mesh.rotation.x = obj.rotation.x;
                //                        mesh.rotation.y = obj.rotation.y;
                //                        mesh.rotation.z = obj.rotation.z;
                //                        mesh.position = obj.position;
                //                        mesh.name = obj.name;
                //                        editor.removeObject(obj);
                //                        mesh.obj_type = 'helper_plane';
                //                        editor.addObject(mesh);
                //                        editor.selected = mesh;
                //                    }
                //                });
                //                buttons.add(helper_plane_add);
                //                var helper_plane_reduce = new UI.Button('工作面-宽度').onClick(function () {
                //                    var obj = editor.selected;
                //                    if (obj.obj_type === 'helper_plane') {
                //                        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width - helper_plane_change.getValue(), obj.geometry.parameters.height, obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
                //                        var material = obj.material;
                //                        var mesh = new THREE.Mesh(geometry, material);
                //                        mesh.rotation.x = obj.rotation.x;
                //                        mesh.rotation.y = obj.rotation.y;
                //                        mesh.rotation.z = obj.rotation.z;
                //                        mesh.position = obj.position;
                //                        mesh.name = obj.name;
                //                        editor.removeObject(obj);
                //                        mesh.obj_type = 'helper_plane';
                //                        editor.addObject(mesh);
                //                        editor.selected = mesh;
                //                    }
                //                });
                //                buttons.add(helper_plane_reduce);
                ///////////////////////////////////////////////////////////////////////////////////////////周静：修改工作面改变宽度之后不能投影bug 20150601
                var helper_plane_add = new UI.Button('工作面+宽度').onClick(function () {
                    //var obj = editor.selected;
                    var obj = object;
                    if (obj.obj_type === 'helper_plane') {
                        //obj.geometry.parameters.width = obj.geometry.parameters.width + helper_plane_change.getValue();

                        //obj.updateMatrixWorld(true);
                        //console.log(obj);
                        //console.log(obj.geometry.parameters.width);
                        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width + helper_plane_change.getValue(), obj.geometry.parameters.height, obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
                        var material = obj.material;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotation.x = obj.rotation.x;
                        mesh.rotation.y = obj.rotation.y;
                        mesh.rotation.z = obj.rotation.z;
                        mesh.obj_point1 = obj.obj_point1;
                        mesh.obj_point2 = obj.obj_point2;
                        mesh.obj_width = obj.obj_width;
                        console.log(mesh.obj_point1, mesh.obj_point2);
                        mesh.position = obj.position;
                        mesh.name = obj.name;
                        editor.removeObject(obj);
                        editor.removeObject(object);
                        mesh.obj_type = 'helper_plane';
                        editor.addObject(mesh);
                        //editor.select = mesh;
                        object = mesh;
                    }
                });
                buttons.add(helper_plane_add);
                var helper_plane_reduce = new UI.Button('工作面-宽度').onClick(function () {
                    var obj = object;
                    if (obj.obj_type === 'helper_plane') {
                        //obj.geometry.parameters.width = obj.geometry.parameters.width - helper_plane_change.getValue();
                        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width - helper_plane_change.getValue(), obj.geometry.parameters.height, obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
                        var material = obj.material;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotation.x = obj.rotation.x;
                        mesh.rotation.y = obj.rotation.y;
                        mesh.rotation.z = obj.rotation.z;
                        mesh.obj_point1 = obj.obj_point1;
                        mesh.obj_point2 = obj.obj_point2;
                        mesh.obj_width = obj.obj_width;
                        mesh.position = obj.position;
                        mesh.name = obj.name;
                        editor.removeObject(obj);
                        mesh.obj_type = 'helper_plane';
                        editor.addObject(mesh);
                        //editor.selected = mesh;
                        object = mesh;
                    }
                });
                buttons.add(helper_plane_reduce);
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////周静：增加工作面修改高度功能 20150601
                var helper_plane_hadd = new UI.Button('工作面+高度').onClick(function () {
                    //var obj = editor.selected;
                    var obj = object;
                    if (obj.obj_type === 'helper_plane') {
                        //obj.geometry.parameters.width = obj.geometry.parameters.width + helper_plane_change.getValue();

                        //console.log(obj);
                        //console.log(obj.geometry.parameters.width);
                        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width, obj.geometry.parameters.height + helper_plane_change.getValue(), obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
                        var material = obj.material;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotation.x = obj.rotation.x;
                        mesh.rotation.y = obj.rotation.y;
                        mesh.rotation.z = obj.rotation.z;
                        mesh.obj_point1 = obj.obj_point1;
                        mesh.obj_point2 = obj.obj_point2;
                        mesh.obj_width = obj.obj_width;
                        console.log(mesh.obj_point1, mesh.obj_point2);
                        mesh.position = obj.position;
                        mesh.name = obj.name;
                        editor.removeObject(obj);
                        mesh.obj_type = 'helper_plane';
                        editor.addObject(mesh);
                        //editor.select = mesh;
                        object = mesh;
                        //console.log(editor.select);
                    }
                });
                buttons.add(helper_plane_hadd);
                var helper_plane_hreduce = new UI.Button('工作面-高度').onClick(function () {
                    var obj = object;
                    if (obj.obj_type === 'helper_plane') {
                        //obj.geometry.parameters.width = obj.geometry.parameters.width - helper_plane_change.getValue();
                        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width, obj.geometry.parameters.height - helper_plane_change.getValue(), obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
                        var material = obj.material;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotation.x = obj.rotation.x;
                        mesh.rotation.y = obj.rotation.y;
                        mesh.rotation.z = obj.rotation.z;
                        mesh.obj_point1 = obj.obj_point1;
                        mesh.obj_point2 = obj.obj_point2;
                        mesh.obj_width = obj.obj_width;
                        mesh.position = obj.position;
                        mesh.name = obj.name;
                        editor.removeObject(obj);
                        mesh.obj_type = 'helper_plane';
                        editor.addObject(mesh);
                        //editor.selected = mesh;
                        object = mesh;
                    }
                });
                buttons.add(helper_plane_hreduce);
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                var plane_fliter_panel = new UI.Panel();
                var plane_front = new UI.Number().setWidth('150px').onChange(function () {
                    editor.plane_front_value = plane_front.getValue();
                });
                plane_fliter_panel.add(new UI.Text('前距离：').setWidth('90px'));
                plane_front.setValue(editor.plane_front_value);
                plane_fliter_panel.add(plane_front);
                var plane_back = new UI.Number().setWidth('150px').onChange(function () {
                    editor.plane_back_value = plane_back.getValue();
                }); ;
                plane_fliter_panel.add(new UI.Text('后距离：').setWidth('90px'));
                plane_back.setValue(editor.plane_back_value);
                plane_fliter_panel.add(plane_back);
                params.add(plane_fliter_panel);
                //////////////////////////////
                var plane_up_panel = new UI.Panel();
                helper_plane_dis = new UI.Number().setWidth('150px');
                plane_up_panel.add(new UI.Text('移动距离：').setWidth('90px'));
                helper_plane_dis.setValue(20);
                plane_up_panel.add(helper_plane_dis);
                params.add(plane_up_panel);

                var plane_change_panel = new UI.Panel();
                helper_plane_change = new UI.Number().setWidth('150px');
                plane_change_panel.add(new UI.Text('变化大小：').setWidth('90px'));
                helper_plane_change.setValue(20);
                plane_change_panel.add(helper_plane_change);
                params.add(plane_change_panel);


                /////////////////////////////


            } else if (editor.getObjectType(object) === 'hline') {
                var line_type = editor.lineType(object);
                if (line_type == 'segment') {
                    var create_plane = new UI.Button('生成工作面').onClick(function () {
                        points = object.geometry.vertices;
                        signals.helperPlaneCreate.dispatch(points[0], points[1], plane_heigh.getValue(), plane_width.getValue());
                    });
                    buttons.add(create_plane);

                    /////////////////////////////////////////////////////////////////////////////郭佳宁：画采区和抽注单元(20150616)
                    /////////////////////////////////////////////////////////////弹出新的标签页
                    var create_2Dplane = new UI.Button('投影到二维平面').onClick(function () {
                        console.log("2d平面");
                        console.log(points[0], points[1]);
                        console.log(points[0].x + parseFloat(editor.cur_center[0]));
                        console.log(points[0].z + parseFloat(editor.cur_center[1]));
                        console.log(points[0].y + parseFloat(editor.cur_center[2]));

                        var numbers_X = [];
                        var numbers_Y = [];
                        numbers_X.push(points[0].x, points[1].x);
                        numbers_Y.push(points[0].z, points[1].z);
                        var x_min = Math.min.apply(Math, numbers_X);
                        var x_max = Math.max.apply(Math, numbers_X);
                        var y_min = Math.min.apply(Math, numbers_Y);
                        var y_max = Math.max.apply(Math, numbers_Y);
                        //重置数组
                        numbers_X.length = 0;
                        numbers_Y.length = 0;
                        numbers_X.push(x_min, x_max);
                        numbers_Y.push(y_min, y_max);

                        console.log(x_min, x_max, y_min, y_max, numbers_X, numbers_Y);
                        var paraString = "x_list=" + numbers_X + "&" + "y_list=" + numbers_Y + "&" + "cur_batch=" + editor.cur_batch;
                        var targetURL = "../geo/areaAndUnit.html" + "?" + paraString;
                        window.open(targetURL, "采区和抽注单元", "height=800, width=800"); //弹出新的标签页


                        //points[0]和points[1]为3d空间中的两个点，作为2d空间中画布上的两个点


                        //加载这个范围内所有井口信息

                    });
                    buttons.add(create_2Dplane);
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////

                    var plane_heigh_panel = new UI.Panel();
                    var plane_heigh = new UI.Number().setWidth('150px');
                    plane_heigh_panel.add(new UI.Text('工作面高度：').setWidth('90px'));
                    plane_heigh.setValue(200);
                    plane_heigh_panel.add(plane_heigh);
                    params.add(plane_heigh_panel);

                    var plane_width_double = new UI.Panel();
                    var plane_width = new UI.Checkbox();
                    plane_width_double.add(new UI.Text('工作面宽度是否加倍：').setWidth('150px'));
                    plane_width_double.add(plane_width);
                    params.add(plane_width_double);
                }
                if (line_type == 'segment' && p_object != null && editor.getObjectType(p_object) === 'object' && editor.objectType(p_object) == 'leaf') {
                    var create_plane = new UI.Button('分割矿体"' + p_object.name + '"').onClick(function () {
                        var post_data = {};
                        post_data.linetype = line_type;
                        post_data.same_level = level_check.getValue();
                        post_data.virtual_cut = virtual_cut.getValue();
                        post_data.close = close_object.getValue();
                        post_data.block_id = p_object.obj_id || 0;
                        post_data.line = object.geometry.vertices;
                        post_data.cur_batch = editor.cur_batch + "";
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/WellInfo2.asmx/SplitBlock", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (objects) {
                                editor.removeObject(p_object);
                                ////////////////////////////////////////////////////////////
                                var loader = new THREE.JSONLoader();
                                $.each(objects, function (i, object) {
                                    var geom = loader.parse(object);
                                    var loadedMesh = editor.createMesh(object.metadata.object_color, geom.geometry);
                                    loadedMesh.ori_name = object.metadata.ori_name;
                                    loadedMesh.name = object.metadata.object_name;
                                    loadedMesh.obj_type = 'object';
                                    loadedMesh.ori = (object.metadata.ori === 'true');
                                    loadedMesh.leaf = (object.metadata.leaf === 'true');
                                    loadedMesh.des = object.metadata.object_des;
                                    loadedMesh.obj_id = object.metadata.object_id;
                                    editor.addObject(loadedMesh);
                                    if (object.metadata.parent != undefined) {
                                        editor.parent(loadedMesh, editor.findByObjId(object.metadata.parent));
                                        //editor.signals.objectChanged.dispatch(loadedMesh);
                                    }
                                });
                            }
                        });
                    });
                    buttons.add(create_plane);

                    var plane_level_check = new UI.Panel();
                    var level_check = new UI.Checkbox();
                    plane_level_check.add(new UI.Text('同层级切割：').setWidth('150px'));
                    plane_level_check.add(level_check);
                    params.add(plane_level_check);

                    var plane_virtual_cut = new UI.Panel();
                    var virtual_cut = new UI.Checkbox();
                    plane_virtual_cut.add(new UI.Text('计划切割：').setWidth('150px'));
                    plane_virtual_cut.add(virtual_cut);
                    params.add(plane_virtual_cut);

                    var plane_close_object = new UI.Panel();
                    var close_object = new UI.Checkbox();
                    plane_close_object.add(new UI.Text('是否封口：').setWidth('150px'));
                    plane_close_object.add(close_object);
                    params.add(plane_close_object);
                }
                if (line_type == 'close' && p_object != null && editor.getObjectType(p_object) === 'object' && editor.objectType(p_object) == 'leaf') {
                    var create_plane = new UI.Button('剪裁矿体"' + p_object.name + '"').onClick(function () {
                        var post_data = {};
                        post_data.linetype = line_type;
                        post_data.same_level = level_check.getValue();
                        post_data.virtual_cut = virtual_cut.getValue();
                        post_data.close = close_object.getValue();
                        post_data.block_id = p_object.obj_id || 0;
                        post_data.line = object.geometry.vertices;
                        post_data.cur_batch = editor.cur_batch + "";
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/WellInfo2.asmx/SplitBlock", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (objects) {
                                editor.removeObject(p_object);
                                ////////////////////////////////////////////////////////////
                                var loader = new THREE.JSONLoader();
                                $.each(objects, function (i, object) {
                                    var geom = loader.parse(object);
                                    var loadedMesh = editor.createMesh(object.metadata.object_color, geom.geometry);
                                    loadedMesh.ori_name = object.metadata.ori_name;
                                    loadedMesh.name = object.metadata.object_name;
                                    loadedMesh.obj_type = 'object';
                                    loadedMesh.ori = (object.metadata.ori === 'true');
                                    loadedMesh.leaf = (object.metadata.leaf === 'true');
                                    loadedMesh.des = object.metadata.object_des;
                                    loadedMesh.obj_id = object.metadata.object_id;
                                    editor.addObject(loadedMesh);
                                    if (object.metadata.parent != undefined) {
                                        editor.parent(loadedMesh, editor.findByObjId(object.metadata.parent));
                                        //editor.signals.objectChanged.dispatch(loadedMesh);
                                    }
                                });
                            }
                        });
                    });
                    buttons.add(create_plane);

                    var plane_level_check = new UI.Panel();
                    var level_check = new UI.Checkbox();
                    plane_level_check.add(new UI.Text('同层级切割：').setWidth('150px'));
                    plane_level_check.add(level_check);
                    params.add(plane_level_check);

                    var plane_virtual_cut = new UI.Panel();
                    var virtual_cut = new UI.Checkbox();
                    plane_virtual_cut.add(new UI.Text('计划切割：').setWidth('150px'));
                    plane_virtual_cut.add(virtual_cut);
                    params.add(plane_virtual_cut);

                    var plane_close_object = new UI.Panel();
                    var close_object = new UI.Checkbox();
                    plane_close_object.add(new UI.Text('是否封口：').setWidth('150px'));
                    plane_close_object.add(close_object);
                    params.add(plane_close_object);
                }

            }
            else {

            }

        }

    }


    return container;

}
