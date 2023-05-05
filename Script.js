/* ----- Классы ----- */

class Snake{
	constructor(x, y, color){
		this.x = x;
		this.y = y;
		this.color = color;
		this.speed = 10;
		this.direction = "Right";
		this.body = [{x: x - 10, y: y}, {x: x - 20, y: y}, {x: x - 30, y: y}, {x: x - 40, y: y}];
	}

	draw(){
		let segment = this.body;
		ctx.fillStyle = "Red";

		// Отрисовка головы (что-бы было понятно где голова).
		ctx.fillRect(segment[0].x - 5, segment[0].y - 5, 10, 10);
		ctx.fill();
		ctx.fillStyle = this.color;

		// Отрисовка тела.
		for( let i = 1; i < segment.length; ++i){
			ctx.fillRect(segment[i].x - 5, segment[i].y - 5, 10, 10);
			ctx.fill();
		}
	}

	addCegment(){
		let lastSegmentX = this.body[this.body.length - 1].x,
			lastSegmentY = this.body[this.body.length - 1].y;
		this.body.push({x: lastSegmentX, y: lastSegmentY});
	}

	isCollision(){
		let head = this.body[0];

		// Проверка колизии с стеной.
		if (head.x <= -380 || head.x >= 380 || head.y <= -260 || head.y >= 280) return true;

		// Проверка колизии с своими сегментами.
		for( let i = 1; i < this.body.length; i++){
			if (head.x == this.body[i].x && head.y == this.body[i].y) return true;
		}
		return false;
	}

	move(){
		let head = this.body[0],
			segment = this.body,
			speed = this.speed,
			hit = this.isCollision();

		// Делаю сдвиг значений сегментов змеи [0]->[1]->[2]->...
		for(let i = segment.length - 1; i >= 1; i--){
			segment[i].x = segment[i - 1].x;
			segment[i].y = segment[i - 1].y;
		}

		// Делаю сдвиг змеи, если она не столкнулась с препятствием.
		if (!hit){

			switch (this.direction){
			case "Up":
				head.y -= speed;
				break;
			case "Down":
				head.y += speed;
				break;
			case "Left":
				head.x -= speed;
				break;
			case "Right":
				head.x += speed;
				break;
			}

		} else {
			restart();
		}
		
	}
}

class Point{
	constructor(color){
		this.x = getRandomCount(0, 380);
		this.y = getRandomCount(0, 250);
		this.radius = 5;
		this.color = color;
	}

	draw(){
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "White";

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();

		ctx.strokeStyle = "Black";
	}

	isCollision(){
		let head = snake.body[0];

		if (head.x == this.x && head.y == this.y){
			score++;
			snake.addCegment();
			return true;
		}

		return false;
	}

	update(){
		this.x = getRandomCount(0, 380);
		this.y = getRandomCount(0, 250);
	}
}

/* ----- Настройки сцены ----- */

	var canvas = document.querySelector("#canvas"),
	ctx = canvas.getContext("2d");

	ctx.translate(400, 300);
	ctx.font = "30px Arial";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;

/* ----- Настройки состояния сцены ----- */

	var score = 0,
	fps = 105,
	isPaused = false,
	isRestarted = false,
	isFirst = true;

/* ----- Инициализация объектов ----- */

	point = new Point("Black");
	snake = new Snake(5, 5, "Black");
	intro();

/* ----- настройки управление ----- */

addEventListener("keydown", function (event){

	/* Для удобства переименовываю текущее направление 
	   змеи, а затем меняю его значение, если оно не в
	   противоположную сторону (иначе змея будет 
	   ползти в себя). Если игрок ещё ничего не нажал,
	   то воспроизводится intro, иначе инициализация
	    игровой петли. */

	let direction = snake.direction;
	if (isFirst){
		isFirst = !isFirst;
		gameLoop = setInterval(game, fps);
	} else {
		switch (event.code){
		case "ArrowUp":
			if (direction != "Down") snake.direction = "Up";
			break;
		case "ArrowDown":
			if (direction != "Up") snake.direction = "Down";
			break;
		case "ArrowLeft":
			if (direction != "Right") snake.direction = "Left";
			break;
		case "ArrowRight":
			if (direction != "Left") snake.direction = "Right";
			break;
		case "Space":
			if (!isRestarted){
				pause();
				break;
			}
			break;
		case "KeyR":
			if (isRestarted){
				restart();
				break;
			}
		}
	}
});

/* ----- Функции для сцены ----- */

