var canvaswidth=800;
var canvasheight=300;

var strokeColor='block';

var isMoveDown=false;
var lastLoc={x:0,y:0}   //记录上一次鼠标的位置

var lastTimestamp=0;
var lastLineWidth=-1;
var canvas=document.getElementById("canvas");
var context=canvas.getContext('2d');
canvas.height=canvasheight;
canvas.width=canvaswidth;
$('#controller').css('width',canvaswidth+'px');


$('#clear_btn').click(
	function(e){
		context.clearRect(0,0,canvaswidth,canvasheight);
		
	}
)

$('.color_btn').click(function(){
	$('.color_btn').removeClass('color_btn_selected');
	$(this).addClass('color_btn_selected');
	strokeColor=$(this).css('background-color');
})
function beginStroke(point){
	isMoveDown=true;
	lastLoc=windowToCanvas(point.x,point.y);
	lastTimestamp = new Date().getTime();
}

function endStroke(){
	isMoveDown=false;
}

function moveStroke(point){
	var curLoc=windowToCanvas(point.x,point.y);
		var curTimestamp=new Date().getTime();
		var s=calcDistance(curLoc,lastLoc);
		var t=curTimestamp-lastTimestamp;
		var lineWidth=calcLineWidth(t,s);
		context.beginPath();
		context.moveTo(lastLoc.x,lastLoc.y);
		context.lineTo(curLoc.x,curLoc.y);
		
		context.strokeStyle=strokeColor;
		context.lineWidth=lineWidth;
		context.lineCap='round';
		context.lineJoin='round';
		context.stroke();
		context.closePath();
		lastLoc=curLoc;
		lastTimestamp=curTimestamp;
		lastLineWidth=lineWidth;
}
canvas.onmousedown=function(e){
	e.preventDefault();
	beginStroke({
		x:e.clientX,
		y:e.clientY
	})
}
canvas.onmouseup=function(e){
	e.preventDefault();
	endStroke()
}
canvas.onmouseout=function(e){
	e.preventDefault();
	endStroke()
}
canvas.onmousemove=function(e){
	e.preventDefault();
	if(isMoveDown){
		moveStroke({x:e.clientX,y:e.clientY})	
	}
}

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	touch=e.touches[0]
	beginStroke({x:touch.pageX,y:touch.pageY})
})
canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if(isMoveDown){
		touch=e.touches[0]
		moveStroke({x:touch.pageX,y:touch.pageY})
	}
	
})
canvas.addEventListener('touchend',function(e){
	e.preventDefault();
	endStroke();
})


function calcLineWidth(t,s){
	var v=s/t;
	var resultLineWidth;
	if(v<=0.1)
	resultLineWidth=30;
	else if(v>=10)
	resultLineWidth=1;
	else
	resultLineWidth=30-(v-0.1)/(10-0.1)*(30-1)
	
	if(lastLineWidth==-1)
		return resultLineWidth
		
		return resultLineWidth*2/3+resultLineWidth*1/3
	
}
function calcDistance(loc1,loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
}
function windowToCanvas(x,y){
	var bbox=canvas.getBoundingClientRect();
	return{
		x:Math.round(x-bbox.left),
		y:Math.round(y-bbox.top)
	}
}


