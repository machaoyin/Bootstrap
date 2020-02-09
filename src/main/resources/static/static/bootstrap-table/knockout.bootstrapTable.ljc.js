/***
 * 扩展数组的删除一个元素的方法
 */
Array.prototype.removeByValue = function(val) {
	for(var i=0; i<this.length; i++) {
		if(this[i] == val) {
			this.splice(i, 1);
	      	//break;
	 	}
	}
};
/***
 * 扩展数据的新增元素的方法
 */
Array.prototype.addByValue=function(val){
	if(this.indexOf(val)<0){
		this.push(val);
	}
}

/***
 * bootstrapr的默认参数
 */

bootbox.setDefaults({
	locale:'zh_CN',
	size: 'small',
	title:'提示'
});


var defaultParams = {
        toolbar: '#toolbar',                //工具按钮用哪个容器
        queryParams: function (param) {
            return { limit: param.limit, offset: param.offset };
        },//传递参数（*）
        idField: 'id',
        pagination: true,                   //是否显示分页（*）
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 20,                       //每页的记录行数（*）
        pageList: [20, 30, 100, 200],        //可供选择的每页的行数（*）
        method: 'get',
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        //striped:true,
        singleSelect:true,					//办能单选
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        cache:false,
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        showToggle: true,
        selectIds:[],						//选中的行的id号
        queryObj:null,						//查询div的jquery对象
        thisObj:null						//表格的jquery对象
 		
    };

/***
 * bootstrapTable要绑定的对象的的构造方法
 * params : bootstrapTable的参数
 * queryCondition : 查询条件，被绑定
 * urls : bootstrapTable所有的相关调用的url
 * clearClick : 查询窗口清空事件
 * queryClick : 查询窗口查询事件
 * addClick : 工具栏新增事件
 * editClick : 工具栏编辑事件
 * deleteClick : 工具栏删除按钮事件
 * searchClick : 工具栏的查询事件
 */
