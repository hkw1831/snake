function setup() {
	canvasOuterWidth = 600;
	canvasOuterHeight = 400;
	canvasWidth = 400;
	canvasHeight = 400;
	createCanvas(canvasOuterWidth, canvasOuterHeight);
	frameRate(10)
	bodySize = 10;
	fruit = new Fruit(canvasWidth, canvasHeight, bodySize);
	snake = new Snake(canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight, bodySize);
}

function draw() {
	background(0, 0, 0);
	stroke(255, 255, 255);
	line(canvasWidth, 0, canvasWidth, canvasHeight);
	fill(255);
	textSize(30);
	text("Score: " + snake.score, canvasWidth + 10, 100);
	snake.moveContinuous();
	if (snake.die()) {
		setup();
	}
	snake.eat(fruit);
	snake.draw();
	fruit.draw();
}

function keyTyped() {
	if (key === 'w') { // up
		snake.moveDirection('up')	
	}
	else if (key === 'a') { // left
		snake.moveDirection('left')
	}
	else if (key === 's') { // down
		snake.moveDirection('down')
	}
	else if (key === 'd') { // right
		snake.moveDirection('right')
	}
	if (snake.die()) {
		setup();
	}
	snake.eat(fruit);
}