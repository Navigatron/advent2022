import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const YEAR = 2022;

yargs(hideBin(process.argv))
	.option('day', {
		alias: 'd',
		type: 'number',
		description: 'Which day to act on',
		demandOption: true
	})
	.command('init', 'setup for a day', {}, (args)=>{
		init(args['day'] as number);
	})
	.command('run', 'Run', (yargs)=>yargs
		.option('part', {
			choices: [1, 2],
			demandOption: true,
		})
		.option('test', {
			type: 'boolean',
		})
	, async (args)=>{
		const filename = args['test'] ? 'test.txt' : 'input.txt';
		const output = await run(args['day'] as number, args['part'] as number, filename);
		console.log(output);
	})
	.parse()

function testBanner(prefix: string){
	console.log(prefix+' x ---------------------------x');
	console.log(prefix+' | POPULATE test.txt YOU GOON |');
	console.log(prefix+' x ---------------------------x');
}

async function init(day: number){
	// Create directory for the day
	await fs.mkdir(`./${day}`, {recursive: true});
	console.log(`[Init] Directory ./${day} created/exists`)
	
	// Create index.ts for the day, if it doesn't already exist.
	const indexFileStats = await fs.stat(`./${day}/index.ts`).catch(()=>false);
	if( indexFileStats ){
		// The file already exists, nice.
		console.log(`[Init] Looks like ./${day}/index.ts already exists`);
	} else {
		// Create it from template
		await fs.cp('./template.ts', `./${day}/index.ts`);
		console.log('[Init] Created index.ts from template.');
	}

	// Create test.txt, if not exists, and complain if it's empty.
	const testFileStats = await fs.stat(`./${day}/test.txt`).catch(()=>false);
	if( typeof testFileStats === 'object' ){
		// Is it empty?
		if(testFileStats.size===0){
			testBanner('[Init]');
		} else {
			console.log('[Init] test.txt looks good!')
		}
	} else {
		// Create it
		await fs.writeFile(`./${day}/test.txt`, '', 'utf-8');
		console.log('[Init] Created test.txt');
		testBanner('[Init]');
	}

	// Ensure the input is here
	const inputFileStats = await fs.stat(`./${day}/input.txt`).catch(()=>false);
	if( typeof inputFileStats === 'object' ){
		console.log('[Init] You have an input.txt, not going to touch it.')
	} else {
		if( typeof process.env['AOC_SESSION'] === 'undefined'){
			console.log('[Init] Create a .env file with AOC_SESSION defined, and I can grab input.txt for you!');
		}else{
			// const input = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
			// 	// YO
			// })
		console.log('[Init] You\'re missing input.txt - I don\'t know how to get that yet, you\'ll have to make it manually.');
		}
		// how does dotenv work?
		// fetch https://adventofcode.com/{year}/day/{day}/input
		// process.AOC_COOKIE
		// await fs.writeFile(`./${day}/input.txt`, '', 'utf-8');
		// testBanner('[Init]');
	}

	console.log('[Init] Init complete!');
}

async function run(day: number, part: number, filename: string){
	const input = await fs.readFile(`./${day}/${filename}`, 'utf8');
	const {part1, part2} = await import(`./${day}/index.ts`);
	const output = part === 1 ? part1(input) : part2(input);
	return output;
}

