
export function part1(input: string){
	// this shouldn't work but it does
	return ((input.match(/(?:([A-Za-z])(?!.{0,3}\1)){4}/) as RegExpMatchArray).index as number)+4;
}

export function part2(input: string){
	for(let i = 14; i< input.length; i++){
		const slice = input.slice(i-14, i);
		// 14 consecutive characters that do not appear a second time
		if( slice.match(/(?:(.)(?!.*\1)){14}/) ){
			return i;
		}
	}
	throw new Error("no match");
}
