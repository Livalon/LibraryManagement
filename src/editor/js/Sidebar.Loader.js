Sidebar.Loader = function (editor) {
    var meshCount = 0;
    var signals = editor.signals;
    var pull = new Pull(editor);
    var container = new UI.CollapsiblePanel();
    container.setCollapsed(true);

    container.addStatic(new UI.Text('开始'));
    container.add(new UI.Break());

    var buttons = new UI.Panel();

    var params = new UI.Panel();

    container.add(buttons);
    container.add(params);

    var well_panel = new UI.Panel();
    var well_query = new UI.Input().setWidth('150px');
    well_panel.add(new UI.Text('钻孔：').setWidth('90px'));
    well_panel.add(well_query);
    buttons.add(well_panel);
    var well_botton_panel = new UI.Panel();
    function parseDrill(drill) {
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors, linewidth: 2, opacity: 0 });
        $.each(drill.samples, function (i, v) {
            var start = new THREE.Vector3(v.start.x, v.start.y, v.start.z);
            var end = new THREE.Vector3(v.end.x, v.end.y, v.end.z);
            geometry.vertices.push(start, end);
            geometry.colors.push(new THREE.Color(v.color), new THREE.Color(v.color));
        });
        // 显示井
        var line = new THREE.LineSegments(geometry, material);
        line.position.x = drill.pithead.x;
        line.position.y = drill.pithead.y;
        line.position.z = drill.pithead.z;
        return line;
    }
    function parseDrills(res) {
        var group = new THREE.Group();
        $.each(res.data, function (i, drill) {
            group.add(parseDrill(drill));
        });
        editor.addObject(group);
    }

    var load_init_well = new UI.Button('原始孔').setWidth('60px').onClick(onAddWellClick);
