<script setup lang='ts'>
	import { ref, onMounted } from 'vue';

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

	const canvasRef = ref<HTMLCanvasElement | null>(null);

	onMounted(() => {
		const canvas = canvasRef.value;
		if (!canvas) throw new Error('Canvas not found');
		const context = canvas.getContext('2d');
		if (!context) return;

		const ctx = context;
		let win = {
			w: 300,
			w2: 150,
			h: 400,
			h2: 200
		}
		let mouse = {
			x: 0,
			y: 0
		}
		let ballNum = 50;

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

		canvas.width  = win.w;
		canvas.height = win.h;

		const colors: string[] = [
								'#9c13bf',
								'#4f217f',
								'#ff12fb',
								'#0b1240',
								'#e5006a'
								];
		const colorsLength = colors.length;
		const borderColorIndex = getRandom(0, colorsLength - 1);
		const borderColorStroke = colors[borderColorIndex];
		const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

		function createBall(): Circle {
			let dx = getRandom(-2, 2);
			while (dx == 0) dx = getRandom(-2, 2);
			let dy = getRandom(-2, 2);
			while (dy == 0) dy = getRandom(-2, 2);
			const { x, y, radius, color, friction } = {
				x: getRandom(0, win.w),
				y: getRandom(0, win.h),
				radius: getRandom(5, 5),
				color: colors[getRandom(0, colorsLength - 1)],
				friction: Math.random()
			};
			return new Circle(x, y, dx, dy, radius, color, friction);
		}

		function isMobileDevice() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		}

		// Computer
		if (!isMobileDevice()) {
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
				ctx.strokeStyle = borderColorStroke;
				ctx.fillStyle = borderColorFill;
			}
		)

		//if (isMobileDevice()) {
		//}

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
			friction: number;
			color: string;
			draw: () => void;
			update: () => void;
		}

		var gravity = 0.5;
		var gravityDirection = {
			x: 0,
			y: 1
		};
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
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.strokeStyle = borderColorStroke;
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x + this.dx*3, this.y + this.dy*3);
				ctx.stroke();
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

		function border() {
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

			const offsetLetter = 3;
			let title = 'Gravity';
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

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			for (let c of circles) {
				c.update();
			}
			border();
			requestAnimationFrame(drawAnimation);
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
