export function get_boolean(): boolean {
	return (Math.random() > 0.5);
}

export function get_random(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function is_mobile_device() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
