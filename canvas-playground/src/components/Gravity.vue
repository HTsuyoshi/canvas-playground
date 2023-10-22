<script setup lang='ts'>
	import { ref, onMounted } from 'vue';
	import { get_random, get_boolean, is_mobile_device } from '../lib/generic.ts';
	import { border, buttons, draw_circle, drawing_styles } from '../lib/draw.ts';
	import { handle_resize, handle_mouse_click, handle_mouse_move, handle_esc_click } from '../lib/events.ts';

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
							'#9c13bf',
							'#4f217f',
							'#ff12fb',
							'#0b1240',
							'#e5006a'
							];
	const colorsLength = colors.length;
	const borderColorIndex = 1;
	const borderColorStroke = colors[borderColorIndex];
	const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

	// Variables
	let win = {
		w: props.width,
		w2: props.width/2,
		h: props.height,
		h2: props.height/2
	}
	let mouse = {
		x: 0,
		y: 0
	}
	let ballNum: number = 50;
	let debug: number = 1;
	var gravity = 0.5;
	var gravityDirection = {
		x: 0,
		y: 1
	};

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

		function createBall(): Circle {
			let dx = (get_boolean() ? 1 : -1) * get_random(1, 2);
			let dy = (get_boolean() ? 1 : -1) * get_random(1, 2);
			const { x, y, radius, color, friction } = {
				x: get_random(0, win.w),
				y: get_random(0, win.h),
				radius: get_random(5, 5),
				color: colors[get_random(0, colorsLength - 1)],
				friction: Math.random()
			};
			return new Circle(x, y, dx, dy, radius, color, friction);
		}

		canvas.style.background = '#ffffff';

		// Shapes
		interface CircleInterface {
			x: number;
			y: number;
			dx: number;
			dy: number;
			r: number;
			friction: number;
			color: string;
			draw: () => void;
			update: () => void;
		}

		class Circle implements CircleInterface {
			x: number;
			y: number;
			dx: number;
			dy: number;
			r: number;
			friction: number;
			color: string;

			// Shapes functions
			constructor(x: number, y: number,
						dx: number, dy: number,
						r: number, color: string,
						friction: number) {
				this.x = x;
				this.y = y;
				this.dx = dy;
				this.dy = dx;
				this.r = r;
				this.color = color;
				this.friction = friction;
			}

			draw(): void {
				draw_circle(ctx, this.x, this.y, this.dx, this.dy, this.r, debug, this.color, borderColorStroke)
			}

			move(): void {
				if (this.y + this.r <= win.h && this.y - this.r >= 0)
					this.dy += gravity * gravityDirection.y;
				if (this.x + this.r <= win.w && this.x - this.r >= 0)
					this.dx += gravity * gravityDirection.x;

				this.x += this.dx;
				this.y += this.dy;

				if (this.x - this.r < 0) {
					this.dx = Math.abs(this.dx) * this.friction;
					this.x = this.r;
				}
				if (this.x + this.r > win.w) {
					this.dx = - Math.abs(this.dx) * this.friction;
					this.x = win.w - this.r;
				}
				if (this.y - this.r < 0) {
					this.dy = Math.abs(this.dy) * this.friction;
					this.y = this.r;
				}
				if (this.y + this.r > win.h) {
					this.dy = - Math.abs(this.dy) * this.friction;
					this.y = win.h - this.r;
				}

			}

			update(): void {
				this.move();
				this.draw();
			}
		}

		// Event
		window.addEventListener ('click', (e) => handle_mouse_click(e, win, circles, createBall));
		if (!is_mobile_device()) {
			window.addEventListener (
				'mousemove',
				(e) => {
					handle_mouse_move(e, mouse);

					const x = mouse.x - (win.w2);
					const y = mouse.y - (win.h2);
					let magnitude = Math.sqrt(x*x + y*y);
					gravity = 250*magnitude/((win.w2)*(win.w2) + (win.h2)*(win.h2));
					gravityDirection.x = x/magnitude;
					gravityDirection.y = y/magnitude;
				}
			)
			window .addEventListener('keydown', (e) => { debug = handle_esc_click(e, drawing_styles, debug) });
		} else {
			if (window.DeviceOrientationEvent) {
				window.addEventListener(
				'deviceorientation',
				(e) => {
					//let alpha = e.alpha;
					let beta  = e.beta;
					if (beta === null) beta = 0;
					let gamma = e.gamma;
					if (gamma === null) gamma = 0;

					gravityDirection.x = 2*gamma / 90;
					gravityDirection.y = 2*beta / 90;
				});
			} else {
				window.addEventListener (
					'mousemove',
					(e) => {
						mouse.x = e.x;
						mouse.y = e.y;

						const x = mouse.x - (win.w2);
						const y = mouse.y - (win.h2);
						let magnitude = Math.sqrt(x*x + y*y);
						gravity = 250*magnitude/((win.w2)*(win.w2) + (win.h2)*(win.h2));
						gravityDirection.x = x/magnitude;
						gravityDirection.y = y/magnitude;
					}
				)
			}
		}

		if (props.fullscreen) {
			window.addEventListener ('resize', () => handle_resize(win, window.innerWidth, window.innerHeight, ctx))
		}

		// Main function
		let circles: Array<Circle> = [];
		for (let i = 0; i < ballNum; i++) {
			circles.push(createBall());
		}

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			for (let c of circles) {
				c.update();
			}
			ctx.fillStyle = borderColorFill;
			ctx.strokeStyle = borderColorStroke;
			border(ctx, 'Gravity');
			buttons(ctx)
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
