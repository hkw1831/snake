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
GA.prototype.uniformCrossover = function(rank1Index, rank2Index, snake1, snake2, crossWeightsDna, isMutate) {
	var isRange = true
	var snakeDnaParent1 = snake1.snakeDna
	var snakeDnaParent2 = snake2.snakeDna
//	var parentSnakeIndex1 = snake1.index
//	var parentSnakeIndex2 = snake2.index
	var randomAdjustmentFactor = 0;

	var variance = 0;
	for (var i = 0; i < snakeDnaParent1.weightsDna.length; i++) {
		variance += Math.abs(snakeDnaParent1.weightsDna[i] - snakeDnaParent2.weightsDna[i]);
	}
	for (var i = 0; i < snakeDnaParent1.biasesDna.length; i++) {
		variance += Math.abs(snakeDnaParent1.biasesDna[i] - snakeDnaParent2.biasesDna[i]);
	}
	variance = variance / (snakeDnaParent1.weightsDna.length + snakeDnaParent1.biasesDna.length);
	variance = variance.toFixed(2);

	var dnaWeightsChildren1 = [];
	var dnaWeightsChildren2 = [];
	for (var i = 0; i < snakeDnaParent1.weightsDna.length; i++) {
		var maxVariableRange = Math.abs(snakeDnaParent1.weightsDna[i] - snakeDnaParent2.weightsDna[i]) * randomAdjustmentFactor
		var randomAdjustment = (Math.random() * 2 - 1) * maxVariableRange;
		if (isRange) {
			var range = 0.625 * Math.abs(snakeDnaParent1.weightsDna[i] - snakeDnaParent2.weightsDna[i])
			var avg = (snakeDnaParent1.weightsDna[i] + snakeDnaParent2.weightsDna[i]) / 2
			dnaWeightsChildren1.push(avg + (Math.random() * 2 - 1) * range);
			dnaWeightsChildren2.push(avg + (Math.random() * 2 - 1) * range);
		} else {
			if (crossWeightsDna) {
				if (Math.random() >= 0.5) {
					dnaWeightsChildren1.push(snakeDnaParent1.weightsDna[i] + randomAdjustment);
					dnaWeightsChildren2.push(snakeDnaParent2.weightsDna[i] + randomAdjustment);
				} else {
					dnaWeightsChildren1.push(snakeDnaParent2.weightsDna[i] + randomAdjustment);
					dnaWeightsChildren2.push(snakeDnaParent1.weightsDna[i] + randomAdjustment);			
				}
			} else {
				dnaWeightsChildren1.push(snakeDnaParent1.weightsDna[i] + randomAdjustment);
				dnaWeightsChildren2.push(snakeDnaParent2.weightsDna[i] + randomAdjustment);
			}
		}
	}
	dnaBiasesChildren1 = [];
	dnaBiasesChildren2 = [];
	for (var i = 0; i < snakeDnaParent1.biasesDna.length; i++) {
		if (isRange) {
			var maxVariableRange = Math.abs(snakeDnaParent1.biasesDna[i] - snakeDnaParent2.biasesDna[i]) * randomAdjustmentFactor
			var randomAdjustment = (Math.random() * 2 - 1) * maxVariableRange;
			if (Math.random() >= 0.5) {
				dnaBiasesChildren1.push(snakeDnaParent1.biasesDna[i] + randomAdjustment);
				dnaBiasesChildren2.push(snakeDnaParent2.biasesDna[i] + randomAdjustment);
			} else {
				dnaBiasesChildren1.push(snakeDnaParent2.biasesDna[i] + randomAdjustment);
				dnaBiasesChildren2.push(snakeDnaParent1.biasesDna[i] + randomAdjustment);			
			}
		} else {
			var range = 0.625 * Math.abs(snakeDnaParent1.biasesDna[i] - snakeDnaParent2.biasesDna[i])
			var avg = (snakeDnaParent1.biaseDna[i] + snakeDnaParent2.biasesDna[i]) / 2
			dnaBiasesChildren1.push(avg + (Math.random() * 2 - 1) * range);
			dnaBiasesChildren2.push(avg + (Math.random() * 2 - 1) * range);
		}
	}
	if (isMutate) {
		mutateProb = 0.5
		mutateRange = 4
		if (crossWeightsDna) {
			mutateProb = 0.25
		}
	} else {
		mutateProb = 0.02
		mutateRange = 40
		if (crossWeightsDna) {
			mutateProb = 0.01
		}
	}
	
	for (var i = 0; i < dnaWeightsChildren1.length; i++) {
		if (Math.random() < mutateProb) {
			dnaWeightsChildren1[i] = dnaWeightsChildren1[i] + (Math.random() * 2 - 1) * mutateRange;
		}
	}
	for (var i = 0; i < dnaWeightsChildren2.length; i++) {
		if (Math.random() < mutateProb) {
			dnaWeightsChildren2[i] = dnaWeightsChildren2[i] + (Math.random() * 2 - 1) * mutateRange;
		}
	}
	for (var i = 0; i < dnaBiasesChildren1.length; i++) {
		if (Math.random() < mutateProb) {
			dnaBiasesChildren1[i] = dnaBiasesChildren1[i] + (Math.random() * 2 - 1) * mutateRange;
		}
	}
	for (var i = 0; i < dnaBiasesChildren2.length; i++) {
		if (Math.random() < mutateProb) {
			dnaBiasesChildren2[i] = dnaBiasesChildren2[i] + (Math.random() * 2 - 1) * mutateRange;
		}
	}

	dnaChildren1 = new SnakeNeuralNetworkDna(dnaWeightsChildren1, dnaBiasesChildren1, variance);
	dnaChildren2 = new SnakeNeuralNetworkDna(dnaWeightsChildren2, dnaBiasesChildren2, variance);
	
// 	var dnaTypeName = '[' + parentSnakeIndex1 + ', ' + parentSnakeIndex2 + '] uniformCrossover';
	var dnaTypeName = '[' + (rank1Index + 1) + ', ' + (rank2Index + 1) + '] uniformCrossover';
	if (crossWeightsDna) {
		dnaTypeName += 'CrossWeight'
	}
	if (isMutate) {
		dnaTypeName += 'Mutate'
	}
	return {gene1: {dna: dnaChildren1, dnaType: dnaTypeName}, gene2: {dna: dnaChildren2, dnaType: dnaTypeName}}
/*	if (crossWeightsDna) {
		return {gene1: {dna: dnaChildren1, dnaType: 'uniformCrossoverCrossWeight'}, gene2: {dna: dnaChildren2, dnaType: 'uniformCrossoverCrossWeight'}}
	}
	return {gene1: {dna: dnaChildren1, dnaType: 'uniformCrossoverNoCrossWeight'}, gene2: {dna: dnaChildren2, dnaType: 'uniformCrossoverNoCrossWeight'}}
	*/
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