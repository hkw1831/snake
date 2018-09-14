var Snake = function(x, y, canvasX, canvasY, canvasWidth, canvasHeight, bodySize, snakeDna, dnaType){
	this.x = canvasX + x;
	this.y = canvasY + y;
	this.canvasX = canvasX;
	this.canvasY = canvasY;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.diagDist = Math.sqrt(this.canvasWidth * this.canvasWidth + this.canvasHeight * this.canvasHeight);
	this.longestDist = this.canvasWidth;
	this.bodySize = bodySize;
	this.tailLength = 4;
	this.tailX = [this.x - this.bodySize, this.x - 2*this.bodySize, this.x - 3*this.bodySize, this.x - 4*this.bodySize];
	this.tailY = [this.y, this.y, this.y, this.y];
	this.direction = 'right';
	this.score = 0;
	this.health = 200;
	this.isDead = false;
	this.snakeDna = snakeDna;
	this.neuralNetwork = new SnakeNeuralNetwork(this.snakeDna);
	this.dnaType = dnaType;
}

Snake.prototype.calculateMove = function(fruit) {
	return this.neuralNetwork.calculate(this, fruit);
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
	this.health--;
	this.score++;
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
// 	if (newY > this.canvasY + this.canvasHeight - this.bodySize) {
// 		newY = this.canvasY;
// 	}
// 	if (newY < this.canvasY) {
// 		newY = this.canvasY + this.canvasHeight - this.bodySize;
// 	}
// 	if (newX > this.canvasX + this.canvasWidth - this.bodySize) {
// 		newX = this.canvasX;
// 	}
// 	if (newX < this.canvasX) {
// 		newX = this.canvasX + this.canvasWidth - this.bodySize;
// 	}
	this.x = newX;
	this.y = newY;
}

Snake.prototype.eat = function(fruit) {
	distance = dist(this.x, this.y, fruit.x, fruit.y);
	if (distance < this.bodySize/2) {
		this.score = this.score + 400
		this.health = 200;
		this.tailLength++;
		this.tailX.push(this.x);
		this.tailY.push(this.y);
		fruit.createRandomLocWithSnake(this);
	}
}

Snake.prototype.die = function(fruit) {
	var died2 = this.died();
	if (died2){
// 		this.score = this.score + this.health;
		this.score = this.score + Math.floor(this.diagDist - dist(this.x, this.y, fruit.x, fruit.y));
// 		this.score = this.score - this.health;
		this.health = 0;
	}
	return died2;
}

