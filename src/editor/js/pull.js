function generateWellStart() {
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
}
var Pull = function (editor) {

};
Pull.prototype = {
//    generateWellStart: function () {
//        var canvas = document.createElement('canvas');
//        canvas.width = 32;
//        canvas.height = 32;
//
//        var context = canvas.getContext('2d');
//        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
//        gradient.addColorStop(0, 'rgba(255,255,255,1)');
//        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
//        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
//        gradient.addColorStop(1, 'rgba(0,0,0,1)');
//
//        context.fillStyle = gradient;
//        context.fillRect(0, 0, canvas.width, canvas.height);
//
//        return canvas;
//    },
    parseDrills: function (wells) {
//        var p = this;
        ////////////////////////////////////////////////////////////
        $.each(wells.data, function (i, well) {
            var next_point = new THREE.Vector3();
            var point = new THREE.Vector3();
            var geometry = new THREE.Geometry();
            var next_color, next_value, next_lvalue, next_amount, next_lvalues;
            ////////////////////////////////////////////////////////郭佳宁：记录每条井上的辅助信息（品位、岩性、平米铀量）及井口不重叠点集
            var well_helperInfo = [];
            var well_helperPS = [];
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $.each(well.ps, function (i, v) {
                point.x = v.sX;
                point.z = v.sY;
                point.y = v.sZ;
                next_point.x = v.eX;
                next_point.z = v.eY;
                next_point.y = v.eZ;
                var color_value = parseInt(v.fc[0]);
                next_value = v.fv[0] || 0;
                next_lvalue = v.flv.toString();
                next_lvalue = next_lvalue == "" ? "空" : next_lvalue;
                next_amount = v.fa[0] || 0;
                geometry.vertices.push(point.clone(), next_point.clone());
                geometry.colors.push(new THREE.Color(color_value), new THREE.Color(color_value));
                well_helperInfo.push({ i: [next_value, next_amount, next_lvalue] }); //井口辅助信息
                well_helperPS.push(point.clone());
            });
            ///////////////////////////////////////////////////////////////////郭佳宁：记录井上的点
            editor.wells_infos[well.no] = {};
            editor.wells_infos[well.no]["hInfo"] = well_helperInfo;
            editor.wells_infos[well.no]["hPS"] = well_helperPS;
            ///////////////////////////////////////////////////////////////////////////////////////

            //显示井
            //var type = Math.random() > 0.1 ? THREE.LineStrip : THREE.LinePieces;
            var type = THREE.LinePieces;
            var real = well.real == 1 ? 2 : 1;
            var real_opacity = well.real == 1 ? 1 : 0.5;
            //var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff,linewidth: 2 } ), type );

            //////////////////////////////////////////////////////////////////郭佳宁：修改加载计划井口样式（白色细虚线）
            var object = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, linewidth: real, opacity: real_opacity }), type); //实际井口
            if (real == 1) {
                object = new THREE.Line(geometry, new THREE.LineDashedMaterial({ vertexColors: THREE.VertexColors, linewidth: real, gapSize: 5, opacity: real_opacity }), type); //虚拟井口
            }
            object.name = well.no;
            object.des = well.des;
            object.obj_type = 'well';
            object.obj_id = well.wid;
            object.real = real;
            //parentTransform.add( object );
            editor.addObject(object);
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////马老师原版：井口初始点信息
            // 显示井口
            var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: new THREE.Texture(generateWellStart()),
                blending: THREE.AdditiveBlending
            }));
            sprite.scale.set(20, 20, 6.0);
//            if (object.geometry.vertices.length != 0){
                sprite.position = object.geometry.vertices[0].clone();
//            }

            sprite.name = well.no;
            sprite.parent_name = well.no;
            sprite.obj_type = 'well_start';
            editor.sceneHelpers.add(sprite);

            //显示label ///////////////////////////////////////////////////////////修改label的颜色20160413 王颖

//                    var wellFlag = well.no.split("-")[1];
//                    console.log("计划孔标注-" + wellFlag);
//                    var spritey;
//                    if (wellFlag == "注") {
//                        spritey = editor.makeTextSprite(" " + well.no + " ", { fontsize: 32, backgroundColor: { r: 255, g: 100, b: 100, a: 1} });
//                    } else {
//                        spritey = editor.makeTextSprite(" " + well.no + " ", { fontsize: 32, backgroundColor: { r: 100, g: 255, b: 100, a: 1} });
//                    }
            ///////////////////////end of
//                    spritey.position = object.geometry.vertices[0].clone();
//                    spritey.name = well.no;
//                    spritey.parent_name = well.no;
//                    spritey.obj_type = 'well_label';
//                    editor.sceneHelpers.add(spritey);
        });
    },
    loadDetailWell: function (is_init, real, key) {
//        var p = this;
        var post_data = {};
        post_data.is_init = is_init;
        post_data.is_real = real;
        post_data.cur_batch = editor.cur_batch + "";
        post_data.key = key;
        if (real) {
            editor.destoryObject("well");
        }
        editor.post("/drill/load",post_data, this.parseDrills);
//        $.ajax({
//            type: "POST", //访问WebService使用Post方式请求
//            contentType: "application/json", //WebService 会返回Json类型
//            url: "/drill/load", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
//            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
//            dataType: 'json',
//            async: false,
//            success: function (wells) { //回调函数
//
//            }
//
//        });

    }
};