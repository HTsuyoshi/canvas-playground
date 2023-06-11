<script setup lang='ts'>
	import { ref, onMounted } from 'vue';
	import { getRandom, isMobileDevice } from '../lib/generic.ts';
	import { border, buttons, draw_circle, drawing_styles } from '../lib/draw.ts';

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
			let dx = getRandom(-2, 2);
			while (dx == 0) dx = getRandom(-2, 2);
			let dy = getRandom(-2, 2);
			while (dy == 0) dy = getRandom(-2, 2);
			const { x, y, radius, color } = {
				x: getRandom(0, win.w),
				y: getRandom(0, win.h),
				radius: getRandom(5, 5),
				color: colors[getRandom(0, colorsLength - 1)]
			};
			return new Circle(x, y, dx, dy, radius, color);
		}

		canvas.style.background = '#ffffff';

		// Shapes
		interface CircleInterface {
			x: number;
			y: number;
			dx: number;
			dy: number;
			r: number;
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

			handleTouch(): void {
				const x = this.x + rect.left;
				const y = this.y + rect.top;
				const winw20 = win.w/20;
				if (mouse.x - x <   winw20 &&
					mouse.x - x > - winw20 &&
					mouse.y - y <   winw20 &&
					mouse.y - y > - winw20) {
					if (this.r < Math.max(winw20, 75)) {
						this.r += 10;
					}
				} else {
					for (let t of touch)
					{
						if (t.clientX - x <   winw20 &&
							t.clientX - x > - winw20 &&
							t.clientY - y <   winw20 &&
							t.clientY - y > - winw20) {
							if (this.r < Math.max(winw20, 75)) {
								this.r += 10;
							}
						}
					}
					if (this.r > 5) {
						this.r--;
					}
				}
			}

			update(): void {
				this.handleTouch();
				this.move();
				this.draw();
			}
		}

		// Events
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
				}
			)
		}

		// Computer
		if(!isMobileDevice()) {
			window.addEventListener (
				'mousemove',
				(e) => {
					mouse.x = e.x;
					mouse.y = e.y;
				}
			)
		}

		window.addEventListener (
			'click',
			(e) => {
				if (e.clientX > win.w2)
					for (let i = 0; i < 10; i++)
						circles.push(createBall());
				if (e.clientX < win.w2)
					circles.splice(0, 10);
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

		// Cellphone
		if(isMobileDevice()) {
			window.addEventListener (
				'touchstart',
				(e) => {
					for (let t of e.changedTouches) {
						if (t.clientX > win.w2)
							for (let i = 0; i < 10; i++)
								circles.push(createBall());
						if (t.clientX < win.w2)
							circles.splice(0, 10);
						touch.push(t);
					}
					ctx.strokeStyle = borderColorStroke;
					ctx.fillStyle = borderColorFill;
				}
			)

			window.addEventListener (
				'touchmove',
				(e) => {
					for (let t of e.changedTouches)
						for (let i=0; i<touch.length; ++i)
							if (t.target == touch[i].target)
								touch[i] = t;
				}
			)

			window.addEventListener (
				'touchend',
				(e) => {
				for (let t of e.changedTouches) {
					const index = touch.findIndex(item => item.target === t.target);
						if (index !== -1) touch.splice(index, 1);
					}
				}
			)

			window.addEventListener(
				'touchcancel',
				(e) => {
				for (let t of e.changedTouches) {
					const index = touch.findIndex(item => item.target === t.target);
						if (index !== -1) touch.splice(index, 1);
					}
				}
			);
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
