/**
 * Created by lenovo on 2015/6/1.
 */
define(['jquery'],function($){

    function Widget(){
        this.boundingBox = null;   //最外层容器
    }

    Widget.prototype = {
        on:function(type,handler){
            if(typeof this.handlers[type] == "undefined"){
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
            return this;
        },
        fire:function(type,data){
            //观察者模式
            if(this.handlers[type] instanceof Array){
                var handlers = this.handlers[type];
                for(var i = 0,len = handlers.length;i<len;i++){
                    handlers[i](data);
                }
            }
        },
        renderUI: function () {},  //添加dom节点
        bindUI:function(){},    //监听事件
        syncUI:function(){},    //初始化组件属性
        render:function(container){  //渲染组件
            this.renderUI();
            this.handlers = {};   //这里给handlers赋值
            this.bindUI();
            this.syncUI();
            $(container || document.body).append(this.boundingBox);
        },
        destructor : function(){},  //销毁前处理函数
        destroy: function () {      //销毁组件
            this.destructor();
            this.boundingBox.off();  //jquery移除一个或多个事件处理函数
            this.boundingBox.remove();
        }
    }

    return {
        Widget : Widget
    }
})