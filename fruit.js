Fruit = function(canvasWidth, canvasHeight, size) {
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.size = size;
	this.createRandomLoc();	
}

Fruit.prototype.createRandomLoc = function() {
	this.x = Math.floor(Math.random() * this.canvasWidth / this.size) * this.size;
	this.y = Math.floor(Math.random() * this.canvasHeight / this.size) * this.size;
}

Fruit.prototype.draw = function() {
	stroke(0, 0, 0)
	rect(this.x, this.y, this.size, this.size)
}

Fruit.prototype.changePos = function() {
	this.createRandomLoc();
}