<script setup lang='ts'>
	import { ref, onMounted } from 'vue';
	import { get_random, is_mobile_device } from '../lib/generic.ts';
	import { border, buttons, draw_circle, drawing_styles } from '../lib/draw.ts';
	import { get_distance, get_direction } from '../lib/physics.ts';
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
							'#ca2222',
							'#db3e3e',
							'#f18585',
							'#b1b1b1',
							'#0d0d0d'
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
	let mouse = {
		pos: {
			x: -1000,
			y: -1000
		},
		vel : {
			dx: 0,
			dy: 0
		},
		r: 50,
		elasticity: 1.0
	}
	let ballNum: number = 20;
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

		function createBall(): Circle {
			let dx = get_random(-10, 10);
			while (dx == 0) dx = get_random(-10, 10);
			let dy = get_random(-10, 10);
			while (dy == 0) dy = get_random(-10, 10);
			const { x, y, radius, color, elasticity } = {
				x: get_random(0, win.w),
				y: get_random(0, win.h),
				radius: get_random(10, 50),
				color: colors[get_random(0, colorsLength - 1)],
				elasticity: 0.5 + (Math.random() * 0.5)
			};
			return new Circle(x, y, dx, dy, radius, color, elasticity);
		}

		function collision(): void {
			for (let i = 0; i < circles.length; i++) {
				const c1 = circles[i];
				for (let j = i + 1; j < circles.length; j++) {
					const c2 = circles[j];
					const dist = get_distance(c1.pos, c2.pos);
					const minDist = c1.r + c2.r;
					if (dist < minDist) {
						const d = get_direction(c2.pos, c1.pos);
						const v1dot = c1.vel.dx * d.x + c1.vel.dy * d.y;
						const v2dot = c2.vel.dx * d.x + c2.vel.dy * d.y;
						const m1 = c1.r ** 2;
						const m2 = c2.r ** 2;
						const v1p = (2 * m2 * v2dot + (m1 - m2) * v1dot) / (m1 + m2);
						const v2p = (2 * m1 * v1dot + (m2 - m1) * v2dot) / (m1 + m2);
						const v1 = { dx: d.x * v1p * c2.elasticity, dy: d.y * v1p * c2.elasticity };
						const v2 = { dx: d.x * v2p * c1.elasticity, dy: d.y * v2p * c1.elasticity };
						c1.vel = v1;
						c2.vel = v2;

						const overlap = minDist - dist;
						c1.pos.x += (overlap * d.x);
						c1.pos.y += (overlap * d.y);
						c2.pos.x -= (overlap * d.x);
						c2.pos.y -= (overlap * d.y);
					}
				}

				const dist = get_distance(c1.pos, mouse.pos);
				const minDist = c1.r + mouse.r;
				if (dist < minDist) {
					const d = get_direction(mouse.pos, c1.pos);
					const v1dot = c1.vel.dx * d.x + c1.vel.dy * d.y;
					const v2dot = mouse.vel.dx * d.x + mouse.vel.dy * d.y;
					const m1 = c1.r ** 2;
					const m2 = mouse.r ** 2;
					const v1p = (2 * m2 * v2dot + (m1 - m2) * v1dot) / (m1 + m2);
					const v1 = { dx: d.x * v1p * mouse.elasticity, dy: d.y * v1p * mouse.elasticity };
					c1.vel = v1;

					const overlap = minDist - dist;
					c1.pos.x += (overlap * d.x);
					c1.pos.y += (overlap * d.y);
				}
			}
		}

		// Shapes
		interface CircleInterface {
			pos: {
				x: number,
				y: number
			};
			vel: {
				dx: number,
				dy: number
			};
			r: number;
			elasticity: number;
			color: string;
			draw: () => void;
			update: () => void;
		}

		class Circle implements CircleInterface {
			pos: {
				x: number,
				y: number
			};
			vel: {
				dx: number,
				dy: number
			};
			r: number;
			elasticity: number;
			color: string;

			// Shapes functions
			constructor(x: number, y: number,
						dx: number, dy: number,
						r: number, color: string,
						elasticity: number) {
				this.pos = { x: x, y: y };
				this.vel = { dx: dx, dy: dy };
				this.r = r;
				this.color = color;
				this.elasticity = elasticity;
			}

			draw(): void {
				draw_circle(ctx, this.pos.x, this.pos.y, this.vel.dx, this.vel.dy, this.r, debug, this.color, borderColorStroke)
			}

			move(): void {
				this.pos.x += this.vel.dx;
				this.pos.y += this.vel.dy;

				if (this.pos.x - this.r < 0) {
					this.vel.dx = Math.abs(this.vel.dx) * this.elasticity;
					this.pos.x = this.r;
				}
				if (this.pos.x + this.r > win.w) {
					this.vel.dx = - Math.abs(this.vel.dx) * this.elasticity;
					this.pos.x = win.w - this.r;
				}
				if (this.pos.y - this.r < 0) {
					this.vel.dy = Math.abs(this.vel.dy) * this.elasticity;
					this.pos.y = this.r;
				}
				if (this.pos.y + this.r > win.h) {
					this.vel.dy = - Math.abs(this.vel.dy) * this.elasticity;
					this.pos.y = win.h - this.r;
				}

			}

			update(): void {
				this.move();
				this.draw();
			}
		}

		// Events
		if (!is_mobile_device()) {
			window.addEventListener (
				'mousemove',
				(e) => {
					mouse.vel.dx = e.x - mouse.pos.x;
					mouse.vel.dy = e.y - mouse.pos.y;
					mouse.pos.x = e.x;
					mouse.pos.y = e.y;
				}
			)
			window.addEventListener (
				'click',
				(e) => {
					if (e.clientX > win.w2)
						for (let i = 0; i < 10; i++)
							circles.push(createBall());
					if (e.clientX < win.w2)
						circles.splice(0, 10);
					ctx.strokeStyle = borderColorStroke;
					ctx.fillStyle = borderColorFill;
				}
			)
			window .addEventListener(
				'keydown',
				(e) => {
					if (e.isComposing || e.keyCode === 27) {
						debug = (debug + 1) % drawing_styles;
					}
				}
			);
		} else {
			window.addEventListener (
				'touchstart',
				(e) => {
					for (let t of e.changedTouches) {
						mouse.vel.dx = t.clientX - mouse.pos.x;
						mouse.vel.dy = t.clientY - mouse.pos.y;
						mouse.pos.x = t.clientX;
						mouse.pos.y = t.clientY;
					}
				}
			)
			window.addEventListener (
				'touchmove',
				(e) => {
					for (let t of e.changedTouches) {
						mouse.vel.dx = t.clientX - mouse.pos.x;
						mouse.vel.dy = t.clientY - mouse.pos.y;
						mouse.pos.x = t.clientX;
						mouse.pos.y = t.clientY;
					}
				}
			)
			window.addEventListener (
				'touchend',
				() => {
					mouse.vel.dx = 0;
					mouse.vel.dy = 0;
					mouse.pos.x = -1000;
					mouse.pos.y = -1000;
				}
			)
			window.addEventListener(
				'touchcancel',
				() => {
					mouse.vel.dx = 0;
					mouse.vel.dy = 0;
					mouse.pos.x = -1000;
					mouse.pos.y = -1000;
				}
			);
		}

		if (props.fullscreen) {
			window.addEventListener ('resize', () => handle_resize(win, window.innerWidth, window.innerHeight, ctx))
		}

		function drawMouse(): void {
			ctx.beginPath();
			ctx.arc(mouse.pos.x, mouse.pos.y, mouse.r, 0, Math.PI * 2);
			ctx.strokeStyle = borderColorStroke;
			ctx.moveTo(mouse.pos.x, mouse.pos.y);
			ctx.lineTo(mouse.pos.x + mouse.vel.dx*3, mouse.pos.y + mouse.vel.dy*3);
			ctx.stroke();
		}

		// Main function
		let circles: Array<Circle> = [];
		for (let i = 0; i < ballNum; i++) {
			circles.push(createBall());
		}

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			drawMouse();
			for (let c of circles) {
				c.update();
			}
			collision();
			ctx.fillStyle = borderColorFill;
			ctx.strokeStyle = borderColorStroke;
			border(ctx, 'Collision');
			if (!is_mobile_device())
				buttons(ctx);
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
