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
		let ballNum = 20;

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
								'#ca2222',
								'#db3e3e',
								'#f18585',
								'#b1b1b1',
								'#0d0d0d'
								];
		const colorsLength = colors.length;
		const borderColorIndex = getRandom(0, colorsLength - 1);
		const borderColorStroke = colors[borderColorIndex];
		const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];

		function createBall(): Circle {
			let dx = getRandom(-10, 10);
			while (dx == 0) dx = getRandom(-10, 10);
			let dy = getRandom(-10, 10);
			while (dy == 0) dy = getRandom(-10, 10);
			const { x, y, radius, color, elasticity } = {
				x: getRandom(0, win.w),
				y: getRandom(0, win.h),
				radius: getRandom(10, 50),
				color: colors[getRandom(0, colorsLength - 1)],
				elasticity: 0.5 + (Math.random() * 0.5)
			};
			return new Circle(x, y, dx, dy, radius, color, elasticity);
		}

		function isMobileDevice() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		}

		// Computer
		if (!isMobileDevice()) {
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

		canvas.style.background = '#ffffff';

		// Essential functions
		function getRandom(min: number, max: number): number {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function getDistance(pos1: { [key: string]: number }, pos2: { [key: string]: number }): number {
			const x = pos1.x - pos2.x;
			const y = pos1.y - pos2.y;
			return Math.sqrt(x*x + y*y);
		}

		function collision(): void {
			for (let i = 0; i < circles.length; i++) {
				const c1 = circles[i];
				for (let j = i + 1; j < circles.length; j++) {
					const c2 = circles[j];
					const dist = getDistance(c1.pos, c2.pos);
					const minDist = c1.r + c2.r;
					if (dist < minDist) {
						const d = getDirection(c2.pos, c1.pos);
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

				const dist = getDistance(c1.pos, mouse.pos);
				const minDist = c1.r + mouse.r;
				if (dist < minDist) {
					const d = getDirection(mouse.pos, c1.pos);
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

		function getDirection(pos1: { [key: string]: number }, pos2: { [key: string]: number }): { [key: string]: number } {
			const d = getDistance(pos1, pos2);
			const pos = {
				x: (pos2.x - pos1.x) / d,
				y: (pos2.y - pos1.y) / d,
			};
			return pos;
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
				ctx.beginPath();
				ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.strokeStyle = borderColorStroke;
				ctx.moveTo(this.pos.x, this.pos.y);
				ctx.lineTo(this.pos.x + this.vel.dx*3, this.pos.y + this.vel.dy*3);
				ctx.stroke();
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

		function border() {
			const border = 10;
			const gap = 5;
			ctx.strokeStyle = borderColorStroke;
			ctx.fillStyle = borderColorFill;

			if (!isMobileDevice()) {
				ctx.lineWidth = 2;
				ctx.setLineDash([5, 1, 5]);
				ctx.beginPath();
				ctx.moveTo(win.w2, 30);
				ctx.lineTo(win.w2, (win.h2) - 90);
				ctx.moveTo(win.w2, (win.h2) + 65);
				ctx.lineTo(win.w2, win.h - 30);
				ctx.stroke();
				ctx.setLineDash([]);
			}

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
			let title = 'Collision';
			ctx.font = `100px Bebas Neue`;
			ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2), win.h2);
			ctx.strokeText(title, (win.w2) - offsetLetter - (ctx.measureText(title).width / 2), (win.h2) - offsetLetter);

			title = '/Htsuyoshi';
			ctx.font = `50px Bebas Neue`;
			ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2), win.h2 + 50);
			ctx.strokeText(title, (win.w2) - offsetLetter - (ctx.measureText(title).width / 2), (win.h2) + 50 - offsetLetter);

			if (!isMobileDevice()) {
				title = 'ADD';
				ctx.font = `30px Bebas Neue`;
				ctx.fillText(title, (win.w*3/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);

				title = 'RM';
				ctx.font = `30px Bebas Neue`;
				ctx.fillText(title, (win.w*1/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);
			}
		}

		function drawMouse(): void {
			ctx.beginPath();
			ctx.arc(mouse.pos.x, mouse.pos.y, mouse.r, 0, Math.PI * 2);
			ctx.strokeStyle = borderColorStroke;
			ctx.moveTo(mouse.pos.x, mouse.pos.y);
			ctx.lineTo(mouse.pos.x + mouse.vel.dx*3, mouse.pos.y + mouse.vel.dy*3);
			ctx.stroke();
		}

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			drawMouse();
			for (let c of circles) {
				c.update();
			}
			collision();
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
