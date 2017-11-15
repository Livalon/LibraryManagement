Sidebar.AreaAndUnit = function (editor) {

    //signal
    var signals = editor.signals;

    //container
    var container = new UI.CollapsiblePanel();
    container.setDisplay('none');
    container.addStatic(new UI.Text('采区和抽注单元'));
    container.add(new UI.Break());

    //scopeParams+scopeButtons
    var buttons = new UI.Panel();
    var params = new UI.Panel();
    container.add(params);
    container.add(buttons); //区域操作

    /**************************************************scopeParamsDetail*********************************************************************/
    //scope
    var options = ['采区', '抽注单元'];
    var selectScopeRow = new UI.Panel();
    var selectScope = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    selectScopeRow.add(new UI.Text('区域').setWidth('90px'));
    selectScopeRow.add(selectScope);
    params.add(selectScopeRow);

    // name
    var objectNameRow = new UI.Panel();
    var objectName = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    objectNameRow.add(new UI.Text('名字').setWidth('90px'));
    objectNameRow.add(objectName);
    params.add(objectNameRow);

    //已经在钻井计划中新建
    var objectSelectName = new UI.Panel();
    var objectSelectOption = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    objectSelectName.add(new UI.Text('选择名称').setWidth('90px'));
    objectSelectName.add(objectSelectOption);
    objectSelectName.setDisplay("none"); //默认不可见
    params.add(objectSelectName);
    //type
    var selectedTypeRow = new UI.Panel();
    var selectType = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    selectedTypeRow.add(new UI.Text('类型').setWidth('90px'));
    selectedTypeRow.add(selectType);
    params.add(selectedTypeRow);

    //state
    var selectedStateRow = new UI.Panel();
    var selectState = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectStateChange);
    selectedStateRow.add(new UI.Text('状态').setWidth('90px'));
    selectedStateRow.add(selectState);
    params.add(selectedStateRow);


    //parent_type_area(scope=unit: visible)
    var selectedAParentRow = new UI.Panel();
    var selectAParent = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    selectedAParentRow.add(new UI.Text('所属采区').setWidth('90px'));
    selectedAParentRow.add(selectAParent);
    selectedAParentRow.setDisplay("none"); //默认不可见
    params.add(selectedAParentRow);


    //loss_rate(scope=area: visible)
    var objectLossRateRow = new UI.Panel();
    var objectLossRate = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    objectLossRateRow.add(new UI.Text('损失率').setWidth('90px'));
    objectLossRateRow.add(objectLossRate);
    params.add(objectLossRateRow);


    // color
    var materialColorRow = new UI.Panel();
    var materialColor = new UI.Color().onChange(update);
    materialColorRow.add(new UI.Text('颜色').setWidth('90px'));
    materialColorRow.add(materialColor);
    params.add(materialColorRow);

    // position
    var objectPositionRow = new UI.Panel();
    var objectPositionX = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionY = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionZ = new UI.Number().setWidth('50px').onChange(update);
    objectPositionRow.add(new UI.Text('位置').setWidth('90px'));
    objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);
    params.add(objectPositionRow);

    // visible
    var objectVisibleRow = new UI.Panel();
    var objectVisible = new UI.Checkbox().onChange(update);
    objectVisibleRow.add(new UI.Text('是否可见').setWidth('90px'));
    objectVisibleRow.add(objectVisible);
    params.add(objectVisibleRow);

    // user data
    var objectUserDataRow = new UI.Panel();
    var objectUserData = new UI.TextArea().setWidth('150px').setHeight('40px').setColor('#444').setFontSize('12px').onChange(update);
    objectUserData.onKeyUp(function () {
        objectUserData.setBorderColor('#ccc');
        objectUserData.setBackgroundColor('');
    });
    objectUserDataRow.add(new UI.Text('描述').setWidth('90px'));
    objectUserDataRow.add(objectUserData);
    params.add(objectUserDataRow);
    /**********************************************************************************************************************************/

    /***********************************************scopeButtonsDetail******************************************************************/
    //create
    var createRow = new UI.Panel();
    var create = new UI.Button('新建').onClick(onCreateClick);
    createRow.add(create);
    buttons.add(createRow);

    //convert to real
    var convertRow = new UI.Panel();
    var convert = new UI.Button('变为实际').onClick(onConvertToRealClick);
    convertRow.add(convert);
    buttons.add(convertRow);
    //删除抽注单元
    var deleteRow = new UI.Panel();
    var deleteunit = new UI.Button('删除').onClick(onDeleteAreaOrUnit);
    deleteRow.add(deleteunit);
    buttons.add(deleteRow);

    //update
    //no button,autoUpdate——update()
    /**********************************************************************************************************************************/

    /**************************************************scopeButtonsEvent***************************************************************/
    //scopeChange
    function onselectScopeChange() {
        console.log("selectScope.dom.value:" + selectScope.dom.value);
        if (selectScope.dom.value == 0) {//采区(默认)
            //类型
            var typeOptions = initTypes("area");
            selectType.setOptions(typeOptions);
            selectedAParentRow.setDisplay("none");
            var lossRate = initLossRate();
            objectLossRate.setValue(lossRate);
            objectLossRateRow.setDisplay("block");
        }
        else {//抽注单元

            //类型
            var typeOptions = initTypes("unit");
            selectType.setOptions(typeOptions);

            //所属采区
            var areaOptions = initAreas();
            selectAParent.setOptions(areaOptions);
            selectedAParentRow.setDisplay("block");
            objectLossRateRow.setDisplay("none");
        }
    }
    //当计划采区或计划抽注单元时，名称时可以选择也可以输入的，两种选择
    function onselectStateChange() {
        if (selectState.dom.value == 7) { //未施工即计划

            objectSelectName.setDisplay("block");
            var areaOptions = initPlan();
            objectSelectOption.setOptions(areaOptions);

        }
        else {
            objectSelectName.setDisplay("none");
        }

    }
    //获取计划采区或计划抽注单元中没有和图形相对应的名称
    function initPlan() {
        var resAreas = {};
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        if (selectScope.dom.value == 0) { //采区
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "../getdata/WellInfo2.asmx/GetPlanAreas",
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
        }
        else {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "../getdata/WellInfo2.asmx/GetPlanUnits",
                data: $.toJSON(post_data),
                dataType: 'json',
                async: false,
                success: function (units) {
                    if (units.as.length != 0) {
                        resAreas = units.as;
                    }
                    else {
                        alert("请新建采区！");
                    }
                },
                error: function (areas) {

                }
            });

        }


        return resAreas;

    }
    //init Areas(sql)
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
    function initLossRate() {
        var resLossRate = 0;
        var post_data = {};
        post_data.cur_batch = editor.cur_batch;
        //post_data.cur_area = editor.select;
        console.log("initLossRate：" + editor.selected.name, editor.selected.stype, editor.cur_batch);
        post_data.cur_name = editor.selected.name;
        post_data.cur_type = editor.selected.stype;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/GetLossRate",
            data: $.toJSON(post_data),
            dataType: 'json',
            async: false,
            success: function (lossRate) { //回调函数
                console.log("LossRateres:" + lossRate);
                resLossRate = lossRate.lossRate;
            },
            error: function (lossRate) {
                resLossRate = 0;
            }
        });
        return resLossRate;
    }
    //init States(sql)
    function initStates() {
        var resStates = {};
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/GetStates",
            data: "{}",
            dataType: 'json',
            async: false,
            success: function (states) { //回调函数
                resStates = states.as;
            }
        });
        return resStates;
    }
    //init type(sql)(unitType/areaType)
    function initTypes(scopeType) {
        var cur_url = "";
        var resTypes = {};
        if (scopeType == "unit") {
            cur_url = "GetUnitTypes";
        }
        else {
            cur_url = "GetMiningAreaTypes";
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/" + cur_url,
            data: "{}",
            dataType: 'json',
            async: false,
            success: function (types) { //回调函数
                resTypes = types.as;
            }
        });
        return resTypes;
    }
    //update sidebar_ AreaAndUnit
    function updateAUUI() {
        container.setDisplay('none');
       // objectSelectName.setDisplay("none");
        //console.log("updateAUUI");
        var object = editor.selected;
        var selectObjectType = object.stype;
        var stateOptions = [];
        var typeOptions = [];
        if (object !== null) {
            container.setDisplay('block');
            //selectObjectName
            objectName.setValue(object.name);

            //selectObjectState
            stateOptions = initStates();
            selectState.setOptions(stateOptions);
            selectState.setValue(object.state); //defaultData

            //selectObjectScope=unit(parent=area)
            /////////////////////////////////////////////////////////郭佳宁：增加区域由计划变为实际功能按钮（20150805）
            if (object.state != undefined && object.state != 1 && object.state != 0) {
                convertRow.setDisplay("block");
            }
            else {
                convertRow.setDisplay("none");
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            switch (selectObjectType) {
                case "area":
                    selectScope.dom.value = 0;
                    var lossRate = initLossRate();
                    objectLossRate.setValue(lossRate);
                    objectLossRateRow.setDisplay("block");
                    createRow.setDisplay("none");
                    break;
                case "unit":
                    selectScope.dom.value = 1;
                    var areaOptions = initAreas();
                    selectAParent.setOptions(areaOptions);
                    selectAParent.setValue(object.sparent); //defaultData
                    objectLossRateRow.setDisplay("none");
                    createRow.setDisplay("none");
                    break;
                default:
                    createRow.setDisplay("block");
            }
            //selectObjectType
            if (selectScope.dom.value == 0) {
                typeOptions = initTypes("area");
            }
            else {
                console.log("scopeUnit");
                typeOptions = initTypes("unit");
            }

            selectType.setOptions(typeOptions);
            selectType.setValue(object.stypeDetail); //defaultData

            //显示坐标
            objectPositionX.setValue(object.geometry.vertices[0].x);
            objectPositionY.setValue(object.geometry.vertices[0].y);
            objectPositionZ.setValue(object.geometry.vertices[0].z);

            //显示材质（颜色）
            var material;
            material = object.material;
            if (material !== undefined && material.color !== undefined) {
                materialColor.setHexValue(material.color.getHexString());
            }
            objectVisible.setValue(object.visible);
            objectUserData.setValue(object.des || '');
            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

            try {

                objectUserData.setValue(JSON.stringify(object.userData, null, '  '));

            } catch (error) {

                console.log(error);

            }
            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

        }
    }

    //create new scope
    function onCreateClick() {
        //名字
        var object_name = objectName.getValue();
        var objectNameId = objectSelectOption.getValue();
        //类型
        var object_type = selectType.getValue();
        //状态
        var object_state = selectState.getValue();
        //区域
        var cur_url = "";
        var post_data = {};
        post_data.id = editor.selected.obj_id || 0;
        alert("selected" + post_data.id);
        post_data.name = object_name;
        post_data.nameId = objectNameId;
        post_data.scope_type = object_type;
        post_data.scope_state = object_state;
        post_data.cur_batch = editor.cur_batch + "";
        post_data.line_Type = editor.getObjectType(editor.selected);
        post_data.loss_rate = objectLossRate.getValue();
        if (selectScope.dom.value == 1) {//unit
            cur_url = "AddUnit";
            post_data.area_id = selectAParent.getValue();
        }
        else { //area
            cur_url = "AddMiningArea";
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/" + cur_url,
            data: $.toJSON(post_data),
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    var resAULine = editor.selected;
                    resAULine.obj_id = res.line_id;
                    resAULine.name = res.line_name;
                    resAULine.state = object_state;
                    resAULine.stypeDetal = object_type;
                    resAULine.obj_type = "auline";
                    console.log("返回值");
                    if (selectScope.dom.value == 1) {
                        console.log("addUnit");
                        resAULine.stype = "unit";
                        resAULine.sparent = selectAParent.getValue();
                    }
                    else {
                        resAULine.stype = "area";
                    }
                }
                else {
                    alert(res.message);
                }
            },
            error: function (res) {

            }
        });

    }

    //start
    function onDeleteAreaOrUnit() {
        //采区或抽注单元的名字
        var object_name = objectName.getValue();
        //类型
        var object_type = selectType.getValue();
        var post_data = {};
        post_data.object_name = object_name;
        alert(object_name);
        var cur_url = "";
        if (selectScope.dom.value == 1) {//unit
            cur_url = "DeleteUnit";
            //alert(cur_url);
            //alert(post_data.object_name);
        }
        else { //area
            cur_url = "DeleteMiningArea";
            //alert(cur_url);
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/" + cur_url,
            data: $.toJSON(post_data),
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    alert('删除成功');
                }
                else {
                    alert('没有删除');
                }
            },
            error: function (res) {
                alert('删除失败!!!!');
            }
        });

    }
    //end


    //convert scope to real scope
    function onConvertToRealClick() {
        console.log("real");
        objectSelectName.setDisplay("none");
        //类型
        var object_type = selectType.getValue();
        //状态
        var object_state = selectState.getValue();
        //区域
        var cur_url = "";
        var post_data = {};
        post_data.id = editor.selected.obj_id || 0;
        post_data.scope_type = object_type;
        post_data.cur_batch = editor.cur_batch + "";
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "../getdata/WellInfo2.asmx/convertRealScope",
            data: $.toJSON(post_data),
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    var resAULine = editor.selected;
                    resAULine.state = 1;
                    updateAUUI();
                }
                else {
                    alert(res.message);
                }
            },
            error: function (res) {

            }
        });
    }
    //update monogoData+sqlData
    ///auline(update)/******/hline(delete hline,create auline)/******/line(delete line,create auline)
    function update() {
        
        var object = editor.selected;
        if (object !== null) {
            object.visible = objectVisible.getValue();
            var selectObjectType = editor.getObjectType(object);
            var lineType = "";
            var scopeType = "";
            if (selectObjectType === 'line' || selectObjectType === 'hline' || selectObjectType === 'auline') {
                if (selectObjectType === 'line') {
                    lineType = "l";
                }
                else if (selectObjectType === 'hline') {
                    lineType = "h";
                }
                else {
                    lineType = "au";
                }
                if (selectScope.dom.value == 1) {
                    scopeType = "unit";
                }
                else {
                    scopeType = "area";
                }
                console.log("upate", objectName.getValue(), objectUserData.getValue(), materialColor.getHexValue(), selectType.getValue(), selectState.getValue(), scopeType, selectAParent.getValue(), lineType, objectLossRate.getValue());
                editor.updateAULineInfo(object, objectName.getValue(), objectUserData.getValue(), materialColor.getHexValue(), selectType.getValue(), selectState.getValue(), scopeType, selectAParent.getValue(), lineType, objectLossRate.getValue());
            } else {
            }
        }
    }

    /***************************************************************************************************************************/

    /******************************************signal Events******************************************************************/
    signals.objectSelected.add(function (object) {
        var objectType = editor.getObjectType(object);
        if ((objectType == 'auline' || objectType == 'hline' || objectType == 'line') && (editor.lineType(object) == "close")) {
            //updateAUUI();
        }
        else {
            container.setDisplay('none');
        }
    });
    signals.objectChanged.add(function (object) {
        if (object !== editor.selected) return;
        var objectType = editor.getObjectType(object);
        if ((objectType == 'auline' || objectType == 'hline' || objectType == 'line') && (editor.lineType(object) == "close")) {
            //updateAUUI();
        }
        else {
            container.setDisplay('none');
        }
    });
    /***************************************************************************************************************************/

    return container;

}
