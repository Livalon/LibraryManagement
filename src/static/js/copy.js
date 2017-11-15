/**
 * Created by langreen on 2017/4/25.
 */

//自动向后复制其他月份的输入矿石量、金属和品位
var k1 = 0;
var k2 = 0;
var num = parseInt($("#data").data("target"));
var type = $("#data").attr("tabindex");
function Copy(target) {
    var flag = $(target).data('target');
    var parenttd = $(target).closest('td');
    var parent_target = $(parenttd).data('target');
    var parenttr = $(target).closest('tr');
    var currentData = parseFloat($(parenttd).find('input').val());
    var firstmine = num - 3;
    var firstmetal = num - 1;
    var mine = $(parenttr).find("td:eq("+firstmine+")").text();
    var metal = $(parenttr).find("td:eq("+firstmetal+")").text();

    var grade;

    if (parent_target == "矿石量"){
        k1 = 0;
        var sum = 0.0;
        var grateTd = $(parenttd).next();
        grade = $(grateTd).find('p').text();
        for (var i = 0;i <= flag;i++){
            var node = i*3+num;
            var tdData = $(parenttr).find("td:eq("+node+")");
            sum += parseFloat($(tdData).find('input').val());
        }
        sum += currentData;

        for (var i = flag+1;i <= 11;i++){

            var mineNode = i * 3 + num;
            var minetdData = $(parenttr).find("td:eq(" + mineNode + ")");

            if(sum <= mine){
                k1++;
                $(minetdData).find('input').attr("value", currentData);
                sum += currentData;
            }else {
                if (i == (k1 + 1)) {
                    var temp = mine - sum +currentData;
                    $(minetdData).find('input').attr("value", temp);
                }else {
                    $(minetdData).find('input').attr("value", 0);
                    $(gradetdData).find('p').text(0);
                }

            }
        }
    }
    if (parent_target == "金属量"){
        k2 = 0;
        var sum = 0.0;
        var grateTd = $(parenttd).prev();
        grade = $(grateTd).find('p').text();
        for (var i = 0;i<=flag;i++) {
            var node = i * 3 + num + 2;
            var tdData = $(parenttr).find("td:eq(" + node + ")");
            sum += parseFloat($(tdData).find('input').val());
        }
        sum += currentData;
        for (var i= flag+1;i <= 11;i++){
            var metalNode = i * 3 + num + 2;
            var metaltdData = $(parenttr).find("td:eq(" + metalNode + ")");

            if (sum <= metal) {
                k2++;
                $(metaltdData).find('input').attr("value", currentData);
                sum += currentData;

            }else {
                if (i == (k2 + 1)) {
                    var temp = metal - sum +currentData;
                    $(metaltdData).find('input').attr("value", temp);
                }else{
                    $(metaltdData).find('input').attr("value", 0);
                    $(gradetdData).find('p').text(0);
                }

            }
        }
    }

    if (grade != 0){
        if(k1 <= k2){
            for (var i= flag + 1;i < k1 + 1;i++){
                var gradeNode = i  * 3 + num + 1;
                var gradetdData = $(parenttr).find("td:eq(" + gradeNode + ")");
                $(gradetdData).find('p').text(grade);
            }

            if (k1 < 12){
                var mineNode = (k1 + 1) * 3 + num;
                var gradeNode = (k1 + 1) * 3 + num + 1;
                var metalNode = (k1 + 1 ) * 3 + num + 2;

                var mineData = $(parenttr).find("td:eq(" + mineNode + ")").find('input').val();
                var metalData = $(parenttr).find("td:eq(" + metalNode + ")").find('input').val();

                if (mineData != 0){
                    var lastgarde = (metalData/mineData)*100;
                    $(parenttr).find("td:eq(" + gradeNode + ")").find('p').text(lastgarde.toFixed(4));
                }
            }

        }
        if (k1 > k2){
            for (var i= flag + 1;i < k2 + 1;i++){
                var gradeNode = i  * 3 + num + 1;
                var gradetdData = $(parenttr).find("td:eq(" + gradeNode + ")");
                $(gradetdData).find('p').text(grade);
            }
        }
        if (k2 > 12){
            var mineNode = (k2 + 1) * 3 + num;
            var gradeNode = (k2 + 1)*3 + num + 1;
            var metalNode = (k2 + 1 )*3 + num + 2;

            var mineData = $(parenttr).find("td:eq(" + mineNode + ")").find('input').val();
            var metalData = $(parenttr).find("td:eq(" + metalNode + ")").find('input').val();

            if (mineData != 0){
                var lastgarde = (metalData/mineData)*100;

                $(parenttr).find("td:eq(" + gradeNode + ")").find('p').text(lastgarde.toFixed(4));
            }
        }

    }else {
        for (var i = flag + 1; i < 13; i ++)
        var gradeNode = i * 3 + num + 1;
        $(parenttr).find("td:eq(" + gradeNode + ")").find('p').text(0);
    }



}
//计算品位
function TextChange(target) {
    var dataTarget = $(target).data('target');
    var parenttd = $(target).closest('td');
    var mine = 0;
    var grade = 0;
    var metal = 0;
    var gradetd;
    if (dataTarget == "矿石量"){
        mine = $(target).val();
        gradetd = $(parenttd).next();
        var metaltd = $(gradetd).next();
        metal = $(metaltd).find('input').val();

    }
    if (dataTarget == "金属量"){
        metal = $(target).val();
        gradetd = $(parenttd).prev();
        var minetd = $(gradetd).prev();
        mine = $(minetd).find('input').val();

    }
    if(mine !=0){
        grade = (metal/mine)*100;
        $(gradetd).find('p').text(grade.toFixed(4));
    }else {
        $(gradetd).find('p').text(0);
    }

}

