Node = function(weights, biases) {
	this.weights = weights;
	this.biases = biases;
}

Node.prototype.calculate = function(inputs){
	var sumValue = 0;
	for (var i = 0; i < this.weights.length; i++) {
		sumValue += this.weights[i] * inputs[i];
	}
	sumValue += this.biases;
	return 1 / (1 + Math.exp(-sumValue));
}

Layer = function(nodes) {
	this.nodes = nodes;
}

Layer.prototype.calculate = function(inputs) {
	var outputs = [];
	for (var i = 0; i < this.nodes.length; i++) {
		outputs.push(this.nodes[i].calculate(inputs));
	}
	return outputs;
}

// at least 1 hidden layer and 1 output layer
NeuralNetwork = function(layers) {
	this.layers = layers;
}

NeuralNetwork.prototype.calculate = function(inputs) {
// 	console.log("inputs:" + inputs.toString());
	outputs = [];
	outputs.push(this.layers[0].calculate(inputs));
	for (var i = 1; i < this.layers.length; i++) {
		outputs.push(this.layers[i].calculate(outputs[i-1]));
	}
// 	console.log("outputs:" + outputs.toString());
	return outputs[this.layers.length - 1];
}

SnakeNeuralNetworkDna = function(weights, biases) {
	// biasesDna should have 16 + 16 values
	// weightsDna should have 16 * 16 + 16 * 16 + 16 * 3 values
	this.weightsDna = weights;
	this.biasesDna = biases;
}

SnakeNeuralNetwork = function(snakeDna) {
	// Specific for Snake
	// need to set the DNA and then setNetwork() before calculate
	// this.inputNum input -> 16 node for hidden layer -> this.outputNodeNum node for output
// 	this.dna = []
	this.weightsDna = snakeDna.weightsDna;
	this.biasesDna = snakeDna.biasesDna;
	
	// partial road info
	this.inputNum = 10;
	this.hiddenLayer0NodeNum = 10;
	this.hiddenLayer1NodeNum = 10;
	this.hiddenLayer2NodeNum = 10;
	this.hiddenLayer3NodeNum = 10;
	this.outputNodeNum = 3;
	
	// full road info
// 	this.inputNum = 1200;
// 	this.hiddenLayer0NodeNum = 20;
// 	this.hiddenLayer1NodeNum = 10;
// 	this.outputNodeNum = 4;

// 	this.nodeNum = this.hiddenLayer0NodeNum + this.hiddenLayer1NodeNum + this.hiddenLayer2NodeNum + this.hiddenLayer3NodeNum + this.outputNodeNum;
	
	var layer0 = [];
	var layer1 = [];
	var layer2 = [];
	var layer1a = [];
	var layer1b = [];
	for (var i = 0; i < this.hiddenLayer0NodeNum; i++) {
		var nodeWeight = [];
		for (var j = 0; j < this.inputNum; j++) {
			nodeWeight.push(this.weightsDna[i * this.inputNum + j]);
		}
		layer0.push(new Node(nodeWeight, this.biasesDna[i]));
	}
	
	var layer0WeightsDnaSize = this.inputNum * this.hiddenLayer0NodeNum
	var layer0BiasesDnaSize = this.hiddenLayer0NodeNum
	for (var i = 0; i < this.hiddenLayer1NodeNum; i++) {
		var nodeWeight2 = [];
		for (var j = 0; j < this.hiddenLayer0NodeNum; j++) {
			nodeWeight2.push(this.weightsDna[layer0WeightsDnaSize + i * this.hiddenLayer0NodeNum + j]);
		}
		layer1.push(new Node(nodeWeight2, this.biasesDna[layer0BiasesDnaSize + i]));
	}
	
	var layer1BiasesDnaSize = layer0BiasesDnaSize + this.hiddenLayer1NodeNum
	var layer1WeightsDnaSize = layer0WeightsDnaSize + this.hiddenLayer0NodeNum * this.hiddenLayer1NodeNum
	for (var i = 0; i < this.hiddenLayer2NodeNum; i++) {
		var nodeWeight2a = [];
		for (var j = 0; j < this.hiddenLayer1NodeNum; j++) {
			nodeWeight2a.push(this.weightsDna[layer1WeightsDnaSize + i * this.hiddenLayer1NodeNum + j]);
		}
		layer1a.push(new Node(nodeWeight2a, this.biasesDna[layer1BiasesDnaSize + i]));
	}
	
	var layer2BiasesDnaSize = layer1BiasesDnaSize + this.hiddenLayer2NodeNum
	var layer1aWeightsDnaSize = layer1WeightsDnaSize + this.hiddenLayer1NodeNum * this.hiddenLayer2NodeNum
	for (var i = 0; i < this.hiddenLayer3NodeNum; i++) {
		var nodeWeight2b = [];
		for (var j = 0; j < this.hiddenLayer2NodeNum; j++) {
			nodeWeight2b.push(this.weightsDna[layer1aWeightsDnaSize + i * this.hiddenLayer2NodeNum + j]);
		}
		layer1b.push(new Node(nodeWeight2b, this.biasesDna[layer2BiasesDnaSize + i]));
	}
	
	var layer3BiasesDnaSize = layer2BiasesDnaSize + this.hiddenLayer3NodeNum
	var layer1bWeightsDnaSize = layer1aWeightsDnaSize + this.hiddenLayer2NodeNum * this.hiddenLayer3NodeNum
	for (var i = 0; i < this.outputNodeNum; i++) {
		var nodeWeight3 = [];
		for (var j = 0; j < this.hiddenLayer3NodeNum; j++) {
			nodeWeight3.push(this.weightsDna[layer1bWeightsDnaSize + i * this.hiddenLayer3NodeNum + j]);
		}
		layer2.push(new Node(nodeWeight3, this.biasesDna[layer3BiasesDnaSize + i]));
	}

	this.neuralNetwork = new NeuralNetwork([new Layer(layer0), new Layer(layer1), new Layer(layer1a), new Layer(layer1b), new Layer(layer2)]);
	
/* 	for (var i = 0; i < this.outputNodeNum; i++) {
		var nodeWeight3 = [];
		for (var j = 0; j < this.hiddenLayer1NodeNum; j++) {
			nodeWeight3.push(this.weightsDna[this.inputNum * this.hiddenLayer0NodeNum + this.hiddenLayer0NodeNum + this.hiddenLayer1NodeNum + i * this.hiddenLayer1NodeNum + j]);
		}
		layer2.push(new Node(nodeWeight3, this.biasesDna[this.hiddenLayer0NodeNum - this.hiddenLayer1NodeNum + i]));
	}
	this.neuralNetwork = new NeuralNetwork([new Layer(layer0), new Layer(layer1), new Layer(layer2)]); */
}

