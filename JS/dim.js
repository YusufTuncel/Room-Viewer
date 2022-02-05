class Rect{
	constructor(x, y, w, h, angle){
		this.x = (x===undefined)? 0: x;
		this.y = (y===undefined)? 0: y;
		this.w = (w===undefined)? 1: w;
		this.h = (h===undefined)? 1: h;
		this.angle = (angle===undefined)? 0: angle;
	}
	
	asPoints(){
		var center_x = this.x + (this.w/2);
		var center_y = this.y + (this.h/2);
		return [
			rotate_point(this.x, this.y, center_x, center_y, this.angle),
			rotate_point(this.x+this.w, this.y, center_x, center_y, this.angle),
			rotate_point(this.x+this.w, this.y+this.h, center_x, center_y, this.angle),
			rotate_point(this.x, this.y+this.h, center_x, center_y, this.angle)
		]
	}
	asJsonPoints(){
		var points = this.asPoints();
		return [{x:points[0][0], y:points[0][1]}, {x:points[1][0], y:points[1][1]}, {x:points[2][0], y:points[2][1]}, {x:points[3][0], y:points[3][1]}]
	}
	intersects (other) {
		var a = this.asJsonPoints()
		var b = other.asJsonPoints()
		var polygons = [a, b];
		var minA, maxA, projected, i, i1, j, minB, maxB;

		for (i = 0; i < polygons.length; i++) {

			// for each polygon, look at each edge of the polygon, and determine if it separates
			// the two shapes
			var polygon = polygons[i];
			for (i1 = 0; i1 < polygon.length; i1++) {

				// grab 2 vertices to create an edge
				var i2 = (i1 + 1) % polygon.length;
				var p1 = polygon[i1];
				var p2 = polygon[i2];

				// find the line perpendicular to this edge
				var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

				minA = maxA = undefined;
				// for each vertex in the first shape, project it onto the line perpendicular to the edge
				// and keep track of the min and max of these values
				for (j = 0; j < a.length; j++) {
					projected = normal.x * a[j].x + normal.y * a[j].y;
					if ((minA==undefined) || projected < minA) {
						minA = projected;
					}
					if ((maxA==undefined) || projected > maxA) {
						maxA = projected;
					}
				}

				// for each vertex in the second shape, project it onto the line perpendicular to the edge
				// and keep track of the min and max of these values
				minB = maxB = undefined;
				for (j = 0; j < b.length; j++) {
					projected = normal.x * b[j].x + normal.y * b[j].y;
					if ((minB==undefined) || projected < minB) {
						minB = projected;
					}
					if ((maxB==undefined) || projected > maxB) {
						maxB = projected;
					}
				}

				// if there is no overlap between the projects, the edge we are looking at separates the two
				// polygons, and we know there is no overlap
				if (maxA < minB || maxB < minA) {
					return false;
				}
			}
		}
		return true;
	};
	draw(fill){
		var points = this.asPoints()
		ctx.fillStyle = fill;
		ctx.moveTo(points[0][0], points[0][1]);
		ctx.beginPath();
		for (var i = 1;i<4; i++)
			ctx.lineTo(points[i][0], points[i][1]);
		ctx.lineTo(points[0][0], points[0][1]);
		ctx.closePath();
		ctx.fill();
	}
}
class Point{
	constructor(x, y, angle){
		this.x = (x===undefined)? 0: x;
		this.y = (y===undefined)? 0: y;
		this.angle = (angle===undefined)? 0: angle;
	}
}


function degrees_to_radians(degrees){
	return degrees * (Math.PI/180);
}


function radians_to_degrees(radians){
	return radians * (180/Math.PI);
}

function rotate_point(x, y, cx, cy, angle){
	rads_angle = degrees_to_radians(angle)
	cosA = Math.cos(rads_angle)
	sinA = Math.sin(rads_angle)
	return [
		cx+(x-cx)*cosA-(y-cy)*sinA,
		cy+(x-cx)*sinA+(y-cy)*cosA
	]
}

function intersects_any(rect){
	for (var i = 0; i<rects.length; i++)
		if (rects[i] !== rect)
			if (rect.rect.intersects(rects[i].rect)){
				return i;
			}
	return -1;
}