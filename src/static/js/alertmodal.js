/**
*	调用例子：
*	
*	alert("删除成功！");
*	-- 会用模态框方式提示参数内容
*
*	
*	modalConfirm("确认删除？","确认删除名字为张三的用户？",function(){
*		delete("张三"); 
*	});
*	-- 此方法会弹出模态框 标题为-确认删除？  内容为 - 确认删除名字为张三的用户？
*	--	当用户点击确认时会调用 delete("张三"); 方法
*
*/

$(function(){
	$("body").append("<div style=\"z-index:1000000\" class=\"modal fade\" id=\"alertModal\" tabindex=\"-10\" role=\"dialog\" aria-labelledby=\"myModalLabel\">"+
				"	<div class=\"modal-dialog\" role=\"document\">"+
				"	  <div class=\"modal-content\">"+
				"		<div class=\"modal-header\">"+
				"		  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+
				"		  <h4 class=\"modal-title\">提示</h4>"+
				"		</div>"+
				"		<div class=\"modal-body\">"+
				"		  <span id=\"alertspan\">成功</span>"+
				"		</div>"+
				"		<div class=\"modal-footer\">"+
				"		  <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">确定</button>"+
				"		</div>"+
				"	  </div>"+
				"	</div>"+
				"</div>"+
				
				"<div id=\"modal_confirm\" style=\"z-index:10000\" class=\"modal fade\">"+
				"	<div class=\"modal-dialog\">"+
				"		<div  class=\"modal-content\">"+
				"			<div class=\"modal-header\">"+
				"				<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+
				"				<h4 class=\"modal-title\" id=\"modal_confirm_title\"></h4>"+
				"			</div>"+
				"			<div class=\"modal-body\">"+
				"				<div id=\"modal_confirm_content\"></div>"+
				"			</div>"+
				"			<div class=\"modal-footer\">"+
				"				<button id=\"modal_confirm_cancel\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>"+
				"				<button id=\"modal_confirm_sure\" type=\"button\" class=\"btn btn-primary\">确认</button>"+
				"			</div>"+
				"		</div>"+
				"	</div>");

	
})


var alert=function(data){
	$("#alertspan").empty();
	$("#alertspan").append(data);
	//$("#alertspan").text(data);
	$("#alertModal").modal('show');
}

var modalConfirm = function(title,content,callback){
	$("#modal_confirm_title").html(title);
	$("#modal_confirm_content").html(content);
	$('#modal_confirm_sure').unbind("click"); 
	$('#modal_confirm_sure').click(function(){
		$("#modal_confirm").modal('hide');
		callback();
	});
	$("#modal_confirm").modal('show');
}

var isClickClose = false;
var modalConfirmCancel = function(title,content,callback,cancel){
	isClickClose = false;
	$("#modal_confirm_title").html(title);
	$("#modal_confirm_content").html(content);
	$('#modal_confirm_sure').unbind("click"); 
	$('#modal_confirm_sure').click(function(){
		isClickClose = true;
		$("#modal_confirm").modal('hide');
		callback();
	});

	$('#modal_confirm').unbind('hidden.bs.modal');
	$('#modal_confirm').on('hidden.bs.modal', function(){
		if(isClickClose){
			isClickClose = false;
		}else{
			cancel();
		}
	});
	
	$("#modal_confirm").modal('show');
}

