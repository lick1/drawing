let drawings = new Drawing(ctx); 
let isDom = false;
let isShowText = false;
let type = "line";
let dx = 0;
let dy = 0;
function setType(types){
	switch(types){
		case "画笔":
			type = "brush";
			break;
		case "直线":
			type = "line";
			break;
		case "圆形":
			type = "circle";
			break;
		case "椭圆":
			type = "ellipse";
			break;
		case "矩形":
			type = "rectangle";
			break;
		case "圆角矩形":
			type = "rectangleCorner";
			break;
		case "正方形":
			type = "square";
			break;
		case "文本":
			type = "text";
			break;
		case "橡皮":
			type = "eraser"
		default :
			break;
	}
}

canvas.addEventListener('mousedown',function(e){
	isDom = true;
	let x = e.pageX - this.offsetLeft;
	let y = e.pageY - this.offsetTop - menu.offsetHeight;
	
	drawings.set({color:color.value});
	drawings.set({
		x,
		y
	})
	ctx.beginPath();
	if(type == "brush"){
		ctx.moveTo(x,y);
	}
	if(type == "text" && !isShowText){
		inputText.style.display = "block";
		inputText.style.top = `${y}px`;
		inputText.style.left = `${x}px`;
		dx = x;
		dy = y;
		console.log(dx,dy);
		isShowText = !isShowText;
	}else{
		if(inputText.value){
			console.log(dx,dy);
			drawings.textInput(inputText.value,dx,dy,inputText.offsetWidth);
		}
		inputText.value = null;
		inputText.style.display = "none";
		isShowText = !isShowText;
	}
})
canvas.addEventListener('mousemove',function(e){
	let x = e.pageX - this.offsetLeft;
	let y = e.pageY - this.offsetTop - menu.offsetHeight;
	if(isDom && type != "text"){
		drawings.imageData();
		drawings[type](x,y);
		
	}
})
canvas.addEventListener('mouseup',function(e){
	isDom = false;
	ctx.closePath();
	let data = ctx.getImageData(0,0,canvas.offsetWidth,canvas.offsetHeight);
	drawings.set({data})
})
	
// 线的大小
size.addEventListener('mouseover',function(){
	selectSize.style.display = 'block';
	for(let i = 0;i < currentSizes.length;i++){
		currentSizes[i].addEventListener('click',function(){
			for(let j = 0;j < currentSizes.length;j++){
				currentSizes[j].className = '';
			}
			this.className = 'current-size';
			drawings.set({size:SIZES[i]})
			lineSize.style.borderBottom = `${SIZES[i]}px solid #000`;
		})
	}
})
selectSize.addEventListener('mouseout',function(){
	selectSize.style.display = 'none';
	
})
render();
// 几何类型的选举
function render(){
	for(let i = 0;i < graphs.length;i++){
		graphs[i].addEventListener('click',function(){
			for(let j = 0;j < graphs.length;j++){
				graphs[j].classList.remove('current');
			}
			eraser.classList.remove('eraser-current')
			this.classList.add('current');
			let str = this.getAttribute('title');
			setType(str);
		
		})
	}
	eraser.addEventListener('click',function(){
		eraser.classList.add('eraser-current');
		let str = eraser.getAttribute('title');
		setType(str);
		for(let j = 0;j < graphs.length;j++){
			graphs[j].classList.remove('current');
		}
	})
}

// 修改画板的宽度
modification.addEventListener('click',function(){
	
	if(drawings.getImgData != null){
		prompt();
	}else{
		setCanvas();
	}
	
	
})

function prompt(){
	promptPopUp.style.display = 'block';
	confirm.addEventListener('click',()=>{
		imageDownload();
		setCanvas();
		promptPopUp.style.display = 'none';
	})
	cancel.addEventListener('click',function(){
		setCanvas();
		promptPopUp.style.display = 'none';
	})
}
function setCanvas(){
	ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
	drawings.render();
	let drawingWidth = parseInt(getDrawingWidth.value);
	let drawingHeight = parseInt(getDrawingHeight.value);
	if(drawingWidth > 10 && drawingHeight > 10){
		canvas.style.width = drawingWidth + "px";
		canvas.style.height = drawingHeight + "px";
		canvas.width = drawingWidth;
		canvas.height = drawingHeight;
		getDrawingWidth.placeholder = drawingWidth;
		getDrawingHeight.placeholder = drawingHeight;
		getDrawingWidth.value = '';
		getDrawingHeight.value = "";
	}else{
		
	}
	
}
// document.getElementById('download').addEventListener('click', function() {
//     downloadCanvas(this, 'canvas', 'test.png');
// }, false);
function imageDownload(){
	if(drawings.getImgData != null){
		download.href = canvas.toDataURL();
		let name = Math.random() + '';
		name = name.slice(2);
		download.download = `${name.substring(0,8)}.png`;
	}
}


download.addEventListener('click',function() {
	imageDownload()
})