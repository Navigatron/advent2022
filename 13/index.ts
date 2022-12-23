
function parseInput(input: string){
	return input.trim().split('\n\n').map(g=>g.split('\n').map(l=>eval(l)));
}

type Pkt = number | Array<Pkt>;

// Return true if left is smaller than right
function compare(left: Pkt, right: Pkt): boolean | undefined {
	// console.log(`Compare ${left} with ${right}`);
	// Number Comparison
	if( typeof left === 'number' && typeof right === 'number' ){
		if(left === right){
			return undefined;
		}
		return left < right;
	}
	// Array comparison
	if( Array.isArray(left) && Array.isArray(right) ){
		for(let i=0; true; i++){
			let subLeft = left[i];
			let subRight = right[i];
			// Runout - neither: Child comparison
			if( subLeft !== undefined && subRight !== undefined){
				const result = compare(subLeft, subRight);
				if(result !== undefined){
					return result;
				}
			}
			// Runout - both
			if(subLeft === undefined && subRight === undefined ){
				return undefined;
			}
			// Runout - left
			if(subLeft === undefined && subRight !== undefined){
				return true;
			}
			// Runout - Right
			if(subLeft !== undefined && subRight === undefined){
				return false;
			}
			// Something will run out eventually.
		}
	}
	// Mixed comparison
	if(typeof left === 'number'){
		return compare([left], right);
	}else{
		return compare(left, [right]);
	}
}

export function part1(input: string){
	const packets = parseInput(input);
	return packets.map(g=>compare(g[0], g[1])).map((b,i)=>b?i+1:0).reduce((a,e)=>a+e,0);
}

export function part2(input: string){
	const packets = parseInput(input).flat(1);
	// inject dividers
	packets.push([[2]]);
	packets.push([[6]]);
	// sort
	packets.sort((a,b)=>{
		const result = compare(a,b);
		return {
			undefined: 0,
			true: -1,
			false: 1,
		// @ts-ignore // lol
		}[result];
	});
	// Map to index if divider, 1 otherwise, return multiplicative sum
	return packets.map((p,i)=> compare(p,[[2]]) === undefined || compare(p,[[6]]) === undefined ? i+1 : 1).reduce((a,e)=>a*e,1);
}
