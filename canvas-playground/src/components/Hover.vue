<script setup lang='ts'>
	import { ref, onMounted } from 'vue';
	import { get_boolean, get_random, is_mobile_device } from '../lib/generic.ts';
	import { border, buttons, draw_circle, drawing_styles } from '../lib/draw.ts';
	import { handle_resize, handle_mouse_move, handle_mouse_click, handle_esc_click, handle_touch_start, handle_touch_move, handle_touch_end } from '../lib/events.ts';

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
							'#012030',
							'#13678a',
							'#45c4b0',
							'#9aeba3',
							'#dafdba'
							];
	const colorsLength = colors.length;
	const borderColorIndex = 5;
	const borderColorStroke = colors[borderColorIndex];
	const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

	// Variables
	let win = {
		w: props.width,
		w2: props.width/2,
		h: props.height,
		h2: props.height/2
	}
	if (props.fullscreen) {
		win.w = window.innerWidth;
		win.w2 = window.innerWidth/2;
		win.h = window.innerHeight;
		win.h2 = window.innerHeight/2;
	}
	let mouse = {
		x: - 200,
		y: - 200
	}
	let touch: any[] = [];
	let ballNum: number = 50;
	let debug: number = 0;

	onMounted(() => {
		// Setup canvas
		const canvas = canvasRef.value;
		if (!canvas) throw new Error('Canvas not found');
		const context = canvas.getContext('2d');
		if (!context) return;

		const ctx = context;

		canvas.width  = win.w;
		canvas.height = win.h;

		const rect = canvas.getBoundingClientRect();

		function createBall(): Circle {
			let dx = (get_boolean() ? 1:-1) * get_random(1, 2);
			let dy = (get_boolean() ? 1:-1) * get_random(1, 2);
			const { x, y, radius, color } = {
				x: get_random(0, win.w),
				y: get_random(0, win.h),
				radius: get_random(5, 5),
				color: colors[get_random(0, colorsLength - 1)]
			};
			return new Circle(x, y, dx, dy, radius, color);
		}

		canvas.style.background = '#ffffff';

		class Circle {
			x: number;
			y: number;
			dx: number;
			dy: number;
			r: number;
			color: string;

			// Shapes functions
			constructor(x: number, y: number,
						dx: number, dy: number,
						r: number, color: string) {
				this.x = x;
				this.y = y;
				this.dx = dy;
				this.dy = dx;
				this.r = r;
				this.color = color;
			}

			draw(): void {
				draw_circle(ctx, this.x, this.y, this.dx, this.dy, this.r, debug, this.color, borderColorStroke)
			}

			move(): void {
				if (this.x - this.r < 0)     this.dx = Math.abs(this.dx);
				if (this.x + this.r > win.w) this.dx = - Math.abs(this.dx);
				if (this.y - this.r < 0)     this.dy = Math.abs(this.dy);
				if (this.y + this.r > win.h) this.dy = - Math.abs(this.dy);

				this.x += this.dx;
				this.y += this.dy;
			}

			private expand(winw20: number): void {
				if (this.r < Math.max(winw20, 75)) {
					this.r += 10;
				}
			}

			private shrink(): void {
				if (this.r > 5) {
					this.r--;
				}
			}

			private handle_touch(): void {
				const x = this.x + rect.left;
				const y = this.y + rect.top;
				const winw20 = win.w/20;

				if (!is_mobile_device()) {
					if (mouse.x - x <   winw20 &&
						mouse.x - x > - winw20 &&
						mouse.y - y <   winw20 &&
						mouse.y - y > - winw20)
						this.expand(winw20);
					else this.shrink();
					return;
				}

				for (let t of touch)
				{
					if (t.clientX - x <   winw20 &&
						t.clientX - x > - winw20 &&
						t.clientY - y <   winw20 &&
						t.clientY - y > - winw20)
						this.expand(winw20);
					else this.shrink();
				}
				
			}

			update(): void {
				this.handle_touch();
				this.move();
				this.draw();
			}
		}

		// Events
		if (props.fullscreen) {
			window.addEventListener ('resize', () => handle_resize(win, window.innerWidth, window.innerHeight, ctx))
		}

		// Computer
		if(!is_mobile_device()) {
			window.addEventListener ('mousemove', (e) => handle_mouse_move(e, mouse));
			window.addEventListener ('click', (e) => handle_mouse_click(e, win, circles, createBall));
			window .addEventListener('keydown', (e) => { debug = handle_esc_click(e, drawing_styles, debug) });
		} else {
			window.addEventListener ('touchstart', (e) => handle_touch_start(e, win, circles, createBall, touch));
			window.addEventListener ('touchmove', (e) => handle_touch_move(e, touch));
			window.addEventListener ('touchend', (e) => handle_touch_end(e, touch));
			window.addEventListener('touchcancel', (e) => handle_touch_end(e, touch));
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
			border(ctx, 'Hover');
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
