/**
 * @author mrdoob / http://mrdoob.com/
 */

var Editor = function () {

	var SIGNALS = signals;

	this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 45, 1, 0.1, 50000 );
	this.DEFAULT_CAMERA.name = 'Camera';
	this.DEFAULT_CAMERA.position.set(0, -1000, 1 );
	this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

    //////////////////////////////////////////////////////////////////////////////////////郭佳宁：新增成员变量
    this.cur_center = []; //记录数据库中实际中心位置
    this.is_interrupt_line = false; //记录是否为线打断模式
    this.keyPressCode = -1; //记录键盘事件
    this.scopeAType = []; //采区类型
    this.scopeUType = []; //抽注单元类型
    this.o_MidPoint = {}; //模型中心点
    this.wells_infos = {}; //所有井上所有辅助信息
    this.point_realize = 0.8; //实体节点缩放比例
    this.isSearchMidPoint = true; //是否捕捉中点
    ////////////////////////////////////////////////////////////////////////////////////////////////

	this.signals = {

		// script

		editScript: new SIGNALS.Signal(),

		// player

		startPlayer: new SIGNALS.Signal(),
		stopPlayer: new SIGNALS.Signal(),

		// actions

		showModal: new SIGNALS.Signal(),

		// notifications

		editorCleared: new SIGNALS.Signal(),

		savingStarted: new SIGNALS.Signal(),
		savingFinished: new SIGNALS.Signal(),

		themeChanged: new SIGNALS.Signal(),

		transformModeChanged: new SIGNALS.Signal(),
		snapChanged: new SIGNALS.Signal(),
		spaceChanged: new SIGNALS.Signal(),
		rendererChanged: new SIGNALS.Signal(),

		sceneGraphChanged: new SIGNALS.Signal(),

		cameraChanged: new SIGNALS.Signal(),

		geometryChanged: new SIGNALS.Signal(),

		objectSelected: new SIGNALS.Signal(),
		objectFocused: new SIGNALS.Signal(),

		objectAdded: new SIGNALS.Signal(),
		objectChanged: new SIGNALS.Signal(),
		objectRemoved: new SIGNALS.Signal(),

		helperAdded: new SIGNALS.Signal(),
		helperRemoved: new SIGNALS.Signal(),

		materialChanged: new SIGNALS.Signal(),

		scriptAdded: new SIGNALS.Signal(),
		scriptChanged: new SIGNALS.Signal(),
		scriptRemoved: new SIGNALS.Signal(),

		fogTypeChanged: new SIGNALS.Signal(),
		fogColorChanged: new SIGNALS.Signal(),
		fogParametersChanged: new SIGNALS.Signal(),
		windowResize: new SIGNALS.Signal(),

		showGridChanged: new SIGNALS.Signal(),
		refreshSidebarObject3D: new SIGNALS.Signal(),
		historyChanged: new SIGNALS.Signal(),
		refreshScriptEditor: new SIGNALS.Signal(),


		////////////////////////////////////////////// 新增信号
		updateBatch: new SIGNALS.Signal(),	// 更新批次
		lineCombined: new SIGNALS.Signal(), //合并成闭合线圈
		lineConnected: new SIGNALS.Signal(), //连接线
		lineInterruptedToSegments: new SIGNALS.Signal(), //打散线模式
		sphereMidPointSelected: new SIGNALS.Signal(), //椭球块段模型中心点
		displayWellInfo: new SIGNALS.Signal(),
		///////////////////////////////////////////////////////////////////////////////
		draw_HP: new SIGNALS.Signal(),
		/////////////////////////////////////////////视角辅助面用的信号
		viewChanged: new SIGNALS.Signal(),
		helpPlaneChanged: new SIGNALS.Signal(),
		helperPlaneReturn: new SIGNALS.Signal(),
		helperPlaneCreate: new SIGNALS.Signal(),
		helperPlaneReverse: new SIGNALS.Signal(),
		helperPlaneUpDown: new SIGNALS.Signal(),
		//////////////////////////////////////////////////////////////////////////
	};
	
	this.config = new Config();
	
	this.history = new History( this );
	
	this.storage = new Storage();
	
	this.loader = new Loader( this );
	
	this.camera = this.DEFAULT_CAMERA.clone();
	
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';

	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};
	this.scripts = {};

	this.selected = null;
	this.helpers = {};

	this.cache = {}
};

