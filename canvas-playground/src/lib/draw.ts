export function border(ctx: CanvasRenderingContext2D, title: string,
						win: { w: number, w2: number, h: number, h2: number},
						offset_title = { x: 0, y: 0}) {
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

export function buttons(ctx: CanvasRenderingContext2D,
						win: { w: number, w2: number, h: number, h2: number}) {
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

export function life_buttons(ctx: CanvasRenderingContext2D,
						win: { w: number, w2: number, h: number, h2: number}) {
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
