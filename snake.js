var Snake = function(index, x, y, canvasX, canvasY, canvasWidth, canvasHeight, bodySize, snakeDna, dnaType, layersNums){
	this.index = index;
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
	this.layersNums = layersNums;
	this.neuralNetwork = new SnakeNeuralNetwork(this.snakeDna, layersNums);
	this.dnaType = dnaType;
	this.noBoundary = false;
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
	this.score--;
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
	if (this.noBoundary) {
		if (newY > this.canvasY + this.canvasHeight - this.bodySize) {
			newY = this.canvasY;
		}
		if (newY < this.canvasY) {
			newY = this.canvasY + this.canvasHeight - this.bodySize;
		}
		if (newX > this.canvasX + this.canvasWidth - this.bodySize) {
			newX = this.canvasX;
		}
		if (newX < this.canvasX) {
			newX = this.canvasX + this.canvasWidth - this.bodySize;
		}
	}
	this.x = newX;
	this.y = newY;
}

Snake.prototype.eat = function(fruit) {
	distance = dist(this.x, this.y, fruit.x, fruit.y);
	if (distance < this.bodySize/2) {
// 	if (this.x == fruit.x && this.y == fruit.y)
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
	if (this.health <= 50) {
		fill(255, 0, 255)
	} //else {
	//	fill(255, 255, 255)
	//}
	rect(this.x, this.y, this.bodySize, this.bodySize)
	for (var i = 0; i < this.tailLength; i++) {
		rect(this.tailX[i], this.tailY[i], this.bodySize, this.bodySize);
	}
}

Snake.prototype.drawDeath = function() {
//	textSize(20);
//	text(this.score, this.canvasX + 30, this.canvasY + 30);
}

Snake.prototype.getRoadInfo2 = function(fruit) {
	info = [];
	var numRoadInfo = 3 * (this.canvasX / this.bodySize) * (this.canvasY / this.bodySize); // 400 * 3
	for (var i = 0; i < numRoadInfo; i++) {
		info.push(Number(0));
	}
	// first 100; snake head
	info[this.convertPosToIndex(this.x, this.y)] = Number(1);
	// second 100: snake body
	for (var i = 0; i < this.tailLength; i++) {
		info[400 + this.convertPosToIndex(this.tailX[i], this.tailY[i])] = Number(1);
	}
	
	// third 100; fruit
	info[800 + this.convertPosToIndex(fruit.x, fruit.y)] = Number(1);
	return info;
}

Snake.prototype.convertPosToIndex = function(x, y) {
	var col = (x - this.canvasX)/this.bodySize;
	var row = (y - this.canvasY)/this.bodySize;
	return row * (this.canvasWidth) + col;
}

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
// 	info.push((this.distFrontFace() / this.longestDist));
// 	info.push((this.distBackFace() / this.longestDist));
// 	info.push((this.distLeftFace() / this.longestDist));
// 	info.push((this.distRightFace() / this.longestDist));

//18
// 	info.push(this.hitFront());
// 	info.push(this.hitBack());
// 	info.push(this.hitLeft());
// 	info.push(this.hitRight());
// 	info.push(this.nearWallBodyFront());
// 	info.push(this.nearWallBodySide());
// 	info.push((this.distWallBodyFrontSideFace() / this.longestDist));
// 	info.push((this.distWallBodyBackSideFace() / this.longestDist));




 	// Face view
 	// boolean value
//  	info.push(this.fruitInFrontFace(fruit));
// 	info.push(this.fruitInBackFace(fruit));
//  	info.push(this.fruitInLeftFace(fruit));
//  	info.push(this.fruitInRightFace(fruit));
// 	info.push(this.fruitInFrontLeftFace(fruit))
// 	info.push(this.fruitInFrontRightFace(fruit))
//  	info.push(this.fruitInClosestFrontFace(fruit));
//  	info.push(this.fruitInClosestLeftFace(fruit));
// 	info.push(this.fruitInClosestRightFace(fruit));
	
// 	info.push(this.hitFrontWallFace());
// 	info.push(this.hitLeftWallFace());
// 	info.push(this.hitRightWallFace());
// 	info.push(this.hitFrontBodyFace());
// 	info.push(this.hitLeftBodyFace());
// 	info.push(this.hitRightBodyFace());
	
	// distance value
//	info.push((this.distFruitFrontFace(fruit) / this.longestDist));
// 	info.push((this.distFruitSideFace(fruit) / this.longestDist));
// 	info.push((this.distWallBodyFrontSideFace() / this.longestDist));
// 	info.push((this.distWallBodyLeftSideFace() / this.longestDist));
// 	info.push((this.distWallBodyRightSideFace() / this.longestDist));
/*  	info.push(this.canMoveFrontFace());
 	info.push(this.canMoveLeftFace());
 	info.push(this.canMoveRightFace());	 */
  	

	  	info.push(this.canMoveFrontFace2(1));
	  		  	info.push(this.canMoveFrontFace2(2));  	
  	for (var i = 1; i <= 5; i++) {
	 	info.push(this.canMoveLeftFace2(i));
	 	info.push(this.canMoveRightFace2(i));	  		
  	}
  	/*
  	info.push(this.canMoveFrontFace2(1));
 	info.push(this.canMoveLeftFace2(1));
 	info.push(this.canMoveRightFace2(1));	
  	info.push(this.canMoveFrontFace2(2));
 	info.push(this.canMoveLeftFace2(2));
 	info.push(this.canMoveRightFace2(2));	
 	info.push(1 - this.hasObjectFace(-1, 1));
	info.push(1 - this.hasObjectFace(1, 1));
	*/

/*
	var matrixSize = 20;

 	for (var y = matrixSize; y >= -matrixSize; y--) {
//	for (var y = matrixSize; y >= 0; y--) {		
		for (var x = -matrixSize; x <= matrixSize; x++) {
// 			console.log(x + " " + y)
			if (x != 0 || y != 0) {
				info.push(this.hasObjectFace(x, y));
			}
		}
	}  	
*/
/* 	
 	info.push(this.hasObjectFace(-1, 1));
 	info.push(this.hasObjectFace(0, 1));
 	info.push(this.hasObjectFace(1, 1)); 	
 	info.push(this.hasObjectFace(-1, 0));
 	info.push(this.hasObjectFace(0, 0));
 	info.push(this.hasObjectFace(1, 0)); 	
 	info.push(this.hasObjectFace(-1, -1));
 	info.push(this.hasObjectFace(0, -1));
 	info.push(this.hasObjectFace(1, -1));
 */	
 	
//  	info.push(this.turnLeftIfHitFront());
  	info.push(this.fruitInFrontFace2(fruit));
 	info.push(this.fruitInLeftFace2(fruit));
 	info.push(this.fruitInRightFace2(fruit));
 	
 	
/*
 	if (this.index == 0) {
 	 	var rowCol = matrixSize * 2 + 1
	 	console.log('---------')
	 	for (var i = 0; i < rowCol; i++) {
	 		console.log(info.slice(i * rowCol, i * rowCol + rowCol).toString())
	 	}
// 	 	console.log(info.slice(0, 3).toString())
// 	 	console.log(info.slice(3, 6).toString())
// 	 	console.log(info.slice(6, 9).toString())
	 	console.log(this.x + " " + this.y + " " + this.tailX.toString() + " " + this.tailY.toString())
 	}
 */	
	// Map view
	// boolean value
	
	// distance value
//	info.push((this.diagDist - dist(this.x, this.y, fruit.x, fruit.y)) / this.diagDist);
	
	
	// TODO should add distBack etc?
	
	/*
	info.push(this.fruitInFront(fruit));
	info.push(this.fruitInLeft(fruit));
	info.push(this.fruitInRight(fruit));
	info.push(this.hitFrontWallFace());
	info.push(this.hitLeftWallFace());
	info.push(this.hitRightWallFace());
	info.push(this.hitFrontBodyFace());
	info.push(this.hitLeftBodyFace());
	info.push(this.hitRightBodyFace());
	info.push(this.nearWallBodySide());
	*/
	if (this.index == 0) {
		console.log(info.length);
	}
	return info;
}

