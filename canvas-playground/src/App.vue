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
			x: - 200,
			y: - 200
		}
		let touch: any[] = [];
		let ballNum = 100;

		canvas.width  = win.w;
		canvas.height = win.h;

		// Computer
		window.addEventListener (
			'mousemove',
			(e) => {
				mouse.x = e.x;
				mouse.y = e.y;
			}
		)

		window.addEventListener (
			'click',
			(e) => {
				if (e.clientX > win.w/2)
					for (let i = 0; i < 10; i++)
						circles.push(createBall());
				if (e.clientX < win.w/2)
					circles.splice(0, 10);
			}
		)

		// Cellphone
		window.addEventListener (
			'touchstart',
			(e) => {
				for (let t of e.changedTouches) {
					if (t.clientX > win.w/2)
						for (let i = 0; i < 10; i++)
							circles.push(createBall());
					if (t.clientX < win.w/2)
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

		window.addEventListener (
			'resize',
			function () {
				win.w = window.innerWidth;
				win.h = window.innerHeight;
				ctx.canvas.width  = win.w;
				ctx.canvas.height = win.h;
			}
		)

		canvas.style.background = '#ffffff';

		// Essential functions
		function getRandom(min: number, max: number): number {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

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
				if (mouse.x - this.x <   win.w/20 &&
					mouse.x - this.x > - win.w/20 &&
					mouse.y - this.y <   win.w/20 &&
					mouse.y - this.y > - win.w/20) {
					if (this.r < Math.max(win.w/20, 75)) {
						this.r += 10;
					}
				} else {
					for (let t of touch)
					{
						if (t.clientX - this.x <   win.w/20 &&
							t.clientX - this.x > - win.w/20 &&
							t.clientY - this.y <   win.w/20 &&
							t.clientY - this.y > - win.w/20) {
							if (this.r < Math.max(win.w/20, 75)) {
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

		function border() {
			const border = 10;
			const gap = 5;

			ctx.strokeStyle = borderColorStroke;
			ctx.fillStyle = borderColorFill;
			ctx.lineWidth = 2;
			ctx.strokeRect(border, border, win.w - (2*border), win.h - (2*border));

			ctx.lineWidth = 5;
			ctx.strokeRect(gap + border, gap + border, win.w - (2*gap + 2*border), win.h- (2*gap + 2* border));

			ctx.lineWidth = 2;
			ctx.strokeRect(2*gap + border, 2*gap + border, win.w - (2*2*gap + 2*border), win.h - (2*2*gap + 2*border));

			const offset = 3;
			let title = 'Github';
			ctx.font = `100px Bebas Neue`;
			ctx.fillText(title, (win.w/2) - (ctx.measureText(title).width / 2), win.h/2);
			ctx.strokeText(title, (win.w/2) - offset - (ctx.measureText(title).width / 2), (win.h/2) - offset);

			title = '/Htsuyoshi';
			ctx.font = `50px Bebas Neue`;
			ctx.fillText(title, (win.w/2) - (ctx.measureText(title).width / 2), win.h/2 + 50);
			ctx.strokeText(title, (win.w/2) - offset - (ctx.measureText(title).width / 2), (win.h/2) + 50 - offset);

			title = 'ADD';
			ctx.font = `30px Bebas Neue`;
			ctx.fillText(title, (win.w*3/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);

			title = 'RM';
			ctx.font = `30px Bebas Neue`;
			ctx.fillText(title, (win.w*1/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);
		}

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			for (let c of circles) {
				c.update();
			}
			border();
			requestAnimationFrame(drawAnimation);
		}

		const colors: string[] = [
								'#012030',
								'#13678a',
								'#45c4b0',
								'#9aeba3',
								'#dafdba'
								];
		const colorsLength = colors.length;
		const borderColorIndex = getRandom(0, colorsLength - 1);
		const borderColorStroke = colors[borderColorIndex];
		const borderColorFill = colors[borderColorIndex + 1 % colorsLength];

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

		let circles: Array<Circle> = [];
		for (let i = 0; i < ballNum; i++) {
			circles.push(createBall());
		}

		drawAnimation();
	});
</script>

<template>
	<canvas ref='canvasRef'></canvas>
</template>

<style scoped>
	@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
</style>
