// Canvas setup Cynthia
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }
    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }
    draw() {
        ctx.fillStyle = '#f497a5';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 10, 4, 4, '#FF0000'), //#9cf429; rojo
            new Ball(canvas.width / 3, canvas.height / 3, 15, 3, -3, '#00FF00'), // #cf0f7f verde
            new Ball(canvas.width / 4, canvas.height / 4, 8, -2, 5, '#0000FF'), //azul rey
            new Ball(canvas.width / 5, canvas.height / 5, 12, 4, -2, '#FFFF00'), //AMARILLO
            new Ball(canvas.width / 6, canvas.height / 6, 20, -3, 3, '#FF00FF'), //PURPURA
            new Ball(canvas.width / 2.5, canvas.height / 2.5, 18, 5, -4, '#FFA500'), //NARANJA
            new Ball(canvas.width / 3.5, canvas.height / 3.5, 14, -3, 6, '#008080'), //VERDE MENTAOSCURO
            new Ball(canvas.width / 4.5, canvas.height / 4.5, 22, 2, -5, '#CF0F7F'), //ROS
            new Ball(canvas.width / 5.5, canvas.height / 5.5, 9, -4, 3, '#9CF429'),//VINO
            new Ball(canvas.width / 6.5, canvas.height / 6.5, 16, 4, -3, '#00CED1')
        ];
        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, true); // Controlado por el jugador
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // Controlado por la computadora
        this.keys = {}; // Para capturar las teclas
    }
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }
    update() {
        this.balls.forEach(ball => {
            ball.move();
            
            // Colisiones con las paletas
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = -ball.speedX;
            }
            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -ball.speedX;
            }
            
            // Detectar cuando la pelota sale de los bordes (punto marcado)
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }
        
        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.balls[0]);
    }
    
    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }
    
    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();
