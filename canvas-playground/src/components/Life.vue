<script setup lang='ts'>
	import { ref, onMounted } from 'vue';

	// Arguments
	const props = defineProps({
		fullscreen: {
			type: Boolean,
			default: false,
		},
		width: {
			type: Number,
			default: 300,
			validator: (value: number) => Number.isInteger(value)
		},
		height: {
			type: Number,
			default: 400,
			validator: (value: number) => Number.isInteger(value)
		}
	});

	// Refs
	const canvasRef = ref<HTMLCanvasElement | null>(null);

	// Constants
	const colors: string[] = [
							'#f2167d',
							'#049dd9',
							'#05c7f2',
							'#f2b035',
							'#f28963'
							];
	const colorsLength = colors.length;
	const borderColorIndex = 0;
	const borderColorStroke = colors[borderColorIndex];
	const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

	// Variables
	let updateGame = true;
	let invertCell = false;
	let win = {
		w: 300,
		w2: 150,
		h: 400,
		h2: 200
	}
	if (props.fullscreen) {
		win.w = window.innerWidth;
		win.w2 = window.innerWidth/2;
		win.h = window.innerHeight;
		win.h2 = window.innerHeight/2;
	} else {
		win.w = props.width;
		win.w2 = props.width/2;
		win.h = props.height;
		win.h2 = props.height/2;
	}

	// Essential functions
	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	function border(ctx: CanvasRenderingContext2D) {
		const border = 10;
		const gap = 5;
		ctx.strokeStyle = borderColorStroke;
		ctx.fillStyle = borderColorFill;

		let offset = border;
		ctx.lineWidth = 2;
		ctx.strokeRect(border, border, win.w - 2*offset, win.h - 2*offset);

		offset += gap;
		ctx.lineWidth = 5;
		ctx.strokeRect(offset, offset, win.w - 2*offset, win.h - 2*offset);

		offset += gap;
		ctx.lineWidth = 2;
		ctx.strokeRect(offset, offset, win.w - 2*offset, win.h - 2*offset);

		const offsetLetter = 3;
		let title = 'Life';
		ctx.font = `100px Bebas Neue`;
		ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2), 120);
		ctx.strokeText(title, (win.w2) - offsetLetter - (ctx.measureText(title).width / 2), 120 - offsetLetter);

		title = '/Htsuyoshi';
		ctx.font = `50px Bebas Neue`;
		ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2), 170);
		ctx.strokeText(title, (win.w2) - offsetLetter - (ctx.measureText(title).width / 2), 170 - offsetLetter);

		if(!isMobileDevice()) {
			title = 'Left click';
			ctx.font = `60px Bebas Neue`;
			ctx.fillText(title, (win.w2/2) - (ctx.measureText(title).width / 2), win.h2);
			ctx.strokeText(title, (win.w2/2) - offsetLetter - (ctx.measureText(title).width / 2), win.h2 - offsetLetter);

			title = 'Pause/Start';
			ctx.font = `30px Bebas Neue`;
			ctx.fillText(title, (win.w2/2) - (ctx.measureText(title).width / 2), win.h2 + 50);
			ctx.strokeText(title, (win.w2/2) - offsetLetter - (ctx.measureText(title).width / 2), win.h2 + 50 - offsetLetter);

			title = 'Right click';
			ctx.font = `60px Bebas Neue`;
			ctx.fillText(title, (win.w2*3/2) - (ctx.measureText(title).width / 2), win.h2);
			ctx.strokeText(title, (win.w2*3/2) - offsetLetter - (ctx.measureText(title).width / 2), win.h2 - offsetLetter);

			title = 'Invert';
			ctx.font = `30px Bebas Neue`;
			ctx.fillText(title, (win.w2*3/2) - (ctx.measureText(title).width / 2), win.h2 + 50);
			ctx.strokeText(title, (win.w2*3/2) - offsetLetter - (ctx.measureText(title).width / 2), win.h2 + 50 - offsetLetter);
		}
	}

	onMounted(() => {
		// Setup canvas
		const canvas = canvasRef.value;
		if (!canvas) throw new Error('Canvas not found');
		const context = canvas.getContext('2d');
		if (!context) return;

		const ctx: CanvasRenderingContext2D = context;

		canvas.width  = win.w;
		canvas.height = win.h;
		canvas.style.background = '#ffffff';

		// Game
		class Game {
			grid: number[][];
			cols: number;
			rows: number;
			size: number;
			alive: Map<string, { x: number, y: number }>;
			reset: Map<string, { x: number, y: number }>;

			constructor() {
				this.size = 10;
				this.cols = Math.floor(win.w / this.size);
				this.rows = Math.floor(win.h / this.size);
				this.grid = Array.from({ length: this.cols }, () =>
					Array(this.rows).fill(0)
				);
				this.alive = new Map();
				this.reset = new Map();
			}

			public resize(): void {
				this.cols = Math.floor(win.w / this.size);
				this.rows = Math.floor(win.h / this.size);
				this.grid = Array.from({ length: this.cols }, () =>
					Array(this.rows).fill(0)
				);
				for (let c of this.reset) {
					if (c[1].x >= this.cols ||
						c[1].y >= this.rows) {
						this.reset.delete(c[0]);
						continue;
					}
				}
				for (let c of this.alive) {
					if (c[1].x >= this.cols ||
						c[1].y >= this.rows) {
						this.alive.delete(c[0]);
						continue;
					}
				}
			}

			public draw(): void {
				ctx.beginPath();
				ctx.fillStyle = borderColorFill;
				for (let c of this.alive.values()) {
					ctx.fillRect(c.x * this.size, c.y * this.size, this.size, this.size);
					// Debugging
					//ctx.strokeRect(c.x * this.size, c.y * this.size, this.size, this.size);
					//let title = `${this.grid[c.x][c.y]}`;
					//ctx.font = '30px Bebas Neue';
					//ctx.fillText(title, c.x * this.size + 30, c.y * this.size + 50);
				}
			}

			public mouseAdd(x: number, y: number): void {
				this.addCell(Math.floor(x/this.size), Math.floor(y/this.size));
			}

			public mouseRemove(x: number, y: number): void {
				const key = [Math.floor(x/this.size), Math.floor(y/this.size)].toString();
				if (this.alive.has(key))
					this.alive.delete(key);
			}

			public addCell(x: number, y: number): void {
				if (x < 0 && x >= this.cols
					&& y < 0 && y >= this.rows) {
					console.error(`x: ${x}, cols: ${this.cols}`);
					console.error(`y: ${y}, rows: ${this.rows}`);
					return;
				}
				const key: string = [x, y].toString();
				this.alive.set(key, { x: x , y: y});
			}

			private updateCells(): void {
				for (let c of this.reset.values()) {
					const key: string = [c.x, c.y].toString();
					if (this.alive.has(key)) {
						if (this.grid[c.x][c.y] < 2 ||
							this.grid[c.x][c.y] > 3 ) {
							this.alive.delete(key);
							continue;
						}
						continue;
					}
					if (this.grid[c.x][c.y] === 3) {
						this.alive.set(key, { x: c.x, y: c.y});
					}
				}
			}

			private updateNeighbours(): void {
				for (let c of this.alive.values()) {
					for (let off_x=-1; off_x<=1; ++off_x) {
						for (let off_y=-1; off_y<=1; ++off_y) {
							let x = c.x + off_x;
							let y = c.y + off_y;
							if (c.x + off_x < 0)
								x = this.cols - 1;
							if (c.x + off_x >= this.cols)
								x = 0;
							if (c.y + off_y < 0)
								y = this.rows - 1;
							if (c.y + off_y >= this.rows)
								y = 0;
							if (off_x !== 0 || off_y !== 0) {
								this.grid[x][y] += 1;
							}
							const key: string = [x, y].toString();
							if (this.reset.has(key)) continue;
							this.reset.set(key, { x: x, y: y });
						}
					}
				}
			}

			private resetNeighbours(): void {
				for (let c of this.reset.values()) {
					this.grid[c.x][c.y] = 0;
				}
				this.reset = new Map();
			}

			public update(): void {
				this.resetNeighbours();
				this.updateNeighbours();
				this.updateCells();
			}
		}

		// Events
		if(!isMobileDevice()) {
			window.addEventListener (
				'mousemove',
				(e) => {
					if (invertCell) {
						game.mouseRemove(e.clientX, e.clientY);
					} else {
						game.mouseAdd(e.clientX, e.clientY);
					}
				}
			)
			window.addEventListener (
				'click',
				() => {
					updateGame = !updateGame;
				}
			)
			window.addEventListener(
				'contextmenu',
				(e) => {
					e.preventDefault();
					invertCell = !invertCell;
				}
			);
		} else {
			window.addEventListener (
				'touchstart',
				(e) => {
					for (let t of e.changedTouches) {
						game.mouseAdd(t.clientX, t.clientY);
					}
				}
			)

			window.addEventListener (
				'touchmove',
				(e) => {
					for (let t of e.changedTouches) {
						game.mouseAdd(t.clientX, t.clientY);
					}
				}
			)
		}

		if (props.fullscreen) {
			window.addEventListener (
				'resize',
				function () {
					win.w = window.innerWidth;
					win.w2 = window.innerWidth/2;
					win.h = window.innerHeight;
					win.h2 = window.innerHeight/2;
					ctx.canvas.width  = win.w;
					ctx.canvas.height = win.h;
					game.resize();
				}
			)
		}

		// Main function
		const game = new Game();
		game.addCell(0,0);
		game.addCell(2,0);
		game.addCell(1,1);
		game.addCell(2,1);
		game.addCell(1,2);

		let t = 0;
		let delay = 1000 / 24;
		if(isMobileDevice()) {
			delay = 1000 / 18;
		}

		function drawAnimation(timestamp: DOMHighResTimeStamp): void {
			const dt = timestamp - t;
			ctx.clearRect(0, 0, win.w, win.h);
			game.draw();
			border(ctx);
			if (dt >= delay) {
				t = timestamp;
				if (updateGame)
					game.update();
			}
			requestAnimationFrame(drawAnimation);
		}

		requestAnimationFrame(drawAnimation);
	});
</script>

<template>
	<canvas ref='canvasRef'></canvas>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
</style>