Snake.prototype.hasObjectFace = function(x, y) {
	if (this.direction == 'up') {
		return this.hasObjectMap(x, -y);
	}
	if (this.direction == 'down') {
		return this.hasObjectMap(-x, y);
	}
	if (this.direction == 'left') {
		return this.hasObjectMap(-y, x);
	}
	if (this.direction == 'right') {
		return this.hasObjectMap(y, -x);
	}
	return Number(-1); // error
}

Snake.prototype.hasObjectMap = function(x, y) {
	var newX = this.x + x * this.bodySize;
	var newY = this.y + y * this.bodySize;
	if (newX < this.canvasX || newX + this.bodySize > this.canvasX + this.canvasWidth) {
		return Number(1);
	}
	if (newY < this.canvasY || newY + this.bodySize > this.canvasY + this.canvasHeight) {
		return Number(1);
	}
	for (var i = 0; i < this.tailLength; i++) {
		if (newX == this.tailX[i] && newY == this.tailY[i]) {
			return Number(1);
		}
	}
	return Number(0);
}

Snake.prototype.turnLeftIfHitFront = function() {
	return this.distWallBodyLeftSideFace() > this.distWallBodyRightSideFace() ? Number(1) : Number(0);
}

Snake.prototype.canMoveFrontFace2 = function(size) {
	return (this.hitFrontWallFace2(size) == Number(1) || this.hitFrontBodyFace2(size) == Number(1)) ? Number(0) : Number(1);
}

