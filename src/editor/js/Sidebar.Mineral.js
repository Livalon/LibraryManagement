Sidebar.Mineral = function (editor) {

    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed(true);

    container.addStatic(new UI.Text('实体建模'));
    container.add(new UI.Break());

    // class

    var MineralRow = new UI.Panel();
    var MineralName = new UI.Input().setWidth('120px').setColor('#444').setFontSize('12px');

    MineralRow.add(new UI.Text('矿体名称').setWidth('60px'));
    MineralRow.add(MineralName);
    var AddMineral = new UI.Button('新建矿体').onClick(onAddMineralClick);
    MineralRow.add(AddMineral);
    container.add(MineralRow);
    container.add(new UI.Break());

    var MineralSelectRow = new UI.Panel();
    var MineralSelect = new UI.Select().setOptions(editor.all_mineral).setWidth('150px').setColor('#444').setFontSize('12px').onChange(updateMineral);

    MineralSelectRow.add(new UI.Text('当前矿体').setWidth('90px'));
    MineralSelectRow.add(MineralSelect);
    container.add(MineralSelectRow);

    var BlockRow = new UI.Panel();

    //    var BlockSelect = new UI.Select().setOptions(editor.all_block).setWidth('150px').setColor('#444').setFontSize('12px').onChange(updateBlock);
    //    BlockRow.add(new UI.Text('当前块段').setWidth('90px'));
    //    BlockRow.add(BlockSelect);
    //    BlockRow.add(new UI.Break());
    //    BlockRow.add(new UI.Break());
    var SelectedObject = new UI.FancySelect().setId('selected_object');
    BlockRow.add(SelectedObject);
    BlockRow.add(new UI.Break());

    //    var NewBlockName = new UI.Input().setWidth('180px').setColor('#444').setFontSize('12px');
    //    BlockRow.add(new UI.Text('新块段名').setWidth('60px'));
    //    BlockRow.add(NewBlockName);
    //    BlockRow.add(new UI.Break());

    var AddBlock = new UI.Button('分配矿体').onClick(onAddBlockClick);
    BlockRow.add(AddBlock);
    //    var FillBlock = new UI.Button('合并当前块段').onClick(onFillBlockClick);
    //    BlockRow.add(FillBlock);
    //    var DelBlock = new UI.Button('删除当前块段').onClick(onDelBlockClick);
    //    BlockRow.add(DelBlock);
    var ClearSelected = new UI.Button('清除当前选择').onClick(onClearSelClick);
    BlockRow.add(ClearSelected);

    container.add(BlockRow);
    container.add(new UI.Break());


    signals.updateBatch.add(function (object) {

        updateUI();

    });

    function updateUI() {
        editor.loadMineral(editor.cur_batch);
        MineralSelect.setOptions(editor.all_mineral);
        MineralSelect.setValue(editor.cur_mineral);
        MineralName.setValue("");
    }

    function onAddMineralClick() {
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        post_data.mineral_name = MineralName.getValue();
        if (MineralName.getValue() != "") {
            $.ajax({
                type: "POST", //访问WebService使用Post方式请求
                contentType: "application/json", //WebService 会返回Json类型
                url: "../getdata/WellInfo2.asmx/AddMineral", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                dataType: 'json',
                async: false,
                success: function (res) { //回调函数
                    if (res.result) {
                        updateUI();
                    } else {
                        alert(res.message);
                    }
                }
            });
        }

    }

    function updateMineral() {
        editor.cur_mineral = MineralSelect.getValue();
    }
    //    function updateBlock() {
    //        editor.cur_block = BlockSelect.getValue();
    //    }
    function onAddBlockClick() {
        var post_data = {};
        post_data.mineral_id = editor.cur_mineral + "";
        post_data.cur_batch = editor.cur_batch + "";
        post_data.block_name = editor.all_mineral[MineralSelect.getValue()];
        object_ids = [];
        objects = [];
        object_ori = [];
        $.each(editor.oriobjectlist, function (index, value) {
            object_ids.push(value.obj.obj_id);
            objects.push(value.obj);
            object_ori.push(value.obj.ori ? true : false);
        });
        post_data.objects = object_ids;
        post_data.ori_flags = object_ori;
//        if (isExplore.dom.checked == true) {
//            post_data.explored = 1;
//        }
//        else {
//            post_data.explored = 0;
//        }
        if (post_data.block_name != "") {
            $.ajax({
                type: "POST", //访问WebService使用Post方式请求
                contentType: "application/json", //WebService 会返回Json类型
                url: "../getdata/WellInfo2.asmx/CreateBlock", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                dataType: 'json',
                success: function (object) {
                    if (object.result) {
                        $.each(objects, function (i, v) {
                            editor.removeObject(v);
                        });
                        var loader = new THREE.JSONLoader();
                        var geom = loader.parse(object);
                        var MinedScale = (object.metadata.ori === 'true') ? 0 : object.metadata.MinedScale;
                        var loadedMesh = editor.createMesh(object.metadata.object_color, geom.geometry);
                        //////////////////////////////////////////////////////////////////////////////////
                        //console.log("object", geom.geometry.vertices);
                        loadedMesh.ori_name = object.metadata.ori_name;
                        loadedMesh.name = object.metadata.object_name;
                        loadedMesh.obj_id = object.metadata.object_id;
                        ///////////////////////////////////////////////////////郭佳宁：矿体点集
                        loadedMesh.geom = geom.geometry.vertices;
                        ///////////////////////////////////////////////////////郭佳宁：增加矿体的区域信息
                        loadedMesh.areaId = object.metadata.area_id || 0;
                        loadedMesh.unitIds = object.metadata.unit_ids;
                        //////////////////////////////////////////////////////////////////////////////
                        loadedMesh.obj_type = 'object';
                        loadedMesh.ori = (object.metadata.ori === 'true');
                        loadedMesh.leaf = (object.metadata.leaf === 'true');
                        loadedMesh.des = object.metadata.object_des;
                        loadedMesh.IsPlan = object.metadata.is_plan;
                        //console.log("plan_real", loadedMesh.IsPlan);
                        if (!loadedMesh.ori) {
                            loadedMesh.De_Acreage = object.metadata.De_Acreage;
                            loadedMesh.De_MetalAmount = object.metadata.De_MetalAmount;
                            loadedMesh.De_Percentage = object.metadata.De_Percentage;
                            loadedMesh.De_Volume = object.metadata.De_Volume;
                            loadedMesh.Mined = object.metadata.Mined;
                            loadedMesh.Is_Global = object.metadata.Is_Global;
                            loadedMesh.ContentType = object.metadata.ContentType;
                            loadedMesh.Density = object.metadata.Density;
                            loadedMesh.Acreage = object.metadata.Acreage;
                            loadedMesh.Volume = object.metadata.Volume;
                            loadedMesh.Metal = '未估值';
                            loadedMesh.Metal_Amount = 0;
                            loadedMesh.Metal_Percentage = 0;
                            loadedMesh.MinedScale = object.metadata.MinedScale;
                        }
                        
                        editor.addObject(loadedMesh);
                        if (object.metadata.parent != undefined) {
                            editor.parent(loadedMesh, editor.findByObjId(object.metadata.parent));
                        }
                        //////////////////////////////////////////////////////////////////////////////////
                        editor.select(null);
                        editor.select(loadedMesh);
                    } else {
                        alert(object.message);
                    }

                }
            });
        }
    }
   
    function onClearSelClick() {
        editor.oriobjectlist = [];
        SelectedObject.setOptions(editor.oriobjectlist);
    }

    signals.objectSelected.add(function (object) {
        var objectType = editor.getObjectType(object);
        var objectTypeName = editor.getObjectTypeName(object);
        if (objectType === "object" && (object.ori || object.leaf)) {
            var flag = true;
            $.each(editor.oriobjectlist, function (index, value) {
                if (value.value === object.id) { flag = false; }
            });
            if (flag) {
                editor.oriobjectlist.push({ value: object.id, html: '<span class="type ' + objectType + '">' + objectTypeName + '</span> ' + object.name, obj: object });
                SelectedObject.setOptions(editor.oriobjectlist);
            }
            if (editor.selected !== null) {
                SelectedObject.setValue(editor.selected.id);
            }
        }
    });
    signals.objectRemoved.add(function (object) {
        var objectType = editor.getObjectType(object);
        if (objectType === "object" && (object.ori || object.leaf)) {
            var i = 0;
            $.each(editor.oriobjectlist, function (index, value) {
                if (value != undefined && value.value === object.id) {
                    editor.oriobjectlist.splice(i, i + 1);
                }
                i++;
            });
            SelectedObject.setOptions(editor.oriobjectlist);
        }


    });

    return container;

}
