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
							'#012030',
							'#13678a',
							'#45c4b0',
							'#9aeba3',
							'#dafdba'
							];
	const colorsLength = colors.length;
	const borderColorIndex = getRandom(0, colorsLength - 1);
	const borderColorStroke = colors[borderColorIndex];
	const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

	// Variables
	let win = {
		w: 300,
		w2: 150,
		h: 400,
		h2: 200
	}
	let mouse = {
		x: - 200,
		y: - 200
	}
	let touch: any[] = [];
	let ballNum = 50;
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
	function getRandom(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	function border(ctx: CanvasRenderingContext2D) {
		const border = 10;
		const gap = 5;
		ctx.strokeStyle = borderColorStroke;
		ctx.fillStyle = borderColorFill;

		ctx.lineWidth = 2;
		ctx.setLineDash([5, 1, 5]);
		ctx.beginPath();
		ctx.moveTo(win.w2, 30);
		ctx.lineTo(win.w2, (win.h2) - 90);
		ctx.moveTo(win.w2, (win.h2) + 65);
		ctx.lineTo(win.w2, win.h - 30);
		ctx.stroke();
		ctx.setLineDash([]);

		let offset = border;
		ctx.lineWidth = 2;
		ctx.strokeRect(border, border, win.w - 2*offset, win.h - 2*offset);

		offset += gap;
		ctx.lineWidth = 5;
		ctx.strokeRect(offset, offset, win.w - 2*offset, win.h - 2*offset);

		offset += gap;
		ctx.lineWidth = 2;
		ctx.strokeRect(offset, offset, win.w - 2*offset, win.h - 2*offset);

		ctx.beginPath();
		const offsetLetter = 3;
		let title = 'Hover';
		ctx.font = `100px Bebas Neue`;
		ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2), win.h2);
		ctx.strokeText(title, (win.w2) - offsetLetter - (ctx.measureText(title).width / 2), (win.h2) - offsetLetter);

		title = '/Htsuyoshi';
		ctx.font = `50px Bebas Neue`;
		ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2), win.h2 + 50);
		ctx.strokeText(title, (win.w2) - offsetLetter - (ctx.measureText(title).width / 2), (win.h2) + 50 - offsetLetter);

		title = 'ADD';
		ctx.font = `30px Bebas Neue`;
		ctx.fillText(title, (win.w*3/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);

		title = 'RM';
		ctx.font = `30px Bebas Neue`;
		ctx.fillText(title, (win.w*1/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);
	}

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
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
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
			border(ctx);
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
