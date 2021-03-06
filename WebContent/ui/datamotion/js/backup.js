var testData=[
        {	"key_":"0321",
			"pathsrc":"c://path",
			"namesrc":"backupfilename1",
			"pathdest":"c://path//test",
			"timedo":"2016-11-02 11:10:20",
			"filesize":100,
			"station":"TS",
			"aircraft":"TG-1",
			"sensor":"ZW",
			"datatype":"dat",
			"datalevel":"L0",
			"camera":"SCI",
			"timerecive":"2015-12-12 08:20:59",
			"timecollectstart":"2015-12-12 08:20:59",
			"timecollectend":"2015-12-12 09:20:59",
			"suffix":"dat",
			"status":0,
			"timeadd":"2015-12-12 08:20:59",
			"labelids":""
        },
        {	"key_":"0322",
			"pathsrc":"c://path",
			"namesrc":"backupfilename2",
			"pathdest":"c://path//test",
			"timedo":"2016-11-03 11:10:20",
			"filesize":100,
			"station":"TS",
			"aircraft":"TG-2",
			"sensor":"ZW",
			"datatype":"dat",
			"datalevel":"L1",
			"camera":"SCI",
			"timerecive":"2015-12-13 08:20:59",
			"timecollectstart":"2015-12-13 08:20:59",
			"timecollectend":"2015-12-13 09:20:59",
			"suffix":"dat",
			"status":1,
			"timeadd":"2015-12-13 08:20:59",
			"labelids":""
        }
		
];

//var dataSet1 = [
//	               [0,"c://path","name","c://path","2015-12-12 08:20:59",100,"TS","TG-2","ZW","dat","L1","SCI","2015-12-12 08:20:59","2015-12-12 08:20:59","2015-12-12 08:20:59",1,"2015-12-12 08:20:59",""],
//	               [1,"c://path","name","c://path","2015-12-12 08:20:59",100,"TS","TG-2","ZW","dat","L1","SCI","2015-12-12 08:20:59","2015-12-12 08:20:59","2015-12-12 08:20:59",1,"2015-12-12 08:20:59",""]
//	               
//	               ];
//	var table = $('#myTable').DataTable();
//	table.clear().draw();
//	table.rows.add(dataSet1).draw();
	
$('#doQuery_btn_backup')
.click(
		function() {
			//alert("oooo");
			//console.log("search click");
			if(!getCheckedTreeNodes()){
				
				return false;
			}
			// 获取查询参数
			var datasrch = {
				treecheckeds : {},
				timebegcollect : '',
				timeendcollect : '',
				timebegreceive : '',
				timeendreceive : '',
				timebegdb : '',
				timeenddb : '',
				status : 0
			};

			datasrch.timebegcollect = $('#dateinfo_collectStartTime')
					.val();
			datasrch.timeendcollect = $('#dateinfo_collectEndTime')
					.val();
			datasrch.timebegreceive = $('#dateinfo_receiveTimeBeg')
					.val();
			datasrch.timeendreceive = $('#dateinfo_receiveTimeEnd')
					.val();

			datasrch.timebegdb = $('#dateinfo_DBstartTime').val();
			datasrch.timeenddb = $('#dateinfo_DBEndTime').val();
			datasrch.status = $('#status').val();
			datasrch.treecheckeds = dataRoot;
			// console.log(datasrch);
			// 发送查询请求
			$
					.ajax({
						type : "post",
						url : encodeURI(encodeURI(cxt
								+ "/jf/datamotion/t7_backupfile/doQuery")),
						data : {
							v : JSON.stringify(datasrch)
						},
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						crossDomain : false,
						// 是否使用异步发送
						async : false,
						cache : false,
						success : function(response) {
							//console.log(response);
							
							var returnData = response.data;
							
							var table = $('#myTable').DataTable();
							table.clear().draw();
							table.rows.add(returnData).draw();
							
//							 if (response.length >= 3) {
//								 for ( var ind in response) {
//									 g_BackData = response[ind];
//									 g_StepData[g_BackData.number] =
//										 g_BackData;
//									 parseJsonData(firstLoadHtml);
//								 }
//							 }
							 //遍历 json 更新 dataTable

						}
					});
		});
