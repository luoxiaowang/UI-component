require.config({
   paths:{
       jquery:'jquery-1.9.1.min',
       jqueryUI: 'jquery-ui'
   }
});

require(['jquery','window'], function ($,w) {
    $("#a").click(function(){
        var win = new w.Window();
            win.alert({
            content : 'welcome',
            title : '提示11',
            width : 300,
            height :250,
            y:90,
            hasCloseBtn:true,
            skinClassName : 'window_skin_a',
            text4AlertBtn : '取消',
            dragHandler:".window_header",
            //两种监听方式都可以
            handler4AlertBtn:function(){
                alert("you click the alert button");
            },
            handler4CloseBtn:function(){
                alert("you click the close button");
            }
        }).on("alert",function(){alert("the second alert")})
          .on("alert",function(){alert("the third alert")});
        
        win.on("close",function(){alert("the second alert")});
    })

    $('#b').click(function(){
        var win = new w.Window();
        win.confirm({
            title: '系统消息',
            content: '您确定要删除这个文件吗?',
            width: 300,
            height: 150,
            y: 50,
            text4ConfirmBtn: '是',
            text4CancelBtn: '否',
            dragHandle: '.window_header'
        }).on('confirm', function(){
            alert('确定');
        }).on('cancel', function(){
            alert('取消');
        });
    });

    $('#c').click(function(){
        var win = new w.Window();

        win.prompt({
            title: '请输入您的名字',
            content: '我们将会为您保存您输入的的信息',
            width: 300,
            height: 150,
            y: 50,
            text4PromptBtn: '输入',
            text4CancelBtn: '取消',
            defaultValue4PromptInput: '张三',
            dragHandle: '.window_header',
            handler4PromptBtn: function(inputValue){
                alert('您输入的内容是: ' + inputValue);
            },
            handler4CancelBtn: function(){
                alert('取消');
            }
        });
    });

    $('#d').click(function(){
        var win = new w.Window();

        win.common({
            content: '我是一个通用弹窗',
            width: 300,
            height: 150,
            y: 50,
            hasCloseBtn: true
        });
    });

})