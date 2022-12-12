
type Monkey = {
	items: number[];
	operation: string;
	divisor: number;
	trueFriend: number;
	falseFriend: number;
	shenanigans: number;
};

function parseMonkeys(input: String): Monkey[]{
	return input.trim().split('\n\n').map(chunk=>{
		const matches = (chunk.match(
			new RegExp([
				'Monkey \\d+:',
				'  Starting items: (?<items>(?:\\d+)(?:, \\d+)*)',
				'  Operation: new = (?<operation>.*?)',
				'  Test: divisible by (?<divisor>\\d+)',
				'    If true: throw to monkey (?<trueFriend>\\d+)',
				'    If false: throw to monkey (?<falseFriend>\\d+)'].join('\\n'))
		) as RegExpMatchArray).groups as {
			items: string;
			operation: string;
			divisor: string;
			trueFriend: string;
			falseFriend: string;
		};
		return {
			items: matches.items.split(', ').map(n=>Number.parseInt(n)),
			operation: matches.operation,
			divisor: Number.parseInt(matches.divisor),
			trueFriend: Number.parseInt(matches.trueFriend),
			falseFriend: Number.parseInt(matches.falseFriend),
			shenanigans: 0,
		};
	});
}

export function part1(input: string){
	const monkeys = parseMonkeys(input);

	// Simulate 20 rounds
	for(let _round = 0; _round < 20; _round++){
		// Each monkey takes a turn
		monkeys.forEach(monkey=>{
			// monkey processes each item
			monkey.items.forEach(item=>{
				// Increase shenanigans
				monkey.shenanigans += 1;
				
				// As the monkey inspects the item, my worry increases
				// @ts-ignore
				let old = item;
				let worry = eval(monkey.operation);
				
				// I am less worried post inspection
				worry = Math.floor(worry / 3);

				// Is my worry level divisble?
				if( worry % monkey.divisor === 0){
					// Toss to TrueFriend
					(monkeys[monkey.trueFriend] as Monkey).items.push(worry);
				} else {
					// Toss to FalseFriend
					(monkeys[monkey.falseFriend] as Monkey).items.push(worry);
				}
			});
			// All items processed, nuke queue
			monkey.items = [];
		});
	}

	// Sort monkeys by shenanigans
	const shenanigans = monkeys.map(m=>m.shenanigans).sort((a,b)=>b-a) as [number, number]; // at least two!
	// Return top two, multed.
	return shenanigans[0] * shenanigans[1];
}

export function part2(input: string){
	const monkeys = parseMonkeys(input);

	// == here be dragons ==
	const magic = monkeys.reduce((a,e)=>a*e.divisor,1);

	console.log(magic);

	// Simulate 10000 rounds
	for(let _round = 0; _round < 10000; _round++){
		// Each monkey takes a turn
		monkeys.forEach(monkey=>{
			// monkey processes each item
			monkey.items.forEach(item=>{
				// Increase shenanigans
				monkey.shenanigans += 1;
				
				// As the monkey inspects the item, my worry increases
				// @ts-ignore
				let old = item;
				let worry = eval(monkey.operation);
				
				// I am NOT less worried post inspection
				// worry = Math.floor(worry / 3);

				// Apply magic
				worry = worry % magic;

				// Is my worry level divisble?
				if( worry % monkey.divisor === 0){
				
					// Toss to TrueFriend
					(monkeys[monkey.trueFriend] as Monkey).items.push(worry);
				} else {
					// Toss to FalseFriend
					(monkeys[monkey.falseFriend] as Monkey).items.push(worry);
				}
			});
			// All items processed, nuke queue
			monkey.items = [];
		});

		// if( _round % 1000 === 0 ){
		// 	console.log(`== After round ${_round} ==`);
		// 	monkeys.forEach((monkey, mid)=>{
		// 		console.log(`Monkey ${mid} inspected items ${monkey.shenanigans} times.`);
		// 	});
		// }
	}

	// Sort monkeys by shenanigans
	const shenanigans = monkeys.map(m=>m.shenanigans).sort((a,b)=>b-a) as [number, number]; // at least two!
	// Return top two, multed.
	return shenanigans[0] * shenanigans[1];

	// 14391121333 is too high!
}
