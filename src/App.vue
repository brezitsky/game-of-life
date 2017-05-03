<template>
	<div id="app">

		<div class="grid">
			<div class="left">
				<div class="canvas">
					<div class="panzoom">
						<canvas ref='canvas' @click='clickCanvas($event)'></canvas>
					</div>
				</div>
			</div>

			<div class="right">
				<div class="settings">
					Rows: <input @change='canvSize' type="number" v-model='dimensionX'>
				</div>

				<div class="settings">
					Columns: <input @change='canvSize' type="number" v-model='dimensionY'>
				</div>

				<div class="settings">
					Cell size:
					<input @change='canvSize' type="range" min='1' max='30' step='1' v-model='cellSize'>
					{{cellSize}}x{{cellSize}}
				</div>

				<div class="speed">
					Speed:
					<input @change='setSpeed' type="range" min='10' max='1000' step='10' v-model='speed'>
					{{speed}}ms
				</div>

				<div class="controls">
					<button @click='random' :disabled='!navigation.random'>Generate random</button>
					<button @click='userInput' :disabled='!navigation.userInput'>Unlock user input</button>
				</div>

				<div class="controls">
					<button @click='start' :disabled='!navigation.start'>start</button>
					<button @click='pause' :disabled='!navigation.pause'>pause</button>
					<button @click='stop' :disabled='!navigation.stop'>stop</button>
				</div>

				<div class="tick">
					Tick: <b>{{tick}}</b>
				</div>

				<div class="gameover" v-show='gameover.allDead || gameover.sameGenerations ||	gameover.periodical.length'>
					Game over! Total ticks: {{tick}}
					<div v-show='gameover.allDead'>All cells are dead.</div>
					<div v-show='gameover.sameGenerations'>Generations not changed. All structures ar still lifes.</div>
					<div v-show='gameover.periodical.length'>Periodical generations.</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const GameOfLife = require('./GameOfLife.js');

const gol = new GameOfLife({
	x: 20,
	y: 20,
	size: 22
});

let interval = null;

exports.default = {
	name: 'app',

	data () {
		return {
			dimensionX: 20,
			dimensionY: 20,
			cellSize: 30,
			speed: 50,
			tick: 0,
			navigation: {
				start: true,
				pause: false,
				stop: false,
				random: true,
				userInput: true
			},
			userCanClick: false,
			gameover: {
				allDead: false,
				sameGenerations: false,
				periodical: []
			}
		}
	},

	methods: {

		canvSize() {
			gol.dimensionX = this.dimensionX;
			gol.dimensionY = this.dimensionY;
			gol.per = this.cellSize;
			gol.clearCanvas();
			gol.applyCanvasSize()
			gol.drawGrid();
		},

		random() {
			gol.generateFirstState();
			gol.drawGrid();

			this.navigation.start = true;
			this.navigation.pause = false;
			this.navigation.stop = false;
			this.navigation.random = true;
			this.navigation.userInput = true;
			this.userCanClick = false;
		},

		userInput() {
			gol.clearCanvas();

			this.navigation.start = true;
			this.navigation.pause = false;
			this.navigation.stop = false;
			this.navigation.random = true;
			this.navigation.userInput = true;
			this.userCanClick = true;
			this.gameover.allDead = false;
			this.gameover.sameGenerations = false;
			this.gameover.periodical = false;

			gol.generateSimpleGrid();
			gol.drawGrid();
		},

		setSpeed() {
			if(!this.navigation.start) {
				this.start();
			}
		},

		start() {
			clearInterval(interval);

			interval = setInterval(() => {
				this.gameover = gol.computeNextGeneration();
				gol.currentGeneration = gol.nextGeneration;
				gol.drawGrid();
				this.tick++;
			}, this.speed)

			this.navigation.start = false;
			this.navigation.pause = true;
			this.navigation.stop = true;
			this.navigation.random = false;
			this.navigation.userInput = false;
			this.userCanClick = false;
			this.gameover.allDead = false;
			this.gameover.sameGenerations = false;
			this.gameover.periodical = false;
		},

		pause() {
			clearInterval(interval);
			this.navigation.start = true;
			this.navigation.pause = false;
			this.navigation.stop = true;
			this.navigation.random = false;
			this.navigation.userInput = false;
			this.userCanClick = false;
			this.gameover.allDead = false;
			this.gameover.sameGenerations = false;
			this.gameover.periodical = false;
		},

		stop() {
			clearInterval(interval);
			gol.clearCanvas();
			gol.clearGenerationsHistory();

			this.navigation.start = true;
			this.navigation.pause = false;
			this.navigation.stop = false;
			this.navigation.random = true;
			this.navigation.userInput = true;
			this.userCanClick = false;
			this.tick = 0;
			this.gameover.allDead = false;
			this.gameover.sameGenerations = false;
			this.gameover.periodical = [];

			gol.generateSimpleGrid();
			gol.drawGrid();
		},

		clickCanvas(e) {
			// console.log(this);
			gol.canvasClick({
				x: e.layerX,
				y: e.layerY,
				flag: this.userCanClick
			})
		}
	},

	updated() {
		if(this.gameover.allDead || this.gameover.sameGenerations) {
			clearInterval(interval);
			this.navigation.start = false;
			this.navigation.pause = false;
			this.navigation.stop = true;
			this.navigation.random = false;
			this.navigation.userInput = false;
			this.userCanClick = false;
		}

		if(this.gameover.periodical.length) {
			clearInterval(interval);
			this.navigation.start = false;
			this.navigation.pause = false;
			this.navigation.stop = true;
			this.navigation.random = false;
			this.navigation.userInput = false;
			this.userCanClick = false;
			console.log(this.gameover.periodical);
		}
	},

	mounted() {
		gol.canvas = this.$refs.canvas;
		gol.ctx = gol.canvas.getContext('2d');
		gol.applyCanvasSize();
		gol.generateSimpleGrid();
		gol.drawGrid();
	}
}
</script>

<style lang="scss">
body {
	padding: 0;
	margin: 0;
	font-family: Arial;
	font-size: 16px;
	box-sizing: border-box;

	* {
		box-sizing: border-box;
	}

	#app {

		.grid {
			display: flex;
			width: 100%;

			.left {
				overflow: hidden;
				flex: 0 1 auto;
			}

			.right {
				flex: 1 1 auto;
				padding: 10px 0 0;
			}
		}

		.canvas {
			width: 100%;
			height: 70vh;
			overflow: auto;
			margin: 0 0 20px;
		}

		.settings {
			padding: 0 10px;
			display: flex;
			align-items: center;
			margin: 0 0 20px;

			input {
				margin: 0 10px;
			}
		}

		.tick {
			padding: 0 10px;
			margin: 0 0 20px;
		}

		.controls {
			padding: 0 10px;
			display: flex;
			margin: 0 0 20px;

			button {
				padding: 10px 20px;
				cursor: pointer;
				font-size: 12px;
				text-transform: uppercase;
				margin: 0 10px 0 0;
			}
		}

		.speed {
			display: flex;
			align-items: center;
			padding: 0 10px;
			margin: 0 0 20px;
		}

		.gameover {
			padding: 0 10px;
		}
	}
}
</style>