Snake.prototype.died = function() {
// 	console.log(this.health);
	for (var i = 0; i < this.tailLength - 3; i++) {
		if (dist(this.x, this.y, this.tailX[i], this.tailY[i]) < this.bodySize/2) {
			return true;
		}
	}
	if ((this.y > this.canvasY + this.canvasHeight - this.bodySize) || (this.y < this.canvasY)) {
		return true;
	}
	if ((this.x > this.canvasX + this.canvasWidth - this.bodySize) || (this.x < this.canvasX)) {
		return true;
	}
	if (this.health <= 0) {
		return true;
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

// Neural Network part:

// arr[0-7]: will hit (true: 1, false: 2) in the following direction: 
// x means the head of snake:
// +---+
// | 0 |
// |3x1|
// | 2 |
// +---+
// arr[8-9]: x, y coord of snake head
// arr[10-11]: x, y coord of fruit
Snake.prototype.getRoadInfo = function(fruit) {
	info = [];/* 
	info.push(this.hitTop());
	info.push(this.hitRight());
	info.push(this.hitBottom());
	info.push(this.hitLeft());
	info.push(this.fruitInLeft(fruit));
	info.push(this.fruitInRight(fruit));
	info.push(this.fruitInFront(fruit));
	info.push(this.fruitInBack(fruit));
	info.push(this.fruitInTopLeft(fruit));
	info.push(this.fruitInTopRight(fruit));
	info.push(this.fruitInBottomLeft(fruit));
	info.push(this.fruitInBottomRight(fruit)); */
// 	info.push(this.distTopWall());
// 	info.push(this.distLeftWall());
// 	info.push(this.distBottomWall());
// 	info.push(this.distRightWall());
/* 	info.push(this.distTopBody() / this.longestDist);
	info.push(this.distBottomBody() / this.longestDist);
	info.push(this.distLeftBody() / this.longestDist);
	info.push(this.distRightBody() / this.longestDist); */
// 	info.push((this.distFront() / this.longestDist));
// 	info.push((this.distBack() / this.longestDist));
// 	info.push((this.distLeft() / this.longestDist));
// 	info.push((this.distRight() / this.longestDist));
	info.push(this.hitFront());
	info.push(this.hitBack());
	info.push(this.hitLeft());
	info.push(this.hitRight());
	info.push(this.fruitInFront(fruit));
	info.push(this.fruitInBack(fruit));
	info.push(this.fruitInLeft(fruit));
	info.push(this.fruitInRight(fruit));
	info.push((this.distFruitFront(fruit) / this.longestDist));
	info.push((this.distFruitSide(fruit) / this.longestDist));
	info.push((this.distWallBodyFrontSide() / this.longestDist));
	info.push((this.distWallBodyBackSide() / this.longestDist));
	info.push((this.distWallBodyLeftSide() / this.longestDist));
	info.push((this.distWallBodyRightSide() / this.longestDist));
// 	info.push(this.nearWallBodyFront());
// 	info.push(this.nearWallBodySide());
	info.push(this.fruitInFrontLeft(fruit))
	info.push(this.fruitInFrontRight(fruit))
 	info.push((this.diagDist - dist(this.x, this.y, fruit.x, fruit.y)) / this.diagDist);
 	info.push(this.fruitInClosestFront(fruit));
 	info.push(this.fruitInClosestLeft(fruit));
	info.push(this.fruitInClosestRight(fruit));

// 	console.log(info.toString());
	return info;
}

Snake.prototype.fruitInClosestFront = function(fruit) {
	if (this.direction == 'up' && this.x == fruit.x && this.y - fruit.y == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'down' && this.x == fruit.x && fruit.y - this.y == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'left' && this.y == fruit.y && this.x - fruit.x == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'right' && this.y == fruit.y && fruit.x - this.x == this.bodySize) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInClosestLeft = function(fruit) {
	if (this.direction == 'up' && this.y == fruit.y && this.x - fruit.x == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'down' && this.y == fruit.y && fruit.x - this.x == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'left' && this.x == fruit.x && fruit.y - this.y == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'right' && this.x == fruit.x && this.y - fruit.y == this.bodySize) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInClosestRight = function(fruit) {
	if (this.direction == 'up' && this.y == fruit.y && fruit.x - this.x == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'down' && this.y == fruit.y && this.x - fruit.x == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'left' && this.x == fruit.x && this.y - fruit.y == this.bodySize) {
		return Number(1);
	}
	if (this.direction == 'right' && this.x == fruit.x && fruit.y - this.y == this.bodySize) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInFrontLeft = function(fruit) {
	if (this.direction == 'up' && fruit.x < this.x && fruit.y < this.y){
		return Number(1);
	}
	else if (this.direction == 'down' && fruit.x > this.x && this.y < fruit.y ) {
		return Number(1);
	}
	else if (this.direction == 'left' && fruit.y > this.y && this.x > fruit.x) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.y > this.y && fruit.x < this.x) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInFrontRight = function(fruit) {
	if (this.direction == 'up' && fruit.x > this.x && fruit.y < this.y){
		return Number(1);
	}
	else if (this.direction == 'down' && fruit.x < this.x && this.y < fruit.y ) {
		return Number(1);
	}
	else if (this.direction == 'left' && fruit.y < this.y && this.x > fruit.x) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.y > this.y && fruit.x > this.x) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInFront = function(fruit) {
	if (this.direction == 'up' && fruit.x == this.x && fruit.y > this.y){
		return Number(1);
	}
	else if (this.direction == 'down' && fruit.x == this.x && this.y > fruit.y ) {
		return Number(1);
	}
	else if (this.direction == 'left' && fruit.y == this.y && this.x > fruit.x) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.y == this.y && fruit.x > this.x) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInBack = function(fruit) {
	if (this.direction == 'up' && fruit.x == this.x && fruit.y < this.y){
		return Number(1);
	}
	else if (this.direction == 'down' && fruit.x == this.x && this.y < fruit.y ) {
		return Number(1);
	}
	else if (this.direction == 'left' && fruit.y == this.y && this.x < fruit.x) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.y == this.y && fruit.x < this.x) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInLeft = function(fruit) {
	if (this.direction == 'up' && fruit.y == this.y && fruit.x < this.x){
		return Number(1);
	}
	else if (this.direction == 'down' && fruit.y == this.y && this.x < fruit.x ) {
		return Number(1);
	}
	else if (this.direction == 'left' && fruit.x == this.x && this.y < fruit.y) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.x == this.x && fruit.y < this.y) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.fruitInRight = function(fruit) {
	if (this.direction == 'up' && fruit.y == this.y && fruit.x > this.x){
		return Number(1);
	}
	else if (this.direction == 'down' && fruit.y == this.y && this.x > fruit.x ) {
		return Number(1);
	}
	else if (this.direction == 'left' && fruit.x == this.x && this.y > fruit.y) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.x == this.x && fruit.y > this.y) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.distFruitFront = function(fruit) {
	if (this.direction == 'up'){
		return this.y - fruit.y;
	}
	else if (this.direction == 'down') {
		return fruit.y - this.y;
	}
	else if (this.direction == 'left') {
		return this.x - fruit.x;
	}
	else if (this.direction == 'right') {
		return fruit.x - this.x;
		
	}
}

Snake.prototype.distFruitSide = function(fruit) {
	if (this.direction == 'up'){
		return fruit.x - this.x;
	}
	else if (this.direction == 'down') {
		return this.x - fruit.x;
	}
	else if (this.direction == 'left') {
		return this.y - fruit.y;
	}
	else if (this.direction == 'right') {
		return fruit.y - this.y;
	}
}

Snake.prototype.distWallBodyLeftSide = function() {
	return this.distLeft();
}

Snake.prototype.distWallBodyRightSide = function() {
	return -this.distRight();
}

Snake.prototype.distWallBodyFrontSide = function() {
	return -this.distFront();
}

Snake.prototype.distWallBodyBackSide = function() {
	return this.distBack();
}

// if right side is wider than left side return 1, if same return 0, else return -1;
Snake.prototype.nearWallBodySide = function() {
	if (this.distLeft() == this.distRight()) {
		return Number(0);
	}
	if (this.distLeft() < this.distRight()) {
		return Number(1);
	}
	if (this.distLeft() > this.distRight()) {
		return Number(-1);
	}
}

// if front side is wider than back side return -1, if same return 0, else return 1;
Snake.prototype.nearWallBodyFront = function() {
	if (this.distFront() == this.distBack()) {
		return Number(0);
	}
	if (this.distFront() < this.distBack()) {
		return Number(-1);
	}
	if (this.distFront() > this.distBack()) {
		return Number(1);
	}
}

Snake.prototype.distTopWall = function() {
	return this.y - this.canvasY;
}

Snake.prototype.distLeftWall = function() {
	return this.x - this.canvasX;
}

Snake.prototype.distBottomWall = function() {
	return this.canvasY + this.canvasHeight - this.y;
}

Snake.prototype.distRightWall = function() {
	return this.canvasX + this.canvasWidth - this.x;
}

Snake.prototype.hitFront = function() {
	return this.distFront() <= this.bodySize ? Number(-1) : Number(1);
}
Snake.prototype.hitBack = function() {
	return this.distBack() <= this.bodySize ? Number(-1) : Number(1);
}
Snake.prototype.hitLeft = function() {
	return this.distLeft() <= this.bodySize ? Number(-1) : Number(1);
}
Snake.prototype.hitRight = function() {
	return this.distRight() <= this.bodySize ? Number(-1) : Number(1);
}

Snake.prototype.distFront = function() {
	if (this.direction == 'up'){
		return this.distTopBody();
	}
	else if (this.direction == 'down') {
		return this.distBottomBody();
	}
	else if (this.direction == 'left') {
		return this.distLeftBody();
	}
	else if (this.direction == 'right') {
		return this.distRightBody();
	}
}

Snake.prototype.distBack = function() {
	if (this.direction == 'up'){
		return this.distBottomBody();
	}
	else if (this.direction == 'down') {
		return this.distTopBody();
	}
	else if (this.direction == 'left') {
		return this.distRightBody();
	}
	else if (this.direction == 'right') {
		return this.distLeftBody();
	}
}

Snake.prototype.distLeft = function() {
	if (this.direction == 'up'){
		return this.distLeftBody();
	}
	else if (this.direction == 'down') {
		return this.distRightBody();
	}
	else if (this.direction == 'left') {
		return this.distBottomBody();
	}
	else if (this.direction == 'right') {
		return this.distTopBody();
	}
}

Snake.prototype.distRight = function() {
	if (this.direction == 'up'){
		return this.distRightBody();
	}
	else if (this.direction == 'down') {
		return this.distLeftBody();
	}
	else if (this.direction == 'left') {
		return this.distTopBody();
	}
	else if (this.direction == 'right') {
		return this.distBottomBody();
	}
}

Snake.prototype.distTopBody = function() {
	var minDist = this.distTopWall();
	for (var i = 0; i < this.tailLength; i++) {
		if (this.x == this.tailX[i]) {
			var dist = this.y - this.tailY[i];
			if (dist > 0 && dist < minDist) {
				minDist = dist;
			}
		}
	}
	return minDist;
}

Snake.prototype.distBottomBody = function() {
	var minDist = this.distBottomWall();
	for (var i = 0; i < this.tailLength; i++) {
		if (this.x == this.tailX[i]) {
			var dist = this.tailY[i] - this.y;
			if (dist > 0 && dist < minDist) {
				minDist = dist;
			}
		}
	}
	return minDist;
}

Snake.prototype.distLeftBody = function() {
	var minDist = this.distLeftWall();
	for (var i = 0; i < this.tailLength; i++) {
		if (this.y == this.tailY[i]) {
			var dist = this.x - this.tailX[i];
			if (dist > 0 && dist < minDist) {
				minDist = dist;
			}
		}
	}
	return minDist;
}

Snake.prototype.distRightBody = function() {
	var minDist = this.distRightWall();
	for (var i = 0; i < this.tailLength; i++) {
		if (this.y == this.tailY[i]) {
			var dist = this.tailX[i] - this.x;
			if (dist > 0 && dist < minDist) {
				minDist = dist;
			}
		}
	}
	return minDist;
}

Snake.prototype.hitTop = function() {
	if (this.y == this.canvasY) {
		return Number(1);
	}
	for (var i = 0; i < this.tailLength; i++) {
		if (this.y - this.bodySize == this.tailY[i] && this.x == this.tailX[i]) {
			return Number(1);
		}
	}
	return Number(0);
}

Snake.prototype.hitRight = function() {
	if (this.x == this.canvasX + this.canvasWidth - this.bodySize) {
		return Number(1);
	}
	for (var i = 0; i < this.tailLength; i++) {
		if (this.x + this.bodySize == this.tailX[i] && this.y == this.tailY[i]) {
			return Number(1);
		}
	}
	return Number(0);
}

Snake.prototype.hitBottom = function() {
	if (this.y == this.canvasY + this.canvasHeight - this.bodySize) {
		return Number(1);
	}
	for (var i = 0; i < this.tailLength; i++) {
		if (this.y + this.bodySize == this.tailY[i] && this.x == this.tailX[i]) {
			return Number(1);
		}
	}
	return Number(0);
}

Snake.prototype.hitLeft = function() {
	if (this.x == this.canvasX) {
		return Number(1);
	}
	for (var i = 0; i < this.tailLength; i++) {
		if (this.x - this.bodySize == this.tailX[i] && this.y == this.tailY[i]) {
			return Number(1);
		}
	}
	return Number(0);
}

Snake.prototype.fruitInTopLeft = function(fruit) {
	return (this.x > fruit.x && this.y > fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInTopRight = function(fruit) {
	return (this.x < fruit.x && this.y > fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInBottomLeft = function(fruit) {
	return (this.x > fruit.x && this.y < fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInBottomRight = function(fruit) {
	return (this.x < fruit.x && this.y < fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInLeft = function(fruit) {
	return (this.x < fruit.x && this.y == fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInRight = function(fruit) {
	return (this.x > fruit.x && this.y == fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInFront = function(fruit) {
	return (this.x == fruit.x && this.y > fruit.y) ? Number(1) : Number(0);
}

Snake.prototype.fruitInBack = function(fruit) {
	return (this.x == fruit.x && this.y < fruit.y) ? Number(1) : Number(0);
}