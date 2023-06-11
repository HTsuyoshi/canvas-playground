<script setup lang='ts'>
	import { ref, onMounted } from 'vue';
	import { border } from '../lib/draw.ts';

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
							'#1e1e1e',
							'#424242',
							'#666666',
							'#807f83',
							'#cbc9cf'
							];
	const colorsLength = colors.length;
	const borderColorIndex = 0;
	const borderColorStroke = colors[borderColorIndex];
	const borderColorFill = colors[(borderColorIndex + 1) % colorsLength];
	const g = 9.81;
	let t = 0;
	const dt = 0.1;

	// Variables
	let win = {
		w:  props.width,
		w2: props.width/2,
		h:  props.height,
		h2: props.height/2
	}

	if (props.fullscreen) {
		win.w = window.innerWidth;
		win.w2 = window.innerWidth/2;
		win.h = window.innerHeight;
		win.h2 = window.innerHeight/2;
	}

	// Essential functions
	onMounted(() => {
		const canvas = canvasRef.value;
		if (!canvas) throw new Error('Canvas not found');
		const context = canvas.getContext('2d');
		if (!context) return;

		const ctx = context;

		canvas.width  = win.w;
		canvas.height = win.h;

		canvas.style.background = '#ffffff';

		class Pendulum {
			x1: number;
			y1: number;
			l1: number;
			m1: number;
			t1: number;
			o1: number;
			x2: number;
			y2: number;
			l2: number;
			m2: number;
			t2: number;
			o2: number;
			r: number;
			c: string;
			linex: number[];
			liney: number[];

			// Shapes functions
			constructor(x1: number, y1: number,
						l1: number, m1: number,
						t1: number,
						x2: number, y2: number,
						l2: number, m2: number,
						t2: number,
						c: string, r: number) {
				this.x1 = x1;
				this.y1 = y1;
				this.l1 = l1;
				this.m1 = m1;
				this.t1 = t1;
				this.o1 = 0;
				this.x2 = x2;
				this.y2 = y2;
				this.l2 = l2;
				this.m2 = m2;
				this.t2 = t2;
				this.o2 = 0;
				this.r = r;
				this.c = c;
				this.linex = [];
				this.liney = [];
			}

			drawCircle(x: number, y: number, r: number): void {
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2);
				ctx.fillStyle = this.c;
				ctx.fill();
			}

			draw(): void {
				// Draw line
				ctx.beginPath();
				ctx.lineWidth = 8;
				ctx.moveTo(win.w2, win.h2);
				ctx.lineTo(this.x1, this.y1);
				ctx.moveTo(this.x1, this.y1);
				ctx.lineTo(this.x2, this.y2);
				ctx.strokeStyle = this.c;
				ctx.stroke();

				ctx.beginPath();
				ctx.lineWidth = 1;
				if (t > 500) {
					this.linex.splice(0, 1);
					this.liney.splice(0, 1);
				}
				for (let i=1; i<this.linex.length; i++) {
					ctx.moveTo(this.linex[i-1], this.liney[i-1]);
					ctx.lineTo(this.linex[i], this.liney[i]);
				}
				ctx.stroke();
				
				// Draw center
				this.drawCircle(win.w2, win.h2, this.r);
				this.drawCircle(this.x1, this.y1, this.r);
				this.drawCircle(this.x2, this.y2, this.r);
				this.linex.push(this.x2);
				this.liney.push(this.y2);
			}

			update(): void {
				this.x1 = win.w2 + this.l1 * Math.sin(this.t1);
				this.y1 = win.h2 + this.l1 * Math.cos(this.t1);
				this.x2 = this.x1 + this.l2 * Math.sin(this.t2);
				this.y2 = this.y1 + this.l2 * Math.cos(this.t2);

				const omega1_dot = (this.m2 * g * Math.sin(this.t2) * Math.cos(this.t1 - this.t2) - this.m2 * this.l1 * this.o1 * this.o1 * Math.sin(this.t1 - this.t2) - (this.m1 + this.m2) * g * Math.sin(this.t1)) / (this.l1 * (this.m1 + this.m2 * Math.sin(this.t1 - this.t2) * Math.sin(this.t1 - this.t2)));
				const omega2_dot = ((this.m1 + this.m2) * (g * Math.sin(this.t1) * Math.cos(this.t1- this.t2) - this.l2 * this.o2 * this.o2 * Math.sin(this.t1- this.t2) - g * Math.sin(this.t2)) / (this.l2 * (this.m1 + this.m2 * Math.sin(this.t1 - this.t2) * Math.sin(this.t1 - this.t2))));

				this.o1 += omega1_dot * dt;
				this.o2 += omega2_dot * dt;
				this.t1 += this.o1 * dt;
				this.t2 += this.o2 * dt;
				t += dt;
				this.draw();
			}
		}

		function createPendulum(i: number): Pendulum {
			const c = colors[i % colorsLength];
			const r = 10;
			const { l1, m1, t1 } = {
				l1: 100 + i,
				m1: 50,
				t1: Math.PI / (2 + (i/10)),
			};
			const { l2, m2, t2 } = {
				l2: 100 + i,
				m2: 50,
				t2: Math.PI / (2 + (i/10)),
			};
			const p = new Pendulum(0, 0, l1, m1, t1,
									0, 0, l2, m2, t2,
									c, r);
			return p;
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

		// Main function
		const pendulums: Pendulum[] = [];
		for (let i=0; i<10; i++)
			pendulums.push(createPendulum(i));

		function drawAnimation(): void {
			ctx.clearRect(0, 0, win.w, win.h);
			ctx.strokeStyle = borderColorStroke;
			ctx.fillStyle = borderColorFill;
			border(ctx, 'Chaos', { x: 0, y: -200 });
			for (let p of pendulums)
				p.update();
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
