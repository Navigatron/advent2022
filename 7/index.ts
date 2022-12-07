import * as path from 'node:path';

// Go S3 style: FLAT!
type Files = Record<string, number | undefined>;

function parseFiles(input: string): Files{
	// File map
	const files: Files = {};
	// Current working directory
	let prefix = '/';
	// Iterate over lines
	input.trim().split('\n').forEach(line=>{
		let lineMatch;
		if( lineMatch = line.match(/\$ cd (.+)$/) as [string, string] ){
			// CD
			prefix = path.resolve(prefix, lineMatch[1]);
		} else if( lineMatch = line.match(/(\d+|dir) ([\w\.]+)/) as [string, string, string] ){
			// New file at cd+name, with size N (or undefined if dir)
			files[path.resolve(prefix, lineMatch[2])] = lineMatch[1] === 'dir' ? undefined : Number.parseInt(lineMatch[1]);
		}
	});
	return files;
}

export function part1(input: string){
	const files = parseFiles(input);
	// Iterate over paths
	return Object.keys(files)
		// filter to dirs
		.filter(pathname => !files[pathname])
		// map to sizes
		.map(dirname => Object.keys(files)
			// Filter to files in this dir
			.filter(pathname => pathname.startsWith(dirname+'/'))
			// Aggregate their sizes
			.reduce((a,filename)=>a+(files[filename] ?? 0),0)
		)
		// Filter to those less than 100k
		.filter(n=>n<=100000)
		// Sum
		.reduce((a,e)=>a+e,0);
}

export function part2(input: string){
	const files = parseFiles(input);
	// How big is root? The sum of all files
	const rootSize = Object.values(files).reduce((a,e)=>(a as number)+(e ?? 0),0) as number;
	// How much free space do we have?
	const free = 70000000 - rootSize;
	// How much more disk space do we need? 30M minus what we already have 
	const needToFree = 30000000 - free;
	// Iterate over paths
	return Object.keys(files)
		// Filter to directories (no size value)
		.filter(pathname => !files[pathname])
		// Map to sizes (sum of all files with same prefix)
		.map(dirname => Object.keys(files)
			// Filter to files in this directory
			.filter(pathname => pathname.startsWith(dirname+'/'))
			// Aggregate their sizes
			.reduce((a,filename)=>a+(files[filename] ?? 0),0)
		)
		// Filter to directories big enough to be worth deleting
		.filter(dirSize=>dirSize>=needToFree)
		// Sort so smallest is on top, and return :)
		.sort((a,b)=>a-b)[0];
}
