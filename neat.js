NEATNode = function(id, depth, biases) {
	this.id = id;
	this.depth = depth;
	this.biases = biases;
	// placeholder	
}

NEATConnection = function(id, startNodeId, endNodeId, weights) {
	this.id = id;
	this.startNodeId = startNodeId;
	this.endNodeId = endNodeId;
	this.weights = weights;
	this.enabled = true;
}

NEATConnection.prototype.enable = function() {
	this.enable = true;
}

NEATConnection.prototype.disable = function() {
	this.enable = false;
}

NEATGraph = function() {
	this.nodes = new Map();
	this.connections = new Map();
}

NEATSpecies = function() {
	
}

NEATRegistry = function() {
	
}