/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new Sidebar.Batch(editor));
	container.add( new Sidebar.Loader( editor ) );
	container.add(new Sidebar.Menu(editor));
	container.add(new Sidebar.Mineral(editor));
    //
	container.add(new Sidebar.Level(editor));
	// /////////////////////////////////////////////////////////郭佳宁：椭球体和块段模型
	container.add(new Sidebar.MathObject(editor));
	// /////////////////////////////////////////////////////////////////////////////////
	container.add( new Sidebar.Scene( editor ) );
	container.add( new Sidebar.Object3D( editor ) );
	container.add(new Sidebar.Operation(editor));
	container.add(new Sidebar.Block(editor));
	container.add(new Sidebar.KDF(editor));
	container.add(new Sidebar.KLG(editor));
	// ////////////////////////////////////////////////////////郭佳宁：采区和抽注单元
	container.add(new Sidebar.AreaAndUnit(editor));
	container.add(new Sidebar.Importer(editor));
	return container;
};
