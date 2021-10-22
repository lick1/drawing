const canvas = document.querySelector('#canvas');
const menu = document.querySelector('.menu')
const size = document.querySelector('.size');
const selectSize = document.querySelector('.select-size');
const currentSizes = document.querySelectorAll('.select-size div');
const lineSize = document.querySelector('.line-size');
const current = document.querySelector('.current');
const color = document.querySelector('.color input')
const graphs = document.querySelectorAll('.graph>div')
const inputText = document.querySelector('.text-input');
const eraser = document.querySelector('.eraser');
const modification = document.querySelector('.modification');
const getDrawingWidth = document.querySelector('.drawing-width');
const getDrawingHeight = document.querySelector('.drawing-height');
const download = document.querySelector('.download')
const promptPopUp = document.querySelector('.prompt-pop-up'); 
const confirm = document.querySelector('.confirm');
const cancel = document.querySelector('.cancel');


const ctx = canvas.getContext('2d');


const SIZES = [1, 3, 5, 8];

class Drawing {
	constructor(ctx) {
		this.size = 1;
		this.color = '#000';
		this.dx = 0;
		this.dy = 0;
		this.imgData = null;
		this.ctx = ctx;
	}
	getImgData(){
		return this.imgData;
	}
	render(){
		this.size = 1;
		this.color = '#000';
		this.dx = 0;
		this.dy = 0;
		this.imgData = null;
		this.ctx = ctx;
	}
	imageData() {
		this.ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
		if (this.imgData != null) {
			this.ctx.putImageData(this.imgData, 0, 0, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
		}
	}
	set(obj) {
		this.dx = obj.x || this.dx;
		this.dy = obj.y || this.dy;

		this.size = obj.size || this.size;
		this.color = obj.color || this.color;
		this.imgData = obj.data || this.imgData
	}
	brush(x, y) {
		this.ctx.lineTo(x, y);
		this.ctx.lineWidth = this.size;
		this.ctx.strokeStyle = this.color;
		this.ctx.lineCap = 'round';
		// ctx.fill();
		this.ctx.stroke();
	}
	// 直线
	line(x, y) {

		ctx.beginPath();
		this.ctx.moveTo(this.dx, this.dy);
		this.ctx.lineTo(x, y);
		this.ctx.lineWidth = this.size;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
	}
	// 圆
	circle(x, y) {
		let zx = Math.abs(x - this.dx);
		let zy = Math.abs(y - this.dy);
		let cx = 0;
		let cy = 0;
		let r = 0;
		if (zx < zy) {
			r = zx
			cx = (x + this.dx) / 2;
			cy = y > this.dy ? this.dy + zx : this.dy - zx;
		} else {
			r = zy
			cy = (y + this.dy) / 2;
			cx = x > this.dx ? this.dx + zy : this.dx - zy;
		}
		ctx.beginPath();
		this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
		this.ctx.lineWidth = this.size;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
	}
	// 椭圆
	ellipse(x, y) {
		let rad = Math.atan2(x - this.dx, y - this.dy);
		let rx = Math.abs(x - this.dx);
		let ry = Math.abs(y - this.dy);
		ctx.beginPath();
		ctx.ellipse(this.dx, this.dy, rx, ry, rad * Math.PI / 180, 0, 2 * Math.PI); //倾斜45°角
		this.ctx.lineWidth = this.size;
		this.ctx.strokeStyle = this.color;
		ctx.stroke();
	}
	// 矩形
	rectangle(x, y) {
		this.ctx.beginPath();
		this.ctx.strokeRect(this.dx, this.dy, x - this.dx, y - this.dy);
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.size;
		this.ctx.stroke();
	}
	square(x, y) {
		this.ctx.beginPath();
		let zx = Math.abs(x - this.dx);
		let zy = Math.abs(y - this.dy);
		let zwhidthx = 0;
		let zwhidthy = 0;
		if (zx < zy) {
			zwhidthx = x - this.dx;
			zwhidthy = y > this.dy ? zx : -zx;
		} else {
			zwhidthy = y - this.dy;
			zwhidthx = x > this.dx ? zy : -zy;
		}
		this.ctx.strokeRect(this.dx, this.dy, zwhidthx, zwhidthy);
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.size;
		this.ctx.stroke();
	}
	// 圆角矩形
	rectangleCorner(x, y) {
		this.ctx.beginPath();
		let rx = 0;
		let ry = 0;
		if (x < this.dx && y < this.dy) {
			rx = x;
			ry = y;
		} else if (x < this.dx && y > this.dy) {
			rx = x;
			ry = this.dy;
		} else if (x > this.dx && y < this.dy) {
			rx = this.dx;
			ry = y;
		} else {
			rx = this.dx
			ry = this.dy
		}


		this.drawRoundRect(rx, ry, Math.abs(x - this.dx), Math.abs(y - this.dy), ((Math.abs(y - this.dy) < 20 ||
			Math.abs(x - this.dx) < 20) ? 0 : 10));
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.size;
		this.ctx.stroke();
	}
	drawRoundRect(x, y, width, height, radius) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + radius);
		this.ctx.lineTo(x, y + height - radius);
		this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		this.ctx.lineTo(x + width - radius, y + height);
		this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		this.ctx.lineTo(x + width, y + radius);
		this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		this.ctx.lineTo(x + radius, y);
		this.ctx.quadraticCurveTo(x, y, x, y + radius);
		this.ctx.stroke();
	}
	textInput(text,x, y,width) {
		var result = this.breakLinesForCanvas(text,width,`16px 微软雅黑`);
		this.ctx.font = "16px 微软雅黑";
		
		this.ctx.fillStyle = this.color;
		var lineHeight = 14;
		result.forEach((line, index) => {
		   this.ctx.fillText(line, x ,y + lineHeight * index + 16);
		});
	}

	findBreakPoint(text, width) {
		var min = 0;
		var max = text.length - 1;
		while (min <= max) {
			var middle = Math.floor((min + max) / 2);
			var middleWidth = this.ctx.measureText(text.substr(0, middle)).width;
			var oneCharWiderThanMiddleWidth = this.ctx.measureText(text.substr(0, middle + 1)).width;
			if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
				return middle;
			}
			if (middleWidth < width) {
				min = middle + 1;
			} else {
				max = middle - 1;
			}
		}

		return -1;
	}
	breakLinesForCanvas(text, width, font) {
		var result = [];
		var breakPoint = 0;
		if (font) {
			this.ctx.font = font;
		}
		while ((breakPoint = this.findBreakPoint(text, width)) !== -1) {
			result.push(text.substr(0, breakPoint));
			text = text.substr(breakPoint);
		}
		if (text) {
			result.push(text);
		}
		return result;
	}
	//橡皮
	eraser(x,y){
		ctx.save();
		ctx.globalCompositeOperation = "destination-out";
		ctx.lineTo(x,y);
		ctx.lineWidth = 10;
		ctx.stroke();
		ctx.restore();
	}
}
