var Snake = function(x, y, canvasWidth, canvasHeight, bodySize){
	this.x = x;
	this.y = y;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.bodySize = bodySize;
	this.tailLength = 0;
	this.tailX = [];
	this.tailY = [];
	this.direction = 'right';
	this.score = 0;
}

Snake.prototype.moveContinuous = function() {
	for(var i = 0; i < this.tailLength - 1; i++) {
		this.tailX[i] = this.tailX[i + 1];
		this.tailY[i] = this.tailY[i + 1];
	}
	this.tailX[this.tailLength - 1] = this.x;
	this.tailY[this.tailLength - 1] = this.y;
	if (this.direction == 'left') {
		this.move(-1, 0);
	}
	if (this.direction == 'right') {
		this.move(1, 0);
	}
	if (this.direction == 'up') {
		this.move(0, -1);
	}
	if (this.direction == 'down') {
		this.move(0, 1);
	}
}

// input parameter: left, right, up, down
Snake.prototype.moveDirection = function(direction) {
	if (direction == 'left' && this.direction != 'right' && this.direction != 'left') {
		this.direction = 'left';
	}
	if (direction == 'right' && this.direction != 'left' && this.direction != 'right') {
		this.direction = 'right';
	}
	if (direction == 'up' && this.direction != 'down' && this.direction != 'up') {
		this.direction = 'up';
	}
	if (direction == 'down' && this.direction != 'up' && this.direction != 'down') {
		this.direction = 'down';
	}
}

// input parameter options: -1, 0, 1
Snake.prototype.move = function(x, y) {
	var newX = this.x + x * this.bodySize;
	var newY = this.y + y * this.bodySize;
	if (newX <= this.canvasWidth - this.bodySize && newX >= 0) {
		this.x = newX;
	}
	else if (newX == this.canvasWidth) {
		this.x = 0;
	}
	else if (newX < 0) {
		this.x = this.canvasWidth - this.bodySize;
	}
	if (newY <= this.canvasHeight - this.bodySize && newY >= 0) {
		this.y = newY;
	}
	else if (newY == this.canvasHeight) {
		this.y = 0;
	}
	else if (newY < 0) {
		this.y = this.canvasHeight - this.bodySize;
	}
}

Snake.prototype.eat = function(fruit) {
	distance = dist(this.x, this.y, fruit.x, fruit.y);
	if (distance < this.bodySize/2) {
		this.score++;
		fruit.createRandomLoc();
		this.tailLength++;
		this.tailX.push(this.x);
		this.tailY.push(this.y);
	}
}

Snake.prototype.die = function() {
	for (var i = 0; i < this.tailLength; i++) {
		if (dist(this.x, this.y, this.tailX[i], this.tailY[i]) < this.bodySize/2) {
			return true;
		}
	}
	return false;
}

Snake.prototype.draw = function() {
	stroke(0, 0, 0)
	rect(this.x, this.y, this.bodySize, this.bodySize)
	for (var i = 0; i < this.tailLength; i++) {
		rect(this.tailX[i], this.tailY[i], this.bodySize, this.bodySize);
	}
}