/*
$('#doQuery_btn_backup')
.click(
		function() {
			console.log("search click");
			// 获取查询参数
			var datasrch = {
				info : {},
				timereceive:'',
				timebegcollect : '',
				timeendcollect : '',
				timebegdb : '',
				timeenddb : '',
				status : 0
			};
			getCheckedTreeNodesArr();
			datasrch.timereceive = $('#dateinfo_receiveTime_backup')
			.val();
			datasrch.timebegcollect = $('#dateinfo_collectStartTime_backup')
					.val();
			datasrch.timeendcollect = $('#dateinfo_collectEndTime_backup')
					.val();
			datasrch.timebegdb = $('#dateinfo_backupStartTime').val();
			datasrch.timeenddb = $('#dateinfo_backupEndTime').val();
			datasrch.status = $('#backupstatus').val();
			datasrch.info = dataCheckedTreeNodes;
			console.log(datasrch);
			// 发送查询请求
			$.ajax({
						type : "post",
						url : encodeURI(encodeURI(cxt
								+ "/jf/datamotion/t7_backupfile/doQuery")),
						data : datasrch,
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						crossDomain : false,
						// 是否使用异步发送
						async : false,
						cache : false,
						success : function(response) {
							// if (response.length > 1 && response !=
							// '1') {
							// for ( var ind in response) {
							// g_BackData = response[ind];
							// g_StepData[g_BackData.number] =
							// g_BackData;
							// parseJsonData(firstLoadHtml);
							// }
							// }
							//遍历 json 更新 dataTable
							
						}
					});
		});
*/
//全部本地下载
$('#doAllLocalDownload_btn')
.click(
		function() {
			
			var table = $('#myTable').DataTable();
			var tableData = table.rows().data();
			var keys = [];
			for(var i = 0;i < tableData.length;i++)
			{
				keys.push(tableData[i][0]);//数据表里的所有id；
			}
			console.log(keys);
			// 获取查询参数
			var datadownload = {
				// key_ list
				keys : keys
			};
			// 发送查询请求
			$.ajax({
						type : "post",
						url : encodeURI(encodeURI(cxt
								+ "/jf/datamotion/t7_backupfile/doAllLocalDownload")),
						data : {
							keys : JSON.stringify(datadownload)
						},
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						crossDomain : false,
						// 是否使用异步发送
						async : false,
						cache : false,
						success : function(response) {
							if(response=="1")//成功
							{
								alert("全部本地下载成功");
							}
						}
					});
		});

//全部重新备份
$('#doAllNewBackup_btn')
.click(
		function() {
			// 获取查询参数
			var table = $('#myTable').DataTable();
			var tableData = table.rows().data();
			var keys = [];
			for(var i = 0;i < tableData.length;i++)
			{
				keys.push(tableData[i][0]);//数据表里的所有id；
			}
			console.log(keys);
			// 获取查询参数
			var databackup = {
				// key_ list
				keys : keys
			};
			// 发送查询请求
			$.ajax({
						type : "post",
						url : encodeURI(encodeURI(cxt
								+ "/jf/datamotion/t7_backupfile/doAllNewBackup")),
						data : {
							keys : JSON.stringify(databackup)
						},
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						crossDomain : false,
						// 是否使用异步发送
						async : false,
						cache : false,
						success : function(response) {
							if(response=="1")//成功
							{
								alert("全部重新备份成功");
							}
						}
					});
		});
function doLocalDownload(id)
{
	$.ajax({
		type : "post",
		url : encodeURI(encodeURI(cxt
				+ "/jf/datamotion/t7_backupfile/doLocalDownload")),
		data : {id:id},
		dataType : 'json',
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		crossDomain : false,
		// 是否使用异步发送
		async : false,
		cache : false,
		success : function(response) {
//			if(response=="1")//成功
//			{
//				alert("本地下载成功");
//			}
//			if(response=="－1")//成功
//			{
//				alert("本地下载失败");
//			}
			
		}
	});
}
function doNewBackup(index,data)
{
	var id = data[0];
	$.ajax({
		type : "post",
		url : encodeURI(encodeURI(cxt
				+ "/jf/datamotion/t7_backupfile/doNewBackup")),
		data : {id:id},
		dataType : 'json',
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		crossDomain : false,
		// 是否使用异步发送
		async : false,
		cache : false,
		success : function(response) {
			//alert(response);
			if(response=="1")//成功
			{
				var table = $('#myTable').DataTable();
				data[15]="1";
				//console.log(data);
				table.row(index).remove().draw( false );
//				table.clear().draw();
				table.row.add(data).draw(false);
				
				alert("重新备份成功");
			}
			if(response=="-1")//成功
			{
				alert("重新备份失败");
			}
			
			
		}
	});
}
function doDeleteSeleted(index,data)//选中的记录删除（修改status_＝3）
{
	var id = data[0];
	// 发送查询请求
	$.ajax({
				type : "post",
				url : encodeURI(encodeURI(cxt
						+ "/jf/datamotion/t7_backupfile/doDeleteSeleted")),
				data : {id:id},
				dataType : 'json',
				contentType : "application/x-www-form-urlencoded; charset=UTF-8",
				crossDomain : false,
				// 是否使用异步发送
				async : false,
				cache : false,
				success : function(response) {
					var returnData = response;
					
					var table = $('#myTable').DataTable();
					//console.log(table.rows().data()[0]);
					//var tableData = table.rows().data();
					
					if(returnData=="1")//删除成功
					{
						data[15]="3";
						//console.log(data);
						table.row(index).remove().draw( false );
//						table.clear().draw();
						table.row.add(data).draw(false);
						alert("删除成功");
					}
					if(returnData=="-1")
					{
						alert("删除失败");
					}
					
				}
			});
}