function setup() {
	console.log("============ Setup ================");
	canvasOuterWidth = 1400;
	canvasOuterHeight = 1000;
	canvasWidth = 100;
	canvasHeight = 100;
	createCanvas(canvasOuterWidth, canvasOuterHeight);
	frameRate(200)
	bodySize = 5;
	fruits = [];
	snakes = [];
// 	network = new SnakeNeuralNetwork();
	dnaWeightsSize = 20*20 + 20*20 + 20*3;
	dnaBiasesSize = 20 + 20 + 3;
	numRow = 8;
	numCol = 8;
	numSnake = numRow * numCol;
	ga = new GA();
	gen = 1;
	maxFitness = 0;
	maxDna = [];
// 	for (var i = 0; i < numCol; i++) {
// 		for (var j = 0; j < numRow; j++) {
// 			fruits.push(new Fruit(j * canvasWidth, i * canvasWidth, canvasWidth, canvasHeight, bodySize));	
// 			snakes.push(new Snake(canvasWidth/2, canvasHeight/2, j * canvasWidth, i * canvasWidth, canvasWidth, canvasHeight, bodySize, generateDna(dnaSize)));
// 		}
// 	}
// 	fruits.push(new Fruit(200, 0, canvasWidth, canvasHeight, bodySize));
// 	fruits.push(new Fruit(0, 200, canvasWidth, canvasHeight, bodySize));
// 	fruits.push(new Fruit(200, 200, canvasWidth, canvasHeight, bodySize));
// 	snakes.push(new Snake(canvasWidth/2, canvasHeight/2, 0, 0, canvasWidth, canvasHeight, bodySize));
// 	snakes.push(new Snake(canvasWidth/2, canvasHeight/2, 200, 0, canvasWidth, canvasHeight, bodySize));
// 	snakes.push(new Snake(canvasWidth/2, canvasHeight/2, 0, 200, canvasWidth, canvasHeight, bodySize));
// 	snakes.push(new Snake(canvasWidth/2, canvasHeight/2, 200, 200, canvasWidth, canvasHeight, bodySize));
	loopGen();
}

function sortScore(snakes) {
// 	console.log(snakes.length);
	var sortable = [];
	for (var i = 0; i < snakes.length; i++) {
		sortable.push({snakeNo: i, snake: snakes[i]});
	}
// 	console.log("Before sort: ");
// 	for (var i = 0; i < sortable.length; i++) {
// 		console.log(sortable[i].snakeNo + " " + sortable[i].snake.score);
// 	}
	var sortable2 = sortable.sort(function(a, b){
		return Number(b.snake.score) - Number(a.snake.score);
	});
// 	console.log("After sort: ");
// 	for (var i = 0; i < sortable2.length; i++) {
// 		console.log(sortable2[i].snakeNo + " " + sortable2[i].snake.score);
// 	}
	return sortable2;
}

function getHighestSnake(sortable, rank) {
	return sortable[rank].snake;
}

