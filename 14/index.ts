
enum Material {
	sand,
	rock,
};

class World{

	map: number[][] = [];
	isPartTwo: boolean;
	abyss: number;

	get(x: number, y: number): Material | undefined {
		// Part 2 has a floor
		if(this.isPartTwo && y >= this.abyss+2){
			return Material.rock;
		}
		const row = this.map[y];
		return row?.[x];
	}

	set(x: number, y: number, material: Material){
		let row = this.map[y];
		if(row === undefined){
			row = this.map[y] = [];
		}
		row[x] = material;
	}

	constructor(input: string, isPartTwo: boolean){
		this.isPartTwo = isPartTwo;
		input.trim().split('\n').forEach(line=>{
			const points = line.split(' -> ').map(pair=>pair.split(',').map(n=>Number.parseInt(n)) as [number,number]);
			let last = points.shift() as [number, number];
			for(let point of points){
				let deltax = Math.max(Math.min(point[0] - last[0], 1), -1);
				let deltay = Math.max(Math.min(point[1] - last[1], 1), -1);
				// Iterate from last to here, setting rock as we go.
				let cx = last[0];
				let cy = last[1];
				for(;cx !== point[0] || cy !== point[1];){
					this.set(cx, cy, Material.rock);
					cx += deltax;
					cy += deltay;
				}
				this.set(cx, cy, Material.rock);
				// Save current as last for next round
				last = point;
			}
		});
		this.abyss = Object.keys(this.map).map(k=>Number.parseInt(k)).reduce((a,e)=>Math.max(a,e),-Infinity);
	}

	render(){
		// console.log(this.map);
		const minx = this.map.reduce((a, row)=>Math.min(a, Object.keys(row).map(n=>Number.parseInt(n)).reduce((b,c)=>Math.min(b,c),Infinity)), Infinity);
		const maxx = this.map.reduce((a, row)=>Math.max(a, Object.keys(row).map(n=>Number.parseInt(n)).reduce((b,c)=>Math.max(b,c),-Infinity)), -Infinity);
		// console.log(`${minx}, ${maxx}`);
		for( let y = 0; y <= this.abyss+2; y++ ){
			for( let x = minx; x<maxx; x++){
				const c = this.get(x,y);
				let w = '.';
				if(c === Material.rock){
					w = "#";
				}
				if(c === Material.sand){
					w = "o"
				}
				process.stdout.write(w);
			}
			process.stdout.write('\n');
		}
	}

	// Returns false if the sand falls off the edge
	putSand(){
		let sandx = 500;
		let sandy = 0;

		// Is our entrance blocked? (p2)
		if( this.get(sandx, sandy) !== undefined ){
			return false;
		}

		// Iterate until we land
		for(;;){
			// Have we fallen into the abyss? (+2 to account for p2)
			if( sandy > this.abyss + 2){
				return false;
			}
			// Can we move down?
			if( this.get(sandx, sandy+1) === undefined ){
				sandy += 1;
				continue;
			}
			// Can we move down and to the left?
			if( this.get(sandx-1, sandy+1) === undefined){
				sandx -= 1;
				sandy += 1;
				continue;
			}
			// Can we move down and to the right?
			if( this.get(sandx+1, sandy+1) === undefined){
				sandx += 1;
				sandy += 1;
				continue;
			}
			// Such is life!
			break;
		}
		this.set(sandx, sandy, Material.sand);
		return true;
	}
}

export async function part1(input: string){
	const world = new World(input, false);
	let sandCount = 0;
	while(world.putSand()){
		sandCount++;
	}
	world.render();
	return sandCount;
}

export function part2(input: string){
	const world = new World(input, true);
	let sandCount = 0;
	while(world.putSand()){
		sandCount++;
	}
	return sandCount;
}
