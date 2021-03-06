import { FPS, HEIGHT, SIZE, WIDTH, WORLD_HEIGHT, WORLD_WIDTH, } from "./constants.js";
import Vector from "./lib/core/classes/Vector.js";
import lib from "./lib/index.js";
import Enemy from "./src/classes/Enemy.js";
import Greenemy from "./src/classes/Greenemy.js";
import Pinkemy from "./src/classes/Pinkemy.js";
import Yellowemy from "./src/classes/Yellowemy.js";
import Ground from "./src/Ground.js";
import Player from "./src/Player.js";
let gameOver = false;
const { Container, Game, Scene, Timer, Text } = lib;
const gameOverScene = new Scene("gameover", new Text(WIDTH / 2, HEIGHT / 2, "game over", "175px Arial", "cyan", true), new Text(WIDTH / 2, HEIGHT / 2 + 100, "click to trick again", "50px Arial", "red", true));
function game() {
    const ground = new Ground(0, WORLD_HEIGHT, WORLD_WIDTH, SIZE * 5);
    const player = new Player(0, 0);
    const enemies = new Container(...new Array(3000).fill("").map(spawn));
    const scene = new Scene("main", ground, enemies, player);
    const game = new Game({
        id: "canvas",
        width: 1600,
        height: 900,
    }, player, scene, gameOverScene);
    player.setGame(game);
    game.setActive("main");
    const update = (ctx, deltaTime) => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.beginPath();
        for (let x = -((player.pos.x / 4) % SIZE) * 4; x <= WIDTH; x += SIZE * 4) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, HEIGHT);
        }
        for (let y = -((player.pos.y / 4) % SIZE) * 4; y <= HEIGHT; y += SIZE * 4) {
            ctx.moveTo(0, y);
            ctx.lineTo(WIDTH, y);
        }
        ctx.lineWidth = 2;
        ctx.stroke();
        enemies.entities.forEach((enemy) => {
            const dx = enemy.pos.x - player.pos.x;
            const dy = enemy.pos.y - player.pos.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < enemy.r + player.r) {
                if (enemy instanceof Greenemy) {
                    player.health -= WIDTH / 5;
                    player.score--;
                }
                else if (enemy instanceof Yellowemy) {
                    player.health += WIDTH / 2;
                }
                else if (enemy instanceof Pinkemy) {
                    player.vel.add(new Vector(Math.random() * SIZE * 200 - 100, Math.random() * SIZE * 200 - 100));
                    player.score += 2;
                }
                else {
                    player.vel.multiply(1.1);
                    player.health += WIDTH / 10;
                    player.score++;
                }
                player.isGrounded = true;
                enemies.remove(enemy);
                spawn();
            }
        });
        if (player.health <= 0) {
            game.setActive("gameover");
            timer.stop();
            gameOver = true;
        }
        game.engine.update(ctx, deltaTime);
    };
    const timer = new Timer(game.ctx, FPS, update);
    timer.start();
}
game();
document.getElementById("canvas").addEventListener("click", (e) => {
    if (gameOver) {
        gameOver = false;
        Game.destroy();
        Scene.destroy();
        Timer.destroy();
        game();
    }
});
function spawn() {
    const seed = Math.random();
    const x = Math.round(Math.random() * (WORLD_WIDTH - SIZE * 2) + SIZE);
    const y = Math.round(Math.random() * (WORLD_HEIGHT - SIZE * 2) + SIZE);
    if (seed < 0.6)
        return new Enemy(x, y);
    else if (seed < 0.75)
        return new Greenemy(x, y);
    else if (seed < 0.9)
        return new Yellowemy(x, y);
    else
        return new Pinkemy(x, y);
}
//# sourceMappingURL=main.js.map