Sidebar.Object3D = function (editor) {

    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setDisplay('none');

    var objectType = new UI.Text().setTextTransform('uppercase');
    container.addStatic(objectType);
    container.add(new UI.Break());

    // uuid

    // name
    var objectNameRow = new UI.Panel();
    var objectName = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);

    objectNameRow.add(new UI.Text('名字').setWidth('90px'));
    objectNameRow.add(objectName);

    container.add(objectNameRow);

    // parent
    var objectParentRow = new UI.Panel();
    var objectParent = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);

    objectParentRow.add(new UI.Text('父块段').setWidth('90px'));
    objectParentRow.add(objectParent);

    container.add(objectParentRow);
    ////////////////////////////////////////////////////////////////////////////////////////////////马胜：矿体其他属性界面
    //area
    var ObjectProRow = new UI.Panel();
    var Acreage_P = new UI.Text().setWidth('150px').setColor('#00cc00').setFontSize('12px');
    ObjectProRow.add(new UI.Text('投影面积').setWidth('90px'));
    ObjectProRow.add(Acreage_P);
    
    var Volume_P = new UI.Text().setWidth('150px').setColor('#00cc00').setFontSize('12px');
    ObjectProRow.add(new UI.Text('体积').setWidth('90px'));
    ObjectProRow.add(Volume_P);

    var Metal_P = new UI.Text().setWidth('150px').setColor('#00cc00').setFontSize('12px');
    ObjectProRow.add(new UI.Text('金属类型').setWidth('90px'));
    ObjectProRow.add(Metal_P);
    var Metal_Amount_P = new UI.Text().setWidth('150px').setColor('#00cc00').setFontSize('12px');
    ObjectProRow.add(new UI.Text('金属量').setWidth('90px'));
    ObjectProRow.add(Metal_Amount_P);
    var Metal_Percentage_P = new UI.Text().setWidth('150px').setColor('#00cc00').setFontSize('12px');
    ObjectProRow.add(new UI.Text('品位').setWidth('90px'));
    ObjectProRow.add(Metal_Percentage_P);
    var MinedScale_P = new UI.Text().setWidth('150px').setColor('#0000cc').setFontSize('12px');
    ObjectProRow.add(new UI.Text('开采率').setWidth('90px'));
    ObjectProRow.add(MinedScale_P);

    var De_Heigth_P = new UI.Number().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('平均高度').setWidth('90px'));
    ObjectProRow.add(De_Heigth_P);

    var Mined_P = new UI.Checkbox().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('是否开采').setWidth('90px'));
    ObjectProRow.add(Mined_P);
    var Global_P = new UI.Checkbox().setWidth('90px').onChange(update);
    ObjectProRow.add(new UI.Text('是否作为一个块段').setWidth('150px'));
    ObjectProRow.add(Global_P);
    var De_Acreage_P = new UI.Number().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('默认面积').setWidth('90px'));
    ObjectProRow.add(De_Acreage_P);
    var De_Volume_P = new UI.Number().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('默认体积').setWidth('90px'));
    ObjectProRow.add(De_Volume_P);
    var De_Percentage_P = new UI.Number().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('默认品位').setWidth('90px'));
    ObjectProRow.add(De_Percentage_P);
    var De_MetalAmount_P = new UI.Number().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('默认金属量').setWidth('90px'));
    ObjectProRow.add(De_MetalAmount_P);
    var Density_P = new UI.Number().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('密度').setWidth('90px'));
    ObjectProRow.add(Density_P);
    var ContentType_P = new UI.Input().setWidth('150px').onChange(update);
    ObjectProRow.add(new UI.Text('储量类型').setWidth('90px'));
    ObjectProRow.add(ContentType_P);
    ObjectProRow.setDisplay("none"); //默认不可见
    container.add(ObjectProRow);
    ////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：增加实体所属采区或抽注单元
    //area
    var selectedAParentRow = new UI.Panel();
    var selectAParent = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(initUnits);
    selectedAParentRow.add(new UI.Text('所属采区').setWidth('90px'));
    selectedAParentRow.add(selectAParent);
    selectedAParentRow.setDisplay("none"); //默认不可见
    container.add(selectedAParentRow);

    //unit
    var selectUnits = []; //所选抽注单元集合
    var selectedUParentRow = new UI.Panel();
    var selectUParent = new UI.FancySelect().setId('selectUParent').setHeight("150px");

    selectedUParentRow.add(new UI.Text('所属抽注单元').setWidth('90px'));
    selectedUParentRow.add(selectUParent);
    selectedUParentRow.setDisplay("block"); //默认不可见
    container.add(selectedUParentRow);
    selectUParent.onChange(function () {
        ignoreObjectSelectedSignal = true;
        var selectKey = selectUParent.getValue();
        var selectValue = selectUParent.options[selectUParent.selectedIndex].innerText.substring(4);
        selectUnits.push({ "key": selectKey, "value": selectValue });
        editor.selectById(parseInt(selectUParent.getValue()));
        ignoreObjectSelectedSignal = false;
        update();
    });

    //    var selectedUParentRow = new UI.Panel();
    //    var selectUParent = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    //    selectedUParentRow.add(new UI.Text('所属抽注单元').setWidth('90px'));
    //    selectedUParentRow.add(selectUParent);
    //    selectedUParentRow.setDisplay("none"); //默认不可见
    //    container.add(selectedUParentRow);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // color
    var materialColorRow = new UI.Panel();
    var materialColor = new UI.Color().onChange(update);

    materialColorRow.add(new UI.Text('颜色').setWidth('90px'));
    materialColorRow.add(materialColor);
    container.add(materialColorRow);

    // position


    var objectPositionRow = new UI.Panel();
    var objectPositionX = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionY = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionZ = new UI.Number().setWidth('50px').onChange(update);

    objectPositionRow.add(new UI.Text('位置').setWidth('90px'));
    objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);

    container.add(objectPositionRow);
    //设置修改抽注状态   =========================================================================20160413  王颖
    var objectStateRow = new UI.Panel();
    var injectStateText = new UI.Text('抽注状态').setWidth('90px');
    objectStateRow.add(injectStateText);
    var stateSelect = new UI.Select();
    var options = ['抽', '注'];
    stateSelect.setOptions(options);
    objectStateRow.add(stateSelect);
    container.add(objectStateRow);
    //////////////////////////////////////////////////////////////////////////////////////////////////end of 20160413修改抽注状态

    // visible

    var objectVisibleRow = new UI.Panel();
    var objectVisible = new UI.Checkbox().onChange(update);

    objectVisibleRow.add(new UI.Text('是否可见').setWidth('90px'));
    objectVisibleRow.add(objectVisible);

    container.add(objectVisibleRow);

    // user data

    var objectUserDataRow = new UI.Panel();
    var objectUserData = new UI.TextArea().setWidth('150px').setHeight('40px').setColor('#444').setFontSize('12px').onChange(update);
    objectUserData.onKeyUp(function () {
        objectUserData.setBorderColor('#ccc');
        objectUserData.setBackgroundColor('');
    });

    objectUserDataRow.add(new UI.Text('描述').setWidth('90px'));
    objectUserDataRow.add(objectUserData);

    container.add(objectUserDataRow);

    ///////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：更新矿体所属采区和抽注单元
    var objectButtonRow = new UI.Panel();
    var ClearSelected = new UI.Button('清除当前选择').onClick(onClearSelectClick);
    objectButtonRow.add(ClearSelected);
    container.add(objectButtonRow);
    /////////////////////////////////////////20160413 王颖
    var selectSave = new UI.Button('保存').onClick(onSaveStateClick);
    objectButtonRow.add(selectSave);
    ////////////////////////////////////////////////////end of
    
    ////////////////////////////////////////////////////////////20160413 王颖
    function onSaveStateClick() {
        var object = editor.selected;
        var post_data = {};
        post_data.wellState = stateSelect.getValue();
        post_data.objectName = objectName.getValue();

        post_data.line_type = object.obj_type
        alert(object.obj_type)
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/updateWellState",
            data: $.toJSON(post_data),
            dataType: 'json',
            async: true,
            success: function (res) {
                update();
                alert("保存成功");

            },
            error: function (areas) {

            }
        });
    }
    function onClearSelectClick() {
        selectUParent.setOptions([]);
        selectAParent.setValue(0);
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        post_data.block_id = editor.selected.obj_id || 0;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/DeleObjectScope",
            data: $.toJSON(post_data),
            dataType: 'json',
            async: false,
            success: function (res) {

                editor.selected.unitIds = [];
                editor.selected.areaId = 0;

            },
            error: function (areas) {

            }
        });

    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function updateScaleX() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleX.getValue() / object.scale.x;

            objectScaleY.setValue(objectScaleY.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleY() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleY.getValue() / object.scale.y;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleZ() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleZ.getValue() / object.scale.z;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleY.setValue(objectScaleY.getValue() * scale);

        }

        update();

    }

    //////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：增加初始化矿体所需选择的采区或抽注单元
    function initAreas() {
        var resAreas = {};
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/GetMiningAreas",
            data: $.toJSON(post_data),
            dataType: 'json',
            async: false,
            success: function (areas) {
                if (areas.as.length != 0) {
                    resAreas = areas.as;
                }
                else {
                    alert("请新建采区！");
                }
            },
            error: function (areas) {

            }
        });
        return resAreas;
    }
    //init unit(sql)(select area)
    function initUnits() {

        var resUnits = [];
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        post_data.areaId = selectAParent.getValue();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/GetUnits",
            data: $.toJSON(post_data),
            dataType: 'json',
            async: false,
            success: function (units) {
                if (units.as.length == 0) {
                    alert("请新建此采区下的抽注单元！");
                }
                $.each(units.as, function (ky, vl) {
                    var objectType = "抽注单元";
                    resUnits.push({ value: ky, html: '<span class="type ' + "auline" + '">' + "抽注单元" + '</span> ' + vl });
                });
                selectUParent.setValue(0);
                selectUParent.setOptions(resUnits);
            },
            error: function (units) {
            }
        });
        update();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //更新实体的辅助信息
    function update() {

        var object = editor.selected;
        if (object !== null) {
            //editor.setObjectName(object, objectName.getValue());
            object.visible = objectVisible.getValue();
            //object.des = objectUserData.getValue();
            //var material;
            if (editor.getObjectType(object) === 'line') {
                editor.updateLineInfo(object, objectName.getValue(), objectUserData.getValue(), materialColor.getHexValue());
            } else if (editor.getObjectType(object) === 'hline') {
                editor.updateHLineInfo(object, objectName.getValue(), objectUserData.getValue(), materialColor.getHexValue());
            }
            else if (editor.getObjectType(object) === 'well') {
                editor.updateWellInfo(object, objectUserData.getValue());
            } else if (editor.getObjectType(object) === 'object') {
                var newParentId = 0;
                if (object.parent !== undefined) {
                    var newParentId = parseInt(objectParent.getValue());
                }
                ////////////////////////////////////////////////////////////////////////////////////郭佳宁：修改更新矿体（增加矿体到指定的区域）
                editor.updateObjectInfo(object, objectName.getValue(), objectUserData.getValue(), materialColor.getHexValue(), newParentId, selectAParent.getValue(), selectUParent.getValue(), De_Acreage_P.getValue(), De_Volume_P.getValue(), De_Percentage_P.getValue(), De_MetalAmount_P.getValue(), Density_P.getValue(), Mined_P.getValue(), ContentType_P.getValue(), Global_P.getValue(), De_Heigth_P.getValue());
            } else {
            }
            //signals.objectChanged.dispatch(object);
        }

    }

    // events
    ////////////////////////////////////////////////////////////////////////////////////////郭佳宁：修改objectSelected信号,auline显示sidebar.areaAndunit
    signals.objectSelected.add(function (object) {
        var objectType = editor.getObjectType(object);
        if (objectType == "auline") {
            container.setDisplay('none');
        }
        else {
            //console.log(editor.p_selected, object);
            if (object != undefined) {
                if (editor.p_selected != undefined && object.obj_id != editor.p_selected.obj_id) {
                    $.each(selectUnits, function (i, v) {
                        editor.p_selected.unitIds.push(v);
                    });
                    selectUnits.length = 0;
                    selectUParent.setOptions([]);
                }
            }
            else {
                selectUnits.length = 0;
                selectAParent.setOptions([]);
                selectUParent.setOptions([]);
            }
            updateUI();
        }
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    signals.sceneGraphChanged.add(function () {

        var scene = editor.scene;
        var sel = editor.selected;
        var options = {};

        options[scene.id] = '矿床';

        (function addObjects(objects) {

            for (var i = 0, l = objects.length; i < l; i++) {

                var object = objects[i];

                if (object.name != '' && editor.getObjectType(object) === 'object' && !object.ori) {
                    options[object.id] = object.name;
                }
                addObjects(object.children);
            }

        })(scene.children);
        objectParent.setOptions(options);
    });
    //////////////////////////////////////////////////////////////////////////////////////////郭佳宁：修改objectChanged信号,auline显示sidebar.areaAndunit
    signals.objectChanged.add(function (object) {


        var objectType = editor.getObjectType(object);
        if (objectType == "auline") {
            container.setDisplay('none');
        }
        else {
            updateUI();
        }

    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function updateUI() {

        container.setDisplay('none');
        objectName.setDisabled(false);
        objectPositionX.setDisabled(true);
        objectPositionY.setDisabled(true);
        objectPositionZ.setDisabled(true);
        var object = editor.selected;

        if (object !== null) {

            container.setDisplay('block');



            objectType.setValue(editor.getObjectTypeName(object));

            //objectUUID.setValue( object.uuid );
            objectName.setValue(object.name);

            if (object.parent !== undefined) {

                objectParent.setValue(object.parent.id);

            }
            var material;
            materialColorRow.setDisplay('block');
            objectPositionRow.setDisplay('block');
            objectParentRow.setDisplay('block');

            if (editor.getObjectType(object) === 'well') {
                objectName.setDisabled(true);
                objectPositionX.setValue(object.geometry.vertices[0].x);
                objectPositionY.setValue(object.geometry.vertices[0].y);
                objectPositionZ.setValue(object.geometry.vertices[0].z);
                material = object.material;
                materialColorRow.setDisplay('none');
                objectParentRow.setDisplay('none');
                selectedAParentRow.setDisplay('none');
                selectedUParentRow.setDisplay('none');
                ObjectProRow.setDisplay("none");

            } else if (editor.getObjectType(object) === 'line' || editor.getObjectType(object) === 'hline') {
                objectPositionX.setValue(object.geometry.vertices[0].x);
                objectPositionY.setValue(object.geometry.vertices[0].y);
                objectPositionZ.setValue(object.geometry.vertices[0].z);
                material = object.material;
                objectParentRow.setDisplay('none');
                selectedAParentRow.setDisplay('none');
                selectedUParentRow.setDisplay('none');
                ObjectProRow.setDisplay("none");

            } else if (editor.getObjectType(object) === 'object') {
                material = object.children[1].material;
                objectPositionRow.setDisplay('none');



                if (object.ori) {
                    objectParentRow.setDisplay('none');
                } else {
                    //init areaPanel+areaOption
                    var typeAOptions = initAreas();
                    selectAParent.setOptions(typeAOptions);
                    selectAParent.setValue(object.areaId);
                    selectedAParentRow.setDisplay("block");


                    //init unitPanel
                    selectedUParentRow.setDisplay("block");
                    //其他属性
                    ObjectProRow.setDisplay("block");
                    De_Acreage_P.setValue(object.De_Acreage);
                    De_Volume_P.setValue(object.De_Volume);
                    De_Percentage_P.setValue(object.De_Percentage);
                    De_MetalAmount_P.setValue(object.De_MetalAmount);
                    Density_P.setValue(object.Density);
                    Mined_P.setValue((object.Mined == 1) ? true : false);
                    Global_P.setValue((object.Is_Global == 1) ? true : false);
                    ContentType_P.setValue(object.ContentType);
                    Acreage_P.setValue(object.Acreage);
                    Volume_P.setValue(object.Volume);
                    Metal_P.setValue(object.Metal);
                    Metal_Amount_P.setValue(object.Metal_Amount);
                    Metal_Percentage_P.setValue(object.Metal_Percentage);
                    MinedScale_P.setValue(object.MinedScale);
                    De_Heigth_P.setValue(object.Ag_Heigth);

                }
                if (object.unitIds != undefined && object.unitIds.length != 0) {
                    var loadUnits = [];
                    $.each(object.unitIds, function (i, v) {
                        var objectType = "auline";
                        loadUnits.push({ value: v.key, html: '<span class="type ' + objectType + '">' + "抽注单元" + '</span> ' + v.value });
                    });
                    selectUParent.setOptions(loadUnits);
                }

            } else if (editor.getObjectType(object) === 'scene') {
                objectPositionRow.setDisplay('none');
                materialColorRow.setDisplay('none');
                objectParentRow.setDisplay('none');
                selectedAParentRow.setDisplay('none');
                selectedUParentRow.setDisplay('none');
                ObjectProRow.setDisplay("none");

            } else {


                //                objectPositionX.setValue( object.position.x );
                //                objectPositionY.setValue( object.position.y );
                //                objectPositionZ.setValue( object.position.z );
            }
            if (material !== undefined && material.color !== undefined) {

                materialColor.setHexValue(material.color.getHexString());

            }
            objectVisible.setValue(object.visible);
            objectUserData.setValue(object.des || '');
            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

            //updateRows();
            //updateTransformRows();

        } else {
            container.setDisplay('none');
        }

    }

    return container;

}
