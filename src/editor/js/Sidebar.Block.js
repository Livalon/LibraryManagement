Sidebar.Block = function (editor) {
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed(true);
    container.setDisplay('none');

    container.addStatic(new UI.Text('距离幂储量估算'));
    container.add(new UI.Break());

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add(buttons);
    container.add(params);
    signals.objectSelected.add(function (object) {

        updateUI();

    });
    function updateUI() {
        container.setDisplay('none');
        buttons.clear();
        params.clear();
        var object = editor.selected;
        var p_object = editor.p_selected;
        if (object !== null && editor.getObjectType(object) === 'object' && !object.ori) {

            container.setDisplay('block');
            var jvlimi = new UI.Button('储量估算').onClick(function () {
                var post_data = {};
                post_data.cur_batch = editor.cur_batch + "";
                post_data.id = object.obj_id || 0;
                post_data.bb_id = editor.cur_bb || 0;
                post_data.metal = editor.cur_metal || "CU";
                post_data.welltype = welltype_pl.getValue();
                post_data.min = min.getValue();
                post_data.max = max.getValue();
                post_data.Radius1 = Radius1.getValue();
                post_data.Radius2 = Radius2.getValue();
                post_data.Radius3 = Radius3.getValue();
                post_data.Ang1 = Ang1.getValue();
                post_data.Ang2 = Ang2.getValue();
                post_data.Ang3 = Ang3.getValue();
                post_data.midu = midu.getValue();
                post_data.minnum = minnum.getValue();
                post_data.maxnum = maxnum.getValue();
                post_data.discnumx = discnumx.getValue();
                post_data.discnumy = discnumy.getValue();
                post_data.discnumz = discnumz.getValue();
                post_data.srchoct = srchoct.getValue();
                post_data.power = ipower.getValue();
                post_data.mindrillcount = mindrillcount.getValue();

                post_data.inlev = inlev.getValue();
                post_data.boundlev = boundlev.getValue();
                post_data.isoutside = isoutside.getValue();
                $.ajax({
                    type: "POST", //访问WebService使用Post方式请求
                    contentType: "application/json", //WebService 会返回Json类型
                    url: "../getdata/WellInfo2.asmx/JLMCompute", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                    data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                    dataType: 'json',
                    success: function (res) {
                        if (res.result) {
                            alert("总块数：" + res.allblocknum + ",约束块数：" + res.relablocknum + ",估值块数：" + res.resultblocknum
                            + "\n金属量：" + res.result_quatity + ",平均品位：" + res.result_averGrade + ",体积：" + res.volume);
                        } else {
                            alert(res.message);
                        }

                    }
                });
            });
            buttons.add(jvlimi);
            var BbSelectRow = new UI.Panel();
            var cubeParams = [];
            var ElliParams = [];
            var flag = "";
            var BbSelect = new UI.Select().setOptions(editor.all_eb).setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {
                //editor.cur_bb = BbSelect.getValue();
                var tmp = BbSelect.getValue();
                flag = tmp[0];
                editor.cur_bb = tmp.substring(1);
                console.log("flag:" + flag);
                console.log("editor.cur_bb:" + editor.cur_bb);

                var post = {};
                post.object_id = editor.cur_bb; //获取点击的是模型的id
                post.object_name = editor.all_eb[tmp];

                if (flag == "b") {
                    //获取块段模型信息
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/GetBb", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        async: false,
                        success: function (object) { //回调函数
                            cubeParams.length = 0;
                            cubeParams.push(object.cur_ox, object.cur_oy, object.cur_oz, object.cur_lengthX, object.cur_lengthY, object.cur_lengthZ, object.cur_lengthBX, object.cur_lengthBY, object.cur_lengthBZ);
                        }
                    });
                    MineralModelParams.setDisplay('block');
                    StartX.setValue(cubeParams[0]);
                    StartY.setValue(cubeParams[1]);
                    console.log("cubeParams:" + cubeParams[1]);
                    StartZ.setValue(cubeParams[2]);

                    GlobalX.setValue(cubeParams[3]);
                    GlobalY.setValue(cubeParams[4]);
                    GlobalZ.setValue(cubeParams[5]);

                    BlockX.setValue(cubeParams[6]);
                    BlockY.setValue(cubeParams[7]);
                    BlockZ.setValue(cubeParams[8]);
                }
                else {
                    //获取椭球模型信息
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/WellInfo2.asmx/GetEllipsoid", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        async: false,
                        success: function (object) { //回调函数
                            ElliParams.length = 0;
                            ElliParams.push(object.cur_centerX, object.cur_centerY, object.cur_centerZ, object.cur_a, object.cur_b, object.cur_c, object.cur_theta, object.cur_phi, object.cur_rotation);

                        }
                    });
                    MineralModelParams.setDisplay('none');
                    EllispedModel.setDisplay('block');

                    Radius1.setValue(ElliParams[3]);
                    Radius2.setValue(ElliParams[4]);
                    Radius3.setValue(ElliParams[5]);
                    Ang1.setValue(ElliParams[7]);
                    Ang2.setValue(ElliParams[6]);
                    Ang3.setValue(ElliParams[8]);
                    console.log("Radius1" + ElliParams[3]);


                }

            });
            BbSelectRow.add(new UI.Text('块段模型').setWidth('90px'));
            BbSelectRow.add(BbSelect);
            params.add(BbSelectRow);

            var MetalSelectRow = new UI.Panel();
            var MetalSelect = new UI.Select().setOptions(editor.all_metal).setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {
                editor.cur_metal = MetalSelect.getValue();
            });
            MetalSelectRow.add(new UI.Text('估值金属').setWidth('90px'));
            MetalSelectRow.add(MetalSelect);
            params.add(MetalSelectRow);

            var well_options = { "init": "原始钻孔", "computed": "样品组合", "lcomputed": "样长组合" };
            var welltype_panel = new UI.Panel();
            var welltype_pl = new UI.Select().setOptions(well_options).setWidth('150px').setColor('#444').setFontSize('12px');
            welltype_panel.add(new UI.Text('方向').setWidth('90px'));
            welltype_panel.add(welltype_pl);
            params.add(welltype_panel);

            var midu_panel = new UI.Panel();
            var midu = new UI.Number().setWidth('150px');
            midu_panel.add(new UI.Text('矿体密度：').setWidth('90px'));
            midu.setValue(1.8);
            midu_panel.add(midu);
            params.add(midu_panel);

            var min_panel = new UI.Panel();
            var min = new UI.Number().setWidth('150px');
            min_panel.add(new UI.Text('最小极限：').setWidth('90px'));
            min.setValue(0.1);
            min_panel.add(min);
            params.add(min_panel);


            var max_panel = new UI.Panel();
            var max = new UI.Number().setWidth('150px');
            max_panel.add(new UI.Text('最大极限：').setWidth('90px'));
            max.setValue(999);
            max_panel.add(max);
            params.add(max_panel);

            //块段模型的参数（于晶晶）

            var post = {};
            console.log("succes:");
            flag = "b";
            post.object_id = 1;
            post.object_name = editor.all_eb["b1"];


            //块段模型的参数，默认值是块段模型的参数
            var MineralModelParams = new UI.Panel();


            //起始点
            var StartPoint_panel = new UI.Panel();
            StartPoint_panel.add(new UI.Text('起始点：').setWidth('90px'));

            //起始点X    
            var StartPointX = new UI.Panel();
            var StartX = new UI.Number().setWidth('150px');
            StartPointX.add(new UI.Text('X：').setWidth('90px'));
            StartX.setValue(0);
            StartPointX.add(StartX);
            StartPoint_panel.add(StartPointX);
            console.log("开始设置块段模型的参数信息：");

            //起始点Y   
            var StartPointY = new UI.Panel();
            var StartY = new UI.Number().setWidth('150px');
            StartPointY.add(new UI.Text('Y：').setWidth('90px'));
            StartY.setValue(0);
            StartPointY.add(StartY);
            StartPoint_panel.add(StartPointY);

            //起始点Z   
            var StartPointZ = new UI.Panel();
            var StartZ = new UI.Number().setWidth('150px');
            StartPointZ.add(new UI.Text('Z：').setWidth('90px'));
            StartZ.setValue(0);
            StartPointZ.add(StartZ);
            StartPoint_panel.add(StartPointZ);
            MineralModelParams.add(StartPoint_panel);

            //整体长度
            var GlobalLong = new UI.Panel();
            GlobalLong.add(new UI.Text('整体长度：').setWidth('90px'));

            //整体长度X
            var GlobalLongX = new UI.Panel();
            var GlobalX = new UI.Number().setWidth('150px');
            GlobalLongX.add(new UI.Text('X:').setWidth('90px'));
            GlobalX.setValue(0);
            GlobalLongX.add(GlobalX);
            GlobalLong.add(GlobalLongX);

            //整体长度Y
            var GlobalLongY = new UI.Panel();
            var GlobalY = new UI.Number().setWidth('150px');
            GlobalLongY.add(new UI.Text('Y:').setWidth('90px'));
            GlobalY.setValue(0);
            GlobalLongY.add(GlobalY);
            GlobalLong.add(GlobalLongY);

            //整体长度Z
            var GlobalLongZ = new UI.Panel();
            var GlobalZ = new UI.Number().setWidth('150px');
            GlobalLongZ.add(new UI.Text('Z:').setWidth('90px'));
            GlobalZ.setValue(0);
            GlobalLongZ.add(GlobalZ);
            GlobalLong.add(GlobalLongZ);
            //将整体长度加到块段模型
            MineralModelParams.add(GlobalLong);

            //块长度
            var BlockLong = new UI.Panel();
            BlockLong.add(new UI.Text('块长度：').setWidth('150px'));

            //块长度X
            var BlockLongX = new UI.Panel();
            var BlockX = new UI.Number().setWidth('150px');
            BlockLongX.add(new UI.Text('X:').setWidth('90px'));
            BlockX.setValue(0);
            BlockLongX.add(BlockX);
            BlockLong.add(BlockLongX);

            //块长度Y
            var BlockLongY = new UI.Panel();
            var BlockY = new UI.Number().setWidth('150px');
            BlockLongY.add(new UI.Text('Y:').setWidth('90px'));
            BlockY.setValue(0);
            BlockLongY.add(BlockY);
            BlockLong.add(BlockLongY);

            //块长度Z
            var BlockLongZ = new UI.Panel();
            var BlockZ = new UI.Number().setWidth('150px');
            BlockLongZ.add(new UI.Text('Z:').setWidth('90px'));
            BlockZ.setValue(0);
            BlockLongZ.add(BlockZ);
            BlockLong.add(BlockLongZ);

            MineralModelParams.add(BlockLong);


            //旋转长度
            var RotaryLong = new UI.Panel();
            RotaryLong.add(new UI.Text('旋转长度:').setWidth('150px'));

            //旋转长度X
            var RotaryLongX = new UI.Panel();
            var RotaryX = new UI.Number().setWidth('150px');
            RotaryLongX.add(new UI.Text('X:').setWidth('90px'));
            RotaryX.setValue(0);
            RotaryLongX.add(RotaryX);
            RotaryLong.add(RotaryLongX);

            //旋转长度Y
            var RotaryLongY = new UI.Panel();
            var RotaryY = new UI.Number().setWidth('150px');
            RotaryLongY.add(new UI.Text('Y:').setWidth('90px'));
            RotaryY.setValue(0);
            RotaryLongY.add(RotaryY);
            RotaryLong.add(RotaryLongY);

            //旋转长度Z
            var RotaryLongZ = new UI.Panel();
            var RotaryZ = new UI.Number().setWidth('150px');
            RotaryLongZ.add(new UI.Text('Z:').setWidth('90px'));
            RotaryZ.setValue(0);
            RotaryLongZ.add(RotaryZ);
            RotaryLong.add(RotaryLongZ);

            MineralModelParams.add(RotaryLong);

            params.add(MineralModelParams);

            //椭球模型的参数
            var EllispedModel = new UI.Panel();

            var Radius1_panel = new UI.Panel();
            var Radius1 = new UI.Number().setWidth('150px');
            Radius1_panel.add(new UI.Text('主轴半径：').setWidth('90px'));
            Radius1.setValue(0);
            Radius1_panel.add(Radius1);
            EllispedModel.add(Radius1_panel);

            var Radius2_panel = new UI.Panel();
            var Radius2 = new UI.Number().setWidth('150px');
            Radius2_panel.add(new UI.Text('次轴半径：').setWidth('90px'));
            Radius2.setValue(0);
            Radius2_panel.add(Radius2);
            EllispedModel.add(Radius2_panel);

            var Radius3_panel = new UI.Panel();
            var Radius3 = new UI.Number().setWidth('150px');
            Radius3_panel.add(new UI.Text('短轴半径：').setWidth('90px'));
            Radius3.setValue(0);
            Radius3_panel.add(Radius3);
            EllispedModel.add(Radius3_panel);

            var Ang1_panel = new UI.Panel();
            var Ang1 = new UI.Number().setWidth('150px');
            Ang1_panel.add(new UI.Text('椭球方向X：').setWidth('90px'));
            Ang1.setValue(0);
            Ang1_panel.add(Ang1);
            EllispedModel.add(Ang1_panel);

            var Ang2_panel = new UI.Panel();
            var Ang2 = new UI.Number().setWidth('150px');
            Ang2_panel.add(new UI.Text('椭球方向Y：').setWidth('90px'));
            Ang2.setValue(0);
            Ang2_panel.add(Ang2);
            EllispedModel.add(Ang2_panel);

            var Ang3_panel = new UI.Panel();
            var Ang3 = new UI.Number().setWidth('150px');
            Ang3_panel.add(new UI.Text('椭球方向Z：').setWidth('90px'));
            Ang3.setValue(0);
            Ang3_panel.add(Ang3);
            EllispedModel.add(Ang3_panel);

            params.add(EllispedModel);
            EllispedModel.setDisplay('block');
            //            var Radius1_panel = new UI.Panel();
            //            var Radius1 = new UI.Number().setWidth('150px');
            //            Radius1_panel.add(new UI.Text('主轴半径：').setWidth('90px'));
            //            Radius1.setValue(800);
            //            Radius1_panel.add(Radius1);
            //            params.add(Radius1_panel);

            //            var Radius2_panel = new UI.Panel();
            //            var Radius2 = new UI.Number().setWidth('150px');
            //            Radius2_panel.add(new UI.Text('次轴半径：').setWidth('90px'));
            //            Radius2.setValue(500);
            //            Radius2_panel.add(Radius2);
            //            params.add(Radius2_panel);

            //            var Radius3_panel = new UI.Panel();
            //            var Radius3 = new UI.Number().setWidth('150px');
            //            Radius3_panel.add(new UI.Text('短轴半径：').setWidth('90px'));
            //            Radius3.setValue(500);
            //            Radius3_panel.add(Radius3);
            //            params.add(Radius3_panel);

            //            var Ang1_panel = new UI.Panel();
            //            var Ang1 = new UI.Number().setWidth('150px');
            //            Ang1_panel.add(new UI.Text('椭球方向X：').setWidth('90px'));
            //            Ang1.setValue(115);
            //            Ang1_panel.add(Ang1);
            //            params.add(Ang1_panel);

            //            var Ang2_panel = new UI.Panel();
            //            var Ang2 = new UI.Number().setWidth('150px');
            //            Ang2_panel.add(new UI.Text('椭球方向Y：').setWidth('90px'));
            //            Ang2.setValue(0);
            //            Ang2_panel.add(Ang2);
            //            params.add(Ang2_panel);

            //            var Ang3_panel = new UI.Panel();
            //            var Ang3 = new UI.Number().setWidth('150px');
            //            Ang3_panel.add(new UI.Text('椭球方向Z：').setWidth('90px'));
            //            Ang3.setValue(30);
            //            Ang3_panel.add(Ang3);
            //            params.add(Ang3_panel);

            var minnum_panel = new UI.Panel();
            var minnum = new UI.Integer().setWidth('120px');
            minnum.setValue(1);
            minnum_panel.add(new UI.Text('最小搜索点数：').setWidth('120px'));
            minnum_panel.add(minnum);
            params.add(minnum_panel);

            var maxnum_panel = new UI.Panel();
            var maxnum = new UI.Integer().setWidth('120px');
            maxnum.setValue(50);
            maxnum_panel.add(new UI.Text('最大搜索点数：').setWidth('120px'));
            maxnum_panel.add(maxnum);
            params.add(maxnum_panel);

            var discnumx_panel = new UI.Panel();
            var discnumx = new UI.Integer().setWidth('120px');
            discnumx.setValue(1);
            discnumx_panel.add(new UI.Text('X轴离散点数：').setWidth('120px'));
            discnumx_panel.add(discnumx);
            params.add(discnumx_panel);

            var discnumy_panel = new UI.Panel();
            var discnumy = new UI.Integer().setWidth('120px');
            discnumy.setValue(1);
            discnumy_panel.add(new UI.Text('Y轴离散点数：').setWidth('120px'));
            discnumy_panel.add(discnumy);
            params.add(discnumy_panel);

            var discnumz_panel = new UI.Panel();
            var discnumz = new UI.Integer().setWidth('120px');
            discnumz.setValue(1);
            discnumz_panel.add(new UI.Text('Z轴离散点数：').setWidth('120px'));
            discnumz_panel.add(discnumz);
            params.add(discnumz_panel);

            var srchoct_panel = new UI.Panel();
            var srchoct = new UI.Integer().setWidth('120px');
            srchoct.setValue(0);
            srchoct_panel.add(new UI.Text('八分圆搜索：').setWidth('120px'));
            srchoct_panel.add(srchoct);
            params.add(srchoct_panel);

            var ipower_panel = new UI.Panel();
            var ipower = new UI.Integer().setWidth('150px');
            ipower.setValue(2);
            ipower_panel.add(new UI.Text('估值幂次：').setWidth('90px'));
            ipower_panel.add(ipower);
            params.add(ipower_panel);

            var mindrillcount_panel = new UI.Panel();
            var mindrillcount = new UI.Integer().setWidth('120px');
            mindrillcount.setValue(0);
            mindrillcount_panel.add(new UI.Text('最少钻孔个数：').setWidth('120px'));
            mindrillcount_panel.add(mindrillcount);
            params.add(mindrillcount_panel);

            var inlev_panel = new UI.Panel();
            var inlev = new UI.Integer().setWidth('150px');
            inlev.setValue(4);
            inlev_panel.add(new UI.Text('内部级数：').setWidth('90px'));
            inlev_panel.add(inlev);
            params.add(inlev_panel);

            var boundlev_panel = new UI.Panel();
            var boundlev = new UI.Integer().setWidth('150px');
            boundlev.setValue(5);
            boundlev_panel.add(new UI.Text('边界级数：').setWidth('90px'));
            boundlev_panel.add(boundlev);
            params.add(boundlev_panel);

            var isoutside_panel = new UI.Panel();
            var isoutside = new UI.Checkbox();
            isoutside_panel.add(new UI.Text('是否外部约束：').setWidth('150px'));
            isoutside.setValue(false);
            isoutside_panel.add(isoutside);
            params.add(isoutside_panel);
            if (flag == "b") {
                //获取块段模型信息
                $.ajax({
                    type: "POST", //访问WebService使用Post方式请求
                    contentType: "application/json", //WebService 会返回Json类型
                    url: "../getdata/WellInfo2.asmx/GetBb", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                    data: $.toJSON(post), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                    dataType: 'json',
                    async: false,
                    success: function (object) { //回调函数
                        cubeParams.length = 0;
                        cubeParams.push(object.cur_ox, object.cur_oy, object.cur_oz, object.cur_lengthX, object.cur_lengthY, object.cur_lengthZ, object.cur_lengthBX, object.cur_lengthBY, object.cur_lengthBZ);
                    }
                });
                StartX.setValue(cubeParams[0]);
                StartY.setValue(cubeParams[1]);
                StartZ.setValue(cubeParams[2]);
                GlobalX.setValue(cubeParams[3]);
                GlobalY.setValue(cubeParams[4]);
                GlobalZ.setValue(cubeParams[5]);
                BlockX.setValue(cubeParams[6]);
                BlockY.setValue(cubeParams[7]);
                BlockZ.setValue(cubeParams[8]);
                console.log("设置块段模型的值");

            }
            else {
                $.ajax({
                    type: "POST", //访问WebService使用Post方式请求
                    contentType: "application/json", //WebService 会返回Json类型
                    url: "../getdata/WellInfo2.asmx/GetEllipsoid", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                    data: $.toJSON(post), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                    dataType: 'json',
                    async: false,
                    success: function (object) { //回调函数
                        ElliParams.length = 0;
                        ElliParams.push(object.cur_centerX, object.cur_centerY, object.cur_centerZ, object.cur_a, object.cur_b, object.cur_c, object.cur_theta, object.cur_phi, object.cur_rotation);
                    }
                });


            }

        }
    }
    //    function onAddkeligeClick() {
    //        var points, particle;
    //        $.ajax({
    //            type: "POST", //访问WebService使用Post方式请求
    //            contentType: "application/json", //WebService 会返回Json类型
    //            url: "../getdata/loadobjects.aspx", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
    //            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
    //            //dataType: 'json',
    //            async: false,
    //            success: function (objects) { //回调函数
    //                var loader = new THREE.JSONLoader();
    //                $.each(objects, function (i, object) {
    //                    var geom = loader.parse(object);
    //                    points = THREE.GeometryUtils.randomPointsInGeometry(geom.geometry, 1000);
    //                    for (var i = 0; i < points.length; i++) {
    //                        //                        var color=parseInt(Math.random() * 0x808008 + 0x808080);
    //                        particle = new THREE.Sprite(new THREE.SpriteMaterial({
    //                            map: new THREE.Texture(editor.generateSprite(0x808008 + i * 10000)),
    //                            blending: THREE.AdditiveBlending
    //                        }));
    //                        particle.scale.set(0.5, 0.5, 1);
    //                        particle.position.x = points[i].x;
    //                        particle.position.z = points[i].z;
    //                        particle.position.y = points[i].y;
    //                        editor.sceneHelpers.add(particle);

    //                    }
    //                });
    //            }
    //        });
    //    }
    //    function onAddblockClick() {
    //        var SEPARATION = editor.world / 2;
    //        var DEEP = 200;
    //        var AMOUNTX = 20;
    //        var AMOUNTY = 20;
    //        var AMOUNTZ = 20;
    //        material = new THREE.SpriteMaterial({
    //            map: new THREE.Texture(editor.generateSprite(0xcccccc)),
    //            blending: THREE.AdditiveBlending
    //        });
    //        for (var iz = 0; iz < DEEP / AMOUNTZ; iz++) {

    //            for (var ix = 0; ix < SEPARATION * 2 / AMOUNTX; ix++) {

    //                for (var iy = 0; iy < SEPARATION * 2 / AMOUNTY; iy++) {

    //                    particle = new THREE.Sprite(material);
    //                    //                particle.scale.set(5,5,1);
    //                    particle.position.x = ix * AMOUNTX - SEPARATION + AMOUNTX / 2;
    //                    particle.position.z = iy * AMOUNTY - SEPARATION + AMOUNTY / 2;
    //                    particle.position.y = -(iz * AMOUNTZ) - AMOUNTZ / 2;
    //                    editor.sceneHelpers.add(particle);

    //                }

    //            }
    //        }

    //    }
    //    function onAddLimitClick() {
    //        var points, particle;
    //        var material = new THREE.SpriteMaterial({
    //            map: new THREE.Texture(editor.generateSprite(0xcccccc)),
    //            blending: THREE.AdditiveBlending
    //        });
    //        $.ajax({
    //            type: "POST", //访问WebService使用Post方式请求
    //            contentType: "application/json", //WebService 会返回Json类型
    //            url: "../getdata/loadobjects.aspx", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
    //            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
    //            //dataType: 'json',
    //            async: false,
    //            success: function (objects) { //回调函数
    //                var loader = new THREE.JSONLoader();
    //                $.each(objects, function (i, object) {
    //                    var geom = loader.parse(object);
    //                    points = THREE.GeometryUtils.randomPointsInGeometry(geom.geometry, 1000);
    //                    for (var i = 0; i < points.length; i++) {

    //                        particle = new THREE.Sprite(material);
    //                        particle.scale.set(0.5, 0.5, 1);
    //                        particle.position.x = points[i].x;
    //                        particle.position.z = points[i].z;
    //                        particle.position.y = points[i].y;
    //                        editor.sceneHelpers.add(particle);

    //                    }
    //                });
    //            }
    //        });
    //    }
    return container;

}