// SnakeNeuralNetwork.prototype.setRandomDNA = function() {
	// First need to know the # info in DNA, which is the weight for each node
	// 8 * 16 for first layer (8 input for 16 node in layer 1)
	// 16 * this.outputNodeNum for second layer (16 input for this.outputNodeNum node in layer 2)
	// total has 8 * 16 + 16 * this.outputNodeNum = this.inputNum2 info
// 	var info = 8 * this.hiddenLayer0NodeNum + this.hiddenLayer0NodeNum * this.outputNodeNum;
// 	for (var i = 0; i < info; i++) {
// 		this.dna.push(Math.random());
// 	}
// }

/* 
SnakeNeuralNetwork.prototype.getDnaSize = function() {
	return this.inputNum * this.hiddenLayer0NodeNum + this.hiddenLayer0NodeNum * this.outputNodeNum;
}
*/
/* 
SnakeNeuralNetwork.prototype.setNetwork = function(snake) {
	var layer0 = [];
	var layer1 = [];
	for (var i = 0; i < this.hiddenLayer0NodeNum; i++) {
		var nodeWeight = [];
		for (var j = 0; j < this.inputNum; j++) {
			nodeWeight.push(snake.dna[i * this.inputNum + j]);
		}
		layer0.push(new Node(nodeWeight));
	}
	for (var i = 0; i < this.outputNodeNum; i++) {
		var nodeWeight2 = [];
		for (var j = 0; j < this.hiddenLayer0NodeNum; j++) {
			nodeWeight2.push(snake.dna[this.inputNum * this.hiddenLayer0NodeNum + i * this.hiddenLayer0NodeNum + j]);
		}
		layer1.push(new Node(nodeWeight2));
	}
	this.neuralNetwork = new NeuralNetwork([new Layer(layer0), new Layer(layer1)]);
}
*/

// SnakeNeuralNetwork.prototype.setDNA = function(dna) {
// 	this.dna = dna;
// }

// SnakeNeuralNetwork.prototype.getDNA = function() {
// 	return this.dna;
// }

SnakeNeuralNetwork.prototype.calculate = function(snake, fruit) {
	var roadInfo = snake.getRoadInfo(fruit); // partial info
//	var roadInfo = snake.getRoadInfo2(fruit); // full info, 1200 input info
	
	if (!snake.isDead && roadInfo[1] == Number(1)){
		console.log("index=" + snake.index + ",snake{x=" + snake.x + ", y=" + snake.y + ", dir=" + snake.direction + "}, fruit{x=" + fruit.x + ", y=" + fruit.y + "} + road=" + roadInfo.toString());
	}
	
// 	var dna = snake.dna;
// 	console.log(roadInfo + " " + dna);
// 	console.log(roadInfo);
	var calc = this.neuralNetwork.calculate(roadInfo);
// 	console.log(calc.toString());
	return calc;
// 	return this.neuralNetwork.calculate(roadInfo);
}