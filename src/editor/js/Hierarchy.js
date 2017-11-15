/**
 * Created by Xi Bingqing on 2016/7/28.
 */

Hierarchy = function (editor) {
    var signals = editor.signals;

    var container = new UI.Panel();
    container.setId('hierarchy');

    var button = new UI.Button("选择");
    container.add(button);

    var treePanel = new UI.Panel();
    treePanel.setId('ztree');
    treePanel.setClass('ztree');
    container.add(treePanel);

    var setting = {
        edit: {
            enable: true,
            showNewBtn: true,
            showRemoveBtn: true,
            showRenameBtn: true,
            editNameSelectAll: true,
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            onRightClick: OnRightClick
        }
    };

    var zNodes = [
        {id: "a", pId: "null", name: "node_a"},
        {id: "b", pId: "a", name: "node_b"},
        {id: "c", pId: "a", name: "node_c"},
        {id: "d", pId: "a", name: "node_d"},
        {id: "e", pId: "a", name: "node_e"}
    ];

    var zTree;
    $(document).ready(function () {
        zTree = $.fn.zTree.init($("#ztree"), setting, zNodes);

        zTree.setting.edit.drag.isCopy = true;
        zTree.setting.edit.drag.isMove = true;
        zTree.setting.edit.drag.prev = true;
        zTree.setting.edit.drag.inner = true;
        zTree.setting.edit.drag.next = true;
    });

    function onClick(event, treeId, treeNode, clickFlag) {
        editor.selectById(treeNode.id);
        editor.focusById(treeNode.id);        
        treeNode.selected = false
    }

    function beforeDrag(treeId, treeNodes) {
        for (var i = 0, l = treeNodes.length; i < l; i++) {
            if (treeNodes[i].drag === false) {
                return false;
            }
        }
        return true;
    }

    function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
        // alert(treeId);

        for (var i = 0, l = treeNodes.length; i < l; i++) {
            // alert(treeNodes[i].name);
        }

        // alert(targetNode.name);
        // alert(moveType)
        // alert(isCopy)

        return targetNode ? targetNode.drop !== false : true;
    }

    function OnRightClick(event, treeId, treeNode) {
        if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
            zTree.cancelSelectedNode();

        } else if (treeNode && !treeNode.noR) {
            zTree.selectNode(treeNode);

        }
    }

    var refreshUI = function () {
        var scene = editor.scene;

        treePanel.clear();
        zNodes = [
            {id: "a", pId: "", name: "node_a"},
            {id: "b", pId: "a", name: "node_b"},
            {id: "c", pId: "a", name: "node_c"},
            {id: "d", pId: "a", name: "node_d"},
            {id: "e", pId: "a", name: "node_e"}
        ];

        (function addObjects(objects, pid) {

            for (var i = 0; i < objects.length; i++) {

                var object = objects[i];
                var objectId = object.id;
                var str = object.name;
                if (str == "") {
                    str = object.type;
                }

                var item = {id: objectId, pId: pid, name: str, open: true};
                zNodes.push(item);
                addObjects(object.children, objectId);
            }

        })(scene.children, scene.id);

        zTree = $.fn.zTree.init($("#ztree"), setting, zNodes);

    };

    signals.sceneGraphChanged.add(refreshUI);

    return container;
};