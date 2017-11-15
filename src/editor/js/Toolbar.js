var Toolbar = function (editor) {
    var signals = editor.signals;
    var container = new UI.Panel();
    container.setId("toolbar")
    var buttons = new UI.Panel();
    buttons.dom.style.float = "right";
    container.add(buttons);

    // grid
    var size = new UI.Integer(1000).onChange(updategrid);
    size.dom.style.width = '42px';
    buttons.add(new UI.Text('区域大小: '));
    buttons.add(size);
    var grid = new UI.Integer(20).onChange(updategrid);
    grid.dom.style.width = '42px';
    buttons.add(new UI.Text('网格大小: '));
    buttons.add(grid);
    ////////////////////////////////////////////////郭佳宁：缩放实体辅助节点
    var point_realize = new UI.Number(0.8).onChange(function () {
        editor.point_realize = point_realize.getValue();
        console.log(editor.point_realize);
    });
    point_realize.dom.style.width = '42px';
    buttons.add(new UI.Text('节点大小: '));
    buttons.add(point_realize);
    ////////////////////////////////////////////////////////////////////////
    var viewgrid = new UI.Checkbox(true).onChange(updategrid);
    buttons.add(viewgrid);
    buttons.add(new UI.Text('显示网格'));
    ////////////////////////////////////////////////郭佳宁：是否捕捉中点
    var searchMidPoint = new UI.Checkbox(true).onChange(function () {
        editor.isSearchMidPoint = searchMidPoint.getValue();
//        console.log(editor.isSearchMidPoint);
    });
    buttons.add(searchMidPoint);
    buttons.add(new UI.Text('捕捉中点'));
    ///////////////////////////////////////////////////////////////////////

    var view = new UI.Checkbox(false).onChange(updateview);
    buttons.add(view);
    buttons.add(new UI.Text('黑色主题'));
    var surface = new UI.Checkbox(false).onChange(function () {
        signals.draw_HP.dispatch({ size: size.getValue(), step: grid.getValue(), surface: surface.dom.checked });

    });
    buttons.add(surface);
    buttons.add(new UI.Text("显示地表"));



    ///////////////////////////////////////////////////////////7个视角by周静
    var visual_above = new UI.Button('↓').onClick(function () {
        signals.viewChanged.dispatch("camera_above");
    });
    buttons.add(visual_above);

    var visual_left = new UI.Button('→').onClick(function () {
        signals.viewChanged.dispatch("camera_left");
    });
    buttons.add(visual_left);

    var visual_below = new UI.Button('↑').onClick(function () {
        signals.viewChanged.dispatch("camera_below");
    });
    buttons.add(visual_below);

    var visual_right = new UI.Button('←').onClick(function () {
        signals.viewChanged.dispatch("camera_right");
    });
    buttons.add(visual_right);

    var visual_front = new UI.Button('×').onClick(function () {
        signals.viewChanged.dispatch("camera_front");
    });
    buttons.add(visual_front);

    var visual_back = new UI.Button('•').onClick(function () {
        signals.viewChanged.dispatch("camera_back");
    });
    buttons.add(visual_back);

    var visual_initial = new UI.Button('原始视角').onClick(function () {
        signals.viewChanged.dispatch("camera_initial");
    });
    buttons.add(visual_initial);
    ///////////////////////////////////////////////////////////



    function updategrid() {
        editor.world = size.getValue();
        editor.removeObject(editor.hp);
        var horizontal_g = new THREE.PlaneGeometry(editor.world * 2, editor.world * 2, 10, 10);
        var horizontal_m = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.1, transparent: true, side: THREE.DoubleSide });
        var horizontal_plane = new THREE.Mesh(horizontal_g, horizontal_m);
        horizontal_plane.rotation.x = Math.PI / 2;
        //    horizontal_plane.position.y=1;
        horizontal_plane.visible = false;
        horizontal_plane.name = '地表';
        horizontal_plane.obj_type = 'hp';
        editor.addObject(horizontal_plane);
        editor.hp = horizontal_plane;
        signals.gridChanged.dispatch({ all: size.getValue(), cell: grid.getValue(), view: viewgrid.getValue() });
    }
   
    function updateview() {
        if (view.getValue() === true) {
            editor.setTheme('/editor/css/dark.css');
            editor.config.setKey('theme', '/editor/css/dark.css');
        }
        else {
            editor.setTheme('/editor/css/light.css');
            editor.config.setKey('theme', '/editor/css/light.css');
        }

    }

    return container;
};