Editor.prototype = {

	setTheme: function ( value ) {
		document.getElementById( 'theme' ).href = value;
		this.signals.themeChanged.dispatch( value );
	},

	//

	setScene: function ( scene ) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addObject: function ( object ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addHelper( child );
		} );

		this.scene.add( object );

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	moveObject: function ( object, parent, before ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		// sort children array

		if ( before !== undefined ) {

			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},

	nameObject: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function ( texture ) {

		this.textures[ texture.uuid ] = texture;

	},

	//

	addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object ) {

			var helper;

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 1 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 1 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 1 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 1 );

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 1 );

			} else if ( object instanceof THREE.SkinnedMesh ) {

				helper = new THREE.SkeletonHelper( object );

			} else {

				// no helper for this object type
				return;

			}

			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			helper.add( picker );

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

	}(),

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//

	addScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) {

			this.scripts[ object.uuid ] = [];

		}

		this.scripts[ object.uuid ].push( script );

		this.signals.scriptAdded.dispatch( script );

	},

	removeScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) return;

		var index = this.scripts[ object.uuid ].indexOf( script );

		if ( index !== - 1 ) {

			this.scripts[ object.uuid ].splice( index, 1 );

		}

		this.signals.scriptRemoved.dispatch( script );

	},

	//

	select: function ( object ) {

		if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;



		this.config.setKey( 'selected', uuid );
		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		if ( id === this.camera.id ) {

			this.select( this.camera );
			return;

		}

		this.select( this.scene.getObjectById( id, true ) );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	},

	focus: function ( object ) {

		this.signals.objectFocused.dispatch( object );

	},

	focusById: function ( id ) {

		this.focus( this.scene.getObjectById( id, true ) );

	},

	clear: function () {

		this.history.clear();
		this.storage.clear();

		this.camera.copy( this.DEFAULT_CAMERA );

		var objects = this.scene.children;

		while ( objects.length > 0 ) {

			this.removeObject( objects[ 0 ] );

		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.deselect();

		this.signals.editorCleared.dispatch();

	},

	//

	fromJSON: function ( json ) {

		var loader = new THREE.ObjectLoader();

		// backwards

		if ( json.scene === undefined ) {

			this.setScene( loader.parse( json ) );
			return;

		}

		var camera = loader.parse( json.camera );

		this.camera.copy( camera );
		this.camera.aspect = this.DEFAULT_CAMERA.aspect;
		this.camera.updateProjectionMatrix();

		this.history.fromJSON( json.history );
		this.scripts = json.scripts;

		this.setScene( loader.parse( json.scene ) );

	},

	toJSON: function () {

		// scripts clean up

		var scene = this.scene;
		var scripts = this.scripts;

		for ( var key in scripts ) {
			var script = scripts[ key ];
			if ( script.length === 0 || scene.getObjectByProperty( 'uuid', key ) === undefined ) {
				delete scripts[ key ];
			}
		}

		//

		return {
			metadata: {},
			project: {
				shadows: this.config.getKey( 'project/renderer/shadows' ),
				editable: this.config.getKey( 'project/editable' ),
				vr: this.config.getKey( 'project/vr' )
			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts,
			history: this.history.toJSON()
		};

	},

	objectByUuid: function ( uuid ) {

		return this.scene.getObjectByProperty( 'uuid', uuid, true );

	},

	execute: function ( cmd, optionalName ) {

		this.history.execute( cmd, optionalName );

	},

	undo: function () {

		this.history.undo();

	},

	redo: function () {

		this.history.redo();

	},

	// 请求后台数据
	post: function (url, data, callback) {
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			dataType: 'json',
			async: false,
			success: callback
		});
	},
    // 获取对象类型
    getObjectType: function (object) {
        for (var type in this.types) {
            if (object != null && object.obj_type === type) return type;
        }
        return 'default';
    },
    getObjectTypeName: function (object) {
        for (var type in this.types) {
            if (object != null && object.obj_type === type) return this.types[type];
        }
        return '未知';

    },
    viewObjectInList: function (object) {
        views = [
            'well',
            'scene',
            'line',
            'hline',
            'auline',
            'object'

        ];
        if (object != null && views.indexOf(object.obj_type) != -1) {
            return true;
        } else {
            return false;
        }

    },
    destoryObject: function (object_type) {
        var ed = this;
        var shallowCopy = $.extend({}, ed.scene.children);
        $.each(shallowCopy, function (i, v) {
            if (v.obj_type === object_type) {
                editor.removeObject(v);
            }
        });
        if (object_type === "well") {
            shallowCopy = $.extend({}, ed.sceneHelpers.children);
            $.each(shallowCopy, function (i, v) {
                if (v.obj_type === 'well_value_label' || v.obj_type === 'well_value_point' || v.obj_type === 'well_label' || v.obj_type === 'well_start') {
                    editor.sceneHelpers.remove(v);
                }
            });
        }

    }
};
