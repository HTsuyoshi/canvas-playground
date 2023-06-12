export function get_distance(pos1: { [key: string]: number }, pos2: { [key: string]: number }): number {
	const x = pos1.x - pos2.x;
	const y = pos1.y - pos2.y;
	return Math.sqrt(x*x + y*y);
}

export function get_direction(pos1: { [key: string]: number }, pos2: { [key: string]: number }): { [key: string]: number } {
	const d = get_distance(pos1, pos2);
	const pos = {
		x: (pos2.x - pos1.x) / d,
		y: (pos2.y - pos1.y) / d,
	};
	return pos;
}

export function easeOutQuad(x: number): number {
	return 1 - (1 - x) * (1 - x);
}

