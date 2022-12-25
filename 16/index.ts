
type Valve = {
	id: string;
	flowRate: number;
	neighborIds: string[];
	neighbors: Valve[];
	open: boolean;
	distanceTo: Record<string, number>;
};

class World{
	valves: Record<string, Valve> = {};

	constructor(input: string){
		input.trim().split('\n').forEach(line=>{
			const match = line.match(/Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/) as [string, string, string, string];
			const valveId = match[1];
			const flowRate = Number.parseInt(match[2]);
			const neighborIds = match[3].split(', ');
			this.valves[valveId] = {
				id: valveId,
				flowRate,
				neighborIds,
				neighbors: [],
				open: false, // All valves start closed
				distanceTo: {},
			};
		});
		// Populate neighbor links
		Object.values(this.valves).forEach(valve=>{
			for(let neighborId of valve.neighborIds){
				valve.neighbors.push(this.valves[neighborId] as Valve);
			}
		});
		// Pre-compute distances
		Object.values(this.valves).forEach(v=>{
			Object.values(this.valves).forEach(w=>{
				v.distanceTo[w.id] = this.distance(v, w);
			});
		});
	}

	distance(start: Valve, end: Valve){
		const dap: Record<string, number> = {};
		dap[start.id] = 0;
		const toVisit: Valve[] = [start];
		for(;;){
			const visiting = toVisit.pop();
			if(visiting === undefined){
				return dap[end.id] as number;
			}
			const newDistance = (dap[visiting.id] as number) + 1;
			for(let neighbor of visiting.neighbors){
				const nd = dap[neighbor.id];
				if(typeof nd === 'undefined' || nd > newDistance){
					dap[neighbor.id] = newDistance;
					toVisit.push(neighbor);
				}
			}
		}
	}
}

export function part1(input: string){
	const world = new World(input);
	let start = world.valves['AA'] as Valve;

	// Return the max possible quantity of pressure release, given a start somewhere at some time
	const solve = (v: Valve, timeLeft: number, points: number): number => {
		// console.log(`At ${v.id} with ${timeLeft} minutes left and ${points} points.`);
		// Get our options
		const opts = Object.values(world.valves)
			// Filter to valves we can open, that are worth opening (flow>0), and do so with time remaining
			.filter(w=> (!w.open) && w.flowRate > 0 && ((v.distanceTo[w.id] as number)+1) < timeLeft)
			// For each option, How many points would we gain?
			.map(w=>{
				const newTimeLeft = timeLeft - ((v.distanceTo[w.id] as number)+1);
				const pointGain = w.flowRate * newTimeLeft;
				w.open = true;
				const result = solve(w, newTimeLeft, points+pointGain);
				w.open = false;
				return result;
			});
		// No options? Very well, stay put.
		if(opts.length===0){
			return points;
		}
		// Return most valuable option
		return opts.reduce((a,e)=>e>a?e:a,-Infinity);
	};

	return solve(start, 30, 0);
}

// This takes forever, but it works.
export function part2(input: string){
	const world = new World(input);
	let start = world.valves['AA'] as Valve;

	// Return the max possible quantity of pressure release, given a start somewhere at some time
	// @param closed - An array of Valve IDs that are closed.
	const solve = (humanPos: Valve, humanTime: number, elephantPos: Valve, elephantTime: number, points: number, visited: string[]): number => {
		let actor: string, actorPos: Valve, actorTime: number;
		if(humanTime >= elephantTime){
			actor = 'human';
			actorPos = humanPos;
			actorTime = humanTime;
		}else{
			actor = 'elephant';
			actorPos = elephantPos;
			actorTime = elephantTime;
		}
		
		// Get our options
		const opts = Object.values(world.valves)
			// Filter to valves we can open, that are worth opening (flow>0), and do so with time remaining
			.filter(w=> !visited.includes(w.id) && w.flowRate > 0 && ((actorPos.distanceTo[w.id] as number)+1) < actorTime)
			// For each option, How many points would we gain?
			.map((w,i,a)=>{
				const newTimeLeft = actorTime - ((actorPos.distanceTo[w.id] as number)+1);
				const pointGain = w.flowRate * newTimeLeft;
				let result;
				if(actor==='human'){
					// console.log(`The ${actor} is moving to ${w.id}, and will have ${newTimeLeft} minutes remaining.`);
					result = solve(w, newTimeLeft, elephantPos, elephantTime, points+pointGain, [w.id, ...visited]);
				}else{
					// console.log(`The ${actor} is moving to ${w.id}, and will have ${newTimeLeft} minutes remaining.`);
					result = solve(humanPos, humanTime, w, newTimeLeft, points+pointGain, [w.id, ...visited]);
				}
				if(visited.length === 2){
					console.log(`>>>>>> Progress: ${i+1}/${a.length} = ${Math.round(((i+1)/a.length)*100)}%`);
				}
				if(visited.length === 1){
					console.log(`>>> Progress: ${i+1}/${a.length} = ${Math.round(((i+1)/a.length)*100)}%`);
				}
				if(humanTime === 26){
					console.log(`Progress: ${i+1}/${a.length} = ${Math.round(((i+1)/a.length)*100)}%`);
				}
				return result;
			});
		// No options? Very well, stay put.
		if(opts.length===0){
			return points;
		}
		// Return most valuable option
		return opts.reduce((a,e)=>e>a?e:a,-Infinity);
	};
	return solve(start, 26, start, 26, 0, []);
}
