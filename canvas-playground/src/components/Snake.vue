<script setup lang='ts'>
	import { ref, onMounted } from 'vue';
	import { get_random, get_boolean } from '../lib/generic.ts';
	import { border, draw_square } from '../lib/draw.ts';
	import { handle_resize } from '../lib/events.ts';

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
							'#ffc476',
							'#fe9b66',
							'#ff7c61',
							'#fa5d5d',
							'#ff3976'
							];
	const colorsLength = colors.length;
	const borderColorIndex = 4;
	const borderColorStroke = colors[borderColorIndex];
	const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

	// Variables
	let win = {
		w: props.width,
		w2: props.width/2,
		h: props.height,
		h2: props.height/2,
	}
	let squareNum: number = 2;
	let debug: number = 1;

	if (props.fullscreen) {
		win.w = window.innerWidth;
		win.w2 = window.innerWidth/2;
		win.h = window.innerHeight;
		win.h2 = window.innerHeight/2;
	}

	onMounted(() => {
		const canvas = canvasRef.value;
		if (!canvas) throw new Error('Canvas not found');
		const context = canvas.getContext('2d');
		if (!context) return;

		const ctx = context;

		canvas.width  = win.w;
		canvas.height = win.h;

		canvas.style.background = '#ffffff';

		function createSquare(): Square {
			const dx = (get_boolean() ? -1 : 1) * 10;
			const dy = (get_boolean() ? -1 : 1) * 10;
			const { x, y, length, color, elasticity } = {
				x: get_random(0, win.w),
				y: get_random(0, win.h),
				length: 75,
				color: colors[get_random(0, colorsLength - 2)],
				elasticity: 1
			};
			return new Square(x, y, dx, dy, length, color, elasticity);
		}

		function collision(): void {
			for (let i = 0; i < squares.length; i++) {
				const s1: Square = squares[i];
				for (let j = i + 1; j < squares.length; j++) {
					const s2: Square = squares[j];
					if (s1.pos.x + s1.l > s2.pos.x &&
						s1.pos.x - s1.l < s2.pos.x &&
						s1.pos.y + s1.l > s2.pos.y &&
						s1.pos.y - s1.l < s2.pos.y) {
						const distx: number = Math.abs(s1.pos.x - s2.pos.x);
						const disty: number = Math.abs(s1.pos.y - s2.pos.y);
						if (distx < disty) {
							s1.vel.dy = -s1.vel.dy;
							s2.vel.dy = -s2.vel.dy;
							const diff = (s1.pos.y > s2.pos.y) ? (s1.l - disty)/2 : - (s1.l - disty)/2;
							s1.pos.y += diff;
							s2.pos.y -= diff;
						} else {
							s1.vel.dx = -s1.vel.dx;
							s2.vel.dx = -s2.vel.dx;
							const diff = (s1.pos.x > s2.pos.x) ? (s1.l - distx)/2 : - (s1.l - distx)/2;
							s1.pos.x += diff;
							s2.pos.x -= diff;
						}
					}
				}
			}
		}

		// Shapes
		interface SquareInterface {
			pos: {
				x: number,
				y: number
			};
			vel: {
				dx: number,
				dy: number
			};
			l: number;
			l2: number;
			elasticity: number;
			color: string;
			draw: () => void;
			update: () => void;
		}

		class Square implements SquareInterface {
			pos: {
				x: number,
				y: number
			};
			vel: {
				dx: number,
				dy: number
			};
			l: number;
			l2: number;
			elasticity: number;
			color: string;

			// Shapes functions
			constructor(x: number, y: number,
						dx: number, dy: number,
						l: number, color: string,
						elasticity: number) {
				this.pos = { x: x, y: y };
				this.vel = { dx: dx, dy: dy };
				this.l = l;
				this.l2 = l/2;
				this.color = color;
				this.elasticity = elasticity;
			}

			draw(): void {
				draw_square(ctx, this.pos.x, this.pos.y, this.vel.dx, this.vel.dy, this.l, debug, this.color, borderColorStroke);
			}

			move(): void {
				this.pos.x += this.vel.dx;
				this.pos.y += this.vel.dy;

				if (this.pos.x - this.l2 < 0) {
					this.vel.dx = Math.abs(this.vel.dx) * this.elasticity;
					this.pos.x = this.l2;
				}
				if (this.pos.x + this.l2 > win.w) {
					this.vel.dx = - Math.abs(this.vel.dx) * this.elasticity;
					this.pos.x = win.w - this.l2;
				}
				if (this.pos.y - this.l2 < 0) {
					this.vel.dy = Math.abs(this.vel.dy) * this.elasticity;
					this.pos.y = this.l2;
				}
				if (this.pos.y + this.l2 > win.h) {
					this.vel.dy = - Math.abs(this.vel.dy) * this.elasticity;
					this.pos.y = win.h - this.l2;
				}

			}

			update(): void {
				this.move();
				this.draw();
			}
		}

		// Events
		window.addEventListener (
			'click',
			() => {
				ctx.clearRect(0, 0, win.w, win.h);
				border(ctx, 'Snake');
				squares = [];
				for (let i = 0; i < squareNum; i++)
					squares.push(createSquare());
				ctx.strokeStyle = borderColorStroke;
				ctx.fillStyle = borderColorFill;
			}
		)

		if (props.fullscreen) {
			window.addEventListener ('resize', () => handle_resize(win, window.innerWidth, window.innerHeight, ctx))
		}

		// Main function
		let squares: Array<Square> = [];
		for (let i = 0; i < squareNum; i++) {
			squares.push(createSquare());
		}
		ctx.strokeStyle = borderColorStroke;
		ctx.fillStyle = borderColorFill;
		border(ctx, 'Snake');

		function drawAnimation(): void {
			for (let s of squares) {
				s.update();
			}
			collision();
			ctx.fillStyle = borderColorFill;
			ctx.strokeStyle = borderColorStroke;
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
