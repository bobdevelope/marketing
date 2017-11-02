document.addEventListener('touchstart',function(ev){
  ev = ev ||event;
  ev.preventDefault();
});

$(function(){
  var startX = 0;
  var startY = 0;
  var nextIndex = 0;
  var oldIndex = 0;
  var isFirst = true;
  var flag = '';
  var viewHeight = $(window).height();
  var viewWidth = $(window).width();
  var $li = $('#wrap .pages>li');
  var music = document.querySelector('.music');
  var audio = document.querySelector('.music audio');
  var play = false;
  //定义出入场动画
  var arr= [
    {
      out:function(){
        $('#wrap .pages .page1 .text .text1').css('transform', 'translateX(290px)')
        $('#wrap .pages .page1 .text .text2').css('transform', 'translateX(-290px)')
        $('#wrap .pages .page1 .text .text3').css('transform', 'translateX(290px)')
        $('#wrap .pages .page1 .text .text4').css('transform', 'translateX(-296px)')
      },
      in:function(){
        $('#wrap .pages .page1 .text .text1').css('transform', 'translateX(0px)')
        $('#wrap .pages .page1 .text .text2').css('transform', 'translateX(0px)')
        $('#wrap .pages .page1 .text .text3').css('transform', 'translateX(0px)')
        $('#wrap .pages .page1 .text .text4').css('transform', 'translateX(0px)')
      }
    },
    {
      out:function(){
        $('#wrap .pages .page2 .icon').css('transform', 'translate(0px,0px) rotate(0deg)')
      },
      in:function(){
        const R = 150;
        var angle = Math.PI/3;
        $('#wrap .pages .page2 .icon').eq(0).css('transform', 'translate(0, '+ (-R) +'px) rotate(720deg)');
        $('#wrap .pages .page2 .icon').eq(1).css('transform', 'translate('+ (-Math.sin(angle)*R)+'px,'+ (-Math.cos(angle)*R) +'px) rotate(720deg)');
        $('#wrap .pages .page2 .icon').eq(2).css('transform', 'translate('+ (-Math.sin(angle)*R)+'px,'+ (Math.cos(angle)*R) +'px) rotate(720deg)');
        $('#wrap .pages .page2 .icon').eq(3).css('transform', 'translate(0,'+ R +'px) rotate(720deg)');
        $('#wrap .pages .page2 .icon').eq(4).css('transform', 'translate('+ (Math.sin(angle)*R)+'px,'+ (Math.cos(angle)*R) +'px) rotate(720deg)');
        $('#wrap .pages .page2 .icon').eq(5).css('transform', 'translate('+ (Math.sin(angle)*R)+'px,'+ (-Math.cos(angle)*R) +'px) rotate(720deg)');

      }
    },
    {
      out:function(){
        $('#wrap .pages .page3 .text').css('transform', 'rotateY(0deg)')
      },
      in:function(){
        $('#wrap .pages .page3 .text').css('transform', 'rotateY(720deg)')
      }
    },
    {
      out:function(){
        $('#wrap .pages .page4 .box .box1').css({
          'width':'0px',
          'height':'0px'
        });
        $('#wrap .pages .page4 .box .box2').css({
          'width':'0px',
          'height':'0px'
        })
      },
      in:function(){
        $('#wrap .pages .page4 .box .box1').css({
          'width':'170px',
          'height':'170px'
        });
        $('#wrap .pages .page4 .box .box2').css({
          'width':'200px',
          'height':'170px'
        })
      }
    },
    {
      out:function(){

      },
      in:function(){

      }
    }
  ];
  //初始化状态
  for(var i=0; i<arr.length; i++){
    arr[i].out();
  };

  addCanvas();


  //增加canvas
  function addCanvas(){
    var oc = document.createElement('canvas');
    $('body').prepend(oc);
    oc.width = viewWidth;
    oc.height = viewHeight;
    if(oc.getContext){
        var ctx = oc.getContext('2d');
        var img = new Image();
        img.src = 'img/a.png';
        img.onload = function(){
          draw(this);
        }
    };

    function draw(img){
      ctx.drawImage(img,0,0,oc.width,oc.height);
      oc.addEventListener('touchstart',function(ev){
        ev = ev || event;
        var touch = ev.changedTouches[0];
        var startX = touch.clientX;
        var startY = touch.clientY;
        ctx.lineWidth=50;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.globalCompositeOperation="destination-out";
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(startX+1,startY+1);
        ctx.stroke();
      });
      oc.addEventListener('touchmove',function(ev){
        ev = ev || event;
        var touch = ev.changedTouches[0];
        var moveX = touch.clientX;
        var moveY = touch.clientY;
        // ctx.beginPath();
        ctx.lineTo(moveX,moveY);
        ctx.stroke();
      });
      oc.addEventListener('touchend',function(ev){
        ev = ev || event;
        var touch = ev.changedTouches[0];
        var imgData = ctx.getImageData(0,0,oc.width,oc.height);
        var allPx = imgData.width*imgData.height;
        var flag =0;
        for(var i=0;i<allPx;i++){
          if(imgData.data[4*i+3] === 0){
            flag++;
          }
        }

        if(flag >= allPx/3){
          oc.style.opacity=0;
        }

        oc.addEventListener("transitionend",function(){
          this.remove();
          audio.play();
          // audio.loop();
          play = true;
          pagesIn();
        })
      })
    };



  };
  //切换页面
  function pagesIn(){
    $li.on('touchstart',function(event){
      $li.css('transition','0s');
      // ev = ev ||event;
      var touch = event.originalEvent.changedTouches[0];
      startX = touch.pageX;
      startY = touch.pageY;
      $(this).siblings().hide();
    });
    $li.on('touchmove',function(event){
      $li.css('transition','0s');
      var touch = event.originalEvent.changedTouches[0];
      var moveX = touch.pageX;
      var moveY = touch.pageY;
      var offsetY = moveY - startY;
      flag = (offsetY>0) ? true : false;
      oldIndex = $(this).index();
      if(flag){
        nextIndex = (oldIndex == 0) ? 4 : oldIndex-1;
        $li.eq(oldIndex).removeClass('active');
        $li.eq(oldIndex).css('transform','translate(0,'+ (offsetY/5)+'px) scale('+ (1-offsetY/viewHeight/3)+')');
        $li.eq(nextIndex).addClass('active');
        $li.eq(nextIndex).show();
        $li.eq(nextIndex).css('transform','translate(0, '+ (offsetY-viewHeight)+'px) scale(1)');
      }else{
        nextIndex = (oldIndex == 4) ? 0 : oldIndex+1;
        $li.eq(oldIndex).removeClass('active');
        $li.eq(oldIndex).css('transform','translate(0,'+ (offsetY/5)+'px) scale('+ (1+offsetY/viewHeight/3)+')');
        $li.eq(nextIndex).addClass('active');
        $li.eq(nextIndex).show();
        $li.eq(nextIndex).css('transform','translate(0, '+ (viewHeight+offsetY)+'px) scale(1)');

      };
    });
    $li.on('touchend',function(event){
      $li.eq(nextIndex).css('transform','translate(0, 0) scale(1)');
      if(flag){
        $li.eq(oldIndex).css('transform','translate(0, '+ viewHeight +'px) scale(0.7)');
      }else{
        $li.eq(oldIndex).css('transform','translate(0, '+ -viewHeight +'px) scale(0.7)');
      }
      $li.css('transition','0.5s');
    });

    $li.on('transitionend',function(){
      arr[oldIndex].out();
      arr[nextIndex].in();
    });
  }

  //MusicOnOff
  music.onclick = function(){
    if(play){
      audio.pause();
      music.className = 'music';
      play = false;
    }else{
      audio.play();
      music.className = 'music circle';
      play = true;
    }
  }

});
