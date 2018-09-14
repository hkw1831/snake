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
	this.inputNum = 20;
	this.hiddenLayer0NodeNum = 20;
	this.hiddenLayer1NodeNum = 20;
	this.outputNodeNum = 3;
	this.nodeNum = this.hiddenLayer0NodeNum + this.hiddenLayer1NodeNum + this.outputNodeNum;
	
	var layer0 = [];
	var layer1 = [];
	var layer2 = [];
	for (var i = 0; i < this.hiddenLayer0NodeNum; i++) {
		var nodeWeight = [];
		for (var j = 0; j < this.inputNum; j++) {
			nodeWeight.push(this.weightsDna[i * this.inputNum + j]);
		}
		layer0.push(new Node(nodeWeight, this.biasesDna[i]));
	}
	for (var i = 0; i < this.hiddenLayer1NodeNum; i++) {
		var nodeWeight2 = [];
		for (var j = 0; j < this.hiddenLayer0NodeNum; j++) {
			nodeWeight2.push(this.weightsDna[this.inputNum * this.hiddenLayer0NodeNum + i * this.hiddenLayer0NodeNum + j]);
		}
		layer1.push(new Node(nodeWeight2, this.biasesDna[this.hiddenLayer0NodeNum + i]));
	}
	for (var i = 0; i < this.outputNodeNum; i++) {
		var nodeWeight3 = [];
		for (var j = 0; j < this.hiddenLayer1NodeNum; j++) {
			nodeWeight3.push(this.weightsDna[this.inputNum * this.hiddenLayer0NodeNum + this.hiddenLayer0NodeNum + this.hiddenLayer1NodeNum + i * this.hiddenLayer1NodeNum + j]);
		}
		layer2.push(new Node(nodeWeight3, this.biasesDna[this.hiddenLayer0NodeNum - this.hiddenLayer1NodeNum + i]));
	}
	this.neuralNetwork = new NeuralNetwork([new Layer(layer0), new Layer(layer1), new Layer(layer2)]);
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
	var roadInfo = snake.getRoadInfo(fruit);
// 	var dna = snake.dna;
// 	console.log(roadInfo + " " + dna);
// 	console.log(roadInfo);
	var calc = this.neuralNetwork.calculate(roadInfo);
// 	console.log(calc.toString());
	return calc;
// 	return this.neuralNetwork.calculate(roadInfo);
}