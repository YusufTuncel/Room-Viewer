const colors = {sel: "#0000FF", col: "#FF000033", normal: "#00FF00"}

function invertColor(hex) {
	function padZero(str, len) {
		len = len || 2;
		var zeros = new Array(len).join('0');
		return (zeros + str).slice(-len);
	}

    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length == 8) {
        hex = hex.slice(0, 6);
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color:'+hex);
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function drawObject(rect, color, text){
	rect.draw(color)
	
	var text_color = invertColor(color);
	
	ctx.fillStyle = text_color
	ctx.font = 'bold 35px serif';
	ctx.textAlign = "center";
	
	let metrics = ctx.measureText(text);
	let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
	let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	ctx.fillText(text, rect.x+(rect.w/2), rect.y+fontHeight);
}

function draw_all(){
	ctx.fillStyle = "#999999"
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();
	
	rects_stack = [...rects];
	
	i = 0
	while (i<rects_stack.length){
		if (draw(i, rects_stack))
			i++;
		else
			rects_stack.splice(i, 1);
	}
}

function draw(i, rects_stack){
	var r = ((rects_stack===undefined)? rects: rects_stack)[i];
	var ins = intersects_any(r) != -1;
	var isSel = seleted_index!=null && rects[seleted_index].rect === r.rect
	var color = (isSel)? colors.sel : colors.normal;
	if (ins)
		color = (isSel)? colors.sel : colors.col;
	drawObject(r.rect, color, r.name);
	
	return ins;
}