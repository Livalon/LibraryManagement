
//对象栏
Sidebar.MathObject = function (editor) {

    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed(true);

    container.addStatic(new UI.Text('椭球与块段模型'));
    container.add(new UI.Break());

    // class
    var options = ['块段模型', '椭球模型'];
    var ModelTypeRow = new UI.Panel();
    var ModelType = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onMathObjectTypeChange);
    ModelTypeRow.add(new UI.Text('模型类型').setWidth('90px'));
    ModelTypeRow.add(ModelType);
    container.add(ModelTypeRow);

    var MineralModelRow = new UI.Panel();

    container.add(MineralModelRow);

    ////////////////////////////////////////////////////////////////////////////////////块段模型
    var MineralModelParams = new UI.Panel();
    //    var MineralName = new UI.Select().setOptions(editor.all_bb).setWidth('150px').setColor('#444').setFontSize('12px').onChange(selectMineralObject);
    //    MineralModelParams.add(new UI.Text('块段模型').setWidth('90px'));
    //    MineralModelParams.add(MineralName);
    //增加块段模型的新建和保存（于晶晶）

    //模型名称
    var MineralNameRow = new UI.Panel();
    var MineralModelName = new UI.Input().setWidth('150px');
    MineralNameRow.add(new UI.Text('模型名称:').setWidth('90px'));
    MineralNameRow.add(MineralModelName);
    MineralModelParams.add(MineralNameRow);

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


    var MetalSelectRow = new UI.Panel();
    var MetalSelect = new UI.Select().setOptions(editor.all_metal).setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {
        editor.cur_metal = MetalSelect.getValue();
    });
    MetalSelectRow.add(new UI.Text('金属类型：').setWidth('90px'));
    MetalSelectRow.add(MetalSelect);
    MineralModelParams.add(MetalSelectRow);


    container.add(MineralModelParams);
    ///////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////椭球模型
    var EllipModelParams = new UI.Panel();
    var EllipModelRow = new UI.Panel();
    var ElliplRow = new UI.Input().setWidth('150px');
    EllipModelRow.add(new UI.Text('椭球模型:').setWidth('90px'));
    EllipModelRow.add(ElliplRow);
    EllipModelParams.add(EllipModelRow);

    var ModelNameRow = new UI.Panel();
    var ModelName = new UI.Input().setWidth('150px');
    ModelNameRow.add(new UI.Text('模型名称:').setWidth('90px'));
    ModelNameRow.add(ModelName);
    EllipModelParams.add(ModelNameRow);

    var MidPoint_panel = new UI.Panel();
    MidPoint_panel.add(new UI.Text('中心点：').setWidth('90px'));
    var AddMiddlePoint = new UI.Button('选择中心点').onClick(onAddMiddlePointClick);
    MidPoint_panel.add(AddMiddlePoint);
    var MidPointParaX = new UI.Panel();
    var MidX = new UI.Number().setWidth('150px');
    MidPointParaX.add(new UI.Text('X：').setWidth('90px'));
    MidX.setValue(0);
    MidPointParaX.add(MidX);
    MidPoint_panel.add(MidPointParaX);

    var MidPointParaY = new UI.Panel();
    var MidY = new UI.Number().setWidth('150px');
    MidPointParaY.add(new UI.Text('Y：').setWidth('90px'));
    MidY.setValue(0);
    MidPointParaY.add(MidY);
    MidPoint_panel.add(MidPointParaY);

    var MidPointParaZ = new UI.Panel();
    var MidZ = new UI.Number().setWidth('150px');
    MidPointParaZ.add(new UI.Text('Z：').setWidth('90px'));
    MidZ.setValue(0);
    MidPointParaZ.add(MidZ);
    MidPoint_panel.add(MidPointParaZ);
    EllipModelParams.add(MidPoint_panel);

    var Radius1_panel = new UI.Panel();
    var Radius1 = new UI.Number().setWidth('150px');
    Radius1_panel.add(new UI.Text('主轴半径：').setWidth('90px'));
    Radius1.setValue(800);
    Radius1_panel.add(Radius1);
    EllipModelParams.add(Radius1_panel);


    var Radius2_panel = new UI.Panel();
    var Radius2 = new UI.Number().setWidth('150px');
    Radius2_panel.add(new UI.Text('次轴半径：').setWidth('90px'));
    Radius2.setValue(500);
    Radius2_panel.add(Radius2);
    EllipModelParams.add(Radius2_panel);

    var Radius3_panel = new UI.Panel();
    var Radius3 = new UI.Number().setWidth('150px');
    Radius3_panel.add(new UI.Text('短轴半径：').setWidth('90px'));
    Radius3.setValue(500);
    Radius3_panel.add(Radius3);
    EllipModelParams.add(Radius3_panel);

    var Ang1_panel = new UI.Panel();
    var Ang1 = new UI.Number().setWidth('150px');
    Ang1_panel.add(new UI.Text('方位角：').setWidth('90px'));
    Ang1.setValue(115);
    Ang1_panel.add(Ang1);
    EllipModelParams.add(Ang1_panel);

    var Ang2_panel = new UI.Panel();
    var Ang2 = new UI.Number().setWidth('150px');
    Ang2_panel.add(new UI.Text('倾角：').setWidth('90px'));
    Ang2.setValue(0);
    Ang2_panel.add(Ang2);
    EllipModelParams.add(Ang2_panel);

    var Ang3_panel = new UI.Panel();
    var Ang3 = new UI.Number().setWidth('150px');
    Ang3_panel.add(new UI.Text('倾俯角：').setWidth('90px'));
    Ang3.setValue(30);
    Ang3_panel.add(Ang3);
    EllipModelParams.add(Ang3_panel);
    EllipModelParams.add(new UI.Break());

    /////////////////////////////////////////////////////////////////////////郭佳宁：添加绕着主轴旋转球体功能
    var tmpMainLine; //主轴辅助线
    var addTmpLine = new UI.Checkbox(true).onChange(function () {
        if (addTmpLine.dom.checked == true) {
            if (tmpMainLine != undefined) {
                tmpMainLine.visible = true;
            }
            //            var focusChild = editor.sceneHelpers.children.filter(function (element) {
            //                return (element.obj_type === 'tmpMainline');
            //            });
            //            $.each(focusChild, function (i, v) {
            //                v.visible = true;
            //            });
        }
        else {
            if (tmpMainLine != undefined) {
                tmpMainLine.visible = false;
            }
            //            var focusChild = editor.sceneHelpers.children.filter(function (element) {
            //                return (element.obj_type === 'tmpMainline');
            //            });
            //            $.each(focusChild, function (i, v) {
            //                v.visible = false;
            //            });
        }
    });
    EllipModelParams.add(addTmpLine);
    EllipModelParams.add(new UI.Text('是否添加辅助线:'));
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    container.add(EllipModelParams);
    EllipModelParams.setDisplay('none');
    //////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////模型事件
    var ModelEvents = new UI.Panel();
    var AddModel = new UI.Button('生成模型').onClick(onAddModelClick);
    ModelEvents.add(AddModel);

    var deleModel = new UI.Button('卸载模型').onClick(onDeleModelClick);
    ModelEvents.add(deleModel);

    var saveModel = new UI.Button('保存模型').onClick(onSaveModelClick);
    ModelEvents.add(saveModel);
    saveModel.setDisplay("block");

    var clearModel = new UI.Button('清理参数').onClick(onClearParamsClick);
    ModelEvents.add(clearModel);
    clearModel.setDisplay("block");
    container.add(ModelEvents);
    //////////////////////////////////////////////////////////////////////////////////////////////////////




    //清理参数
    function onClearParamsClick() {

        //增加块段模型的清理参数（于晶晶）
        if (ModelType.dom.value == 0) {//块段模型的12个参数以及模型名称
            MineralModelName.setValue("");
            StartX.setValue(0);
            StartY.setValue(0);
            StartZ.setValue(0);
            GlobalX.setValue(0);
            GlobalY.setValue(0);
            GlobalZ.setValue(0);
            BlockX.setValue(0);
            BlockY.setValue(0);
            BlockZ.setValue(0);
            RotaryX.setValue(0);
            RotaryY.setValue(0);
            RotaryZ.setValue(0);

        }
        else { //椭球模型的清理参数
            ModelName.setValue("");
            Ang3.setValue(0);
            Ang2.setValue(0);
            Ang1.setValue(0);
            Radius1.setValue(0);
            Radius2.setValue(0);
            Radius3.setValue(0);
            MidY.setValue(0);
            MidX.setValue(0);
            MidZ.setValue(0);

        }

    }
    //卸载模型
    var cubes = [];
    var spheres = [];
    function onDeleModelClick() {
        if (ModelType.dom.value == 0) { //块段模型
            $.each(cubes, function (i, deleCube) {
                editor.removeObject(deleCube);
            });
        }
        else { //椭球模型
            if (tmpMainLine != undefined) {
                editor.sceneHelpers.remove(tmpMainLine);
            }
            $.each(spheres, function (i, deleSphere) {
                editor.removeObject(deleSphere);
            });

        }
    }

    //保存模型
    function onSaveModelClick() {
        if (ModelType.dom.value == 0) { //块段模型
            //保存块段立方体
            //增加块段模型的保存（于晶晶）
            var Mineralpost_data = {};
            var pointsList = [];
            var point = new THREE.Vector3();
            Mineralpost_data.startX = StartX.getValue();
            Mineralpost_data.startY = StartY.getValue();
            Mineralpost_data.startZ = StartZ.getValue();

            Mineralpost_data.name = MineralModelName.getValue();

            Mineralpost_data.lengX = GlobalX.getValue();
            Mineralpost_data.lengY = GlobalY.getValue();
            Mineralpost_data.lengZ = GlobalZ.getValue();

            Mineralpost_data.blongX = BlockX.getValue();
            Mineralpost_data.blongY = BlockY.getValue();
            Mineralpost_data.blongZ = BlockZ.getValue();

            Mineralpost_data.rlongX = RotaryX.getValue();
            Mineralpost_data.rlongY = RotaryY.getValue();
            Mineralpost_data.rlongZ = RotaryZ.getValue();

            Mineralpost_data.metalType = editor.cur_metal;
            console.log("save");


            $.ajax({
                type: "POST", //访问WebService使用Post方式请求
                contentType: "application/json", //WebService 会返回Json类型
                url: "../getdata/WellInfo2.asmx/SaveMineral", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                data: $.toJSON(Mineralpost_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                dataType: 'json',
                success: function (object) { //回调函数
                    alert(object.message);
                },
                complete: function (object) {
                    cube = undefined;
                }
            });
        }
        else { //椭球模型
            //保存椭球体
            var post_data = {};
            var pointsList = [];
            var point = new THREE.Vector3();
            post_data.x = MidX.getValue();
            post_data.y = MidY.getValue();
            post_data.z = MidZ.getValue();
            post_data.name = ModelName.getValue();
            post_data.a = Radius1.getValue();
            post_data.b = Radius2.getValue();
            post_data.c = Radius3.getValue();
            post_data.theta = Ang1.getValue();
            post_data.phi = Ang2.getValue();
            post_data.rotate = Ang3.getValue();

            $.ajax({
                type: "POST", //访问WebService使用Post方式请求
                contentType: "application/json", //WebService 会返回Json类型
                url: "../getdata/WellInfo2.asmx/SaveEllipsoid", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                dataType: 'json',
                success: function (object) { //回调函数
                    alert(object.message);
                },
                complete: function (object) {
                    sphere = undefined;
                }
            });
        }
    }

    //生成模型
    function onAddModelClick() {
        if (ModelType.dom.value == 0) { //块段模型
            createMineralObject();
        }
        else { //椭球模型
            // createEllipObject();
            createNewEllipObject();
        }
    }

    //模型类型
    function onMathObjectTypeChange() {

        if (ModelType.dom.value == 0) {//块段
            EllipModelParams.setDisplay('none');
            MineralModelParams.setDisplay('block');
            saveModel.setDisplay("block");
            clearModel.setDisplay("block");
        }
        else {//椭球
            EllipModelParams.setDisplay('block');
            MineralModelParams.setDisplay('none');
            saveModel.setDisplay("block");
            clearModel.setDisplay("block");
        }
    }

    //中心点
    function onAddMiddlePointClick() { //选择中心点
        signals.operModeChanged.dispatch('select_midPoint'); //发送增加节点的信号，在viewport中定义具体的操作
    }

    //椭球模型
    var sphere;
    function createEllipObject() {
        if (sphere != undefined) {
            editor.removeObject(sphere);
        }
        var a = Radius1.getValue(); //长轴
        var b = Radius2.getValue(); //次轴
        var c = Radius3.getValue(); //短轴
        var theta = Ang1.getValue() / 180 * Math.PI; //方位角
        var phi = Ang2.getValue() / 180 * Math.PI; //倾角水平
        var rotate = Ang3.getValue() / 180 * Math.PI; //未知（球体旋转角度）
        sphere = new THREE.Mesh(new THREE.ESphereGeometry(a, b, c, 100, 100), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
        //        sphere.rotation.z = rotate; //绕z轴转
        if (MidX.getValue() != 0) {
            sphere.position.x = MidX.getValue() - parseFloat(editor.cur_center[0]);
        }
        else {
            sphere.position.x = 0;
        }
        if (MidY.getValue() != 0) {
            sphere.position.z = MidY.getValue() - parseFloat(editor.cur_center[1]);
        }
        else {
            sphere.position.z = 0;
        }
        if (MidZ.getValue() != 0) {
            sphere.position.y = MidZ.getValue() - parseFloat(editor.cur_center[2]);
        }
        else {
            sphere.position.y = 0;
        }



        /////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：修改椭球体旋转角度(20151013)
        //在右手坐标系下，默认椭球体的长抽为x轴，次轴为z轴，短轴为y轴

        //椭球体中三轴参考点，默认为标准右手坐标系下三轴参考点
        var axs_XPoint = new THREE.Vector3(sphere.position.x + a, sphere.position.y, sphere.position.z);
        var axs_YPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + c, sphere.position.z);
        var axs_ZPoint = new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z + b);

        //椭球中心点
        var center_point = new THREE.Vector3();
        center_point.x = sphere.position.x;
        center_point.y = sphere.position.y;
        center_point.z = sphere.position.z;

        //椭球体转动参考点
        var aim_point = new THREE.Vector3();


        //方位角加倾角加倾俯角
        if (theta != null && phi != null) {
            //var theta_addX = a * Math.sin(theta) * Math.cos(phi);
            //var theta_addY = a * Math.cos(theta);
            //var theta_addZ = a * Math.sin(theta) * Math.sin(phi);

            var theta_addX = a * Math.sin(theta) * Math.cos(phi) * Math.cos(rotate);
            var theta_addY = a * (Math.sin(rotate) * Math.sin(phi) * Math.sin(theta) + Math.cos(rotate) * Math.cos(theta));
            var theta_addZ = a * (Math.cos(rotate) * Math.sin(phi) * Math.sin(theta) - Math.sin(rotate) * Math.cos(theta));



            console.log(theta_addX, theta_addY, theta_addZ);
            aim_point.x = center_point.x + theta_addX;
            aim_point.y = center_point.y + theta_addY;
            aim_point.z = center_point.z + theta_addZ;
            sphere.lookAt(aim_point.clone());
            //            sphere.lookAt(new THREE.Vector3(0,0,0));
            console.log(theta, phi, rotate, aim_point);
            /////////////////////////////////////////转动后的三轴参考点
            axs_XPoint = aim_point.clone();
            axs_YPoint.x = center_point.x + c * Math.cos(theta);
            axs_YPoint.y = center_point.y + c * Math.sin(theta);
            axs_YPoint.z = center_point.z;

            //////////////////////////////////////////测试使用的主轴辅助线
            var geometry = new THREE.Geometry();
            geometry.vertices.push(aim_point.clone(), center_point.clone());
            tmpMainLine = new THREE.Line(geometry, new THREE.LineDashedMaterial({ color: 0xff0000, linewidth: 2, gapSize: 5 }), THREE.LineStrip);
            tmpMainLine.obj_type = "tmpMainLine";
            editor.sceneHelpers.add(tmpMainLine);

            //            var geometry1 = new THREE.Geometry();
            //            geometry1.vertices.push(axs_YPoint.clone(), center_point.clone());
            //            var tmpThetaLine1 = new THREE.Line(geometry1, new THREE.LineDashedMaterial({ color: 0x000000, linewidth: 2, gapSize: 5 }), THREE.LineStrip);
            //            tmpThetaLine1.obj_type = "tmpThetaLine1";
            //            editor.sceneHelpers.add(tmpThetaLine1);

            //            var geometry2 = new THREE.Geometry();
            //            geometry2.vertices.push(axs_ZPoint.clone(), center_point.clone());
            //            var tmpThetaLine2 = new THREE.Line(geometry2, new THREE.LineDashedMaterial({ color: 0xff00ff, linewidth: 2, gapSize: 5 }), THREE.LineStrip);
            //            tmpThetaLine2.obj_type = "tmpThetaLine2";
            //            editor.sceneHelpers.add(tmpThetaLine2);
            //////////////////////////////////////////////////////////////////
        }
        sphere.castShadow = sphere.receiveShadow = true;
        sphere.visible = true;
        sphere.obj_type = "ellipsoid_model";
        editor.addObject(sphere);
        //        sphere.lookAt(new THREE.Vector3(10,10,10));
        spheres.push(sphere);

    }
    
    //黄清风新版椭球模型
    var newsphere;
    function createNewEllipObject() {
        if (newsphere != undefined) {
            editor.removeObject(newsphere);
        }
        var a = Radius1.getValue(); //长轴
        var b = Radius2.getValue(); //次轴
        var c = Radius3.getValue(); //短轴
        var theta = Ang1.getValue() / 180 * Math.PI; //方位角
        var phi = Ang2.getValue() / 180 * Math.PI; //倾角水平
        var rotate = Ang3.getValue() / 180 * Math.PI; //未知（球体旋转角度）
        var centerx = 0;
        var centery = 0;
        var centerz = 0;
        if (MidX.getValue() != 0) {
            centerx = MidX.getValue() - parseFloat(editor.cur_center[0]);
        }
        if (MidY.getValue() != 0) {
            centery = MidY.getValue() - parseFloat(editor.cur_center[1]);
        } if (MidZ.getValue() != 0) {
            centerz = MidZ.getValue() - parseFloat(editor.cur_center[2]);
        }
        newsphere = new THREE.Mesh(new THREE.NewESphereGeometry(a, b, c, theta, phi, rotate, 0, 0, 0), new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
        if (MidX.getValue() != 0) {
            newsphere.position.x = MidX.getValue() - parseFloat(editor.cur_center[0]);
        }
        else {
            newsphere.position.x = 0;
        }
        if (MidY.getValue() != 0) {
            newsphere.position.z = MidY.getValue() - parseFloat(editor.cur_center[1]);
        }
        else {
            newsphere.position.z = 0;
        }
        if (MidZ.getValue() != 0) {
            newsphere.position.y = MidZ.getValue() - parseFloat(editor.cur_center[2]);
        }
        else {
            newsphere.position.y = 0;
        }
        newsphere.castShadow = newsphere.receiveShadow = true;
        newsphere.visible = true;
        newsphere.obj_type = "ellipsoid_model";
        editor.addObject(newsphere);
        spheres.push(newsphere);
    }

    //块段模型
    var cube;
    var cubeParams = [];
    function selectMineralObject() {
        var objectIndex = MineralName.getValue() || 0;
        var post_data = {};
        post_data.object_name = editor.all_bb[objectIndex]; //矿体Id
        post_data.object_id = objectIndex; //矿体Id
        //        post_data.cur_batch = editor.cur_batch + "";
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/GetBb", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            async: false,
            success: function (object) { //回调函数
                cubeParams.length = 0;
                cubeParams.push(object.cur_ox, object.cur_oy, object.cur_oz, object.cur_lengthX, object.cur_lengthY, object.cur_lengthZ, object.cur_lengthBX, object.cur_lengthBY, object.cur_lengthBZ);
            }
        });
    }

    function createMineralObject() {

        if (cube != undefined) {
            editor.removeObject(cube);
        }

        //        if (cubeParams.length == 0) {
        //            selectMineralObject();
        //        }

        //老版本的生成块段模型
        //        var BMidX = (parseFloat(cubeParams[0]) + parseFloat(cubeParams[3]) + parseFloat(cubeParams[0])) / 2;
        //        var BMidZ = (parseFloat(cubeParams[1]) + parseFloat(cubeParams[4]) + parseFloat(cubeParams[1])) / 2;
        //        var BMidY = (parseFloat(cubeParams[2]) + parseFloat(cubeParams[5]) + parseFloat(cubeParams[2])) / 2;
        //        var BLengthX = parseFloat(cubeParams[3]);
        //        var BLengthZ = parseFloat(cubeParams[4]);
        //        var BLengthY = parseFloat(cubeParams[5]);
        //        var bSegmentX = parseFloat(cubeParams[3]) / parseFloat(cubeParams[6]);
        //        var bSegmentZ = parseFloat(cubeParams[4]) / parseFloat(cubeParams[7]);
        //        var bSegmentY = parseFloat(cubeParams[5]) / parseFloat(cubeParams[8]);
        //        var geometry = new THREE.BoxGeometry(BLengthX, BLengthY, BLengthZ, bSegmentX, bSegmentY, bSegmentZ);
        //        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        //        cube = new THREE.Mesh(geometry, material);

        //        cube.position.x = BMidX;
        //        cube.position.y = BMidY;
        //        cube.position.z = BMidZ;
        //        cube.castShadow = cube.receiveShadow = true;
        //        cube.obj_type = "cube_model";
        //        cube.visible = true;
        //        editor.addObject(cube);
        //        cubes.push(cube);

        //根据输入的参数生成块段模型（于晶晶）
        var startX = StartX.getValue();
        var startY = StartY.getValue();
        var startZ = StartZ.getValue();
        console.log("startZ:" + startZ);

        var globalX = GlobalX.getValue();
        var globalZ = GlobalY.getValue();
        var globalY = GlobalZ.getValue();

        var blockX = BlockX.getValue();
        var blockZ = BlockY.getValue();
        var blockY = BlockZ.getValue();

        var BMidX = (startX + globalX + startX) / 2
        var BMidZ = (startY + globalZ + startY) / 2;
        var BMidY = (startZ + globalY + startZ) / 2;

        var bSegmentX = globalX / blockX;
        var bSegmentY = globalY / blockY;
        var bSegmentZ = globalZ / blockZ;

        console.log("bSegmentY:" + bSegmentY);
        var geometry = new THREE.BoxGeometry(globalX, globalY, globalZ, bSegmentX, bSegmentY, bSegmentZ);
        console.log(geometry);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        console.log(material);
        cube = new THREE.Mesh(geometry, material);
        console.log(cube);

        cube.position.x = BMidX;
        cube.position.y = BMidY;
        cube.position.z = BMidZ;
        console.log(cube.position.z);
        cube.castShadow = cube.receiveShadow = true;
        cube.obj_type = "cube_model";
        cube.visible = true;
        editor.addObject(cube);
        cubes.push(cube);

    }
    signals.sphereMidPointSelected.add(function () {
        if (editor.o_MidPoint.length != 0) {
            MidY.setValue(editor.o_MidPoint.position.z + parseFloat(editor.cur_center[1]));
            MidZ.setValue(editor.o_MidPoint.position.y + parseFloat(editor.cur_center[2]));
            MidX.setValue(editor.o_MidPoint.position.x + parseFloat(editor.cur_center[0]));
        }

    });
    return container;

}
