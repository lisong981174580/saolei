/**
 * Created by Administrator on 2017/5/18.
 */


window.onload=function () {

    //获取元素

    var  kaishi=document.getElementsByClassName("kaishi")[0];
    var  kaishi_anniu=document.querySelector(".kaishi .anniu1");
    var  xuanguan=document.querySelectorAll(".xuanguan");
    var  tuichu=document.querySelectorAll(".anniu2");


    var  zailai=document.querySelector(".zailai");
    var  zailai_anniu=document.querySelector(".zailai .anniu1");
    var  fenshu=document.querySelector(".fenshu");


    //构造函数参数为横竖格子数  地雷数

    function saolei(numX,numY,num){
        this.numX=numX;
        this.numY=numY;
        this.num=num;
        this.screens=document.querySelector(".screens");
    }

    //对象的原型
    saolei.prototype={
        //打开后执行的方法
        play:function(){
            //格子布局   numX行*numY列
            this.drawScreen(this.numX,this.numY);
            //布雷
            this.pushMine(this.numX,this.numY,this.num);
            //判断附近八个方向是否有雷，并把地雷的总数  记录在gezi[i].num上
            this.drawNum();
            //翻开后
            this.fan();

            //插旗子
            this.qizi();
        },
        //格子布局   numX行*numY列  因为格子的宽度是30px 所以Screen的宽度应该是30的倍数
        drawScreen:function(x,y){
            var width=30*x;
            var height=30*y;
            this.screens.style.width=width+"px";
            this.screens.style.height=height+"px";
            this.screens.classList.add("bian");
            for (var i = 0; i < x; i++) {
                for (var j = 0; j < y; j++) {
                    var gezi=document.createElement("div");
                    gezi.classList.add("gezi");
                    //先把格子藏起来
                    gezi.classList.add("fugai");
                    gezi.id=i+"-"+j;
                    this.screens.appendChild(gezi);
                }
            }
        },
        //布雷   参数x ，y用来控制随机数的范围有   num 用来控制雷数
        pushMine:function(x,y,num){
            var mine_arr=[];
            var mx;
            var my;
            for (var i = 0; i < num; i++) {
                mx=Math.floor(Math.random()*x);
                my=Math.floor(Math.random()*y);
                for (var j = 0; j < mine_arr.length; j++) {
                    if(mx==mine_arr[j].x && my==mine_arr[j].y){
                        j=-1;
                        mx=Math.floor(Math.random()*x);
                        my=Math.floor(Math.random()*y);
                    }
                }
                var mjson={x:mx,y:my};
                mine_arr.push(mjson);
            }

            for (var i = 0; i < mine_arr.length; i++) {
                var id=mine_arr[i].x+"-"+mine_arr[i].y;
                document.getElementById(id).classList.add("lei");
                document.getElementById(id).lei=true;
            }
        },

        //判断附近八个方向是否有雷，并把地雷的总数  记录在gezi[i].num上
        drawNum:function(){
            var gezi=document.querySelectorAll(".gezi");
            for (var i = 0; i < gezi.length; i++) {
                // 判断是否有这个类名
                if(!gezi[i].classList.contains("lei")){
                //如果没有lei这个类名  则判断判断附近八个方向是否有雷，并把地雷的总数  记录在gezi[i].num上
                    gezi[i].num=this.jisuan(gezi[i]);

                }
            }
        },
        // 判断判断附近八个方向是否有雷，并把地雷的总数  记录在gezi[i].num上
        jisuan:function(obj){
            var num=0;
            var arr=obj.id.split("-");
            var idX=parseInt(arr[0]);
            var idY=parseInt(arr[1]);
            var bottom=document.getElementById(`${idX+1}-${idY}`),
                top=document.getElementById(`${idX-1}-${idY}`),
                left=document.getElementById(`${idX}-${idY-1}`),
                right=document.getElementById(`${idX}-${idY+1}`),
                leftTop=document.getElementById(`${idX-1}-${idY-1}`),
                rightTop=document.getElementById(`${idX-1}-${idY+1}`),
                rightBottom=document.getElementById(`${idX+1}-${idY+1}`),
                leftBottom=document.getElementById(`${idX+1}-${idY-1}`);
            if(top){
                if(top.lei){
                    num++;
                }
            }
            if(left){
                if(left.lei){
                    num++;
                }
            }
            if(right){
                if(right.lei){
                    num++;
                }
            }
            if(bottom){
                if(bottom.lei){
                    num++;
                }
            }
            if(leftTop){
                if(leftTop.lei){
                    num++;
                }
            }
            if(leftBottom){
                if(leftBottom.lei){
                    num++;
                }
            }
            if(rightTop){
                if(rightTop.lei){
                    num++;
                }
            }
            if(rightBottom){
                if(rightBottom.lei){
                    num++;
                }
            }

            return num;
        },
        //翻开后
        fan:function(){
            //获取所有格子
            var gezi=document.querySelectorAll(".gezi");
            var that=this;
        //遍历格子
            gezi.forEach(function(v,i){
                //给所有格子添加点击事件
                v.onclick=function(){
                    //如果fugai这个类名 点击之后则移除这个类名  也就是翻开牌子
                    if(v.classList.contains("fugai")){
                        v.classList.remove("fugai");
                        //如果 这个元素  不是雷（绑定过num的）则内容为num
                        if(v.num){
                            v.innerHTML=v.num;
                        }
                        //如果  num是0  则num变为空  并且上下左右有0  也同时变为空
                        if(v.num==0){
                            that.zero(v);
                        }

                        //如果碰到雷了 则结束  并且翻开所有雷
                        if(v.classList.contains("lei")){
                            var lei=document.querySelectorAll(".lei");
                             lei.forEach(function(value){
                                value.classList.remove("fugai");
                            })

                            setTimeout(function(){

                                zailai.style.display="block";
                                fenshu.innerHTML="本次扫雷失败"
                                zailai_anniu.onclick=function () {

                                    that.screens.innerHTML="";
                                    zailai.style.display="none";
                                    that.play();
                                }

                            }, 100);

                        }
                    }
                    //获得所有没有翻开的元素
                    var zhe=document.querySelectorAll(".fugai");

                    var qi=document.querySelectorAll(".qizi");
                    //如果没有翻开的元素个数和插旗子的个数等于地雷总数  则也成功
                    if((zhe.length+qi.length)==that.num){

                        var lei=document.querySelectorAll(".lei");
                        lei.forEach(function(v){
                            v.classList.remove("fugai");
                            v.classList.remove("qizi");
                        })

                        setTimeout(function(){
                            zailai.style.display="block";
                            fenshu.innerHTML="恭喜你扫雷成功，您可选择其他关卡"
                            zailai_anniu.innerHTML=" 开始游戏"
                            zailai_anniu.onclick=function () {

                                that.screens.innerHTML="";
                                zailai.style.display="none";
                                that.play();
                            }
                        }, 100);
                    }
                }
            })
        },
        //如果  num是0  则num变为空  并且上下左右有0  也同时变为空
        zero:function(obj){
            var arr_kong=[];
            arr_kong.push(obj);
            while(arr_kong.length){
                var arr=arr_kong[0].id.split("-");
                var idX=parseInt(arr[0]);
                var idY=parseInt(arr[1]);
                var bottom=document.getElementById(`${idX+1}-${idY}`),
                    top=document.getElementById(`${idX-1}-${idY}`),
                    left=document.getElementById(`${idX}-${idY-1}`),
                    right=document.getElementById(`${idX}-${idY+1}`),
                    leftTop=document.getElementById(`${idX-1}-${idY-1}`),
                    rightTop=document.getElementById(`${idX-1}-${idY+1}`),
                    rightBottom=document.getElementById(`${idX+1}-${idY+1}`),
                    leftBottom=document.getElementById(`${idX+1}-${idY-1}`);
                if(top&&top.classList.contains("fugai")){
                    top.classList.remove("fugai");
                    if(top.num){
                        top.innerHTML=top.num;
                    }
                    if(top.num==0 ){
                        arr_kong.push(top);
                    }
                }
                if(bottom&&bottom.classList.contains("fugai")){
                    bottom.classList.remove("fugai");
                    if(bottom.num){
                        bottom.innerHTML=bottom.num;
                    }
                    if(bottom.num==0){
                        arr_kong.push(bottom);
                    }
                }
                if(right&&right.classList.contains("fugai")){
                    right.classList.remove("fugai");
                    if(right.num){
                        right.innerHTML=right.num;
                    }
                    if(right.num==0){
                        arr_kong.push(right);
                    }
                }
                if(left&&left.classList.contains("fugai")){
                    left.classList.remove("fugai");
                    if(left.num){
                        left.innerHTML=left.num;
                    }
                    if(left.num==0){
                        arr_kong.push(left);
                    }
                }
                if(leftTop&&leftTop.classList.contains("fugai")){
                    leftTop.classList.remove("fugai");
                    if(leftTop.num){
                        leftTop.innerHTML=leftTop.num;
                    }
                    if(leftTop.num==0){
                        arr_kong.push(leftTop);
                    }
                }
                if(leftBottom&&leftBottom.classList.contains("fugai")){
                    leftBottom.classList.remove("fugai");
                    if(leftBottom.num){
                        leftBottom.innerHTML=leftBottom.num;
                    }
                    if(leftBottom.num==0){
                        arr_kong.push(leftBottom);
                    }
                }
                if(rightTop&&rightTop.classList.contains("fugai")){
                    rightTop.classList.remove("fugai");
                    if(rightTop.num){
                        rightTop.innerHTML=rightTop.num;
                    }
                    if(rightTop.num==0){
                        arr_kong.push(rightTop);
                    }
                }
                if(rightBottom&&rightBottom.classList.contains("fugai")){
                    rightBottom.classList.remove("fugai");
                    if(rightBottom.num){
                        rightBottom.innerHTML=rightBottom.num;
                    }
                    if(rightBottom.num==0){
                        arr_kong.push(rightBottom);
                    }
                }

                arr_kong.shift();
            }
        },
        //右击后插旗子
        qizi:function(){
            //选择所有被覆盖的元素
            var fugai=document.querySelectorAll(".fugai");
            var that=this;
            //清除右击的所有默认样式
            this.screens.oncontextmenu=function(ev){
                ev.preventDefault();
            }
            //遍历所有被覆盖的元素
            fugai.forEach(function(v){
                //添加右击效果
                v.oncontextmenu=function(ev){
                    //先清除该单元格的默认样式
                    ev.preventDefault();
                    //如果被覆盖 则移除fugai类名 添加qizi类名      如果有旗子  则移出旗子并且再次覆盖
                    if(this.classList.contains("fugai")){
                        this.classList.remove("fugai");
                        this.classList.add("qizi");
                    }else if(this.classList.contains("qizi")){
                        this.classList.add("fugai");
                        this.classList.remove("qizi");
                    }
                    //定义成功的规则
                    that.success();

                }
            })
        },
        //定义成功的规则
        success:function(){
            var lei=document.querySelectorAll(".lei");
            var qi=document.querySelectorAll(".qizi");

            var flag=true;
            lei.forEach(function(v){
                if(!v.classList.contains("qizi")){
                    flag=false;
                }
            })

            if(flag){

                setTimeout(function(){
                    alert("成功");
                    location.reload();
                }, 100);
            }


        }

    }

    var  leishu=10;
    var sao;
    xuanguan[0].onclick=function () {

        leishu=prompt("请输入地雷的个数");
        sao=new saolei(20,20,leishu);


    }


    xuanguan[1].onclick=function () {


        leishu=prompt("请输入地雷的个数");
        sao=new saolei(20,20,leishu);
      

    }



    var sao=new saolei(20,20,leishu);

    for(let i=0;i<tuichu.length;i++){
        tuichu[i].onclick=function () {
            window.close();
        }
    }
    kaishi_anniu.onclick=function () {
        kaishi.style.display="none";
        sao.play()
    }







    
}