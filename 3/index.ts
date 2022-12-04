
// Rucksacks have two compartments, which are both arrays of characters
type Rucksack = [string, string];

function mapValues(items: string[]): number[] {
	return items.map(item=>{
		// return a number: a=1
		const value = item.charCodeAt(0) - 97 + 1;
		if( value <= 0 ){
			return value + 97 - 1 - 65 + 27;
		}
		return value;
	});
}

export function part1(input: string){
	const rucksacks: Rucksack[] = input.trim().split('\n').map(all=>{
		let compartmentSize = all.length / 2 ;
		return [all.slice(0, compartmentSize), all.slice(compartmentSize)];
	});

	// Determine misplaced item
	const items = rucksacks.map(rs=>{
		// Iterate over first compartment members
		for( let item of rs[0] ){
			if( rs[1].indexOf(item) !== -1 ){
				return item;
			}
		}
		throw new Error(`Rucksack ${rs} does not have a misplaced item!`);
	});

	// Map the items to their values
	const values = mapValues(items);

	// Return Sum of all values
	return values.reduce((a,e)=>a+e,0);
}

export function part2(input: string){
	const rucksacks: string[] = input.trim().split('\n');
	
	// Elves are divided into groups of three
	// Badge is the only thing that all three have in common.

	const badges = [];

	for(let i=0; i<rucksacks.length; i+=3){
		for( let item of rucksacks[i] as string ){ // rucksacks.length guaranteed to be mulitple of three
			if( rucksacks[i+1]?.indexOf(item) != -1 && rucksacks[i+2]?.indexOf(item) != -1){
				// We found it!
				badges.push(item);
				break;
			}
		}
	}

	return mapValues(badges).reduce((a,e)=>a+e,0);
}
