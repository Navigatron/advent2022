
type Range = {start: number, end: number};
type Pair = [Range, Range];

function parsePairs(input: string): Pair[] {
	return input.trim().split('\n').map((line: string)=>{
		// return two ranges
		return line.split(',').map((range: string)=>{
			const [start, end] = range.split('-').map(num=>parseInt(num) as number) as [number, number];
			return {start, end};
		}) as [Range, Range];
	});
}

export function part1(input: string){
	// each section has an ID
	// each elf gets a range of IDs.
	// elf ranges overlap?
	// some ranges fully contain the other
	// // in how many pairs does one fully contain the other?

	const pairs: Pair[] = parsePairs(input);

	const containingPairs = pairs.filter(pair=>{
		// Does one of these contain the other?
		// case 1 - first is bigger
		return (pair[0].start <= pair[1].start && pair[0].end >= pair[1].end) || (pair[0].start >= pair[1].start && pair[0].end <= pair[1].end);
	});
	
	return containingPairs.length;
}

export function part2(input: string){
	const pairs = parsePairs(input);

	// Do it overlap?
	const overlapping = pairs.filter(pair=>{
		// return true if overlap a contains b start, or a contains b end
		const p0 = pair[0];
		const p1 = pair[1];

		return (p0.start <= p1.end && p0.end >= p1.start);
		
	});

	return overlapping.length;
	// 715 is too low!
	
}
