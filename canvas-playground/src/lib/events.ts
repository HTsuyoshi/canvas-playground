export function handle_mouse_move(e: MouseEvent, m: { x: number, y: number }): void{
	m.x = e.x;
	m.y = e.y;
}

export function handle_mouse_click(e: MouseEvent, win: { w: number, w2: number, h: number, h2:number }, circles: object[], createBall: () => object): void {
	if (e.clientX > win.w2)
		for (let i = 0; i < 10; i++)
			circles.push(createBall());
	if (e.clientX < win.w2)
		circles.splice(0, 10);
}

export function handle_esc_click(e: KeyboardEvent, drawing_styles: number, debug: number): number {
	if (e.isComposing || e.keyCode === 27) {
		debug = (debug + 1) % drawing_styles;
	}
	return debug;
}

export function handle_touch_start(e: TouchEvent, win: { w: number, w2: number, h: number, h2: number }, circles: object[], createBall: () => object, touch: object[]): void {
	for (let t of e.changedTouches) {
		if (t.clientX > win.w2) {
			for (let i = 0; i < 10; i++)
				circles.push(createBall());
		} else if (t.clientX < win.w2) {
			circles.splice(0, 10);
		}
		touch.push(t);
	}
}

export function handle_touch_move(e: TouchEvent, touch: object[]): void {
	for (let t of e.changedTouches)
		for (let i=0; i<touch.length; ++i)
			//@ts-ignore
			if (t.target == touch[i].target)
				touch[i] = t;
}

export function handle_touch_end(e: TouchEvent, touch: object[]): void {
	for (let t of e.changedTouches) {
		//@ts-ignore
		const index = touch.findIndex(item => item.target === t.target);
		if (index !== -1) touch.splice(index, 1);
	}
}

export function handle_resize(win: { w: number, w2: number, h: number, h2:number }, w: number, h: number, ctx: CanvasRenderingContext2D): void {
	win.w = w;
	win.w2 = w/2;
	win.h = h;
	win.h2 = h/2;
	ctx.canvas.width  = win.w;
	ctx.canvas.height = win.h;
}
