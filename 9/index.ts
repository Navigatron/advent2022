
type Point = {
	x: number;
	y: number;
};

type DirCode = 'U' | 'D' | 'L' | 'R';

type Instruction = {
	direction: Point;
	magnitude: number;
};

function p(x: number, y: number): Point{
	return {x,y};
}
p.add = (a: Point, b: Point): Point => p(a.x+b.x, a.y+b.y);
p.sub = (a: Point, b: Point): Point => p(a.x-b.x, a.y-b.y);
// "manhattan clamp" - no axis may be greater than m in magnitude
p.mclamp = (a: Point, m: number) => p(
	Math.max(-m, Math.min(m, a.x)),
	Math.max(-m, Math.min(m, a.y))
);

function parseInstructions(input: string): Instruction[] {
	const offsetLookup: Record<DirCode, Point> = {
		"U": {x:  0, y:  1},
		"D": {x:  0, y: -1},
		"L": {x: -1, y:  0},
		"R": {x:  1, y:  0},
	};
	return input.trim().split('\n').map(line=>{
		const [dir, mag] = line.split(' ') as [DirCode, string];
		return {
			direction: offsetLookup[dir],
			magnitude: Number.parseInt(mag),
		};
	});
}

// function debug(head: Point, tail: Point, size: number){
// 	for(let y=size; y>=0; y--){
// 		for(let x=0; x<size; x++){
// 			if(head.x===x && head.y===y){
// 				process.stdout.write('H');
// 			}else if(tail.x===x && tail.y===y){
// 				process.stdout.write('T');
// 			}else if(x===0 && y===0){
// 				process.stdout.write('s');
// 			}else{
// 				process.stdout.write('.');
// 			}
// 		}
// 		process.stdout.write('\n');
// 	}
// 	console.log();
// }

function solution(input: string, knotCount: number): number{
	const instructions = parseInstructions(input);
	const knots = Array(knotCount).fill(p(0,0));

	const tailCache = new Set();
	tailCache.add(`${knots[knotCount-1].x}:${knots[knotCount-1].y}`);

	// console.log('== Initial State ==');
	// console.log();
	// debug(head, tail);

	// Iterate over instructions, move the rope
	instructions.forEach(instruction => {
		// console.log(`== ${JSON.stringify(instruction.direction)} ${instruction.magnitude} ==`);
		// console.log();
		for(let _ = 0; _ < instruction.magnitude; _++){
			// Move head
			knots[0] = p.add(knots[0], instruction.direction);
			// Move followers
			for(let i = 1; i< knots.length; i++){
				const d = p.sub(knots[i-1], knots[i]);
				if( d.x*d.x+d.y*d.y > 2 ){
					// Tail moves by clamping values
					knots[i] = p.add(knots[i], p.mclamp(d, 1));
				}
			}
			// Record tail position
			tailCache.add(`${knots[knotCount-1].x}:${knots[knotCount-1].y}`);
		}
	});
	return tailCache.size;
}

export function part1(input: string){
	return solution(input, 2);
}

export function part2(input: string){
	return solution(input, 10);
}