//        function () {
//        editor.post("/drill/load",null,parseDrills)
//    });

    well_botton_panel.add(load_init_well);
    var load_well = new UI.Button('组合孔').setWidth('60px').onClick(onAddWellClick);
    well_botton_panel.add(load_well);
    var load_jihua_well = new UI.Button('计划孔').setWidth('60px').onClick(onAddJiHuaWellClick);
    well_botton_panel.add(load_jihua_well);
    var destory_well = new UI.Button('卸载孔').setWidth('60px').onClick(onDestoryWellClick);
    well_botton_panel.add(destory_well);
    buttons.add(well_botton_panel);

    var line_panel = new UI.Panel();
    var line_query = new UI.Input().setWidth('150px');
    line_panel.add(new UI.Text('线圈：').setWidth('90px'));
    line_panel.add(line_query);
    buttons.add(line_panel);
    var line_botton_panel = new UI.Panel();
    var load_line = new UI.Button('加载线圈').setWidth('120px').onClick(onAddLineClick);
    line_botton_panel.add(load_line);
    var destory_line = new UI.Button('卸载线圈').setWidth('120px').onClick(onDestoryLineClick);
    line_botton_panel.add(destory_line);
    buttons.add(line_botton_panel);

    var object_panel = new UI.Panel();
    var object_query = new UI.Input().setWidth('150px');
    object_panel.add(new UI.Text('实体：').setWidth('90px'));
    object_panel.add(object_query);
    buttons.add(object_panel);
    var object_botton_panel = new UI.Panel();
    ////////////////////////////////////////////////////////////////郭佳宁：增加细分加载块段功能
    var load_object = new UI.Button('加载计划').setWidth('80px').onClick(onAddObjectClick);
    object_botton_panel.add(load_object);

    var load_object_real = new UI.Button('加载实际').setWidth('80px').onClick(onAddObjectRealClick);
    object_botton_panel.add(load_object_real);
    ////////////////////////////////////////////////////////////////////////////////////////////
    var destory_object = new UI.Button('卸载实体').setWidth('80px').onClick(onDestoryObjectClick);
    object_botton_panel.add(destory_object);
    var object_color_panel = new UI.Panel();
    var object_color = new UI.Checkbox();
    object_color_panel.add(object_color);
    object_color_panel.add(new UI.Text('按经济颜色显示'));
    object_botton_panel.add(object_color_panel);
    buttons.add(object_botton_panel);



    var hline_panel = new UI.Panel();
    var hline_query = new UI.Input().setWidth('150px');
    hline_panel.add(new UI.Text('辅助线：').setWidth('90px'));
    hline_panel.add(hline_query);
    buttons.add(hline_panel);
    var hline_botton_panel = new UI.Panel();
    var load_hline = new UI.Button('加载辅助线').setWidth('120px').onClick(onAddHLineClick);
    hline_botton_panel.add(load_hline);
    var destory_hline = new UI.Button('卸载辅助线').setWidth('120px').onClick(onDestoryHLineClick);
    hline_botton_panel.add(destory_hline);
    buttons.add(hline_botton_panel);

    /////////////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：加载采区或抽注单元
    var auline_panel = new UI.Panel();
    var auline_query = new UI.Input().setWidth('150px');
    auline_panel.add(new UI.Text('区域：').setWidth('90px'));
    auline_panel.add(auline_query);
    buttons.add(auline_panel);
    var auline_botton_panel = new UI.Panel();
    //////////////////////////////////////////////////////////////////郭佳宁：增加细分区域类型
    var load_auline = new UI.Button('加载计划').setWidth('80px').onClick(onAddAULineClick);
    auline_botton_panel.add(load_auline);

    var load_auline_real = new UI.Button('加载实际').setWidth('80px').onClick(onAddAULineRealClick);
    auline_botton_panel.add(load_auline_real);
    ////////////////////////////////////////////////////////////////////////////////////////

    var destory_auline = new UI.Button('卸载区域').setWidth('80px').onClick(onDestoryAULineClick);
    auline_botton_panel.add(destory_auline);
    buttons.add(auline_botton_panel);

    //区域复选框
    var scopeInfo_botton_panel = new UI.Panel();
    var area_info = new UI.Checkbox(false).onChange(onAddAreaChange);
    scopeInfo_botton_panel.add(area_info);
    scopeInfo_botton_panel.add(new UI.Text('采区'));

    var unit_info = new UI.Checkbox(false).onChange(onAddUnitChange);
    scopeInfo_botton_panel.add(unit_info);
    scopeInfo_botton_panel.add(new UI.Text('抽注单元'));
    buttons.add(scopeInfo_botton_panel);


    ///////////////////////////////////////////////////郭佳宁：增加细分加载区域功能（20150805）
    //加载计划区域
    function onAddAULineClick() {
        var isRealScope = false;
        editor.loadAULine(auline_query.getValue(), area_info.getValue(), unit_info.getValue(), isRealScope);
    }
    //加载实际区域
    function onAddAULineRealClick() {
        var isRealScope = true;
        editor.loadAULine(auline_query.getValue(), area_info.getValue(), unit_info.getValue(), isRealScope);
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    function onDestoryAULineClick() {
        editor.select(null);
        editor.destoryObject("auline");
    }
    function onAddAreaChange() {
        editor.destoryObject("auline");
    }
    function onAddUnitChange() {
        editor.destoryObject("auline");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onAddInitWellClick() {
        
        signals.displayWellInfo.dispatch(true); //郭佳宁：显示井口辅助信息console
    }
    function onAddWellClick() {
        pull.loadDetailWell(false, true, well_query.getValue());
        //signals.displayWellInfo.dispatch(true); //郭佳宁：显示井口辅助信息console
    }
    function onAddJiHuaWellClick() {
        editor.loadDetailWell(true, false, well_query.getValue());
        signals.displayWellInfo.dispatch(true); //郭佳宁：显示井口辅助信息console
    }
    function onDestoryWellClick() {
        editor.select(null);
        editor.destoryObject("well");
        signals.displayWellInfo.dispatch(false);//郭佳宁：隐藏井口辅助信息console
    }

    //    // configure menu contents
    //    function onAddWellDetailClick () {
    //        editor.loadDetailWell();
    //    }

    function onAddLineClick() {
        editor.loadLine(line_query.getValue());

    }
    function onDestoryLineClick() {
        editor.select(null);
        editor.destoryObject("line");

    }
    //////////////////////////////////////////////////////////////////郭佳宁：增加细分加载块段功能（20150806）
    function onAddObjectClick() {
        var isRealObject = false;
        editor.loadObject(object_query.getValue(), object_color.getValue(),isRealObject);
    }
    function onAddObjectRealClick() {
        var isRealObject = true;
        editor.loadObject(object_query.getValue(), object_color.getValue(),isRealObject);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onDestoryObjectClick() {
        editor.select(null);
        editor.destoryObject("object");
    }

    function onAddHLineClick() {
        editor.loadHLine(hline_query.getValue());
    }
    function onDestoryHLineClick() {
        editor.select(null);
        editor.destoryObject("hline");
    }
    return container;

};