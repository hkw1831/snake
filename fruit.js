Fruit = function(canvasX, canvasY, canvasWidth, canvasHeight, size) {
	this.canvasX = canvasX;
	this.canvasY = canvasY;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.size = size;
}

Fruit.prototype.createRandomLocWithSnake = function(snake) {
	var created = false;
	while (!created) {
		var samePos = false;
		this.x = this.canvasX + (Math.floor(Math.random() * this.canvasWidth / this.size) * this.size);
		this.y = this.canvasY + (Math.floor(Math.random() * this.canvasHeight / this.size) * this.size);
		for (var i = 0; i < snake.tailLength; i++) {
			if (this.x == snake.tailX[i] && this.y == snake.tailY[i]) {
				samePos = true;
			}
		}
		if (this.x == snake.x && this.y == snake.y) {
			samePos = true;
		}
		if (samePos == true) {
			created = false;
		} else {
			created = true;
		}
	}
}

Fruit.prototype.draw = function() {
	stroke(0, 0, 0)
	fill(255, 0, 0)
	rect(this.x, this.y, this.size, this.size)
	fill(255, 255, 255)
}

Fruit.prototype.changePos = function() {
	this.createRandomLoc();
}