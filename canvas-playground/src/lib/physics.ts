export function getDistance(pos1: { [key: string]: number }, pos2: { [key: string]: number }): number {
	const x = pos1.x - pos2.x;
	const y = pos1.y - pos2.y;
	return Math.sqrt(x*x + y*y);
}

export function getDirection(pos1: { [key: string]: number }, pos2: { [key: string]: number }): { [key: string]: number } {
	const d = getDistance(pos1, pos2);
	const pos = {
		x: (pos2.x - pos1.x) / d,
		y: (pos2.y - pos1.y) / d,
	};
	return pos;
}