// Функция для отрисовки поля и счета.
function drawBoard(){
	ctx.fillStyle = "Black";
	// Очистка кадра.
	ctx.clearRect(-500, -400, 1000, 1000);

	// Отрисовка границ поля.
	ctx.strokeRect(-390, -265, 780, 550);
	ctx.stroke();

	// Отрисовка счета.
	ctx.fillText("Score: " + score, 320, -280);
}

function drawSettings(x, y){
	// Отрисовка кнопки вверх.
	ctx.strokeRect(x - 20, y - 50, 40, 40);
	ctx.moveTo(x - 10, y - 20);
	ctx.lineTo(x + 0, y - 40);
	ctx.lineTo(x + 10, y - 20);
	ctx.fillText(" —  Движение.", x + 200, y + 20);
	// Отрисовка кнопки вниз.
	ctx.strokeRect(x - 20, y + 0, 40, 40);
	ctx.moveTo(x - 10, y + 10);
	ctx.lineTo(x + 0, y + 30);
	ctx.lineTo(x + 10, y + 10);
	// Отрисовка кнопки вправо.
	ctx.strokeRect(x + 30, y + 0, 40, 40);
	ctx.moveTo(x + 40, y + 10);
	ctx.lineTo(x + 60, y + 20);
	ctx.lineTo(x + 40, y + 30);
	// Отрисовка кнопки влево.
	ctx.strokeRect(x - 70, y + 0, 40, 40);
	ctx.moveTo(x - 40, y + 10);
	ctx.lineTo(x - 60, y + 20);
	ctx.lineTo(x - 40, y + 30);
	// Отрисовка кнопки рестарта.
	ctx.strokeRect(x - 20, y + 80, 40, 40);
	ctx.fillText("R", x, y + 103);
	ctx.fillText(" —  Перезапуск.", x + 210, y + 100);
	// Отрисовка кнопки паузы.
	ctx.strokeRect(x - 50, y + 160, 100, 40);
	ctx.fillText("Spase", x, y + 183);
	ctx.fillText(" —  Пауза.", x + 170, y + 180);

	ctx.moveTo(0, 0);
	ctx.stroke();
}

// Функция отрисовки игры.
function game(){
	drawBoard();
	if (point.isCollision()){

		let body = snake.body;

		point.update();
		for (let i = 0; i < body.length; i++){
			if (point.x == body[i].x && point.y == body[i].y) point.update();
		}
	}
	point.draw();
	snake.draw();
	snake.move();
}

// Функция отрисовки кнопок управления.
function intro(){
	drawBoard();
	drawSettings(-100, -100);
}

// Функция отрисовки паузы.
function pause(){

	/* Отрисовывает иконку и убивает петлю, иначе запускает заново. */

	if (!isPaused){
		// иконка остановки.
		ctx.fillStyle = "Black";
		ctx.strokeStyle = "White";
		ctx.beginPath();
		ctx.moveTo(-20, -30);
		ctx.lineTo(20, 0);
		ctx.lineTo(-20, 30);
		ctx.closePath();
		ctx.fill();

		clearInterval(gameLoop);
	} else {
		gameLoop = setInterval(game, fps);
	}

	isPaused = !isPaused;
}

// Функция отрисовки рестарта.
function restart(){

	/* если игрок согласился начать заново,то счет обнуляется,
	 создается новая змейка и новая петля, иначе игра ждет. */

	if (!isRestarted){
		// Отрисовывает иконку перезапуска и убивает петлю.
		ctx.strokeStyle = "Black";
		ctx.beginPath();
		ctx.moveTo(25, -15);
		ctx.lineTo(25, -25);
		ctx.lineTo(-25, -25);
		ctx.lineTo(-25, 25);
		ctx.lineTo(25, 25);
		ctx.lineTo(25, 0);
		ctx.lineTo(15, 10);
		ctx.moveTo(25, 0);
		ctx.lineTo(35, 10);
		ctx.stroke();
		ctx.moveTo(0, 0);
		clearInterval(gameLoop);
	} else {
		snake = new Snake(5, 5, "Black");
		point = new Point("Black");
		score = 0;
		gameLoop = setInterval(game, fps);
	}

	isRestarted = !isRestarted;
}

/* ----- Дополнительные функции ----- */

// Функция выдающее случайное (целое) число с случайным знаком в выбранном диапазоне.
function getRandomCount(min, max) {
	let count = Math.trunc(Math.random(Math.random()) * (max - min) + min);
		count = Math.trunc(count / 10) * 10 + 5;

	// Выбираю знак числа.
	if ( Math.random() > 0.5){
		return count;
	} else {
		return count * (-1);
	}
}
