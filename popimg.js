;(function($, window, undefined) {
  var defaults = {
      imgContainer : 'body'
  };
  function PopImg(options) {
    $.extend(this, defaults, options);
    this.init();
  }
  PopImg.prototype = {
    init:function(){
      this.imgContainer = $(this.imgContainer);
      this.imgArr       = $(this.imgContainer).find('img');
      this.imgLen       = this.imgArr.length;
      this.body         = $(document.body);
      this.popEle       = null;
      this.popNumEle    = null;
      this.index        = 0;
      try {
          this.imgAddStyle();
          this.bindClick();
          this.slideHandle();
      } catch(e) {
          console.error('error:'+e);
      }
    },
    imgAddStyle:function(){
      for(var i = 0; i < this.imgLen; i++){
          $(this.imgArr[i]).addClass('yxl-zoom').css({"cursor":"zoom-in",'transition':'all 0.3s'}).attr('data-index',i)
      }
    },
    bindClick:function(){
      var _this = this;
      $('.yxl-zoom').on('click',function(e){
         e.preventDefault();
         var target   = e.target;
         if (!target || target.tagName != 'IMG') return
         if($(e.target).hasClass('yxl-zoom')){
          var thisImg  = $(this);
          _this.index = thisImg.attr('data-index');
          _this.zoom.call(_this,thisImg);
         }
      })
    },
    zoom:function(img){
      this.popEle =  $("<div/>").css({
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        zIndex: 999,
        "-webkit-overflow-scrolling": 'touch',
        background: "#000",
        opacity: "1",
      }).attr("data-id", "b_layer");
      this.popNumEle = $("<div class='yxl-pop-num'>" +(parseInt(this.index)+1)+"/"+this.imgLen+"</div>").css({
          position: "fixed",
          left: 0,
          right: 0,
          'textAlign':'center',
          bottom: '20px',
          zIndex: 1000,
          'fontSize':'18px',
          color:'white'
      })
        $(this.popEle).appendTo(this.body);
        $(this.popNumEle).appendTo(this.body);
        var $img = this.cloneImg($(img));
        $img.removeClass('yxl-zoom').addClass('yxl-zoom-in');
        $img.appendTo(this.body);
        this.justifyImg($img);
    },
    slideHandle:function(){
      var self = this,
      startx,
      endx;
      this.body.on('touchstart','.yxl-zoom-in', function (e2) {  
          var target = e2.target;
          if (!target || target.tagName != 'IMG') return;
          if($(target).hasClass('yxl-zoom-in')){
            var touch = e2.changedTouches;  
            startx = touch[0].clientX;  
          }
       });  
      this.body.on('touchend','.yxl-zoom-in', function (e2) {  
          var target = e2.target;
          e2.preventDefault();
          if (!target || target.tagName != 'IMG') return;
          if($(target).hasClass('yxl-zoom-in')){
            var touch = e2.changedTouches;  
            endx = touch[0].clientX;  
            self.slideStart(startx,endx);
          }
      });  
    },
    slideStart:function(startx,endx){
      if(startx != endx){
          if (startx > endx ) { 
              this.slideLeft();
          } else {  
              this.slideRight();
          }  
      }else{
          this.closePop();
      }
    },
    closePop:function(){
        $(this.popEle).remove();
        $(this.popNumEle).remove();
        $("img[data-b-img]").remove();
    },
    slideLeft:function(){
        if(parseInt(this.index)+1 >= (this.imgLen)) return
        this.index = parseInt(this.index) + 1
        this.closePop();
        $('.yxl-pop-num').text((this.index+1)+"/"+this.imgLen);
        this.zoom($(this.imgArr[this.index]))
    },
    slideRight:function(){
        if(parseInt(this.index) === 0) return
        this.closePop();
        $('.yxl-pop-num').text((this.index)+"/"+this.imgLen);
        this.index = parseInt(this.index-1)
        this.zoom($(this.imgArr[this.index]))
    },
    justifyImg:function($ele){
        var dW = $(window).width();
        var dH = $(window).height();
        $ele.css("cursor", "zoom-out").attr("data-b-img", 1);
        var img = new Image();
        img.onload = function(){
          if(this.width >dW){
            this.width = dW
            this.height = 350
          }
          if(this.height > dH){
            this.height = 350
          }
          $ele.css({
            width: this.width,
            height: this.height,
            'transition':'all 0.3s',
            left: (dW - this.width) / 2, 
            top: (dH - this.height) / 2
          });
        };
        img.src = $ele.attr("src");
    },
    cloneImg:function($node){
        var left = $node.offset().left;
        var top = $node.offset().top;
        var nodeW = $node.width();
        var nodeH = $node.height();
        return $node.clone().css({
          position: "fixed",
          width: nodeW,
          height: nodeH,
          'transition':'all 0.3s',
          left: left,
          top: top,
          "-webkit-overflow-scrolling": 'touch',
          zIndex: 10000000
        });
    },
  }
  window.PopImg = PopImg;
})($, window);