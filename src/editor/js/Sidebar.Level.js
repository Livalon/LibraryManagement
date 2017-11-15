Sidebar.Level = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( true );

	container.addStatic( new UI.Text( '选择图层' ) );
	container.add( new UI.Break() );

	// class

	var options = ['全部图层','矿井图层','矿体线圈','矿体实体','矿体块段','水文图层'];

	var levelTypeRow = new UI.Panel();
	var levelType = new UI.Select().setOptions( options ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( updateLevel );

    levelTypeRow.add( new UI.Text( '图层' ).setWidth( '90px' ) );
    levelTypeRow.add( levelType );

	container.add( levelTypeRow );

	var level_all = new UI.Checkbox(true).onChange(updatelevel1);
	container.add(level_all);
	container.add(new UI.Text('全部图层'));

	var level_mine = new UI.Checkbox(false).onChange(updatelevel1);
	container.add(level_mine);
	container.add(new UI.Text('矿井图层'));

	var level_line = new UI.Checkbox(false).onChange(updatelevel1);
	container.add(level_line);
	container.add(new UI.Text('矿体线圈'));

	var level_entity = new UI.Checkbox(false).onChange(updatelevel1);
	container.add(level_entity);
	container.add(new UI.Text('矿体实体'));

	if ( editor.config.getKey( 'level' ) !== undefined ) {

        levelType.setValue( editor.config.getKey( 'renderer' ) );

	}

	//

	function updateLevel() {
        editor.select( null );
		signals.levelChanged.dispatch( levelType.getValue() );
		editor.config.setKey('level', levelType.getValue());
    }

    function updatelevel1() {

        var levelType = "0";
        var levels = [];
        editor.select(null);
        if (level_all.getValue() === true) {
            levels.push(0);
        }
        if (level_mine.getValue() === true) {
            levels.push(1);
        }
        if (level_line.getValue() === true) {
            levels.push(2);
        }
        if (level_entity.getValue() === true) {
            levels.push(3);
        }


        levelType = levels.join("_");
        signals.levelChanged.dispatch(levelType);
        editor.config.setKey('level', levelType);
    }

	return container;

}
