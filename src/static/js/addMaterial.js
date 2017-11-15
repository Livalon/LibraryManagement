//ajax处理函数
function PostHandle(url,data,callback) {
    $.ajax({
        type: "POST",
        url:url,
        data:data,
        dataType:'json',
        async: false,

        success: callback
    });
}

$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

//添加井场材料表格
$("#addWell").jqGrid({
    url: '',
    datatype: "json",
    colModel: [
        { label: 'ID', name: 'id', key: true},
        { label: '材料名称', name: 'name', width: 220 },
        { label: '单位', name: 'unit', width: 140 },
        { label: '每千方溶液单耗', name: 'consume', width: 370 },
        { label: '不含税单价', name: 'price', width: 270, sorttype: 'integer' },
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        { label: '材料类型', name: 'type', width: 220, sorttype: 'number' },
        { label: '省份', name: 'province', width: 140, sorttype: 'number' },
        { label: '所属', name: 'belong', sorttype: 'number' }
    ],
    loadonce: true,
    viewrecords: true,
    width: 680,
    height: 200,
    rowNum: 20,
    rowList : [20,30,50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: true,
    pager: "#jqWellGridPager"
});
//隐藏列
$("#addWell").setGridParam().hideCol("id").trigger("reloadGrid");
$("#addWell").setGridParam().hideCol("belong").trigger("reloadGrid");

//添加水冶厂材料表格
$("#addHyd").jqGrid({
    url: '',
    datatype: "json",
    colModel: [
        { label: 'ID', name: 'id', key: true },
        { label: '材料名称', name: 'name', width: 220 },
        { label: '单位', name: 'unit', width: 140 },
        { label: '每千方溶液单耗', name: 'consume', width: 370 },
        { label: '不含税单价', name: 'price', width: 270, sorttype: 'integer' },
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        { label: '材料类型', name: 'type', width: 220, sorttype: 'number' },
        { label: '省份', name: 'province', width: 140, sorttype: 'number',display: 'none' },
        { label: '所属', name: 'belong',sorttype: 'number' }
    ],
    loadonce: true,
    viewrecords: true,
    width: 680,
    height: 200,
    rowNum: 20,
    rowList : [20,30,50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: true,
    pager: "#jqHydGridPager"
});
//隐藏列
$("#addHyd").setGridParam().hideCol("id").trigger("reloadGrid");
$("#addHyd").setGridParam().hideCol("belong").trigger("reloadGrid");

//添加堆浸原材料与燃料动力
$("#addDj").jqGrid({
    url: '',
    datatype: "json",
    colModel: [
        { label: 'ID', name: 'id', key: true },
        { label: '材料名称', name: 'name', width: 220 },
        { label: '单位', name: 'unit', width: 140 },
        { label: '每千方溶液单耗', name: 'consume', width: 370 },
        { label: '不含税单价', name: 'price', width: 270, sorttype: 'integer' },
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        { label: '材料类型', name: 'type', width: 220, sorttype: 'number' },
        { label: '省份', name: 'province', width: 140, sorttype: 'number',display: 'none' },
        { label: '所属', name: 'belong',sorttype: 'number' }
    ],
    loadonce: true,
    viewrecords: true,
    width: 680,
    height: 200,
    rowNum: 20,
    rowList : [20,30,50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: true,
    pager: "#jqDjGridPager"
});

//隐藏列
$("#addDj").setGridParam().hideCol("id").trigger("reloadGrid");
$("#addDj").setGridParam().hideCol("belong").trigger("reloadGrid");

//添加共用材料
$("#addGy").jqGrid({
    url: '',
    datatype: "json",
    colModel: [
        { label: 'ID', name: 'id', key: true },
        { label: '材料名称', name: 'name', width: 220 },
        { label: '单位', name: 'unit', width: 140 },
        { label: '每千方溶液单耗', name: 'consume', width: 370 },
        { label: '不含税单价', name: 'price', width: 270, sorttype: 'integer' },
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        { label: '材料类型', name: 'type', width: 220, sorttype: 'number' },
        { label: '省份', name: 'province', width: 140, sorttype: 'number',display: 'none' },
        { label: '所属', name: 'belong',sorttype: 'number' }
    ],
    loadonce: true,
    viewrecords: true,
    width: 680,
    height: 200,
    rowNum: 20,
    rowList : [20,30,50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: true,
    pager: "#jqGyGridPager"
});
//隐藏列
$("#addDj").setGridParam().hideCol("id").trigger("reloadGrid");
$("#addDj").setGridParam().hideCol("belong").trigger("reloadGrid");

//添加人工成本表格
$("#addCost").jqGrid({
    url: '',
    datatype: "json",
    colModel: [
        { label: 'ID', name: 'id', width: 45, key: true },
        { label: '名称', name: 'name', width: 60 },
        { label: '工效(立方米/工日)', name: 'consume', width: 130 },
        { label: '人日单价(元/人日)', name: 'price', width: 130 },
        { label: '成本类型', name: 'type', width: 80, sorttype: 'integer' },
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        { label: '省份', name: 'province', width: 60, sorttype: 'number' }
    ],
    loadonce: true,
    viewrecords: true,
    width: 580,
    height: 200,
    rowNum: 20,
    rowList : [20,30,50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: true,
    pager: "#jqCostGridPager"
});
//隐藏列
$("#addCost").setGridParam().hideCol("id").trigger("reloadGrid");

