;(function($){

	/** 
	 *	renderDom    渲染页面结构元素
	 *	getGroup     获取点击的元素的一组数据
	 *	initPopup	 初始化一开始的弹窗元素
	 *  	-------showMaskAndPopup    显示模态层次和弹窗，包括宽度、高度及定位
	 *  loadPicSize  载入图片，调整尺寸
	 *  	-------preLoadImg		   判断是否图片加载完毕
	 *   	-------changePic		   调整弹窗及图片等元素尺寸
	 */

	var LightBox = function(settings){
		var self = this;

		this.settings = {
			speed:500
		};

		$.extend(this.settings,settings || {});

		//创建遮罩和弹出框
		this.popupMask = $("<div id='G-lightbox-mask'></div>");
		this.popupWin = $('<div id="G-lightbox-popup"></div>');

		//保存body
		this.bodyNode = $(document.body);

		//渲染剩下的dom，插入到body下
		this.renderDom();


		//图片预览区域
		this.picViewArea = this.popupWin.find("div.lightbox-pic-view");  
		//图片
		this.popupPic = this.popupWin.find("img.lightbox-image"); 
		//图片描述区域
		this.popCaptionArea = this.popupWin.find("div.light-pic-caption");
		this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
		this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");

		this.captionText = this.popupWin.find("p.lightbox-pic-desc");
		this.currentIndex = this.popupWin.find("span.lightbox-of-index");
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn");


		//事件委托，获取组数据
		this.groupName = null;
		this.groupData = [];  //放置同一组数据
		this.bodyNode.delegate('.js-lightbox,*[data-role=lightbox]', 'click', function(e) {
			e.stopPropagation();
			var currentGroupName = $(this).attr("data-group");
			//判断是否一组图片
			if(currentGroupName != self.groupName){
				self.groupName = currentGroupName;
				//根据当前组名获取同一组数据
				self.getGroup();
			}

			//初始化弹出
			self.initPopup($(this));

		});

		//关闭弹出
		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;
		});
		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;
		});

		//避免多次快速点击
		this.flag = true;

		this.nextBtn.hover(function(){
			if(!$(this).hasClass('disabled') && self.groupData.length > 1){
				$(this).addClass('lightbox-next-btn-show');
			}
		},function(){
			if(!$(this).hasClass('disabled') && self.groupData.length > 1){
				$(this).removeClass('lightbox-next-btn-show');
			}
		}).click(function(e){
			e.stopPropagation();
			if(!$(this).hasClass('disabled') && self.flag){
				self.flag = false;
				self.goto("next");
			}
		})

		this.prevBtn.hover(function(){
			if(!$(this).hasClass('disabled') && self.groupData.length > 1){
				$(this).addClass('lightbox-prev-btn-show');
			}
		},function(){
			if(!$(this).hasClass('disabled') && self.groupData.length > 1){
				$(this).removeClass('lightbox-prev-btn-show');
			}
		}).click(function(e){
			e.stopPropagation();
			if(!$(this).hasClass('disabled') && self.flag){
				self.flag = false;
				self.goto("prev");
			}
		});


		//绑定窗口调整事件
		var timer = null;
		//判断图片是否弹出了，解决一直检测window.resize事件问题
		self.clear = false;
		$(window).resize(function(){
			if(self.clear){
				window.clearTimeout(timer);
				timer = window.setTimeout(function(){
					self.loadPicSize(self.groupData[self.index].src);
				},500);
			}
		}).keyup(function(e) {
			/* Act on the event */
			var keyValue = e.which;
			if(keyValue == 38 || keyValue == 37){
				self.prevBtn.click();
			}else if(keyValue == 39 || keyValue == 40){
				self.nextBtn.click();
			}
		});
	};

	LightBox.prototype = {
		goto:function(dir){
			if(dir === "next"){
				this.index++;
				if(this.index >= this.groupData.length-1){
					this.nextBtn.addClass("disabled").removeClass('lightbox-next-btn-show');
				}
				if(this.index != 0){
					this.prevBtn.removeClass("disabled");
				}
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);

			}else if(dir === "prev"){
				this.index--;
				if(this.index <= 0){
					this.prevBtn.addClass("disabled").removeClass('lightbox-prev-btn-show');
				}

				if(this.index != this.groupData.length-1){
					this.nextBtn.removeClass("disabled");
				}

				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		loadPicSize:function(sourceSrc){
			var self = this;

			self.popupPic.css({width:'auto',height:'auto'}).hide();
			self.popCaptionArea.hide();

			//监控图片是否加载完成
			this.preLoadImg(sourceSrc,function(){
				self.popupPic.attr("src",sourceSrc);

				var picWidth = self.popupPic.width(),
					picHeight = self.popupPic.height();
				self.changePic(picWidth,picHeight);
			});
		},
		changePic:function(width,height){
			var self = this,
				winWidth = $(window).width(),
				winHeight = $(window).height();

			//如果图片的宽高大于浏览器视口的宽高比例，就看下是否溢出
			//只要图片宽度小于窗口宽度，就保持原宽度
			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

			width = width * scale;
			height = height * scale;

			this.picViewArea.animate({
				width : width-10,
				height : height-10
			},self.settings.speed);
			this.popupWin.animate({
				width : width,
				height : height,
				marginLeft : -(width/2),
				top : (winHeight - height)/2
			},self.settings.speed,function(){
				self.popupPic.css({
					width: width-10,
					height:height-10
				}).fadeIn();
				self.popCaptionArea.fadeIn();
				self.flag = true;
				self.clear = true;
			});

			//设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text("当前索引:" + (this.index + 1) + " of " + this.groupData.length);
		},
		preLoadImg:function(src,callback){
			var img = new Image();
			if(!!window.ActiveXObject){
				//兼容IE
				img.onreadystatechange = function(){
					if(this.readyState == "complete"){
						callback();
					}
				}
			}else{
				img.onload = function(){
					callback();
				}
			};
			img.src = src;
		},
		showMaskAndPopup:function(sourceSrc,currentId){
			var self = this;

			this.popupPic.hide();
			this.popCaptionArea.hide();

			this.popupMask.fadeIn();

			var winWidth = $(window).width(),
				winHeight = $(window).height();

			//刚刚载入的picView的宽度和高度,是窗口的一半
			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});

			this.popupWin.fadeIn();

			//当前popwin的高度(有5像素的边框)  也就是初始化的窗口的高度和宽度
			var viewHeight = winHeight/2+10,
			 	viewwidth = winWidth/2+10;
			
			this.popupWin.css({
				width:viewwidth,  //加上边框的宽度	
				height:viewHeight,
				marginLeft:-(viewwidth)/2,
				top:-viewHeight  //相当于将窗口隐藏进去
			}).animate({
				//做一个向下的运动
				top : (winHeight - viewHeight)/2 //相当于top:50%   margin-top:-viewHeight/2
				//加载图片
			},self.settings.speed,function(){
				self.loadPicSize(sourceSrc);
			});

			//根据当前点击的元素currentId，获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);

			var groupDataLength = this.groupData.length;
			if(groupDataLength > 1){
				if(this.index === 0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index === groupDataLength -1){
					this.nextBtn.addClass("disabled");
					this.prevBtn.removeClass("disabled");
				}else{
					this.prevBtn.removeClass("disabled");
					this.nextBtn.removeClass("disabled");
				}
			}

		},
		getIndexOf:function(currentId){
			var index = 0;

			$(this.groupData).each(function(i){
				index = i;
				if(this.id === currentId){
					return false;
				}
			})

			return index;
		},
		initPopup:function(currentObj){
			var self = this,
				sourceSrc = currentObj.attr("data-source"),
				sourceId = currentObj.attr("data-id");
			this.showMaskAndPopup(sourceSrc,sourceId);
		},
		getGroup:function(){
			var self = this;
			//清空数据
			self.groupData.length = 0;
			//根据当前组别名称获取页面中所有相同组名的对象
			var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
			groupList.each(function(){
				self.groupData.push({
					src : $(this).attr("data-source"),
					id : $(this).attr("data-id"),
					caption : $(this).attr("data-caption")
				});
			})
		},
		//渲染页面元素结构
		renderDom:function(){
			var strDom = '<div class="lightbox-pic-view">'+
							'<span class="lightbox-btn lightbox-prev-btn"></span>'+
							'<img class="lightbox-image" alt="">'+
							'<span class="lightbox-btn lightbox-next-btn"></span>'+	
						'</div>'+
						'<div class="light-pic-caption">'+
							'<div class="lightbox-caption-area">'+
								'<p class="lightbox-pic-desc"></p>'+
								'<span class="lightbox-of-index">当前索引: 0 of 0</span>'+
							'</div>'+
							'<span class="lightbox-close-btn"></span>'+
						'</div>';
			this.popupWin.html(strDom);
			this.bodyNode.append(this.popupMask,this.popupWin);
		}
	};

	window["LightBox"] = LightBox;
})(jQuery);