Snake.prototype.canMoveLeftFace2 = function(size) {
	return (this.hitLeftWallFace2(size) == Number(1) || this.hitLeftBodyFace2(size) == Number(1)) ? Number(0) : Number(1);
}

Snake.prototype.canMoveRightFace2 = function(size) {
	return (this.hitRightWallFace2(size) == Number(1) || this.hitRightBodyFace2(size) == Number(1)) ? Number(0) : Number(1);
}

Snake.prototype.canMoveFrontFace = function() {
	return (this.hitFrontWallFace() == Number(1) || this.hitFrontBodyFace() == Number(1)) ? Number(0) : Number(1);
}

Snake.prototype.canMoveLeftFace = function() {
	return (this.hitLeftWallFace() == Number(1) || this.hitLeftBodyFace() == Number(1)) ? Number(0) : Number(1);
}

Snake.prototype.canMoveRightFace = function() {
	return (this.hitRightWallFace() == Number(1) || this.hitRightBodyFace() == Number(1)) ? Number(0) : Number(1);
}

Snake.prototype.fruitInClosestFrontFace = function(fruit) {
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

Snake.prototype.fruitInClosestLeftFace = function(fruit) {
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

Snake.prototype.fruitInClosestRightFace = function(fruit) {
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

Snake.prototype.fruitInFrontLeftFace = function(fruit) {
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

Snake.prototype.fruitInFrontRightFace = function(fruit) {
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

Snake.prototype.fruitInFrontFace2 = function(fruit) {
	if (this.direction == 'up' && fruit.y > this.y){
		return Number(1);
	}
	else if (this.direction == 'down' && this.y > fruit.y ) {
		return Number(1);
	}
	else if (this.direction == 'left' && this.x > fruit.x) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.x > this.x) {
		return Number(1);
	}
	return Number(0);
}

Snake.prototype.fruitInLeftFace2 = function(fruit) {
	if (this.direction == 'up' && fruit.x < this.x){
		return Number(1);
	}
	else if (this.direction == 'down' && this.x < fruit.x ) {
		return Number(1);
	}
	else if (this.direction == 'left' && this.y < fruit.y) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.y < this.y) {
		return Number(1);
	}
	return Number(0);
}

Snake.prototype.fruitInRightFace2 = function(fruit) {
	if (this.direction == 'up' && fruit.x > this.x){
		return Number(1);
	}
	else if (this.direction == 'down' &&  this.x > fruit.x ) {
		return Number(1);
	}
	else if (this.direction == 'left' && this.y > fruit.y) {
		return Number(1);
	}
	else if (this.direction == 'right' && fruit.y > this.y) {
		return Number(1);
	}
	return Number(0);
}

Snake.prototype.fruitInFrontFace = function(fruit) {
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
	return Number(0);
}

Snake.prototype.fruitInBackFace = function(fruit) {
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
	return Number(0);
}

Snake.prototype.fruitInLeftFace = function(fruit) {
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
	return Number(0);
}

Snake.prototype.fruitInRightFace = function(fruit) {
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
	return Number(0);
}

Snake.prototype.distFruitFrontFace = function(fruit) {
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

Snake.prototype.distFruitSideFace = function(fruit) {
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

Snake.prototype.distWallBodyLeftSideFace = function() {
	return this.distLeftFace();
}

Snake.prototype.distWallBodyRightSideFace = function() {
	return -this.distRightFace();
}

Snake.prototype.distWallBodyFrontSideFace = function() {
	return -this.distFrontFace();
}

Snake.prototype.distWallBodyBackSideFace = function() {
	return this.distBackFace();
}

// if right side is wider than left side return 1, if same return 0, else return -1;
Snake.prototype.nearWallBodySide = function() {
	if (this.distLeftFace() == this.distRightFace()) {
		return Number(0);
	}
	if (this.distLeftFace() < this.distRightFace()) {
		return Number(1);
	}
	if (this.distLeftFace() > this.distRightFace()) {
		return Number(-1);
	}
}

// if front side is wider than back side return -1, if same return 0, else return 1;
Snake.prototype.nearWallBodyFront = function() {
	if (this.distFrontFace() == this.distBackFace()) {
		return Number(0);
	}
	if (this.distFrontFace() < this.distBackFace()) {
		return Number(-1);
	}
	if (this.distFrontFace() > this.distBackFace()) {
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
	return this.distFrontFace() <= this.bodySize ? Number(-1) : Number(1);
}
Snake.prototype.hitBack = function() {
	return this.distBackFace() <= this.bodySize ? Number(-1) : Number(1);
}
Snake.prototype.hitLeft = function() {
	return this.distLeftFace() <= this.bodySize ? Number(-1) : Number(1);
}
Snake.prototype.hitRight = function() {
	return this.distRightFace() <= this.bodySize ? Number(-1) : Number(1);
}

Snake.prototype.hitFrontWallFace = function() {
	if (this.direction == 'up' && this.y == this.canvasY) {
		return Number(1);
	}
	if (this.direction == 'down' && this.y + this.bodySize == this.canvasY + this.canvasHeight) {
		return Number(1);
	}
	if (this.direction == 'left' && this.x == this.canvasX) {
		return Number(1);	
	}
	if (this.direction == 'right' && this.x + this.bodySize == this.canvasX + this.canvasHeight) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.hitLeftWallFace = function() {
	if (this.direction == 'up' && this.x == this.canvasX) {
		return Number(1);
	}
	if (this.direction == 'down' && this.x + this.bodySize == this.canvasX + this.canvasHeight) {
		return Number(1);
	}
	if (this.direction == 'left' && this.y + this.bodySize == this.canvasY + this.canvasHeight) {
		return Number(1);	
	}
	if (this.direction == 'right' && this.y == this.canvasY) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.hitRightWallFace = function() {
	if (this.direction == 'up' && this.x + this.bodySize == this.canvasX + this.canvasHeight) {
		return Number(1);
	}
	if (this.direction == 'down' && this.x == this.canvasX) {
		return Number(1);
	}
	if (this.direction == 'left' && this.y == this.canvasY) {
		return Number(1);	
	}
	if (this.direction == 'right' && this.y + this.bodySize == this.canvasY + this.canvasHeight) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.hitFrontWallFace2 = function(size) {
	if (this.direction == 'up' && this.y - (size - 1) * this.bodySize <= this.canvasY) {
		return Number(1);
	}
	if (this.direction == 'down' && this.y + size * this.bodySize >= this.canvasY + this.canvasHeight) {
		return Number(1);
	}
	if (this.direction == 'left' && this.x - (size - 1) * this.bodySize <= this.canvasX) {
		return Number(1);	
	}
	if (this.direction == 'right' && this.x + size * this.bodySize >= this.canvasX + this.canvasHeight) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.hitLeftWallFace2 = function(size) {
	if (this.direction == 'up' && this.x - (size - 1) * this.bodySize <= this.canvasX) {
		return Number(1);
	}
	if (this.direction == 'down' && this.x + size * this.bodySize >= this.canvasX + this.canvasHeight) {
		return Number(1);
	}
	if (this.direction == 'left' && this.y + size * this.bodySize >= this.canvasY + this.canvasHeight) {
		return Number(1);	
	}
	if (this.direction == 'right' && this.y - (size - 1) * this.bodySize <= this.canvasY) {
		return Number(1);
	}
	return Number(-1);
}

Snake.prototype.hitRightWallFace2 = function(size) {
	if (this.direction == 'up' && this.x + size * this.bodySize >= this.canvasX + this.canvasHeight) {
		return Number(1);
	}
	if (this.direction == 'down' && this.x - (size * this.bodySize) <= this.canvasX) {
		return Number(1);
	}
	if (this.direction == 'left' && this.y - (size * this.bodySize) <= this.canvasY) {
		return Number(1);	
	}
	if (this.direction == 'right' && this.y + size * this.bodySize >= this.canvasY + this.canvasHeight) {
		return Number(1);
	}
	return Number(-1);
}


Snake.prototype.hitLeftBodyFace2 = function(size) {
	if (this.direction == 'up') {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i]) {
				for (var j = 1; j <= size; j++) {	
					if (this.x == this.tailX[i] + j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);
	}
	if (this.direction == 'down'/* && this.x == this.canvasX*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i]){
				for (var j = 1; j <= size; j++) {	
					if (this.x == this.tailX[i] - j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);
	}
	if (this.direction == 'left'/* && this.y == this.canvasY*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i]){
				for (var j = 1; j <= size; j++) {	
					if (this.y == this.tailY[i] - j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);	
	}
	if (this.direction == 'right'/* && this.y + this.bodySize == this.canvasY + this.canvasHeight*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i]) {
				for (var j = 1; j <= size; j++) {	
					if(this.y == this.tailY[i] + j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);
	}
	return Number(-1);
}

Snake.prototype.hitRightBodyFace2 = function(size) {
	if (this.direction == 'up') {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i]) {
				for (var j = 1; j <= size; j++) {	
					if (this.x == this.tailX[i] - j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);
	}
	if (this.direction == 'down'/* && this.x == this.canvasX*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i]) {
				for (var j = 1; j <= size; j++) {
					if (this.x == this.tailX[i] + j * this.bodySize) {
						return Number(1);				
					}	
				}
			}
		}
		return Number(-1);
	}
	if (this.direction == 'left'/* && this.y == this.canvasY*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i]) {
				for (var j = 1; j <= size; j++) {
					if (this.y == this.tailY[i] + j * this.bodySize) {
						return Number(1);					
					}
				}
			}
		}
		return Number(-1);	
	}
	if (this.direction == 'right'/* && this.y + this.bodySize == this.canvasY + this.canvasHeight*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i]) {
				for (var j = 1; j <= size; j++) {
					if (this.y == this.tailY[i] - j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);
	}
	return Number(-1);
}

Snake.prototype.hitFrontBodyFace2 = function(size) {
	if (this.direction == 'up') {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i]) {
				for (var j = 1; j <= size; j++) {
					if (this.y == this.tailY[i] + j * this.bodySize) {
						return Number(1);
					}
				}
			}		
		}
		return Number(-1);
	}
	if (this.direction == 'down'/* && this.x == this.canvasX*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i]) {
				for (var j = 1; j <= size; j++) {
					if (this.y == this.tailY[i] - j * this.bodySize) {
						return Number(1);
					}					
				}
			}
		}
		return Number(-1);
	}
	if (this.direction == 'left'/* && this.y == this.canvasY*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i]){
				for (var j = 1; j <= size; j++) {
					if (this.x == this.tailX[i] + j * this.bodySize) {
						return Number(1);	
					}
				}
			}
		}
		return Number(-1);	
	}
	if (this.direction == 'right'/* && this.y + this.bodySize == this.canvasY + this.canvasHeight*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i]) {
				for (var j = 1; j <= size; j++) {
					if (this.x == this.tailX[i] - j * this.bodySize) {
						return Number(1);
					}
				}
			}
		}
		return Number(-1);
	}
	return Number(-1);
}

Snake.prototype.hitLeftBodyFace = function() {
	if (this.direction == 'up') {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i] && this.x == this.tailX[i] + this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);
	}
	if (this.direction == 'down'/* && this.x == this.canvasX*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i] && this.x == this.tailX[i] - this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);
	}
	if (this.direction == 'left'/* && this.y == this.canvasY*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i] && this.y == this.tailY[i] - this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);	
	}
	if (this.direction == 'right'/* && this.y + this.bodySize == this.canvasY + this.canvasHeight*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i] && this.y == this.tailY[i] + this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);
	}
	return Number(-1);
}

Snake.prototype.hitRightBodyFace = function() {
	if (this.direction == 'up') {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i] && this.x == this.tailX[i] - this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);
	}
	if (this.direction == 'down'/* && this.x == this.canvasX*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.y == this.tailY[i] && this.x == this.tailX[i] + this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);
	}
	if (this.direction == 'left'/* && this.y == this.canvasY*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i] && this.y == this.tailY[i] + this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);	
	}
	if (this.direction == 'right'/* && this.y + this.bodySize == this.canvasY + this.canvasHeight*/) {
		for (var i = 0; i < this.tailLength; i++) {
			if (this.x == this.tailX[i] && this.y == this.tailY[i] - this.bodySize) {
				return Number(1);
			}
		}
		return Number(-1);
	}
	return Number(-1);
}

Snake.prototype.distFrontFace = function() {
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

Snake.prototype.distBackFace = function() {
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

Snake.prototype.distLeftFace = function() {
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

Snake.prototype.distRightFace = function() {
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
/**
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
*/