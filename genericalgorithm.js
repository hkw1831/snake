GA = function() {
	
}

GA.prototype.cross = function(dnaParent1, dnaParent2) {
	dnaChildren1 = [];
	dnaChildren2 = [];
	for (var i = 0; i < dnaParent1.length; i++) {
		dnaChildren1.push(dnaParent1[i]);
		dnaChildren2.push(dnaParent2[i]);
	}
	var index1 = Math.floor(Math.random() * dnaChildren1.length);
	var index2 = Math.floor(Math.random() * dnaChildren1.length);
	for (var i = 0; i < index1; i++) {
		var temp = dnaChildren1[i];
		dnaChildren1[i] = dnaChildren2[i];
		dnaChildren2[i] = temp;
	}
	for (var i = index2; i < dnaChildren1.length; i++) {
		var temp = dnaChildren1[i];
		dnaChildren1[i] = dnaChildren2[i];
		dnaChildren2[i] = temp;
	}
	return {dna1: dnaChildren1, dna2: dnaChildren2};
}

GA.prototype.mutate = function(dna) {
	dnaMutate = [];
	for (var i = 0; i < dna.length; i++) {
		dnaMutate.push(dna[i]);
	}
	for (var i = 0; i < dna.length; i++) {
		var randomValue = Math.random();
		if (randomValue < 0.05) {
			dnaMutate[i] = Math.random() * 2 - 1;
		}
	}
	return dnaMutate;
}

GA.prototype.intermediateCrossover25 = function(dnaParent1, dnaParent2, desc) {
	dnaChildren1 = [];
// 	dnaChildren2 = [];
	for (var i = 0; i < dnaParent1.length; i++) {
		var randomNum = Math.random()
		var lower;
		var higher;
		if (dnaParent1[i] > dnaParent2[i]) {
			lower = dnaParent2[i];
			higher = dnaParent1[i];
		}else{
			lower = dnaParent1[i];
			higher = dnaParent2[i];
		}
		newLower = lower - (higher - lower) * 0.25;
		newHigher = higher + (higher - lower) * 0.25;
		var newValue = newLower + Math.random() * (newHigher - newLower);
		if (Math.random() < 0.05) {
			newValue = newValue + (Math.random() * 2 - 1) * 0.5;
		}
		dnaChildren1.push(newValue)
	}
	return {dna: dnaChildren1, dnaType: desc} // intermediate recombination
}

// only do this first
GA.prototype.uniformCrossover = function(snakeDnaParent1, snakeDnaParent2, crossWeightsDna) {
	dnaWeightsChildren1 = [];
	dnaWeightsChildren2 = [];
	for (var i = 0; i < snakeDnaParent1.weightsDna.length; i++) {
		if (crossWeightsDna) {
			if (Math.random() >= 0.5) {
				dnaWeightsChildren1.push(snakeDnaParent1.weightsDna[i]);
				dnaWeightsChildren2.push(snakeDnaParent2.weightsDna[i]);
			} else {
				dnaWeightsChildren1.push(snakeDnaParent2.weightsDna[i]);
				dnaWeightsChildren2.push(snakeDnaParent1.weightsDna[i]);			
			}			
		} else {
			dnaWeightsChildren1.push(snakeDnaParent1.weightsDna[i]);
			dnaWeightsChildren2.push(snakeDnaParent2.weightsDna[i]);
		}
	}
	dnaBiasesChildren1 = [];
	dnaBiasesChildren2 = [];
	for (var i = 0; i < snakeDnaParent1.biasesDna.length; i++) {
		if (Math.random() >= 0.5) {
			dnaBiasesChildren1.push(snakeDnaParent1.biasesDna[i]);
			dnaBiasesChildren2.push(snakeDnaParent2.biasesDna[i]);
		} else {
			dnaBiasesChildren1.push(snakeDnaParent2.biasesDna[i]);
			dnaBiasesChildren2.push(snakeDnaParent1.biasesDna[i]);			
		}
	}
	mutateProb = 0.05
	if (crossWeightsDna) {
		mutateProb = 0.02
	}
	
	for (var i = 0; i < dnaWeightsChildren1.length; i++) {
		if (Math.random() < mutateProb) {
			dnaWeightsChildren1[i] = dnaWeightsChildren1[i] + (Math.random() * 2 - 1) * 20;
		}
	}
	for (var i = 0; i < dnaWeightsChildren2.length; i++) {
		if (Math.random() < mutateProb) {
			dnaWeightsChildren2[i] = dnaWeightsChildren2[i] + (Math.random() * 2 - 1) * 20;
		}
	}
	for (var i = 0; i < dnaBiasesChildren1.length; i++) {
		if (Math.random() < mutateProb) {
			dnaBiasesChildren1[i] = dnaBiasesChildren1[i] * (Math.random() * 2 - 1) * 20;
		}
	}
	for (var i = 0; i < dnaBiasesChildren2.length; i++) {
		if (Math.random() < mutateProb) {
			dnaBiasesChildren2[i] = dnaBiasesChildren2[i] * (Math.random() * 2 - 1) * 20;
		}
	}

	dnaChildren1 = new SnakeNeuralNetworkDna(dnaWeightsChildren1, dnaBiasesChildren1);
	dnaChildren2 = new SnakeNeuralNetworkDna(dnaWeightsChildren2, dnaBiasesChildren2);
	if (crossWeightsDna) {
		return {gene1: {dna: dnaChildren1, dnaType: 'uniformCrossoverCrossWeight'}, gene2: {dna: dnaChildren2, dnaType: 'uniformCrossoverCrossWeight'}}
	}
	return {gene1: {dna: dnaChildren1, dnaType: 'uniformCrossoverNoCrossWeight'}, gene2: {dna: dnaChildren2, dnaType: 'uniformCrossoverNoCrossWeight'}}
}

GA.prototype.mutateRange = function(dnaParent1, prob) {
	dnaChildren1 = [];
	for (var i = 0; i < dnaParent1.length; i++) {
		if (Math.random() < prob) {
			dnaChildren1.push(dnaParent1[i] + (Math.random() * 2 - 1) * 0.5);
// 			dnaChildren1.push(-dnaParent1[i]);
		} else {
			dnaChildren1.push(dnaParent1[i]);
		}
	}
	return {dna: dnaChildren1, dnaType: 'mutation Range ' + prob}
}

GA.prototype.mutateNeg = function(dnaParent1, prob) {
	dnaChildren1 = [];
	for (var i = 0; i < dnaParent1.length; i++) {
		if (Math.random() < prob) {
// 			dnaChildren1.push(dnaParent1[i] + (Math.random() * 2 - 1) * 0.5);
			dnaChildren1.push(-dnaParent1[i]);
		} else {
			dnaChildren1.push(dnaParent1[i]);
		}
	}
	return {dna: dnaChildren1, dnaType: 'mutation Neg ' + prob}
}