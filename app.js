App = {};
(function(){

	App.Servers = [];

	App.addServer = function(name){
		name = name || '';
		var html = "<div class='server-box'><span class='badge pull-right' onclick='App.destroyThisServer(this)'>X</span></div>";
	    $("#servers").append(html);
	    App.Servers.push([]);
	    App.updateTime();
	};

	App.destroyServer = function(){
    	var server = App.Servers.pop();
		if (!server){
    		$('#myModal').modal('show');
	    	return;
	    }
    	$("#servers .server-box").last().remove();
	    for (var a=0;a<server.length;a++){
	    	App.simulateDelay(server[a].name);
	    }
	    App.updateTime();
	}

	App.addContainer = function(name){
		var servers = App.findAvailableServer();
		if (!servers.length > 0){
			return;
		}
		var time = new Date().getTime();
		var html = "<div class='container "+name+"'>"+name+"<div class='time' data-time='"+time+"'></div></div>";
		var server = servers.pop();
		$("#servers .server-box:nth-child(" + (server+1) +")").append(html);
		App.Servers[server].push({name:name,time:time});
		App.updateTime();
	}

	App.removeContainer = function(name){
		var arr=[];
		var newest=0;
		for (var a=0; a< App.Servers.length; a++){
			for (var b=0; b<App.Servers[a].length; b++){
				if (App.Servers[a][b].name === name){
					if (newest===0 || newest<App.Servers[a][b].time){
						newest = App.Servers[a][b].time;
						arr.push([a,b]);
					}
				}
			}
		}
		if (!arr.length>0){
			return;
		}
		var server = arr.pop();
		App.Servers[server[0]].splice(server[1],1);
		$("#servers .time[data-time='"+newest+"']").parent().remove();
		App.updateTime();
	}

	App.findAvailableServer = function(){
		var servers =[];
		var emptyServer = false;
		for (var a=0; a< App.Servers.length; a++){
			if (App.Servers[a].length === 0 ){
				servers.push(a);
				emptyServer = true;
				break;
			}
			if (App.Servers[a].length < 2){
				servers.push(a);
			}
		}
		if (!servers.length > 0){
			$('#myModal').modal('show');
			return [];
		}
		if (!emptyServer){
			servers.reverse();
		}
		return servers;
	}

	App.simulateDelay = function(name){
		var time = (Math.random()+0.7) *1000
		setTimeout(function(){
			App.addContainer(name);
		},time);
	}

	App.updateTime = function(){
		var time = new Date().getTime();
		var timeArr = $(".time");
		for( var a=0; a< timeArr.length; a++){
			var el = $(".time:eq("+a+")");
			var timeText = App.calculateTime(time, el.data("time"));
			el.text(timeText);
		}
	}

	App.calculateTime = function(currentTime, previousTime){
		var currentTime = new Date().getTime();
		var diff = Math.round((currentTime - previousTime)/1000);
	    var hours   = Math.floor(diff / 3600);
	    var minutes = Math.floor((diff - (hours * 3600)) / 60);
	    var seconds = diff - (hours * 3600) - (minutes * 60);
	    var timeStr = "0 sec";

	    if (seconds > 0){
	    	timeStr = seconds+" sec";
	    }
	    if (minutes > 0){
	    	timeStr = minutes+" min";
	    }
	    if (hours > 0){
	    	timeStr = hours+" h";
	    }

		return "Added "+timeStr+" ago";
	}

	App.destroyThisServer = function(e){
		var servers = $("#servers .server-box");
		var server = $(e).parent()[0];
		var containers;
		for (var a=0; a< servers.length; a++){
			if (servers[a] === server) {
				containers = App.Servers.splice(a,1);
			}
		}
		$(e).parent().remove();
		for (var a=0;a<containers[0].length;a++){
	    	App.simulateDelay(containers[0][a].name);
	    }
	    App.updateTime();
	}
	
	App.addServer();
	App.addServer();
	App.addServer();
	App.addServer();

	setInterval(App.updateTime,10000);

})();
