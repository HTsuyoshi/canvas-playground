export function border(ctx: CanvasRenderingContext2D,
						title: string,
						offset_title = { x: 0, y: 0}) {
	const win = {
		w: ctx.canvas.clientWidth,
		w2: ctx.canvas.clientWidth/2,
		h: ctx.canvas.clientHeight,
		h2: ctx.canvas.clientHeight/2,
	}
	const border = 10;
	const gap = 5;

	let border_offset = border;
	ctx.lineWidth = 2;
	ctx.strokeRect(border, border, win.w - 2*border_offset, win.h - 2*border_offset);

	border_offset += gap;
	ctx.lineWidth = 5;
	ctx.strokeRect(border_offset, border_offset, win.w - 2*border_offset, win.h - 2*border_offset);

	border_offset += gap;
	ctx.lineWidth = 2;
	ctx.strokeRect(border_offset, border_offset, win.w - 2*border_offset, win.h - 2*border_offset);

	ctx.beginPath();
	const offset_letter = 3;
	ctx.font = `100px Bebas Neue`;
	ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2) + offset_title.x, win.h2 + offset_title.y);
	ctx.strokeText(title, (win.w2) - offset_letter - (ctx.measureText(title).width / 2) + offset_title.x, (win.h2) - offset_letter + offset_title.y);

	title = '/Htsuyoshi';
	ctx.font = `50px Bebas Neue`;
	ctx.fillText(title, (win.w2) - (ctx.measureText(title).width / 2) + offset_title.x, win.h2 + 50 + offset_title.y);
	ctx.strokeText(title, (win.w2) - offset_letter - (ctx.measureText(title).width / 2) + offset_title.x, (win.h2) + 50 - offset_letter + offset_title.y);
}

export function buttons(ctx: CanvasRenderingContext2D) {
	const win = {
		w: ctx.canvas.clientWidth,
		w2: ctx.canvas.clientWidth/2,
		h: ctx.canvas.clientHeight,
		h2: ctx.canvas.clientHeight/2,
	}
	ctx.lineWidth = 2;
	ctx.setLineDash([5, 1, 5]);
	ctx.beginPath();
	ctx.moveTo(win.w2, 30);
	ctx.lineTo(win.w2, (win.h2) - 90);
	ctx.moveTo(win.w2, (win.h2) + 65);
	ctx.lineTo(win.w2, win.h - 30);
	ctx.stroke();
	ctx.setLineDash([]);

	let title = 'ADD';
	ctx.font = `30px Bebas Neue`;
	ctx.fillText(title, (win.w*3/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);

	title = 'RM';
	ctx.font = `30px Bebas Neue`;
	ctx.fillText(title, (win.w*1/4) - (ctx.measureText(title).width / 2), win.h*1/8 + 50);
}

export function life_buttons(ctx: CanvasRenderingContext2D) {
	const win = {
		w: ctx.canvas.clientWidth,
		w2: ctx.canvas.clientWidth/2,
		h: ctx.canvas.clientHeight,
		h2: ctx.canvas.clientHeight/2,
	}
	ctx.lineWidth = 2;
	ctx.setLineDash([5, 1, 5]);
	ctx.beginPath();
	ctx.moveTo(win.w2, 30);
	ctx.lineTo(win.w2, (win.h2) - 290);
	ctx.moveTo(win.w2, (win.h2) - 135);
	ctx.lineTo(win.w2, win.h - 30);
	ctx.stroke();
	ctx.setLineDash([]);

	const offset_letter = 3;
	let title = 'Left click';
	ctx.font = `60px Bebas Neue`;
	ctx.fillText(title, (win.w2/2) - (ctx.measureText(title).width / 2), win.h2);
	ctx.strokeText(title, (win.w2/2) - offset_letter - (ctx.measureText(title).width / 2), win.h2 - offset_letter);

	title = 'Pause/Start';
	ctx.font = `30px Bebas Neue`;
	ctx.fillText(title, (win.w2/2) - (ctx.measureText(title).width / 2), win.h2 + 50);
	ctx.strokeText(title, (win.w2/2) - offset_letter - (ctx.measureText(title).width / 2), win.h2 + 50 - offset_letter);

	title = 'Right click';
	ctx.font = `60px Bebas Neue`;
	ctx.fillText(title, (win.w2*3/2) - (ctx.measureText(title).width / 2), win.h2);
	ctx.strokeText(title, (win.w2*3/2) - offset_letter - (ctx.measureText(title).width / 2), win.h2 - offset_letter);

	title = 'Invert';
	ctx.font = `30px Bebas Neue`;
	ctx.fillText(title, (win.w2*3/2) - (ctx.measureText(title).width / 2), win.h2 + 50);
	ctx.strokeText(title, (win.w2*3/2) - offset_letter - (ctx.measureText(title).width / 2), win.h2 + 50 - offset_letter);
}

export const drawing_styles = 5;

function draw_debug(ctx: CanvasRenderingContext2D,
				x: number, y: number,
				dx: number, dy: number,
				r: number, debug: number,
				border_c: string) {

	ctx.strokeStyle = border_c;
	if (debug >= 1) {
		ctx.moveTo(x, y);
		ctx.lineTo(x + dx*3, y + dy*3);
	}

	if(debug >= 2) {
		ctx.moveTo(x - r, y - r*2);
		ctx.lineTo(x - r*2, y - r*2);
		ctx.lineTo(x - r*2, y - r);

		ctx.moveTo(x + r, y - r*2);
		ctx.lineTo(x + r*2, y - r*2);
		ctx.lineTo(x + r*2, y - r);

		ctx.moveTo(x - r, y + r*2);
		ctx.lineTo(x - r*2, y + r*2);
		ctx.lineTo(x - r*2, y + r);

		ctx.moveTo(x + r, y + r*2);
		ctx.lineTo(x + r*2, y + r*2);
		ctx.lineTo(x + r*2, y + r);
	}

	if(debug >= 3) {
		let pos = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
		ctx.font = `25px Bebas Neue`;
		ctx.fillText(pos, x - ctx.measureText(pos).width/2, y - r*1.3);
	}

	if(debug >= 4) {
		ctx.moveTo(0, y);
		ctx.lineTo(ctx.canvas.clientWidth, y);
		ctx.moveTo(x, 0);
		ctx.lineTo(x, ctx.canvas.clientHeight);
	}
	ctx.stroke();
}

export function draw_circle(ctx: CanvasRenderingContext2D,
							x: number, y: number,
							dx: number, dy: number,
							r: number, debug: number,
							c: string, border_c: string) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = c;
	ctx.fill();

	draw_debug(ctx, x, y, dx, dy, r, debug, border_c);
}

export function draw_square(ctx: CanvasRenderingContext2D,
							x: number, y: number,
							dx: number, dy: number,
							l: number, debug: number,
							c: string, border_c: string) {
	ctx.beginPath();
	ctx.rect(x - (l/2), y - (l/2), l, l);
	ctx.fillStyle = c;
	ctx.fill();

	draw_debug(ctx, x, y, dx, dy, l, debug, border_c);
}
