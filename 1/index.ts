// An Elf is an array of Calories
type Calorie = number;
type Elf = Calorie[];

// Convert input text to an array of elves
function parseElves(input: string): Elf[] {
	return input
		// Elves are separated by blank lines
		.split('\n\n')
		// Convert each chunk of text into an Elf
		.map(elf_str => elf_str.trim().split('\n').map(c=>parseInt(c)));
}

// Determine the caloric value of one elf.
function evaluateElf(elf: Elf): Calorie {
	return elf.reduce((a,e)=>a+e,0);
}

// Convert an array of elves to their values, and sort by tastiness
function evaluateElves(elves: Elf[]): Calorie[] {
	return elves
		.map(evaluateElf)
		.sort((a,b)=>b-a);
}

export function part1(input: string){
	const elves = parseElves(input);
	const elfValues = evaluateElves(elves);
	// Return the most calorically-dense elf
	return elfValues[0];
}

export function part2(input: string){
	const elves = parseElves(input);
	const elfValues = evaluateElves(elves) as [Calorie, Calorie, Calorie]; // at least 3
	// Return the three tastiest elves
	return elfValues[0] + elfValues[1] + elfValues[2];
}