function GetData() {
    var data = new Array();
    var capacity = new Array();
    var mine;
    var grade;
    var metal;
    var len = $("#data tr").length;
    var tempName;
    for (var i=2;i<len;i++){
        var mineNode =  num - 3;
        var gradeNode = num - 2;
        var metalNode = num - 1;
        capacity[i-2] = new Array();
        var datatr = $("#data").find("tr:eq("+i+")");
        var name = $(datatr).find("td:eq(0)").find("p").text();
        var mineName;
        if (type == "mined"){
            if (name != ""){
                tempName = name;
            }
            if (name == ""){
                name = tempName;
            }
            mineName = $(datatr).find("td:eq(1)").find("p").text();
        }
        if (type == "add"){
            mineName = $(datatr).find("td:eq(1)").find("input").val();
        }

        mine = parseFloat($(datatr).find("td:eq("+mineNode+")").find("p").text());
        grade = parseFloat($(datatr).find("td:eq("+gradeNode+")").find("p").text());
        metal = parseFloat($(datatr).find("td:eq("+metalNode+")").find("p").text());
        capacity[i-2][0] = {
            "mine" : mine,
            "grade" : grade,
            "metal" : metal
        };

        if (i==len-1){
            for (var j=1;j<14;j++){
                var mineNode = (j-1)*3 + num;
                var gradeNode = (j-1)*3 + num + 1;
                var metalNode = (j-1)*3 + num + 2;
                mine = parseFloat($(datatr).find("td:eq("+mineNode+")").find("p").text());
                grade = parseFloat($(datatr).find("td:eq("+gradeNode+")").find("p").text());
                metal = parseFloat($(datatr).find("td:eq("+metalNode+")").find("p").text());
                capacity[i-2][j] = {
                    "mine" : mine,
                    "grade" : grade,
                    "metal" : metal
                };
            }
        }else {
            for (var j=1;j<14;j++){
                var mineNode = (j-1)*3 + num;
                var gradeNode = (j-1)*3 + num + 1;
                var metalNode = (j-1)*3 + num + 2;
                if(0<j<13){
                    mine = parseFloat($(datatr).find("td:eq("+mineNode+")").find("input").val());
                    grade = parseFloat($(datatr).find("td:eq("+gradeNode+")").find("p").text());
                    metal = parseFloat($(datatr).find("td:eq("+metalNode+")").find("input").val());
                }
                if (j>12){
                    mine = parseFloat($(datatr).find("td:eq("+mineNode+")").find("p").text());
                    grade = parseFloat($(datatr).find("td:eq("+gradeNode+")").find("p").text());
                    metal = parseFloat($(datatr).find("td:eq("+metalNode+")").find("p").text());
                }
                capacity[i-2][j] = {
                    "mine" : mine,
                    "grade" : grade,
                    "metal" : metal
                };

            }
        }


        data[i-2] = {
            "nameOther":mineName,
            "name":name,
            "capacity":capacity[i-2]
        };


    }
    return data;

}

function Sum() {
    var data = GetData();
    //汇总
    for (var j=0;j<13;j++){
        var sumMine = 0;
        var sumMetal = 0;
        var grade = 0;
        var mineNode = j*3 + num - 3;
        var gradeNode = j*3 + num - 2;
        var metalNode = j*3 + num - 1;
        for (var i=0;i<data.length-1;i++){
            sumMine += data[i].capacity[j].mine;
            sumMetal += data[i].capacity[j].metal;
        }
        if (sumMine !=0 && sumMetal != 0){
            grade = (sumMetal/sumMine)*100;
        }
        $("#sum").find("td:eq("+mineNode+")").find("p").text(sumMine);
        $("#sum").find("td:eq("+gradeNode+")").find("p").text(grade.toFixed(4));
        $("#sum").find("td:eq("+metalNode+")").find("p").text(sumMetal);
    }
    //小计
    var sum1 = 0;
    var sum2 = 0;
    var grade1;
    var mineNode = 12*3 + num;
    var gradeNode = 12*3 + num + 1;
    var metalNode = 12*3 + num + 2;
    for (var i=0;i<data.length-1;i++){
        var k =i+2;
        var tr = $("#data").find("tr:eq("+k+")");
        var sumMine = 0;
        var sumMetal = 0;
        var grade = 0;
        for (var j=1;j<13;j++){
            sumMine += data[i].capacity[j].mine;
            sumMetal += data[i].capacity[j].metal;
        }
        sum1 += sumMine;
        sum2 += sumMetal;

        if (sumMine !=0 && sumMetal != 0){
            grade = (sumMetal/sumMine)*100;
        }

        $(tr).find("td:eq("+mineNode+")").find("p").text(sumMine);
        $(tr).find("td:eq("+gradeNode+")").find("p").text(grade.toFixed(4));
        $(tr).find("td:eq("+metalNode+")").find("p").text(sumMetal);


    }

    grade1 = (sum2/sum1)*100;
    var k = data.length + 1;
    var tr = $("#data").find("tr:eq("+k+")");
    $(tr).find("td:eq("+mineNode+")").find("p").text(sum1);
    $(tr).find("td:eq("+gradeNode+")").find("p").text(grade1.toFixed(4));
    $(tr).find("td:eq("+metalNode+")").find("p").text(sum2);

    //计算计划新增产能
    var planMine = $("#planMineCapacility").val();
    var planMetal = $("#planMetalCapacility").val();

    var addMine = planMine - sum1;
    var addMetal = planMetal - sum2;

    $("#addMineCapacility").attr("value",addMine);
    $("#addMetalCapacility").attr("value",addMetal);

}
