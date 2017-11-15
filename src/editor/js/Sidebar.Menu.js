Sidebar.Menu = function (editor) {
    var meshCount = 0;
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed(true);

    container.addStatic(new UI.Text('线编辑'));
    container.add(new UI.Break());

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add(buttons);
    container.add(params);

    var add_helper_plane = new UI.Button('添加辅助线').onClick(onHelperPlaneClick);
    buttons.add(add_helper_plane);
    var add_line = new UI.Button('添加圈矿线').onClick(onDrawLineClick);
    buttons.add(add_line);

    ////////////////////////////////////////////////////////////////////////////郭佳宁：添加计划井
    var add_well = new UI.Button('添加计划孔').onClick(onDrawWellClick);
    buttons.add(add_well);
    //////////////////////////////////////////////////////////////////////////////////////////////
    var measure = new UI.Button('测量').onClick(onMeasureClick);
    buttons.add(measure);
    ///于晶晶 ：钻孔平面布置图
    var drillLayout = new UI.Button('钻孔平面布置图').onClick(function () {
        var paraString = "cur_batch=" + editor.cur_batch;
        var targetURL = "../geo/drillLayout.html" + "?" + paraString;
        console.log("钻孔平面布置图"+paraString);
        window.open(targetURL, "钻孔平面布置图", "height=800, width=800"); //弹出新的标签页


    });
    buttons.add(drillLayout);

    ////////////////////////////////////////////////////////////////////////////////////////////
    //2016-03-01
    ///////////////////////////////////////////////////////////////////////////////////////////
    var test_well = new UI.Button('获取位置及与矿体交点').onClick(onPositionClick);
    buttons.add(test_well);
    var well_label = new UI.Text('井下延伸：');
    var well_input = new UI.Input();
    var objectRow = new UI.Panel();
    objectRow.add(well_label);
    objectRow.add(well_input);
    objectRow.setDisplay('none');
    buttons.add(objectRow);
    //////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////添加画井按钮    王颖
    var point = new UI.Button('画井').onClick(onDrawPointClick);
    buttons.add(point);
    var newRow = new UI.Panel();
    var determinantButton = new UI.Button("行列式").onClick(determinantButtonClick);
    var fivePointButton = new UI.Button("五点型").onClick(fivePointButtonClick);
    var sevenPointButton = new UI.Button("七点型").onClick(sevenPointButtonClick);
    newRow.add(determinantButton);
    newRow.add(fivePointButton);
    newRow.add(sevenPointButton);
    newRow.setDisplay('none');
    buttons.add(newRow);

    function determinantButtonClick() {
        editor.plan_type = 1;
    }
    function fivePointButtonClick() {
        editor.plan_type = 2;
    }
    function sevenPointButtonClick() {
        editor.plan_type = 3;

    }

    function onDrawPointClick() {

        newRow.setDisplay('block');
        signals.operModeChanged.dispatch("point");
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////end

    function onMeasureClick() {
        editor.select(null);
        signals.operModeChanged.dispatch('measure');

    }

    //    function onHelperPlaneClick () {

    //        var width = 2000;
    //        var height = 200;

    //        var widthSegments = 10;
    //        var heightSegments = 10;

    //        var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
    //        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00,  opacity: 0.1, transparent: true,side: THREE.DoubleSide  });
    //        var mesh = new THREE.Mesh( geometry, material );
    //        mesh.position.y=-100;
    //        //mesh.doubleSided = true;
    //        mesh.name = 'p' + ( ++ meshCount );
    //        mesh.obj_type = 'helper_plane';
    //        editor.addObject( mesh );
    //        //editor.select( mesh );

    //    }
    function onHelperPlaneClick() {
        editor.select(null);
        signals.operModeChanged.dispatch('draw_hline');
    }

    function onDrawLineClick() {
        editor.select(null);
        signals.operModeChanged.dispatch('draw_line');
    }
    function onDrawWellClick() {
        editor.select(null);
        signals.operModeChanged.dispatch('draw_well');
    }
    ////////////////////////////////////////////////////
    //2016-03-01
    ///////////////////////////////////////////////////
    function onPositionClick() {
        objectRow.setDisplay('block');
        editor.plan_well_depth = well_input.getValue();
        editor.select(null);
        signals.operModeChanged.dispatch('test_position');
    }
    return container;

}
