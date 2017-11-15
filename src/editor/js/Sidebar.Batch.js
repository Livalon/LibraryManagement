Sidebar.Batch = function (editor) {
    
    var container = new UI.CollapsiblePanel();
    //	container.setCollapsed( true );

    container.addStatic(new UI.Text('选择时间轴'));
    container.add(new UI.Break());

    // class

    var BatchSelectRow = new UI.Panel();


    var BatchSelect = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(updateBatch);
    editor.post("/batch/list", null, function (res) {
        var batches = {}
        $.each(res.data, function (i, v) {
            batches[v.id] = v.name;
        });
        BatchSelect.setOptions(batches);
    });
    BatchSelectRow.add(new UI.Text('时间').setWidth('90px'));
    BatchSelectRow.add(BatchSelect);
    container.add(BatchSelectRow);

    function updateBatch() {
        editor.select(null);
        editor.cur_batch = BatchSelect.getValue();
        editor.destoryAllObject();
        editor.signals.updateBatch.dispatch();
    }
    return container;
};
