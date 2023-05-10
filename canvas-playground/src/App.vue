<script setup lang="ts">
	import { ref, onMounted } from 'vue';

	const canvasRef = ref<HTMLCanvasElement | null>(null);

	onMounted(() => {
		const canvas = canvasRef.value;
		if (!canvas) throw new Error('Canvas not found');
		const context = canvas.getContext('2d');
		if (!context) return;

		const ctx = context;
		let win = {
			w: window.innerWidth,
			h: window.innerHeight
		}
		let mouse = {
			x: -100,
			y: -100
		}
		let touch: any[] = [];

		canvas.width  = win.w;
		canvas.height = win.h;

		window.addEventListener (
			'mousemove',
			(e) => {
				mouse.x = e.x;
				mouse.y = e.y;
			}
		)

		window.addEventListener (
			'touchstart',
			(e) => {
				for (let t of e.changedTouches) {
					touch.push(t);
				}
			}
		)

		window.addEventListener (
			'touchmove',
			(e) => {
				for (let t of e.changedTouches) {
					for (let i=0; i<touch.length; ++i) {
						if (t.target == touch[i].target) {
							touch[i] = t;
							if (i >= touch.length) break;
							continue;
						}
					}
				}
			}
		)

		window.addEventListener (
			'touchend',
			(e) => {
				for (let t of e.changedTouches) {
					for (let i=0; i<touch.length; ++i) {
						if (t.target == touch[i].target) {
							touch.splice(i, 1);
							if (i >= touch.length) break;
							continue;
						}
					}
				}
			}
		)

		window.addEventListener (
			'resize',
			function () {
				win.w = window.innerWidth;
				win.h = window.innerHeight;
				ctx.canvas.width  = win.w;
				ctx.canvas.height = win.h;
			}
		)

		canvas.style.background = '#000000';

		// Essential functions
		function getRandom(min: number, max: number): number {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

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
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				ctx.strokeStyle = this.color;
				ctx.stroke();
				ctx.fillStyle = this.color;
				ctx.fill();
			}

			update(): void {
				if (this.x - this.r < 0)     this.dx = Math.abs(this.dx);
				if (this.x + this.r > win.w) this.dx = - Math.abs(this.dx);
				if (this.y - this.r < 0)     this.dy = Math.abs(this.dy);
				if (this.y + this.r > win.h) this.dy = - Math.abs(this.dy);
				if (mouse.x - this.x <   50 &&
					mouse.x - this.x > - 50 &&
					mouse.y - this.y <   50 &&
					mouse.y - this.y > - 50) {
					if (this.r < 30) {
						this.r += 15;
					}
				} else {
					for (let t of touch)
					{
						if (t.clientX - this.x <   50 &&
							t.clientX - this.x > - 50 &&
							t.clientY - this.y <   50 &&
							t.clientY - this.y > - 50) {
							if (this.r < 15) {
								this.r += 10;
							}
						}
					}
					if (this.r > 5) {
						this.r--;
					}
				}
				this.x += this.dx;
				this.y += this.dy;
				this.draw();
			}
		}

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			for (c of circles) {
				c.update();
			}
			requestAnimationFrame(drawAnimation);
		}

		const colors: string[] = [
								'#012030',
								'#13678a',
								'#45c4b0',
								'#9aeba3',
								'#dafdba'
								];

		let circles: Array<Circle> = [];
		for (let i = 0; i < 500; i++) {
			var c = new Circle(getRandom(0, win.w),
								getRandom(0, win.h),
								getRandom(-2, 2),
								getRandom(-2, 2),
								getRandom(5, 5),
								colors[getRandom(0, colors.length - 1)]);
			circles.push(c);
		}

		drawAnimation();
	});
</script>

<template>
	<canvas ref='canvasRef'></canvas>
</template>

<style scoped>
</style>
