export function getRandom(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

