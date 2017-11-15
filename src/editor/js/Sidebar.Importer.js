Sidebar.Importer = function (editor) {
    var signals = editor.signals;
    var stope = "168采场";
    var baseInfo = {stope:stope};

    var container = new UI.CollapsiblePanel().addStatic(new UI.Text("数据导入")).add(new UI.Break());
    container.add(new UI.Text("采场："),new UI.Input().setValue(stope), new UI.Break(),new UI.Break());

    function parseLine(object) {
        if (object == null || object.points == null) return null;
        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial({
            color: 0x00fff0,
            side: THREE.DoubleSide
        });
        points = object.points;
        for (var i = 0; i < points.length;) {
            var p = points[i++];
            geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
        }
        var line = new THREE.Line(geometry, material);
        line.name = object.name;
        line.type = object.type;
        return line;
    }
    function parseLines(objects) {
        if (objects == null) return null;
        var list = new THREE.Group();
        $.each(objects, function (i, object) {
            list.add(parseLine(object))
        });
        return list;
    }
    function parseMeshs(objects) {
        if (objects == null) return null;
        var loader = new THREE.JSONLoader();
        var list = new THREE.Group();
        $.each(objects, function (i, object) {
            var obj = loader.parse(object);
            var material = new THREE.MeshBasicMaterial({
                color: 0x00fff0,
                side: THREE.DoubleSide,
                wireframe: false,
                transparent: true,
                opacity: 0.33
            });

            var mesh = new THREE.Mesh(obj.geometry, material);
            list.add(mesh);
        });
        return list;
    }


    var fileInput = document.createElement( 'input' );
    var handler = "/importTunnel";
    fileInput.type = 'file';
    fileInput.addEventListener( 'change', function ( event ) {
        var form = new FormData();
        form.append('stope',stope);
        form.append('batch',"批次1");
        // 添加文件对象
        form.append('file', fileInput.files[ 0 ]);

        // XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        xhr.open("post", handler, true);
        xhr.onload = function () {};
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var objects =  eval ("(" + xhr.responseText + ")");
                alert(objects.msg);
                var tunnels = new THREE.Group();
                $.each(objects.data, function (i, object) {
                    var tunnel = new THREE.Group();
                    tunnel.add(parseLine(object.leadLine));
                    tunnel.add(parseLines(object.bondLines));
                    tunnel.add(parseLines(object.crossLines));
                    tunnel.add(parseMeshs(object.meshs));
                    tunnels.add(tunnel);
                });
                editor.addObject(tunnels);
            }
        };
        xhr.send(form);
    } );
    var btn1 = new UI.Button("井巷测量数据").setClass("btn btn-primary btn-sm")
        .onClick(function () {
            handler = "/importTunnel";
            fileInput.click();
        });
    var btn2 = new UI.Button("物探编录数据").setClass("btn btn-primary btn-sm")
        .onClick(function () {
            handler = "/importSample";
            fileInput.click();
        });
    var btn3 = new UI.Button("采场测量数据").setClass("btn btn-primary btn-sm")
        .onClick(function () {
            handler = "/importStope";
            fileInput.click();
        });

    return container.add(btn1, btn2, btn3);
};