function loopGen() {
	if (gen == 1) {
		for (var i = 0; i < numCol; i++) {
			for (var j = 0; j < numRow; j++) {
				var fruit = new Fruit(j * canvasWidth, i * canvasWidth, canvasWidth, canvasHeight, bodySize);	
				var snake = new Snake(canvasWidth/2, canvasHeight/2, j * canvasWidth, i * canvasWidth, canvasWidth, canvasHeight, bodySize, generateDna(dnaWeightsSize, dnaBiasesSize), 'random');
				fruit.createRandomLocWithSnake(snake);
				fruits.push(fruit);
				snakes.push(snake);
			}
		}
	}
	else {
		console.log("aaaz");
		var sortable = sortScore(snakes);
// 		console.log(sortable);
		var rank1Snake = getHighestSnake(sortable, 0);
		var rank2Snake = getHighestSnake(sortable, 1);
		var rank3Snake = getHighestSnake(sortable, 2);
		var rank4Snake = getHighestSnake(sortable, 3);
// 		console.log("1st score: " + rank1Snake.score + );
		if (rank1Snake.score > maxFitness) {
			maxFitness = rank1Snake.score;
// 			maxDna = [];
// 			for (var i = 0; i < rank1Snake.dna.length; i++) {
// 				maxDna.push(rank1Snake.dna[i]);
// 			}
		}
// 		console.log("1st: " + rank1Snake.score/*  + " " + rank1Snake.snakeNo */);
// 		console.log("2nd: " + rank2Snake.score/*  + " " + rank2Snake.snakeNo */);
// 		console.log("3rd: " + rank3Snake.score/*  + " " + rank3Snake.snakeNo */);
// 		console.log("4th: " + rank4Snake.score/*  + " " + rank3Snake.snakeNo */);
		genes = []
/*
		for (var i = 0; i < numSnake / 4; i++) { // 32 snakes (champion and first-runner up snake)
// 			var dnaChildren = ga.cross(rank1Snake.dna, rank2Snake.dna);
// 			var dnaChild1 = dnaChildren.dna1;
// 			var dnaChild2 = dnaChildren.dna2;
 			var dnaMutateChild1 = ga.mutate(rank1Snake.dna);
			var dnaMutateChild2 = ga.mutate(rank2Snake.dna);
			dnas.push(dnaMutateChild1);
			dnas.push(dnaMutateChild2);
		}
*/
// 		genes.push({dna: maxDna, dnaType: 'King'});
		genes.push({dna: rank1Snake.snakeDna, dnaType: '1st'});
		genes.push({dna: rank2Snake.snakeDna, dnaType: '2nd'});
		genes.push({dna: rank3Snake.snakeDna, dnaType: '3rd'});
		genes.push({dna: rank4Snake.snakeDna, dnaType: '4th'});
		/*
		for (var i = 0; i < 8; i++) { 
			var geneChildren = ga.uniformCrossover(rank1Snake.dna, rank2Snake.dna);
			var geneChild1 = {dna: geneChildren.gene1.dna, dnaType: geneChildren.gene1.dnaType};
			var geneChild2 = {dna: geneChildren.gene2.dna, dnaType: geneChildren.gene2.dnaType}
			genes.push(geneChild1);
			genes.push(geneChild2);
		}
		for (var i = 0; i < 14; i++) { 
			var geneChildren = ga.intermediateCrossover25(rank1Snake.dna, rank2Snake.dna, "intermediate Cross 1 2");
			genes.push({dna: geneChildren.dna, dnaType: geneChildren.dnaType});
		}
		*/
		for (var i = 0; i < 30; i++) {
			var snake1 = getHighestSnake(sortable, Math.floor(Math.random() * 10));
			var snake2 = getHighestSnake(sortable, Math.floor(Math.random() * 10));
			var geneChildren = ga.uniformCrossover(snake1.snakeDna, snake2.snakeDna, "uniform crossover");
			var geneChild1 = {dna: geneChildren.gene1.dna, dnaType: geneChildren.gene1.dnaType};
			var geneChild2 = {dna: geneChildren.gene2.dna, dnaType: geneChildren.gene2.dnaType}
			genes.push(geneChild1);
			genes.push(geneChild2);
		}
		/*
		for (var i = 0; i < 30; i++) {
			var snake1 = getHighestSnake(sortable, Math.floor(Math.random() * 10));
			var snake2 = getHighestSnake(sortable, Math.floor(Math.random() * 10));
			var geneChildren = ga.intermediateCrossover25(snake1.dna, snake2.dna, "intermediate Cross random");
			genes.push({dna: geneChildren.dna, dnaType: geneChildren.dnaType});
		}
		for (var i = 0; i < 5; i++) { 
			var snake1 = getHighestSnake(sortable, Math.floor(Math.random() * 10));
			var geneChildren = ga.mutateNeg(snake1.dna, 0.5);
			genes.push({dna: geneChildren.dna, dnaType: geneChildren.dnaType});
		}
		for (var i = 0; i < 5; i++) { 
			var snake1 = getHighestSnake(sortable, Math.floor(Math.random() * 10));
 			var geneChildren = ga.mutateRange(snake1.dna, 0.5);
			genes.push({dna: geneChildren.dna, dnaType: geneChildren.dnaType});
		}
		*/
		/*
		for (var i = 0; i < numSnake / 8; i++) { // 16 snakes (children of champion and second-runner up snake)
			var dnaChildren = ga.cross(rank1Snake.dna, rank3Snake.dna);
			var dnaChild1 = dnaChildren.dna1;
			var dnaChild2 = dnaChildren.dna2;
			var dnaMutateChild1 = ga.mutate(dnaChild1);
			var dnaMutateChild2 = ga.mutate(dnaChild2);
			dnas.push(dnaMutateChild1);
			dnas.push(dnaMutateChild2);
		}
		for (var i = 0; i < numSnake / 8; i++) { // 16 snakes (children of first-runner up and second-runner up snake)
			var dnaChildren = ga.cross(rank2Snake.dna, rank3Snake.dna);
			var dnaChild1 = dnaChildren.dna1;
			var dnaChild2 = dnaChildren.dna2;
			var dnaMutateChild1 = ga.mutate(dnaChild1);
			var dnaMutateChild2 = ga.mutate(dnaChild2);
			dnas.push(dnaMutateChild1);
			dnas.push(dnaMutateChild2);
		}
		for (var i = 0; i < numSnake / 4; i++) { // 16 random snakes
			var chosen = false;
			while (!chosen) {
				var index = Math.floor(Math.random() * sortable.length);
				if(snakes[index].score > 0) {
					dnas.push(snakes[index].dna);
					chosen = true;
				}	
			} 
			var index = Math.floor(Math.random() * sortable.length);
			dnas.push(snakes[index].dna);
		}
		*/
		fruits = [];
		snakes = [];
		
		for (var i = 0; i < sortable; i++) {
// 			console.log("new dna " + i + ": " + dnas[i]);
		}
		for (var i = 0; i < numCol; i++) {
			for (var j = 0; j < numRow; j++) {
				var fruit = new Fruit(j * canvasWidth, i * canvasWidth, canvasWidth, canvasHeight, bodySize);	
				var snake = new Snake(canvasWidth/2, canvasHeight/2, j * canvasWidth, i * canvasWidth, canvasWidth, canvasHeight, bodySize, genes[i * numCol + j].dna, genes[i * numCol + j].dnaType);
				fruit.createRandomLocWithSnake(snake);
				fruits.push(fruit);
				snakes.push(snake);
			}
		}
	}
// 	for (var i = 0; i < snakes.length; i++) {
// 		var str = "";
// 		for (var j = 0; j < snakes[i].dna.length; j++){
// 			var value = snakes[i].dna[j]
// 			var weight = Math.floor(value*10).toFixed(0);
// 			str = str + (value >= 0 ? "+" : "-");
// 			str = str + weight.slice(-1)
// 			str = str + snakes[i].dna[j].toString() + " "
// 		}
// 		console.log("Gene " + i + ": " + str);
// 	}
}

