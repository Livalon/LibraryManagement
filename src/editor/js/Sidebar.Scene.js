Sidebar.Scene = function (editor) {

    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.addStatic(new UI.Text('对象'));
    var wNum = new UI.Text('');
    wNum.setId("wNum");
    container.addStatic(wNum);
    container.add(new UI.Break());

    var ignoreObjectSelectedSignal = false;

    var outliner = new UI.FancySelect().setId('outliner');
    outliner.onChange(function () {
        //console.log("列表选择");

        ignoreObjectSelectedSignal = true;

        editor.selectById(parseInt(outliner.getValue()));
        //console.log("outliner.getValue() " + outliner.getValue());
        ignoreObjectSelectedSignal = false;

    });
    container.add(outliner);
    container.add(new UI.Break());



    // events
    ///////////////////////////////////////////////////////////////////////////////////////////郭佳宁：修改对象列表中显示的对象，添加采区或抽注单元的显示
    signals.sceneGraphChanged.add(function () {
        var scene = editor.scene;
        var sceneType = editor.getObjectType(scene);
        var sceneTypeName = editor.getObjectTypeName(scene);
        var options = [];

        options.push({ value: scene.id, html: '<span class="type ' + sceneType + '">' + sceneTypeName + '</span> ' + scene.name });

        (function addObjects(objects, pad) {

            for (var i = 0, l = objects.length; i < l; i++) {

                var object = objects[i];
                var objectType = editor.getObjectType(object);
                var objectTypeName = editor.getObjectTypeName(object);

                if (editor.viewObjectInList(object)) {
                    var html = "";
                    if (objectType === "object" && !object.ori) {
                        html = pad + '<span class="type block">块段</span> ' + object.name;
                    }
                    /////////////////////////////////////////////////////////////////////////////////郭佳宁：增加显示采区或抽注单元
                    else {
                        if (objectType == "auline" && object.stype != undefined) {
                            if (object.stype == "unit") {
                                objectTypeName = "抽注单元";
                            }
                            else if (object.stype == "area") {
                                objectTypeName = "采区";

                            }
                            else {


                            }
                        }
                        html = pad + '<span class="type ' + objectType + '">' + objectTypeName + '</span> ' + object.name;
                        //console.log(objectTypeName);
                    }
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    options.push({ value: object.id, html: html });
                }
                addObjects(object.children, pad + '&nbsp;&nbsp;&nbsp;');

            }

        })(scene.children, '&nbsp;&nbsp;&nbsp;');

        outliner.setOptions(options);

        if (editor.selected !== null) {

            outliner.setValue(editor.selected.id);

        }

        $("#wNum").html("(导入钻孔条数：" + $("#outliner .type.well").length + "条)");

    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    signals.objectSelected.add(function (object) {

        if (ignoreObjectSelectedSignal === true) return;

        outliner.setValue(object !== null ? object.id : null);

    });

    return container;

}
