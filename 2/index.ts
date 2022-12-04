
type Action = 'rock' | 'paper' | 'scissors';
function actionToPoints(act: Action){
	return {
		'rock': 1,
		'paper': 2,
		'scissors': 3,
	}[act];
}

type EncryptedAction = 'A'|'B'|'C'|'X'|'Y'|'Z';
function codeToAction(code: EncryptedAction): Action{
	return {
		'A': 'rock',
		'B': 'paper',
		'C': 'scissors',
		'X': 'rock',
		'Y': 'paper',
		'Z': 'scissors',
	}[code] as Action;
}

// Actions are beaten by the next one in the array, wrapping.
const actionPrecedence = ['rock', 'paper', 'scissors'];

function doIWin(them: Action, me: Action): boolean{ 
	const theirPrecedence = actionPrecedence.indexOf(them);
	const myPrecedence = actionPrecedence.indexOf(me);

	// You win if you are at exactly them+1 (mod length of actions)
	return (theirPrecedence+1)%actionPrecedence.length === myPrecedence;
}

function roundToPoints(round: Round): number{
	let points = 0;
	const theirAction = round[0];
	const myAction = round[1];

	// I get points for making a play
	points += actionToPoints(myAction);

	// I get three more points if there's a tie
	if(theirAction === myAction){
		points += 3;
	}

	// I get 6 more points if I won!
	if( doIWin(theirAction, myAction) ){
		points += 6;
	}

	// I get no points for a loss - no action required.
	
	return points;
}

type Round = [Action, Action];
function inputToRounds(input: string): Round[]{
	return input.trim().split('\n').map((line: string) =>{
		const [them, me] = line.split(' ') as [EncryptedAction, EncryptedAction];
		return [codeToAction(them), codeToAction(me)];
	});
}

export function part1(input: string){
	const rounds: Round[] = inputToRounds(input);
	console.log(rounds);
	const asPoints = rounds.map(round=>roundToPoints(round));
	console.log(asPoints);
	// return sum
	return asPoints.reduce((a,e)=>a+e, 0);
	// 13058 is wrong
}

type EncryptedOutcome = 'X' | 'Y' | 'Z';
type Outcome = 'win' | 'draw' | 'loss';
function codeToOutcome(code: EncryptedOutcome): Outcome {
	return {
		'X': 'loss',
		'Y': 'draw',
		'Z': 'win',
	}[code] as Outcome;
}

function deriveAction(theirAction: Action, desiredOutcome: Outcome): Action {

	// We want our action to be relative to theirs, based on the desired outcome
	const offset = {
		'win': 1,
		'draw': 0,
		'loss': -1,
	}[desiredOutcome];

	// Convert their index to ours
	let ourIndex = (actionPrecedence.indexOf(theirAction)+offset)%actionPrecedence.length

	// Mod has an edge case in the negatives
	if(ourIndex < 0){
		ourIndex += actionPrecedence.length;
	}

	const ourAction = actionPrecedence[ourIndex] as Action;

	console.log(`If they play ${theirAction}, and we want to ${desiredOutcome}, we should play ${ourAction}`);
	
	return ourAction;
}

export function part2(input: string){

	const rounds: Round[] = input.trim().split('\n').map((line: string) =>{
		const [them, me] = line.split(' ') as [EncryptedAction, EncryptedOutcome];
		const theirAction = codeToAction(them);
		const myAction = deriveAction(theirAction, codeToOutcome(me));
		return [theirAction, myAction];
	});
	
	const asPoints = rounds.map(round=>roundToPoints(round));
	console.log(asPoints);

	return asPoints.reduce((a,e)=>a+e, 0);
}
