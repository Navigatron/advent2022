
function mhd(x1: number, y1: number, x2: number, y2: number){
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function parseInput(input: string){
	const sensors: {x: number, y: number, range: number}[] = [];
	const beacons: {x: number, y: number}[] = [];
	input.trim().split('\n').forEach(line=>{
		const match = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/) as [string, string, string, string, string];
		const s = {
			sx: Number.parseInt(match[1]),
			sy: Number.parseInt(match[2]),
			bx: Number.parseInt(match[3]),
			by: Number.parseInt(match[4]),
		};
		sensors.push({
			x: s.sx,
			y: s.sy,
			range: mhd(s.sx, s.sy, s.bx, s.by)
		});
		beacons.push({
			x: s.bx,
			y: s.by,
		});
	});
	return {
		sensors,
		beacons,
	};
}

export function part1(input: string){
	const {sensors, beacons} = parseInput(input);
	
	// const ytest = 10;
	const ytest = 2000000;

	// What is the furthest left that we can go?
	const minx = sensors.map(s=>s.x-(s.range - Math.abs(s.y - ytest))).reduce((a,e)=>Math.min(a,e), Infinity);
	// Furthest right?
	const maxx = sensors.map(s=>s.x+(s.range - Math.abs(s.y - ytest))).reduce((a,e)=>Math.max(a,e),-Infinity);

	// Filter to beacons on the same y level
	let yBeacons = beacons.filter(b=>b.y===ytest);

	// Counting spaces that can't have a beacon
	let count = 0;
	for(let xtest = minx; xtest <= maxx; xtest++){
		// "A beacon cannot exist here, if we're inside a sensor's range"
		// Iterate over sensors, test for locality.
		for( let sensor of sensors ){
			if( mhd(sensor.x, sensor.y, xtest, ytest) <= sensor.range ){
				// console.log(`Point (${xtest},${ytest}) is in range of sensor (${sensor.x},${sensor.y}) with range ${sensor.range}`);
				// But is that point a beacon? only count if not.
				if( !yBeacons.some(b=>b.x===xtest)){
					count++;
					break;
				}
			}
		}
	}

	return count;
}

export function part2(input: string){
	const {sensors} = parseInput(input);
	//// Test mode:
	// let maxx = 20;
	// let maxy = 20;
	//// Real:
	let maxx = 4000000;
	let maxy = 4000000;

	for(let y=0; y<=maxy; y++){
		for(let x=0; x<=maxx; x++){
			const overlappers = sensors.filter(s=>mhd(s.x,s.y,x,y)<=s.range);
			if(overlappers.length === 0){
				console.log(`> found it at x=${x} y=${y}`);
				return x*4000000+y;
			}else{
				// Skipping ahead reduces iterations per row from 4 MILLION to 4!
				x = overlappers.map(s=>s.x+(s.range-Math.abs(s.y-y))).reduce((a,e)=>Math.max(a,e),-Infinity);
			}
		}
	}
	throw new Error('didnt find it :(');
}
