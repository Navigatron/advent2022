
// A range has a start and an end
type Range = {start: number; end: number};

// A pair is a ... pair of ranges
type Pair = [Range, Range];

// Convert input string to pairs of ranges
function parsePairs(input: string): Pair[] {
	// Process by line
	return input.trim().split('\n').map(line =>
		// Process by range
		line.split(',').map(range => {
			// Convert to Range type
			const [start, end] = range.split('-').map(n => Number.parseInt(n, 10)) as [number, number];
			return {start, end};
		}) as [Range, Range],
	);
}

export function part1(input: string) {
	const pairs: Pair[] = parsePairs(input);
	const containingPairs = pairs.filter(pair =>
		// If p0 (contains) or (is contained by) p1, count it.
		(pair[0].start <= pair[1].start && pair[0].end >= pair[1].end)
		|| (pair[0].start >= pair[1].start && pair[0].end <= pair[1].end),
	);
	return containingPairs.length;
}

export function part2(input: string) {
	const pairs = parsePairs(input);
	// Line overlap test
	const overlapping = pairs.filter(p => (p[0].start <= p[1].end && p[0].end >= p[1].start));
	return overlapping.length;
}
