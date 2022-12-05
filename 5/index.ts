
type Stack = string[];

function parseStacks(input: string): Record<string, Stack>{
	// Get the first half of the input
	const stackmap = input.split('\n\n')[0] as string;
	// Convert each line to an array of crates
	const stackextract = stackmap.split('\n').map(line=>{
		return line.match(/(   |\[\w\]| \d )(?: |$)/gm) as string[];
	}) as [string[]];
	// Remove last row, which just has stack indexes
	const stackLabels = (stackextract.pop() as string[]).map(s=>s.trim());
	// Stacks
	let stacks: Record<string, string[]> = {};
	// Populate the final stacks data structure, one stack at a time
	for(const label of stackLabels){
		stacks[label] = [];
		// Get item at index (label-1) from each row, put it on this stack
		for(const row of stackextract){
			(stacks[label] as string[]).push(row[parseInt(label)-1] as string);
		}
	}
	// They were populated upside down - fix that. Also remove empties.
	Object.keys(stacks).forEach(label => {
		stacks[label] = (stacks[label] as Stack).reverse().map(crate=>crate.match(/\[\w\]/)?.[0] as string).filter(c=>c);
	});
	return stacks;
}

function parseInstructions(input: string){
	return (input.split('\n\n')[1] as string)
		.trim()
		.split('\n')
		.map(line=>line.match(/move (\d+) from (\d) to (\d)/) as [string, string, string, string])
		.map(a=>({
			iterations: parseInt(a[1]),
			from: a[2],
			to: a[3]
		}));
}

function getCode(stacks: Record<string, Stack>){
	let code = '';
	Object.keys(stacks).forEach(label=>{
		code = code + ((stacks[label] as Stack).pop() as string)[1];
	});
	return code;
}

export function part1(input: string){
	const stacks = parseStacks(input);
	const instructions = parseInstructions(input);

	for (const instruction of instructions){
		for( let i=0; i<instruction.iterations; i++){
			const temp = (stacks[instruction.from] as string[]).pop() as string;
			(stacks[instruction.to] as string[]).push(temp);
		}
	}

	return getCode(stacks);
}

export function part2(input: string){
	const stacks = parseStacks(input);
	const instructions = parseInstructions(input);

	for (const instruction of instructions){
		let tempstack = [];
		for( let i=0; i<instruction.iterations; i++){
			// move to tempstack
			const temp = (stacks[instruction.from] as string[]).pop() as string;
			tempstack.push(temp);
		}
		for( let i=0; i<instruction.iterations; i++){
			// move to final stack
			const temp = tempstack.pop() as string;
			(stacks[instruction.to] as string[]).push(temp);
		}
	}
	
	return getCode(stacks);
}
