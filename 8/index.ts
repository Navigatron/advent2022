// This is bad code and I am not proud of it

function treeVisible(forest: number[][], y: number, x: number): boolean {
	const seeable = [true, true, true, true];
	// test above - tree not visible if taller one in way
	for(let yt = 0; yt<y; yt++){
		if(((forest[yt] as number[])[x] as number) >= ((forest[y] as number[])[x] as number)){
			seeable[0] = false;
			break;
		}
	}
	// test below
	for(let yt = y+1; yt<forest.length; yt++){
		if(((forest[yt] as number[])[x] as number) >= ((forest[y] as number[])[x] as number)){
			seeable[1] = false;
			break;
		}
	}
	// test left
	const row = forest[y] as number[];
	for(let xt = 0; xt<x; xt++){
		if((row[xt] as number) >= (row[x] as number)){
			seeable[2] = false;
			break;
		}
	}
	// test right
	for(let xt = x+1; xt<row.length; xt++){
		if((row[xt] as number) >= (row[x] as number)){
			seeable[3] = false;
			break;
		}
	}
	// tree is visible if visible from any direction
	return seeable.reduce((a,e)=>a||e,false);
}

export function part1(input: string){
	const forest = input.split('\n').map(l=>l.split('').map(n=>Number.parseInt(n))) as number[][];

	const result: boolean[][] = [];

	forest.forEach((row, y)=>{
		result[y] = [];
		row.forEach((_t, x)=>{
			(result[y] as boolean[])[x] = treeVisible(forest, y, x);
		});
	});

	return result.reduce((a,e)=>a+(e.reduce((b,f)=>b+(f ? 1 : 0),0)),0);
}

// ---- 2 ----

type Point = {
	x: number;
	y: number;
};

// How many trees do we see in (direction)?
function scanCount(forest: number[][], position: Point, direction: Point): number{
	let testPoint = {x: position.x, y: position.y};
	let treesCanSee = 0;
	const currentRow = forest[position.y] as number[];
	let currentHeight = currentRow[position.x] as number;
	for(;;){
		// Do not test where we are; iterate first
		testPoint.x += direction.x;
		testPoint.y += direction.y;
		// If this testPoint is in bounds, then we can see this tree.
		if(testPoint.x >= 0 && testPoint.x < currentRow.length && testPoint.y >= 0 && testPoint.y < forest.length){
			treesCanSee += 1;
		} else {
			break;
		}
		// If this tree is the same height as ours or taller, then it's the last we can see in this direction.
		if(((forest[testPoint.y] as number[])[testPoint.x] as number) >= currentHeight){
			break;
		}
	}
	return treesCanSee;
}

export function part2(input: string){
	const forest = input.trim().split('\n').map(l=>l.split('').map(n=>Number.parseInt(n))) as number[][];

	const result: number[][] = [];

	forest.forEach((row, y)=>{
		result[y] = [];
		row.forEach((_t, x)=>{
			(result[y] as number[])[x] = [
				{x:  0, y: -1}, // up
				{x:  0, y:  1}, // down
				{x: -1, y:  0}, // left
				{x:  1, y:  0}, // right
			].map(dir=>scanCount(forest, {x,y}, dir)).reduce((a,e)=>a*e,1);
		});
	});

	return result.reduce((forestMax,row)=>{
		const rowMax = row.reduce((rowMax, h)=>h>rowMax?h:rowMax,0);
		return rowMax > forestMax ? rowMax : forestMax;
	},0);

	// no good
	// 2468544
}