var BsTableViewModel=function(data){
	var that=this;
    this.queryCondition = ko.mapping.fromJS(data.queryCondition);
    this.defaultQueryParams = {
        queryParams: function (param) {
            var params = that.queryCondition;
            params.limit = param.limit;
            params.offset = param.offset;
            params.search = param.search;
            params.sort = param.sort;
            params.order=param.order;
            return params;
        }
    };
	var thisParams=$.extend({},defaultParams,this.defaultQueryParams);
	thisParams.selectIds=[];
	this.params = $.extend({}, thisParams, data.tableParams || {});
    
    //为了解决刷新保留选中的行的问题，扩展了如下事件
    $.extend(this.params,{
        onPostBody:function(data){
        	if(that.params.selectIds.length>0){
	        	var selecteds=that.params.selectIds;
	        	var $this=that.params.thisObj;
	        	$this.bootstrapTable('checkBy',{field:'id',values:selecteds});
        	}
         } , 
        onCheck:function(row){
        	var selecteds=that.params.selectIds;
        	if(that.params.singleSelect){
        		selecteds.length=0;
        		selecteds.push(row.id);
        		return;
        	}
			var i=0;
			for(i=0;i<selecteds.length;i++){
				if(selecteds[i]==row.id){
					break;
				}
			}
			if(i==selecteds.length){
				selecteds.push(row.id);
				selecteds=selecteds.sort();
			}
		},
		onUncheck:function(row){
			var selecteds=that.params.selectIds;
			selecteds.removeByValue(row.id);
		},
		onCheckAll:function(rows){
			var ids=that.params.selectIds;
			for(var i=0;i<rows.length;i++){
				ids.addByValue(rows[i].id);
			}
		},
		onUncheckAll : function(rows){
			var ids=that.params.selectIds;
			for(var i=0;i<rows.length;i++){
				ids.removeByValue(rows[i].id);
			}
		}
    });
    this.urls=data.urls;
    
    //查询窗口清空事件
	this.clearClick = function () {
    	self=that.params.thisObj;
		$.each(that.queryCondition, function (key, value) {
	    	//只有监控属性才清空
			if (typeof (value) == "function") {
	        	this(''); //value('');
	        }
	    });
		$('.selectpicker').selectpicker('refresh');
	    self.bootstrapTable('selectPage', 1);
    };

    //查询窗口查询事件
    this.queryClick = function () {
        that.params.thisObj.bootstrapTable('selectPage', 1);
    };

    //工具栏新增事件
    this.addClick = function () {
    	var self=that.params.thisObj;
    	var dialog = $('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"></div>');
        dialog.load(data.urls.add, that.queryCondition, function () { });

        $("body").append(dialog);
        dialog.modal().on('hidden.bs.modal', function () {
            //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
            ko.cleanNode(document.getElementById("formEdit"));
            dialog.remove();
            self.bootstrapTable('refresh');
        });
    };

    //工具栏编辑事件
    this.editClick = function () {
    	var self=that.params.thisObj;
        var arrselectedData = self.bootstrapTable('getSelections');
        if (arrselectedData.length <= 0 || arrselectedData.length > 1) {
            bootbox.alert("每次只能编辑一行");
        	return;
        }
        var selectId=arrselectedData[0].id
        
        var dialog = $('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"></div>');
        dialog.load(data.urls.update, {id:selectId});
        $("body").append(dialog);
        dialog.modal().on('hidden.bs.modal', function () {
        	//关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
        	ko.cleanNode(document.getElementById("formEdit"));
        	dialog.remove();
        	self.bootstrapTable('refresh');
        });
    };
    this.pageEditClick=function(){
    	var self=that.params.thisObj;
        var arrselectedData = self.bootstrapTable('getSelections');
        if (arrselectedData.length <= 0 || arrselectedData.length > 1) {
            bootbox.alert("每次只能编辑一行");
        	return;
        }
    	$('body').load(data.urls.update,arrselectedData[0],function(){});
    };
    //工具栏删除按钮事件
    this.deleteClick = function () {
    	var self=that.params.thisObj;
        var arrselectedData = self.bootstrapTable('getSelections');
        if (!arrselectedData||arrselectedData.length<=0) {
            bootbox.alert("请至少选择一行");
            return;
        }
        var selectId=arrselectedData[0].id;
        bootbox.confirm({
        	size:'small',
        	message:'是否要删除选中记录？',
        	callback:function(result){
        		if(result){
                	//首先在参数selectIds中清除掉所有选中行的id
                	var ids=that.params.selectIds;
                	for(var i=0;i<arrselectedData.length;i++){
                		ids.removeByValue(arrselectedData[i].id);
                	}
                	//ajax调用在后台清除掉选中的行的数据 
                	$.ajax({
                        url: data.urls.delete,
                        type: "post",
                        data: {id:selectId},
                        success: function (data, status) {
                        	if(data.success!=null&&data.success==false){
                        		//alert(data.msg);
                        		bootbox.alert({
                        			size: "small",
                        			title: "提示",
                        			message: data.msg, 
                        			callback: function(){
                        			
                        			}
                        		});
                        	}else{
                        		self.bootstrapTable('refresh'); //刷新表格
                        	}
                        }
                	});
        			
        		}
        	}
        });
    };
    
    
    //工具栏修改用户按钮事件
    this.userClick = function () {
    	var self=that.params.thisObj;
        var arrselectedData = self.bootstrapTable('getSelections');
        if (!arrselectedData||arrselectedData.length<=0) {
            bootbox.alert("请至少选择一行");
            return;
        }
        var selectId=arrselectedData[0].id;
        bootbox.confirm({
        	size:'small',
        	message:'是否要修改选中记录？',
        	callback:function(result){
        		if(result){
                	//首先在参数selectIds中清除掉所有选中行的id
                	var ids=that.params.selectIds;
                	for(var i=0;i<arrselectedData.length;i++){
                		ids.removeByValue(arrselectedData[i].id);
                	}
                	//ajax调用在后台清除掉选中的行的数据 
                	$.ajax({
                        url: data.urls.user,
                        type: "post",
                        data: {id:selectId},
                        success: function (data, status) {
                        	if(data.success!=null&&data.success==false){
                        		//alert(data.msg);
                        		bootbox.alert({
                        			size: "small",
                        			title: "提示",
                        			message: data.msg, 
                        			callback: function(){
                        			
                        			}
                        		});
                        	}else{
                        		self.bootstrapTable('refresh'); //刷新表格
                        	}
                        }
                	});
        			
        		}
        	}
        });
    };
    
    //工具栏修改环卫按钮事件
    this.huanweiClick = function () {
    	var self=that.params.thisObj;
        var arrselectedData = self.bootstrapTable('getSelections');
        if (!arrselectedData||arrselectedData.length<=0) {
            bootbox.alert("请至少选择一行");
            return;
        }
        var selectId=arrselectedData[0].id;
        bootbox.confirm({
        	size:'small',
        	message:'是否要修改选中记录？',
        	callback:function(result){
        		if(result){
                	//首先在参数selectIds中清除掉所有选中行的id
                	var ids=that.params.selectIds;
                	for(var i=0;i<arrselectedData.length;i++){
                		ids.removeByValue(arrselectedData[i].id);
                	}
                	//ajax调用在后台清除掉选中的行的数据 
                	$.ajax({
                        url: data.urls.huanwei,
                        type: "post",
                        data: {id:selectId},
                        success: function (data, status) {
                        	if(data.success!=null&&data.success==false){
                        		//alert(data.msg);
                        		bootbox.alert({
                        			size: "small",
                        			title: "提示",
                        			message: data.msg, 
                        			callback: function(){
                        			
                        			}
                        		});
                        	}else{
                        		self.bootstrapTable('refresh'); //刷新表格
                        	}
                        }
                	});
        			
        		}
        	}
        });
    };
    
    //工具栏修改引导员按钮事件
    this.usherClick = function () {
    	var self=that.params.thisObj;
    	var arrselectedData = self.bootstrapTable('getSelections');
    	if (!arrselectedData||arrselectedData.length<=0) {
    		bootbox.alert("请至少选择一行");
    		return;
    	}
    	var selectId=arrselectedData[0].id;
    	bootbox.confirm({
    		size:'small',
    		message:'是否要修改选中记录？',
    		callback:function(result){
    			if(result){
    				//首先在参数selectIds中清除掉所有选中行的id
    				var ids=that.params.selectIds;
    				for(var i=0;i<arrselectedData.length;i++){
    					ids.removeByValue(arrselectedData[i].id);
    				}
    				//ajax调用在后台清除掉选中的行的数据 
    				$.ajax({
    					url: data.urls.usher,
    					type: "post",
    					data: {id:selectId},
    					success: function (data, status) {
    						if(data.success!=null&&data.success==false){
    							//alert(data.msg);
    							bootbox.alert({
    								size: "small",
    								title: "提示",
    								message: data.msg, 
    								callback: function(){
    									
    								}
    							});
    						}else{
    							self.bootstrapTable('refresh'); //刷新表格
    						}
    					}
    				});
    				
    			}
    		}
    	});
    };
    
    //工具栏修改回收站按钮事件
    this.wbljhszClick = function () {
    	var self=that.params.thisObj;
    	var arrselectedData = self.bootstrapTable('getSelections');
    	if (!arrselectedData||arrselectedData.length<=0) {
    		bootbox.alert("请至少选择一行");
    		return;
    	}
    	var selectId=arrselectedData[0].id;
    	bootbox.confirm({
    		size:'small',
    		message:'是否要修改选中记录？',
    		callback:function(result){
    			if(result){
    				//首先在参数selectIds中清除掉所有选中行的id
    				var ids=that.params.selectIds;
    				for(var i=0;i<arrselectedData.length;i++){
    					ids.removeByValue(arrselectedData[i].id);
    				}
    				//ajax调用在后台清除掉选中的行的数据 
    				$.ajax({
    					url: data.urls.wbljhsz,
    					type: "post",
    					data: {id:selectId},
    					success: function (data, status) {
    						if(data.success!=null&&data.success==false){
    							//alert(data.msg);
    							bootbox.alert({
    								size: "small",
    								title: "提示",
    								message: data.msg, 
    								callback: function(){
    									
    								}
    							});
    						}else{
    							self.bootstrapTable('refresh'); //刷新表格
    						}
    					}
    				});
    				
    			}
    		}
    	});
    };
    
  //工具栏修改老人用户按钮事件
    this.oldmanClick = function () {
    	var self=that.params.thisObj;
    	var arrselectedData = self.bootstrapTable('getSelections');
    	if (!arrselectedData||arrselectedData.length<=0) {
    		bootbox.alert("请至少选择一行");
    		return;
    	}
    	var selectId=arrselectedData[0].id;
    	bootbox.confirm({
    		size:'small',
    		message:'是否要修改选中记录？',
    		callback:function(result){
    			if(result){
    				//首先在参数selectIds中清除掉所有选中行的id
    				var ids=that.params.selectIds;
    				for(var i=0;i<arrselectedData.length;i++){
    					ids.removeByValue(arrselectedData[i].id);
    				}
    				//ajax调用在后台清除掉选中的行的数据 
    				$.ajax({
    					url: data.urls.oldman,
    					type: "post",
    					data: {id:selectId},
    					success: function (data, status) {
    						if(data.success!=null&&data.success==false){
    							//alert(data.msg);
    							bootbox.alert({
    								size: "small",
    								title: "提示",
    								message: data.msg, 
    								callback: function(){
    									
    								}
    							});
    						}else{
    							self.bootstrapTable('refresh'); //刷新表格
    						}
    					}
    				});
    				
    			}
    		}
    	});
    };
    
 /***
  * 工具栏打印取袋二维码按钮事件
  * @author zjh
  */
    this.qrcodeClick = function () {
    	var self=that.params.thisObj;
    	var arrselectedData = self.bootstrapTable('getSelections');
    	if (!arrselectedData||arrselectedData.length<=0) {
    		bootbox.alert("请至少选择一行");
    		return;
    	}
    	var selectId=arrselectedData[0].id;
    	bootbox.confirm({
    		size:'small',
    		message:'是否要打印选中记录？',
    		callback:function(result){
    			if(result){
    				//首先在参数selectIds中清除掉所有选中行的id
    				var ids=that.params.selectIds;
    				for(var i=0;i<arrselectedData.length;i++){
    					ids.removeByValue(arrselectedData[i].id);
    				}
    				//ajax调用在后台清除掉选中的行的数据 
    				$.ajax({
    					url: data.urls.qrcode,
    					type: "post",
    					data: {id:selectId},
    					success: function (msgdate, status) {
    			
    						if(msgdate.success!=null&&msgdate.success==false){
    							//alert(data.msg);
    							bootbox.alert({
    								size: "small",
    								title: "提示",
    								message: msgdate.msg, 
    								callback: function(){
    									
    								}
    							});
    						}else{
    							
    					    	var dialog = $('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"></div>');
    					        dialog.load(data.urls.print, msgdate, function () { });
    					        $("body").append(dialog);
    					        dialog.modal().on('hidden.bs.modal', function () {
    					            //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
    					            //ko.cleanNode(document.getElementById("formEdit"));
    					            dialog.remove();
    					            self.bootstrapTable('refresh');
    					        });
    					       
    						}
    					}
    				});
    				
    			}
    		}
    	});
    };
  //工具栏重置密码按钮事件
    this.resetClick = function () {
    	var self=that.params.thisObj;
    	var arrselectedData = self.bootstrapTable('getSelections');
    	if (!arrselectedData||arrselectedData.length<=0) {
    		bootbox.alert("请至少选择一行");
    		return;
    	}
    	var selectId=arrselectedData[0].id;
    	bootbox.confirm({
    		size:'small',
    		message:'是否要重置选中记录？',
    		callback:function(result){
    			if(result){
    				//首先在参数selectIds中清除掉所有选中行的id
    				var ids=that.params.selectIds;
    				for(var i=0;i<arrselectedData.length;i++){
    					ids.removeByValue(arrselectedData[i].id);
    				}
    				//ajax调用在后台清除掉选中的行的数据 
    				$.ajax({
    					url: data.urls.reset,
    					type: "post",
    					data: {id:selectId},
    					success: function (data, status) {
    						if(data.success!=null&&data.success==true){
    							//alert(data.msg);
    							bootbox.alert({
    								size: "small",
    								title: "提示",
    								message: data.msg, 
    								callback: function(){
    									self.bootstrapTable('refresh');
    								}
    							});
    						}else{
    							bootbox.alert({
    								size: "small",
    								title: "提示",
    								message: data.msg, 
    								callback: function(){
    									self.bootstrapTable('refresh');
    								}
    							});
    							//self.bootstrapTable('refresh'); //刷新表格
    						}
    					}
    				});
    				
    			}
    		}
    	});
    };
    
    //工具栏查询按钮点击事件
    this.searchClick=function(){
    	var self=that.params.thisObj;
    	var dialog = that.params.queryObj;
        dialog.modal().on('hidden.bs.modal', function () {
        	//self.bootstrapTable('selectPage', 1);
        	//关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
        	ko.cleanNode(document.getElementById("formEdit"));
        	dialog.remove();
        });
    }
    

}

