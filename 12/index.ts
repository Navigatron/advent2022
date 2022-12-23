
type Point = {
	elevation: number;
	y: number;
	x: number;
	distance: number;
};

class Map{
	map: Point[][];
	start!: Point;
	end!: Point;
	constructor(input: string){
		this.map = input.trim().split('\n').map((s,y)=>s.split('').map((c,x)=>{
			let p: Point = {
				elevation: c.charCodeAt(0) - 96, // a = 1
				distance: Infinity,
				y,
				x,
			};
			if(c==='S'){
				p.elevation = 1; // hard coded - start is a
				this.start = p;
			}
			if(c==='E'){
				p.elevation = 26; // hard coded - end is z
				p.distance = 0;
				this.end = p;
			}
			return p;
		}));
	}
	// Get a point by cords
	get(x: number, y: number): Point | undefined {
		const row: Point[] | undefined = this.map[y];
		const cell: Point | undefined = row?.[x];
		return cell;
	}
	// Return array of neighbors to a point
	getNeighbors(p: Point): Point[] {
		const neighbors = [];
		neighbors.push(this.get(p.x - 1, p.y));
		neighbors.push(this.get(p.x + 1, p.y));
		neighbors.push(this.get(p.x, p.y - 1));
		neighbors.push(this.get(p.x, p.y + 1));
		return neighbors.filter(q => q !== undefined) as Point[];
	}
	// Create a string
	render(){
		return this.map.map(row=>row.map(c=>c.distance !== undefined ? `[${(''+c.distance).padStart(2)}]` : '[..]').join('')).join('\n')
	}
	// Dijkstra map, starting at end
	// I used A* first, but part 2 works better with Dijkstra's, and it's not that much slower
	solve(){
		let toVisit: Point[] = [this.end];
		for(;;){
			// Visit point
			const visiting = toVisit.pop();
			// Detect end
			if(visiting === undefined){
				break;
			}
			// Get neighbors
			const neighbors: Point[] = this.getNeighbors(visiting).filter(n=>{
				// We can only get here from this neighbor if we are not too tall
				return visiting.elevation - n.elevation <= 1;
			});
			// Each neighbor has its distance updated, added to toVisit array
			let setDistance = visiting.distance as number + 1;
			neighbors.forEach(n=>{
				if( n.distance > setDistance ){
					n.distance = setDistance;
					toVisit.push(n);
				}
			});
		}
	}
}

export function part1(input: string){
	const myMap = new Map(input);
	myMap.solve();
	return myMap.start.distance;
}

export function part2(input: string){
	const myMap = new Map(input);
	myMap.solve();

	const startingPoints = myMap.map.flat().filter(p=>p.elevation===1);
	return startingPoints.reduce((a,e)=>Math.min(a,e.distance), Infinity);
}
