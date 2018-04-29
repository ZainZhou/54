/**
 * Created by Zain on 22/4/2018.
 */
function poster(){}
poster.prototype.init = function(b_src,texts,color,imgs){
  this.width = 750;
  this.height = this.width*1.778;
  this.canvas = document.createElement('canvas');
  this.texts = texts;
  this.imgs = imgs;
  this.color = color;
  this.canvas.setAttribute('width',this.width);
  this.canvas.setAttribute('height',this.height);
  this.back_img = new Image();
  this.back_img.crossOrigin="anonymous";
  this.back_img.src = b_src;
  var _this = this;
  this.back_img.onload = function(){
      _this.draw_back(this);
  };
  $('#canvas_page').append($(this.canvas));
};
poster.prototype.loadImgs = function(){
    var counter = 0;
    for(var i = 0 ; i < this.imgs.length ; i++){
        var img = new Image();
        img.crossOrigin="anonymous";
        var _this = this;
        img.src = _this.imgs[i].src;
        _this.imgs[i].src = img.src;
        img.onload = function(){
            counter++;
            console.log(this);
            for(var i = 0 ; i < _this.imgs.length ; i++){
                if(_this.imgs[i].src == this.src){
                    _this.imgs[i].src = this;
                }
            }
            if(counter == _this.imgs.length){
                console.log("ok");
                _this.drawImg();
            }
        }
    }
};
poster.prototype.drawImg = function(){
    for(var i = 0 ; i < this.imgs.length ; i++){
        var ctx = this.canvas.getContext('2d');
        ctx.save();
        if(this.imgs[i].type == 'avatar'){
            ctx.beginPath();
            ctx.arc(this.imgs[i].x+this.imgs[i].width/2,this.imgs[i].y+this.imgs[i].height/2,this.imgs[i].width/2,0,2*Math.PI,true);
            ctx.clip();
        }
        ctx.drawImage(this.imgs[i].src,this.imgs[i].x,this.imgs[i].y,this.imgs[i].width,this.imgs[i].height);
        ctx.restore();
    }
    this.drawText(this.texts);
};
poster.prototype.drawText = function(){
    var ctx = this.canvas.getContext('2d');
    var _this = this;
    var h = 0;
    ctx.save();
    ctx.beginPath();
    h = this.drawLongText(this.texts.nickname+"的",this.width/2,this.height/16,this.width,"bold 80px Microsoft YaHei",80,this.color,"center");
    h = this.drawLongText("青 春 宣 言 书",this.width/2,h,this.width,"bold 81px Microsoft YaHei",81,this.color,"center");
    h = this.drawLongText(this.texts.keyword,this.width/2,this.height*0.265,this.width,"70px hkh",70,this.color,"center");
    h = this.drawLongText('我的青春与"团团"一起奋斗!',this.width/2,h*1.12,this.width,"45px mw",45,this.color,"center");
    h = this.drawLongText(this.texts.event+"今天是我们相识的:",this.width*0.09,h*1.04,this.width*0.84-15,"32px Microsoft YaHei",32,this.color,"left");
    h = this.drawLongText("第 "+this.texts.days+" 天",this.width/2,h*1.05,this.width,"55px Microsoft YaHei",55,this.color,"center");
    h = this.drawLongText("未来,我们一定不忘初心!",this.width/2,this.height*0.674,this.width,"45px mw",45,"#000000","center");
    h = this.drawLongText(this.texts.oath,this.width*0.1,h*1.02,this.width*0.8,"32px Microsoft YaHei",32,"#000000","left");
    ctx.stroke();
    ctx.restore();
    var generate_img = new Image();
    var _imgSrc = this.canvas.toDataURL("image/png",1);
    generate_img.src = _imgSrc;
    generate_img.onload = function(){
        $(_this.canvas).hide();
        $('#canvas_page').append($(this));
        $(generate_info_page).hide();
        $(canvas_page).show();
        $('.loading').hide();
    }
};
poster.prototype.drawLongText = function(t,x,y,w,s,p,c,a){
    var ctx = this.canvas.getContext('2d');
    var chr = t.split("");
    var temp = "";
    var row = [];
    var font = s;
    ctx.save();
    ctx.beginPath();
    ctx.font = font;
    ctx.fillStyle = c;
    ctx.textAlign = a;
    for(var a = 0; a < chr.length; a++){
        if( ctx.measureText(temp).width >= w ){
            row.push(temp);
            temp = "";
        }
        temp += chr[a];
    }
    row.push(temp);

    for(var b = 0; b < row.length; b++){
        ctx.fillText(row[b],x,y+(b+1)*(p+15));
    }
    ctx.stroke();
    ctx.restore();
    return (y+(row.length)*p*1.2);
};
poster.prototype.draw_back = function(obj){
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.drawImage(obj,0,0,this.width,this.height);
    this.loadImgs();
    ctx.restore();
};
$(function(){
    var p = new poster();
    var info_title = $('.info_title').find('span');
    var w = 750;
    var h = 750*1.778;
    var generate_info_page = $('#generate_info_page');
    var info_inputers = $('.info_inputer').find('input');
    var generate_btn = $('#generate_btn');
    var nick_name = $('.nick_name');
    var developer_info = $('.developer_info');
    var date_selector = $('#date_selector');
    var copyright = $('.copyright');
    var name_inputer = $('.name_inputer');
    var colors = [{'type':'blue','color':'#4396de'},{'type':'red','color':'#dc4c47'},{'type':'yellow','color':'#ecb61a'},{'type':'purple','color':'#874ad3'},{'type':'green','color':'#3fc94b'}];
    var imgs = [{
        'src': public_path + "img/tuan_logo.png",
        'width': w * 0.19,
        'height': w * 0.19,
        'x': w * 0.18,
        'y': h * 0.25,
        'type': 'tuan'
    }, {
        'src': public_path + "img/flag.png",
        'width': w * 0.152,
        'height': h * 0.045,
        'x': w * 0.04,
        'y': h * 0.026,
        'type': 'flag'
    }, {
        'src': public_path + "img/code.jpg",
        'width': w * 0.213,
        'height': w * 0.213,
        'x': w * 0.7386,
        'y': h * 0.83,
        'type': 'code'
    }];
    var ghost_date = $('#date_ghost');
    var _data = {};
    var loading = $('.loading');
    var oMask = $('.oMask');
    var developer_info_container = $('.developer_info_container');
    var close_btn = $('.close_btn');
    var developer_info = $('.developer_info');
    var save_tip = $('.save_tip');
    developer_info.on('click',function(){
        developer_info_container.show();
        oMask.show();
    });
    close_btn.on('click',function(){
       developer_info_container.hide();
        oMask.hide();
    });
    ghost_date.mobiscroll().date({
        theme: "ios",      // Specify theme like: theme: 'ios' or omit setting to use default
        lang: "zh",    // Specify language like: lang: 'pl' or omit setting to use default
        display: "bottom",  // Specify display mode like: display: 'bottom' or omit setting to use default
        mode: "datetimeDate",         // More info about mode: https://docs.mobiscroll.com/3-0-0_beta2/datetime#!opt-mode
        min: new Date(1977,12),
        max: new Date(2018,11),
        onSet: function (event, inst) {
            var date_str = $(this).val().split("/");
            var date = date_str[0]+"年"+date_str[1]+"月"+date_str[2]+"日";
            _data.time = date_str[0]+"-"+date_str[1]+"-"+date_str[2];
            date_selector.val(date);
        },
        onInit: function(event, inst){
            setTimeout(function(){
                loading.hide();
                generate_info_page.css('visibility','visible');
            },200);
        }
    });
    colors = colors.sort(function(){return 0.5 - Math.random();});
    var color = colors[0].color;
    developer_info.attr('src',public_path + "img/info_"+colors[0].type+'.png');
    info_title.addClass(colors[0].type);
    info_inputers.css({'color':colors[0].color,'border':'1px solid'+colors[0].color});
    nick_name.addClass(colors[0].type);
    copyright.addClass(colors[0].type);
    save_tip.addClass(colors[0].type);
    developer_info_container.addClass(colors[0].type);
    generate_info_page.addClass(colors[0].type+"_back");
    generate_btn.css('background',colors[0].color);
    generate_btn.on('click',function(){
        var name_inputer = $('.name_inputer');
        if(name_inputer.val() == ""){
            alert("姓名或网名不能为空!");
            return false;
        }
        loading.show();
        _data.username = name_inputer.val();
        $.post("/54/index.php/Home/Index/getcontent",_data,function(data){
            if(data.status == 200){
                var avatar_json = {'src':avatar_src,'width':w*0.19,'height':w*0.19,'x':w*0.632,'y':h*0.25,'type':'avatar'};
                imgs.push(avatar_json);
                var texts = {'nickname':_data.username,'keyword':data.data.keyword,'event':data.data.event,'days':data.data.days,'oath':data.data.describe};
                p.init(public_path+"img/generate_back/"+colors[0].type+".jpg",texts,color,imgs);
            }else if(data.status == 405){
                alert("姓名或网名中存在敏感词,请重新输入!");
                loading.hide();
            }else{
                alert(data.info);
                loading.hide();
            }
        });
    });
});