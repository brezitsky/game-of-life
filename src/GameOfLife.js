class GameOfLife {
	constructor(settings) {
		this._dimensionX = settings.x;
		this._dimensionY = settings.y;

		this._per = settings.size;

		this._firstState = [];

		this._canvas = null;
		this._ctx = null;

		this._prevGeneration = [];
		this._currentGeneration = [];
		this._nextGeneration = [];

		this._generationsHistory = [];

		this._tick = 0;
	}

	get dimensionX() {
		return this._dimensionX;
	}
	set dimensionX(a) {
		this._dimensionX = a;
	}

	get dimensionY() {
		return this._dimensionY;
	}
	set dimensionY(a) {
		this._dimensionY = a;
	}

	get per() {
		return this._per;
	}
	set per(a) {
		this._per = a;
	}

	get canvas() {
		return this._canvas;
	}
	set canvas(a) {
		this._canvas = a;
	}

	get ctx() {
		return this._ctx;
	}
	set ctx(a) {
		this._ctx = a;
	}

	get firstState() {
		return this._firstState;
	}
	set firstState(a) {
		this._firstState = a;
	}

	get prevGeneration() {
		return this._prevGeneration;
	}
	set prevGeneration(a) {
		this._prevGeneration = a;
	}

	get currentGeneration() {
		return this._currentGeneration;
	}
	set currentGeneration(a) {
		this._currentGeneration = a;
	}

	get nextGeneration() {
		return this._nextGeneration;
	}
	set nextGeneration(a) {
		this._nextGeneration = a;
	}

	get generationsHistory() {
		return this._generationsHistory;
	}
	addGenerationsHistory(a) {
		// console.log(a);
		this._generationsHistory.push(a);
		// console.log(this.generationsHistory);
	}
	clearGenerationsHistory() {
		this._generationsHistory = [];
	}

	get tick() {
		return this._tick;
	}
	set tick(a) {
		this._tick = a;
	}

	monitor() {
		console.log(`dimensionX: ${this.dimensionX}`);
		console.log(`dimensionY: ${this.dimensionY}`);
		console.log(`per: ${this.per}`);
		console.log(`canvas: ${this.canvas}`);
		console.log(`ctx: ${this.ctx}`);
		console.log(`firstState: ${this.firstState}`);
		console.log(`prevGeneration: ${this.prevGeneration}`);
		console.log(`currentGeneration: ${this.currentGeneration}`);
		console.log(`nextGeneration: ${this.nextGeneration}`);
		console.log(`generationsHistory: ${this.generationsHistory}`);
		console.log(`tick: ${this.tick}`);
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	createMatrix(a) {
		let arr = [];

		for(let i = 0; i < this.dimensionX; i++) {
			arr[i] = [];

			for(let j = 0; j < this.dimensionY; j++) {
				arr[i][j] = a;
			}
		}

		return arr;
	}

	generateFirstState() {
		let array = [];

		for(let i = 0; i < this.dimensionX; i++) {
			array[i] = [];

			for(let j = 0; j < this.dimensionY; j++) {
				let random = this.getRandomInt(0, 5);
				if(random === 0 || random === 1) {
					array[i][j] = random;
				}
				else {
					array[i][j] = 0;
				}
			}
		}

		this.currentGeneration = array;
	}

	generateSimpleGrid() {
		this.currentGeneration = this.createMatrix(0);
	}

	applyCanvasSize() {
		this.canvas.width = this.per * this.dimensionX;
		this.canvas.height = this.per * this.dimensionY;
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	canvasClick(params) {
		// console.log(coords);

		if(params.flag) {
			let i = Math.floor(params.x / this.per);
			let j = Math.floor(params.y / this.per);

			// console.log(i, j, params.flag);

			switch (this.currentGeneration[i][j]) {
				case 0:
					this.currentGeneration[i][j] = 1;
					break;
				case 1:
					this.currentGeneration[i][j] = 0;
					break;
				default:
					console.warn('Unknown cell state');
			}

			this.drawGrid();
		}
	}

	drawGrid() {
		this.clearCanvas();

		for(let i = 0; i < this.dimensionX; i++) {
			for(let j = 0; j < this.dimensionY; j++) {

				switch (this.currentGeneration[i][j]) {
					case 0:
					this.ctx.strokeStyle ='blue';
					this.ctx.lineWidth = .2;
					this.ctx.strokeRect(i * this.per, j *	this.per, this.per, this.per);
					break;
					case 1:
					// this.ctx.beginPath();
					// this.ctx.moveTo(i, j);
					this.ctx.fillStyle = 'rgba(0, 0, 0, .7)';
					this.ctx.fillRect(i * this.per, j *	this.per, this.per, this.per)
					break;

					default:
					console.warn(`Wrong state of cell [${i}][${j}]: ${arr[i][j]}`);
				}
			}
		}

		this.prevGeneration = this.currentGeneration;

		this.tick += 1;

		this.addGenerationsHistory(this.prevGeneration);

		// this.monitor();
	}

	gameover() {
		// check for all cells are dead
		let allDead = () => {
			let flag = true;

			for(let i = 0; i < this.dimensionX; i++) {
				for(let j = 0; j < this.dimensionY; j++) {
					if(this.nextGeneration[i][j] === 1) {
						flag = false;
						break;
					}
				}

				if(!flag) break;
			}

			return flag;
		}

		let sameGenerations = () => {
			let flag = true;

			for(let i = 0; i < this.dimensionX; i++) {
				for(let j = 0; j < this.dimensionY; j++) {
					if(this.currentGeneration[i][j] !== this.nextGeneration[i][j]) {
						flag = false;
						break;
					}
				}

				if(!flag) break;
			}

			return flag;
		}

		let periodical = () => {
			let suggestions = [];
			// console.log(this.generationsHistory);
			// console.log(this.nextGeneration);
			// console.log(this.generationsHistory.length);

			for(let k = 0; k < this.generationsHistory.length; k++) {
				// console.log(k);
				let flag = true;

				for(let i = 0; i < this.dimensionX; i++) {
					for(let j = 0; j < this.dimensionY; j++) {
						// console.log(this.generationsHistory[k][i][j] != this.nextGeneration[i][j]);
						if(this.generationsHistory[k][i][j] !== this.nextGeneration[i][j]) {
							flag = false;
							// console.log(flag);
							// console.log(k, i, j);
						}
					}
				}

				if(!flag) {
					suggestions.push({
						tick: k
					})
				}
			}

			return suggestions;
		}

		// console.log({
		// 	allDead: allDead(),
		// 	sameGenerations: sameGenerations(),
		// 	periodical: periodical()
		// });

		return {
			allDead: allDead(),
			sameGenerations: sameGenerations(),
			periodical: periodical()
		};
	}

	computeNextGeneration() {
		let neighbors = 0;
		let nextGen = [];

		for(let i = 0; i < this.dimensionX; i++) {
			nextGen[i] = [];

			for(let j = 0; j < this.dimensionY; j++) {
				if(i - 1 >= 0 && j - 1 >= 0) {
					// console.log('one', i - 1, j - 1);
					neighbors += this.currentGeneration[i - 1][j - 1]; // top left
				}
				else {
					neighbors += this.currentGeneration[this.dimensionX - 1][this.dimensionY - 1]; // top left
				}

				if(i - 1 >= 0) {
					// console.log('two', i - 1);
					neighbors += this.currentGeneration[i - 1][j]; 		// top center
				}
				else {
					neighbors += this.currentGeneration[this.dimensionX - 1][j]; 		// top center
				}

				if(i - 1 >= 0 && j + 1 <= this.dimensionY - 1) {
					// console.log('three', i - 1, j + 1);
					neighbors += this.currentGeneration[i - 1][j + 1]; // top right
				}
				else {
					neighbors += this.currentGeneration[this.dimensionX - 1][0]; // top right
				}

				if(j - 1 >= 0) {
					// console.log('four', j - 1);
					neighbors += this.currentGeneration[i][j - 1]; 		// middle left
				}
				else {
					neighbors += this.currentGeneration[i][this.dimensionY - 1]; 		// middle left
				}

				if(j + 1 <= this.dimensionY - 1) {
					// console.log('five', i,  j + 1);
					neighbors += this.currentGeneration[i][j + 1]; 		// middle right
				}
				else {
					neighbors += this.currentGeneration[i][0]; 		// middle right
				}

				if(i + 1 <= this.dimensionX - 1 && j - 1 >= 0) {
					// console.log('six', i + 1, j - 1);
					neighbors += this.currentGeneration[i + 1][j - 1]; // bottom left
				}
				else {
					neighbors += this.currentGeneration[0][this.dimensionY - 1]; // bottom left
				}

				if(i + 1 <= this.dimensionX - 1) {
					// console.log('seven', i + 1);
					neighbors += this.currentGeneration[i + 1][j]; 		// bottom center
				}
				else {
					neighbors += this.currentGeneration[0][j]; 		// bottom center
				}

				if(i + 1 <= this.dimensionX - 1 && j + 1 <= this.dimensionY - 1) {
					// console.log('eight', i + 1, j + 1);
					neighbors += this.currentGeneration[i + 1][j + 1]; //bottom right
				}
				else {
					neighbors += this.currentGeneration[0][0]; //bottom right
				}
				// console.log('--------------------');

				if(this.currentGeneration[i][j] === 0) {
					// apply rules for dead cell
					if(neighbors === 3) {
						nextGen[i][j] = 1;
					}
					else {
						nextGen[i][j] = 0;
					}
				}
				else if(this.currentGeneration[i][j] === 1) {
					// apply rules for alive cell
					if(neighbors < 2 || neighbors > 3) {
						nextGen[i][j] = 0;
					}
					else {
						nextGen[i][j] = 1;
					}
				}

				// console.log(neighbors);
				neighbors = 0;
			}
		}

		this.nextGeneration = nextGen;

		return this.gameover();
	}
}

module.exports = GameOfLife;
