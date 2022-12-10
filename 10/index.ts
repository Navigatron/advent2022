
enum OPCODE {
	NOOP,
	ADDX,
};

type Instruction = {
	opcode: OPCODE,
	arg?: number,
};

function parseInstructions(input: string): Instruction[]{
	return input.trim().split('\n').map(line=>{
		let match;
		if( match = line.match(/addx (-?\d+)/) ){
			return {
				opcode: OPCODE.ADDX,
				arg: Number.parseInt(match[1] as string),
			}
		} else {
			return {
				opcode: OPCODE.NOOP
			}
		}
	});
}

const screen = [
	Array(40).fill(undefined),
	Array(40).fill(undefined),
	Array(40).fill(undefined),
	Array(40).fill(undefined),
	Array(40).fill(undefined),
	Array(40).fill(undefined),
];

function run(program: Instruction[]): number[] {
	let X = 1;
	let busy = false;
	let currentInstruction;
	const measurements = [];
	let timeOnThisInstruction = 0;

	const reset = () => {
		busy = false;
		timeOnThisInstruction = 0;
	};
	
	for(let cycle=1; true; cycle++){
		// start of cycle
		if(!busy){
			currentInstruction = program.shift() as Instruction;
			busy = true;
			if( currentInstruction === undefined ){
				break;
			}
		}
		
		// middle of cycle
		if([20, 60, 100, 140, 180, 220].includes(cycle)){
			measurements.push(cycle*X);
		}

		// Part 2: Draw!??
		const y = Math.floor((cycle-1)/40); // 
		const x = (cycle-1) % 40;
		// console.log(`c:${cycle} X:${X} y:${y} x:${cycle%40}`);
		let pixel;
		if(Math.abs(x-X)<=1){
			pixel = '#';
		}else{
			pixel = '.';
		}
		(screen[y] as string[])[x] = pixel;

		// end of cycle
		timeOnThisInstruction++;
		switch((currentInstruction as Instruction).opcode){
			case OPCODE.NOOP:
				reset();
				break;
			case OPCODE.ADDX:
				if(timeOnThisInstruction>=2){
					X += (currentInstruction as Instruction).arg as number;
					reset();
				}
				break;
		}
	}
	return measurements;
}

export function part1(input: string){
	const measurements = run(parseInstructions(input));
	return measurements.reduce((a,e)=>a+e,0);
}

export function part2(input: string){
	run(parseInstructions(input));
	return screen.map(l=>l.join('')).join('\n');
}
