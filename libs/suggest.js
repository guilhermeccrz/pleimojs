(function($){
var pleimo = window.pleimo || {};

pleimo.Suggest = {
	MINCHARS: 1, // CHANGED TO MIN 2 CHARS TYPED
	params: {},
	action: "/search",
	close: function (skip){
		clearTimeout(this.timer);
		clearTimeout(pleimo.Suggest.rollTimer);
		if(skip){
			pleimo.Suggest.hide();
		}else{
			this.rollTimer=setTimeout(
				function(){
					pleimo.Suggest.hide();
				},500);
		}
	},
	container: null,
	field: null,
	hide: function (){
		pleimo.Suggest.setSelected();
		if(pleimo.Suggest.container.hasClass("show")){
			pleimo.Suggest.container.removeClass("show");
		}
		pleimo.Suggest.visible=false;
	},
    clear: function() {
        $(this.container).find('ul')
            .html('<li class="loading"></li>');
    },
	init: function (field, container){
		this.field=$(field);
		$(field).attr("autocomplete","off");
		var form=$(field).parents("form");
		this.action=(form.attr("action"));
		this.initContainer(container);

		$(field).keyup(function(e){
			if(e.keyCode==13){
				if((pleimo.Suggest.visible)&&
					((pleimo.Suggest.selected!=null)&&
					 ($(pleimo.Suggest.selected).get(0)!=undefined))
					){
					var sel=$(pleimo.Suggest.selected);
					
					pleimo.Suggest.setValue($(sel).find('img').attr('src'), $(sel).find('h5').text(), $(sel).find('p').text(), $('#id_artist').val());
					pleimo.Suggest.close();
				}else{
					var form=$(pleimo.Suggest.field).parent();
					var val=$(pleimo.Suggest.field).val();
				}
			}else{
				if((e.keyCode==38)||(e.keyCode==40)){
					pleimo.Suggest.navigation(e.keyCode);
				}else{
					if((e.keyCode==37)||(e.keyCode==39)){
						pleimo.Suggest.setSelected();
					}else{
						if(e.keyCode==27){
							pleimo.Suggest.close(true);
						}else{
							var val=$(pleimo.Suggest.field).val();

							if(val&&(val.length>pleimo.Suggest.MINCHARS)){
								if(val!=pleimo.Suggest.last){
									pleimo.Suggest.update();
								}
								pleimo.Suggest.show();
								
								if(this.timer){
									clearTimeout(this.timer);
								}

								this.timer=setTimeout(function(){
									var val=$(pleimo.Suggest.field).val();
									
									if(val&&(val.length>pleimo.Suggest.MINCHARS)){
										if(val!=pleimo.Suggest.last){
											pleimo.Suggest.process();
										}
									}
								},200);

							}else{
								pleimo.Suggest.close();
							}
						}
					}
				}
			}
		});
							
		$(field).blur(function(){
			pleimo.Suggest.close();
		});
							
		$(field).click(function(){
			var val=$(pleimo.Suggest.field).val();
			if(val&&(val.length>pleimo.Suggest.MINCHARS)){
				if(pleimo.Suggest.last!=val){
					pleimo.Suggest.update();
					pleimo.Suggest.process();
				}else{
					pleimo.Suggest.show();
				}
			}else{
				pleimo.Suggest.close();
			}
		});
	},
	initContainer: function (container){
		if(container){
			this.container=$(container);
		}else{
			$(this.field).parent().append("<div id='suggest'></div>");
			this.container=$("#suggest");
		}
		$(this.container).append("<ul></ul>");
		
		var form=$(this.field).parents("form");

		this.update();
	},
	insert: function (tagcode){
		this.update();
		html=tagcode||"";
		$(this.container).find("ul").eq(0).prepend(html);
		
		this.updateEvent();
	},
	last: null,
	navigation: function (keyCode){
		if(this.visible){
			var first=$(this.container).find("li").eq(0);
			var navTo=(keyCode==38)?-1:1;
			var lis=$(this.container).find("li");
			if(lis.length){
				if(this.selected&&$(this.selected)){
					var sel=pleimo.Suggest.selected;
					if(navTo==-1){
						var prev=$(sel).prev();
						
						if((prev.get(0))&&(prev.get(0).tagName=="LI")){
							this.setSelected(prev);
						}else{
							var last=lis.length-1;
							var selectLast=lis.eq(last);
							this.setSelected(selectLast);
						}
					}else{
						var next=$(sel).next();
			
						if(next.get(0)&&(next.get(0).tagName=="LI")){
							this.setSelected(next);
						}else{
							this.setSelected(first);
						}
					}
				}else{
					if(navTo==-1){
						var last=lis.length-1;
						var selectLast=lis.eq(last);
						this.setSelected(selectLast);
					}else{
						this.setSelected(first);
					}
				}
			}
		}
	},
	process: function (){
		var val=$(pleimo.Suggest.field).val();
        var namequery = String(val.toLowerCase());
		pleimo.Suggest.queries[namequery] = new pleimo.Suggest.ArtistSearch(namequery);
		var query=pleimo.Suggest.queries[namequery];
		query.settings=new pleimo.Suggest.Searcher.Settings($(this.container));
        pleimo.Suggest.clear();

		$(query).bind("searcher_loaded",function(event,tagpage) {
            if (this.data.count > 0) {
			    var palavra=$(pleimo.Suggest.field).val();
                if(this.params["q"]==palavra){
                    var html=this.parser();
                    if(html.length>1){
                        $(pleimo.Suggest.container).find('ul').empty();
                        pleimo.Suggest.insert(html);
                    }
                    pleimo.Suggest.show();
                    pleimo.Suggest.last=palavra;
                }
            } else {
                var emptyResult = '<li class="empty"><h5>'+ $('#not-found').text() + '</h5></li>';
                $(pleimo.Suggest.container).find('ul').empty();
                pleimo.Suggest.insert(emptyResult);
                pleimo.Suggest.show();
                pleimo.Suggest.last=palavra;
            }
		});
		query.params["q"]=val;
		query.process();
	},
	queries: {},
	radioQueries: {},
	rollTimer: null,
	selected: null,
	setSelected: function (selection){
		pleimo.Suggest.show();
		if(selection){
			if(!$(selection).hasClass("selected")){
				if(this.selected){
					$(this.selected).removeClass("selected");
				}
				$(selection).addClass("selected");
				this.selected=$(selection);
			}
		}else{
			if(this.selected){
				$(this.selected).removeClass("selected");
			}
			this.selected=null;
		}
	},
	show: function (){clearTimeout(this.rollTimer);
		if(!$(this.container).hasClass("show")){
			$(this.container).addClass("show");
		}
		this.visible=true;
	},
	timer: null,
	update: function (){
		var val=$(this.field).val();
		if(val&&(val.length>pleimo.Suggest.MINCHARS)){
			val=val.replace(/^\s+|\s+$/g,"");
			val=val.replace(/</g,"&lt;");
			val=val.replace(/>/g,"&gt;");
		
			this.updateEvent();
		}
	},
	updateEvent: function (){
		$(this.container).find("li").each(function(){
			$(this).mouseover(function(){
				pleimo.Suggest.setSelected($(this));
			});
			
			$(this).mouseout(function(){
				pleimo.Suggest.close();
			});

			$(this).click(function(){
                pleimo.Suggest.close();
				pleimo.Suggest.setValue($(this).find('img').attr('src'), $(this).find('h5').text(), $(this).find('p').text(), $('#id_artist').val());
			});
		});
	},
	setValue: function(img, name, detail, id) {
		var html = '<h3>' + $('#artist-title').text() + '</h3>\
					<div class="result"><img src="'+ img +'" alt="'+ name +'">\
					<h4>'+ name +'</h4>\
					<p>'+ detail +'</p><a href="javascript:void(0);" class="btn-cancel"><i class="close">X</i></a></div>\
					<input type="hidden" id="selectedArtist" value="'+id+'" />';
		$('#artist-result').html(html);
        $('#artist-result').addClass('open');
		$('.inner .col-right>p').hide();

		$('#artist-result a.btn-cancel').off('click').on('click', function(e) {
			e.preventDefault();
			$('.inner .col-right>p').show();
			$('#artist-result').empty();
            $('#artist-result').removeClass('open');
		});
	},
	visible: false
};

pleimo.Suggest.Searcher = function (){
	this.searchUrl = "";
	this.data = {};
	this.parser = function(){
		return"";
	};
	this.parseParams = function(params) { };
	this.validParams=[];
	this.showParams=[];
	this.params={};
	this.callback=function(data){};
	this.loaded=false,
	this.html="",
	this.className="Searcher";
	this.settings=new pleimo.Suggest.Searcher.Settings();
	this.getNewId=function(){
		var id=this.settings.element;
		id=(id)?id.toLowerCase().replace(/[^a-z]/gi,""):"";
		id=this.className+"_"+id;
		return id;
	};
	this.id="";
	this.init=function(settings){
		this.settings=settings;
		this.id=this.getNewId();

		if(this.request){
			this.request.abort();
			this.request=null;
		}
	};
	this.reset=function(){
		$.extend(this.params, pleimo.Suggest.params);
		if(this.settings.params&&this.settings.params.length>0){
			this.params=pleimo.Suggest.Util.parseToObj(this.settings.params,this.params);
		}
	};
	this.update=function(){
		$.extend(this.params,pleimo.Suggest.params);
	};
	this.request=null;
	this.dataType="jsonp";
	this.process=function(){
		this.loaded=false;
		var searchparams=this.parseParams(this.params);
		var url=this.searchUrl+searchparams;

		if(typeof(this.settings.onProcessCallback)==typeof(function(){})){
			this.settings.onProcessCallback(this);
		}
		var callbackName=this.params["callbackName"];
		var callback=this.params["callback"];
		var contentType=this.params["contentType"]?this.params["contentType"]:"application/json; charset=utf-8";
		var onErrorCallback=this.settings.onErrorCallback;

		if(this.dataType=="jsonp"){
			if(contentType.indexOf("utf-8")==-1){
				this.request = jQuery.ajax({
					url: decodeURIComponent(url),
					dataType: "jsonp",
					cache: true,
					contentType: contentType,
					beforeSend: function(xhr){
						xhr.overrideMimeType("text/plain; charset=utf-8");
					},
					processData: false,
					jsonp: callbackName,
					jsonpCallback: callback,
					error:function(jqXHR,textStatus,errorThrown) {
						onErrorCallback.call(jqXHR,textStatus,errorThrown);
					}
				});
			}else{
				this.request = jQuery.ajax({
					url:url,
					dataType:"jsonp",
					cache:true,
					contentType:contentType,
					processData:false,
					jsonp:callbackName,
					jsonpCallback:callback,
					error:function(jqXHR,textStatus,errorThrown){
						onErrorCallback.call(jqXHR,textStatus,errorThrown);
					}
				});
			}
		}else{
			this.request=jQuery.ajax({
				url:url,
				context:document.body,
				dataType:"html",
				error:function(jqXHR,textStatus,errorThrown){
					onErrorCallback.call(jqXHR,textStatus,errorThrown);
				},
				success:function(data){
					var str=callback+"(data)";
					eval(str);
				}
			});
		}
	};

	this.checkLoaded=null;
	this.ajaxResponse=function(response){
		this.loaded=true;
		if(this.dataType=="html"){
			this.data=response;
			this.html=response;
		}else{
			response=eval(response);
			this.data=response;
			this.html=this.parser();
		}

		jQuery(this).trigger("searcher_loaded",[this]);

		if(this.settings.onCompleteCallback){
			this.checkLoaded=setInterval(
				(function(html,callback,checkLoaded){
					return function(){
						if(html&&html.length>0){
							clearInterval(checkLoaded);callback();
						}
					};
				})(this.html,this.settings.onCompleteCallback,this.checkLoaded)
			,500);
		}
	};

	this.show=function(){
		var container=jQuery(this.settings.container);
		container=(container.length>0)?container[0]:container;

		container.innerHTML=this.html;

		if(this.settings.containersAds&&this.settings.containersAds.length>0){
			if(this.ads&&this.ads.length>0){
				for(var i in this.settings.containersAds){
					if(this.ads[i]&&this.ads[i].length>0){
						var containerAds=jQuery(this.settings.containersAds[i]);
						containerAds=(containerAds.length>0)?containerAds[0]:containerAds;
						containerAds.innerHTML=this.ads[i];
					}
				}
			}
		}
	};
};

pleimo.Suggest.Searcher.Settings = function (elemName,params,paginacao,vejamais){
	this.element=elemName;
	this.container=jQuery(elemName);
	this.params=(params)?params:null;
	this.paginacao=(paginacao!=null)?paginacao:true;
	this.onProcessCallback=function(obj){};
	this.onErrorCallback=function(jqXHR,textStatus,errorThrown){};
	this.onCompleteCallback=function(obj){};
} 

pleimo.Suggest.ArtistSearch = function (name){ 
	this.name=name;
	this.searchUrl=window.base_url+'support/search';
	this.params={
		callback:"pleimo.Suggest.queries."+name+".callback",
		size:"5"
	};
	this.validParams = ['q'];

	this.callback=function(data){
		this.ajaxResponse(data);
	};
	this.parser=function(){
		var response = this.data;
		var result = "";
		var artists = response["artists"]||[];
		var len = artists.length;
        if(artists && len>0){
			for(var i=0; i<len; i++){
				var item=artists[i];
				var name=item["name"];
				var image=item["image"];
				var country=item["country"];
				var style=item["style"];
                var id_artist=item['id'];

				var obj={name:name,image:image,country:country,style:style,id_artist:id_artist};
				result+=this.parseToHTML(obj);
			}
		}
		return result;
	};
	this.parseParams=function(params){
		var paramTemp=pleimo.Suggest.Util.copyValidParams(params,this.validParams);
		return pleimo.Suggest.Util.parseToURLSearch(paramTemp);
	};
	this.parseQuery=function(string){
		string=string||"";
		string=string.replace(/^\s+|\s+$/g,"");
		if(string.indexOf(" ")>-1){
			string=string.replace(/ /g," AND ");
		}
		return string;
	};

	this.image=null;

	this.parseToHTML=function(obj){
        var html = '';
		html += '<li>\
			<img src="'+ obj.image +'" alt="'+ obj.name +'" />\
			<h5>'+ obj.name +'</h5>';
        html += '<p>';
        html += (obj.country && (obj.country != '')) ? obj.style + ' | ' + obj.country : obj.style;
        html += '</p>';
		html +=	'<input type="hidden" id="id_artist" value="'+obj.id_artist+'" />\
		</li>';

		return html;
	};
} 
pleimo.Suggest.ArtistSearch.prototype = new pleimo.Suggest.Searcher;

pleimo.Suggest.Util = {
	copyValidParams: function (params,validParams){
		var obj={};
		for(var i=0;i<validParams.length;i++){
			obj[validParams[i]]=params[validParams[i]];
		}
		return obj;
	},
	parseToURLSearch: function (obj){
		var str="?";
		for(var p in obj){
			if(p&&obj[p]){
				str+=p+"="+encodeURIComponent(obj[p])+"&";
			}
		}
		str=(str.lastIndexOf("&")==str.length-1)?str.substring(0,str.length-1):str;
		return str;
	},
	parseToObj: function (string,obj){
		obj=(obj)?obj:{};
		string=$.trim(string);
		string=(string.indexOf("?")==0)?string.substring(1):string;
		string=(string.indexOf("#")==0)?string.substring(1):string;

		if(string.length){
			var arr=[];
			if(string.indexOf("&")!=-1){
				arr=string.split("&");
			}else{
				arr.push(string);
			}
			if(arr.length){
				for(var i=0;i<arr.length;i++){
					var arrk=arr[i].split("=");
					var val="";
					try{
						if(arrk[1]=="null"){
							arrk[1]=null;
						}else{
							val=decodeURIComponent(arrk[1]);
						}
					}catch(e){
						val=arrk[1];
					}
					if(arrk[0].indexOf("tag-id")==-1){
						val=val.replace(/\+/g," ");
					}else{
						val=val.replace(/\s/g,"+AND+");
					}
					obj[arrk[0]]=val;
				}
			}
		}
		return obj;
	}
}

window.pleimo = pleimo; 
})(jQuery);