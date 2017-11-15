Sidebar.Renderer = function ( editor ) {

	var signals = editor.signals;

	var rendererTypes = {

		'矿井布局': THREE.WebGLRenderer,
		'矿井品味': THREE.WebGLRenderer3,
		'矿体模型': THREE.CanvasRenderer,
		'块段模型': THREE.SVGRenderer,
		'矿井水位': THREE.SoftwareRenderer,
		'水文模型': THREE.RaytracingRenderer

	};

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( true );

	container.addStatic( new UI.Text( '选择图层' ) );
	container.add( new UI.Break() );

	// class

	var options = {};

	for ( var key in rendererTypes ) {

		if ( key.indexOf( 'WebGL' ) >= 0 && System.support.webgl === false ) continue;

		options[ key ] = key;

	}

	var rendererTypeRow = new UI.Panel();
	var rendererType = new UI.Select().setOptions( options ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( updateRenderer );

	rendererTypeRow.add( new UI.Text( '图层' ).setWidth( '90px' ) );
	rendererTypeRow.add( rendererType );

	container.add( rendererTypeRow );

	if ( editor.config.getKey( 'renderer' ) !== undefined ) {

		rendererType.setValue( editor.config.getKey( 'renderer' ) );

	}

	//

	function updateRenderer() {

		signals.rendererChanged.dispatch( rendererType.getValue() );
		editor.config.setKey( 'renderer', rendererType.getValue() );

	}

	return container;

}
