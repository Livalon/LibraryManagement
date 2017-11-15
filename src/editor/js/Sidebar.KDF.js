Sidebar.KDF = function (editor) {
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed(true);
    container.setDisplay('none');

    container.addStatic(new UI.Text('块段法储量估算'));
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
                post_data.metal = editor.cur_metal || "CU";
                post_data.welltype = welltype_pl.getValue();
                post_data.avg_type = avg_type.getValue();
                $.ajax({
                    type: "POST", //访问WebService使用Post方式请求
                    contentType: "application/json", //WebService 会返回Json类型
                    url: "../getdata/WellInfo2.asmx/KDFCompute", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                    data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                    dataType: 'json',
                    success: function (res) {
                        if (res.result) {
                            alert("\n金属量：" + res.result_quatity + ",平均品位：" + res.result_averGrade + ",体积：" + res.volume);
                        } else {
                            alert(res.message);
                        }

                    }
                });
            });
            buttons.add(jvlimi);


            ////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：增加保存参数设置
            var saveParamsRow = new UI.Panel();
            var saveParams = new UI.Button('保存参数').onClick(addBlockValue);
            saveParamsRow.add(saveParams);
            buttons.add(saveParamsRow);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            var MetalSelectRow = new UI.Panel();
            var MetalSelect = new UI.Select().setOptions(editor.all_metal).setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {
                editor.cur_metal = MetalSelect.getValue();
            });
            MetalSelectRow.add(new UI.Text('估值金属').setWidth('90px'));
            MetalSelectRow.add(MetalSelect);
            params.add(MetalSelectRow);

            //////////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：增加块段估值时密度，体积，面积,储量类别
            var MetalDensityRow = new UI.Panel();
            var metalDensity = new UI.Number().setWidth('150px');
            MetalDensityRow.add(new UI.Text('块段密度：').setWidth('90px'));
            metalDensity.setValue(0.1);
            MetalDensityRow.add(metalDensity);
            params.add(MetalDensityRow);

            var MetalVolumeRow = new UI.Panel();
            var metalVolume = new UI.Number().setWidth('150px');
            MetalVolumeRow.add(new UI.Text('块段体积：').setWidth('90px'));
            metalVolume.setValue(0.1);
            MetalVolumeRow.add(metalVolume);
            params.add(MetalVolumeRow);

            var MetalAcreageRow = new UI.Panel();
            var metalAcreage = new UI.Number().setWidth('150px');
            MetalAcreageRow.add(new UI.Text('块段面积：').setWidth('90px'));
            metalAcreage.setValue(0.1);
            MetalAcreageRow.add(metalAcreage);
            params.add(MetalAcreageRow);

            var ContentTypeRow = new UI.Panel();
            var contentType = new UI.Input().setWidth('150px');
            ContentTypeRow.add(new UI.Text('储量类别：').setWidth('90px'));
            contentType.setValue("A");
            ContentTypeRow.add(contentType);
            params.add(ContentTypeRow);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            var well_options = { "init": "原始钻孔", "computed": "样品组合", "lcomputed": "样长组合" };
            var welltype_panel = new UI.Panel();
            var welltype_pl = new UI.Select().setOptions(well_options).setWidth('150px').setColor('#444').setFontSize('12px');
            welltype_panel.add(new UI.Text('方向').setWidth('90px'));
            welltype_panel.add(welltype_pl);
            params.add(welltype_panel);

            var isoutside_panel = new UI.Panel();
            var avg_type = new UI.Checkbox();
            isoutside_panel.add(new UI.Text('是否加权求和：').setWidth('150px'));
            avg_type.setValue(false);
            isoutside_panel.add(avg_type);
            params.add(isoutside_panel);
            

            function addBlockValue() {
                console.log("123");
                var desity = metalDensity.getValue();
                var volumn = metalVolume.getValue();
                var acreage = metalAcreage.getValue();
                var type = contentType.getValue();
                var post_data = {};
                post_data.block_id = editor.selected.obj_id;
                post_data.desity = desity || 0;
                post_data.volumn = volumn;
                post_data.acreage = acreage;
                post_data.type = type;
                $.ajax({
                    type: "POST", //访问WebService使用Post方式请求
                    contentType: "application/json", //WebService 会返回Json类型
                    url: "../getdata/WellInfo2.asmx/SaveKDFParams", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                    data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                    dataType: 'json',
                    success: function (res) {
                        if (res.result) {

                        } else {
                        }

                    }
                });

            }



        }
    }
    return container;

}