function generateDna(dnaWeightsSize, dnaBiasesSize) {
	weightsDna = [];
	biasesDna = [];
	for (var i = 0; i < dnaWeightsSize; i++) {
		weightsDna.push(Math.random() * 40 - 20);
	}
	for (var i = 0; i < dnaBiasesSize; i++) {
		biasesDna.push(Math.random() * 40 - 20);
	}
// 	console.log("dna: " + dna);
	return new SnakeNeuralNetworkDna(weightsDna, biasesDna);
}

function allDead() {
	for (var i = 0; i < numSnake; i++) {
		if (!snakes[i].isDead) {
			return false;
		}
	}
	return true;
}

function draw() {
	background(0, 0, 0);
// 	stroke(255, 255, 255);
// 	line(400, 0, 400, 400);
// 	line(200, 0, 200, 400);
// 	line(0, 200, 400, 200);
// 	fill(255);
// 	textSize(30);
// 	text("Score: " + snakes[i].score, 400 + 10, 100);
	textSize(15);
	text("Gen: " + gen, 800 + 10, 20);
	text("Max: " + maxFitness, 800 + 80, 20);
	textSize(10);
// 	fill(255);
	text("Snake", 800 + 10, 30);
	text("Score", 800 + 50, 30);
	text("Health", 800 + 90, 30);
	text("DNA", 800 + 130, 30);
	for (var i = 0; i < fruits.length; i++) {
		var lineX1 = fruits[i].canvasX;
		var lineY1 = fruits[i].canvasY;
		var lineX2 = fruits[i].canvasX + fruits[i].canvasWidth;	
		var lineY2 = fruits[i].canvasY + fruits[i].canvasHeight;
		stroke(255, 255, 255);
		line(lineX1, lineY1, lineX1, lineY2);
		line(lineX1, lineY1, lineX2, lineY1);
		line(lineX2, lineY1, lineX2, lineY2);
		line(lineX1, lineY2, lineX2, lineY2);
		
		fill(255);
		textSize(10);
		text(i + ": ", 800 + 10, i * 12 + 40);
		text(snakes[i].score, 800 + 50, i * 12 + 40);
		text(snakes[i].health, 800 + 90, i * 12 + 40);
		text(snakes[i].dnaType, 800 + 130, i * 12 + 40);
//		console.log(lineX1 + " " + lineY1 + " " + lineX1 + " " + lineY2);
//		console.log(lineX1 + " " + lineY1 + " " + lineX2 + " " + lineY1);
//		console.log(lineX2 + " " + lineY1 + " " + lineX2 + " " + lineY2);
//		console.log(lineX1 + " " + lineY2 + " " + lineX2 + " " + lineY2);
// 		line(fruits[i].canvasX, fruits[i].canvasY, fruits[i].canvasWidth + fruits[i].canvasX, fruits[i].canvasY);
// 		line(fruits[i].canvasX, fruits[i].canvasY, fruits[i].canvasWidth + fruits[i].canvasX, fruits[i].canvasY);	
// 		textSize(10);
// 		text("Hit top: " + snakes[i].hitTop(), canvasWidth + 10, 200);
// 		text("Hit right: " + snakes[i].hitRight(), canvasWidth + 10, 215);
// 		text("Hit down: " + snakes[i].hitBottom(), canvasWidth + 10, 230);
// 		text("Hit left: " + snakes[i].hitLeft(), canvasWidth + 10, 245);
	
// 		var isDead = false;
		if (!snakes[i].isDead) {
			/// test
// 			var network = new SnakeNeuralNetwork();
// 			network.setRandomDNA();
// 			network.setNetwork(snakes[i]);
			if (i == 0) {
// 				console.log("Road Info " + i + ": " + snakes[i].getRoadInfo(fruits[i]).toString());
			}
			if (i == 0) {
// 				console.log("===============i = " + 1);
			}
			if (i == 0) {
// 				console.log(snakes[i].x + " " + snakes[i].y + " " + snakes[i].canvasX + " " + snakes[i].canvasY);
			}
			
			var networkValue = snakes[i].calculateMove(fruits[i]);

	// 		text("Value[0]: " + networkValue[0].toFixed(2), canvasWidth + 100, 200);
	// 		text("Value[1]: " + networkValue[1].toFixed(2), canvasWidth + 100, 215);
	// 		text("Value[2]: " + networkValue[2].toFixed(2), canvasWidth + 100, 230);
	// 		text("Value[3]: " + networkValue[3].toFixed(2), canvasWidth + 100, 245);
			var maxValue = networkValue[0];
			var maxIndex = 0;
			for (var j = 1; j < networkValue.length; j++) {
				if (Number(networkValue[j]) > Number(maxValue)) {
					maxValue = networkValue[j];
					maxIndex = j;
				}
			}
	// 		text("Max Value: " + maxIndex + " " + maxValue.toFixed(2), canvasWidth + 10, 175);
			if (i == 0) {
	// 			console.log("Road Info " + i + ": " + snakes[i].getRoadInfo(fruits[i]).toString());
	// 			console.log("Move " + i + ": " + maxIndex + " " + networkValue.toString());
			}
		
			if (maxIndex == 2) {
				if (snakes[i].direction == 'up') {
					snakes[i].moveDirection('right');
				}
				else if (snakes[i].direction == 'down') {
					snakes[i].moveDirection('left');
				}
				else if (snakes[i].direction == 'left') {
					snakes[i].moveDirection('up');
				}
				else if (snakes[i].direction == 'right') {
					snakes[i].moveDirection('down');	
				}
			}
			else if (maxIndex == 0) {
				if (snakes[i].direction == 'up') {
					snakes[i].moveDirection('left');
				}
				else if (snakes[i].direction == 'down') {
					snakes[i].moveDirection('right');
				}
				else if (snakes[i].direction == 'left') {
					snakes[i].moveDirection('down');
				}
				else if (snakes[i].direction == 'right') {
					snakes[i].moveDirection('up');	
				}
// 			snakes[i].moveDirection('down');
			}
		
/* 		else if (maxValue > 0.25) {
			snakes[i].moveDirection('left');
		}
		else if (maxValue >= 0) {
			snakes[i].moveDirection('right');
		} */
/* 			if (maxValue > 0.5) {
				if (maxIndex == 0) {
					snakes[i].moveDirection('up');	
				}
				else if (maxIndex == 1) {
					snakes[i].moveDirection('left');
				}
				else if (maxIndex == 2) {
					snakes[i].moveDirection('down');
				}
				else if (maxIndex == 3) {
					snakes[i].moveDirection('right');
				}
// 				if (snakes[i].die()) {
// 					setup();
// 				}
// 				snakes[i].eat(fruits[i]);
			}*/
			/// end of test
		
			snakes[i].moveContinuous();
	
			snakes[i].isDead = snakes[i].die(fruits[i]);
				//setup();
// 				isDead = true;
			snakes[i].eat(fruits[i]);
			if (!(snakes[i].isDead)) {
				snakes[i].draw();
				fruits[i].draw();				
			}
		}
		if (allDead()) {
// 			setup();
			gen++;
			loopGen();
		}
	}
}

function keyTyped() {
	var i = 0;
	if (key === 'w') {
		snakes[i].moveDirection('up')	
	}
	else if (key === 'a') {
		snakes[i].moveDirection('left')
	}
	else if (key === 's') {
		snakes[i].moveDirection('down')
	}
	else if (key === 'd') {
		snakes[i].moveDirection('right')
	}
//	if (snakes[i].die()) {
//		setup();
//	}
	snakes[i].eat(fruits[i]);
}