//添加ko自定义绑定
ko.bindingHandlers.bootstrapTable = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var oViewModel = valueAccessor();
        oViewModel.params.thisObj=$(element);
        oViewModel.params.queryObj=$(element).prevAll('div[role="dialog"]');
        $(element).bootstrapTable(oViewModel.params);
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

    }
};

(function ($) {
    ko.bindingEditViewModel = function (data, validatorFields) {
        var that = {};
        that.editModel = ko.mapping.fromJS(data); // 将model进行ko绑定

        that.default = {
            message: '验证不通过',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: { }
        };
        
        that.params = $.extend({}, that.default, {fields: validatorFields} || {});
        $('#formEdit').bootstrapValidator(that.params).on('success.form.bv', function(e) {
        	e.preventDefault();							   	//很重要没有它则会提交默认表单，不会做下面的ajax表单提交
        	var arrselectedData = ko.toJS(that.editModel); 	//将绑定的model数据还原成json对象
        	var url=$('#formEdit').attr('action');
        	$.post(url,arrselectedData,function(data){
            	if(!data.success){
            		bootbox.alert(data.msg);
            	}
            	$("#myModal").modal("hide");
            });
        });
        ko.applyBindings(that, document.getElementById("formEdit")); //将that对象进行ko绑定,前台可以用that下的editModel.XXX对页面数据进行同步了
    };

})(jQuery);
