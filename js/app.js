'use-strict';
// Global variables
var win = true;
var freeze_screen = false;
var lives = 3;
var score = 0;
var next_level = false;
var start_new_game = false;

// Adding gems
var Gem = function(x, y) {
    //To render the gem within rock part of the canvas
    min = 100;
    max = 225;
    this.x = Math.floor(Math.random() * (max - min) + min);
    this.y = Math.floor(Math.random() * (max - min) + min);
    //    console.log ('x:' + this.x + ' y:' + this.y);
    this.width = 30;
    this.height = 40;
    this.status = 1;
    this.sprite = 'images/Gem Green.png';
};

Gem.prototype.render = function() {
    if (this.status === 1) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } else if (this.status === 0) {
        console.log("Dont draw");
    }
};

/* ************** Enemy **************/
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 40;
    this.height = 30;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //    // // console.log("calling method: app.js(Enemy.prototype.update)");
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < 500 && freeze_screen === false) {
        this.x = this.x + this.speed * dt;
        this.x += 3;
    } else if (freeze_screen === false) {
        this.x = this.x + this.speed * dt;
        this.x = Math.floor(Math.random() * 100);
        this.x += 3;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // // console.log("calling method: app.js(Enemy.prototype.render)");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.sprite = "images/char-horn-girl.png";
};

// Invoking checkCollision method from update
Player.prototype.update = function() {
    // // console.log("calling method: app.js(Player.prototype.update)");
    this.checkCollisions();
};

//Checking collision detection
Player.prototype.checkCollisions = function() {
    start_new_game = false;
    //// // console.log("calling method: app.js(Player.prototype.checkCollisions)");
    // Check collisions with enemies
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].x < player.x + player.width &&
            allEnemies[i].x + allEnemies[i].width > player.x &&
            allEnemies[i].y < player.y + player.height &&
            allEnemies[i].y + allEnemies[i].height > player.y) {
            console.log("collision detected");
            handleCollisions();
        } else if (this.y <= 40 && lives) {
            console.log("You Won");
            score += 10;
            this.reset();
        }
    } // end of for loop with enemy collision.

    for (var j = 0; j < gem.length; j++) {
        if (gem[j].status === 1 && gem[j].x < player.x + player.width &&
            gem[j].x + gem[j].width > player.x &&
            gem[j].y < player.y + player.height &&
            gem[j].y + gem[j].height > player.y) {
            console.log("gem collision detected");
            score += 10;
            gem[j].status = 0;
        }
    }
};


Player.prototype.reset = function() {
// console.log("calling method: app.js(Player.prototype.reset)");
    this.x = 200;
    this.y = 400;
};

Player.prototype.render = function() {
    // console.log("calling method: app.js(Player.prototype.render)");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles the input keys
Player.prototype.handleInput = function(direction) {
    //    // console.log("calling method: app.js(Player.prototype.handleInput)");
    switch (direction) {
        case 'left':
            if (this.x > 50) {
                this.x -= 100;
                console.log("left");

            }
            break;
        case 'right':
            if (this.x < 400) {
                this.x += 100;
                console.log("right");

            }
            break;
        case 'up':
            if (this.y > 0) {
                this.y -= 82;
                console.log("up");
            }
            break;
        case 'down':
            if (this.y < 380) {
                this.y += 82;
                console.log("down");
            }
            break;
        case 'enter':
            console.log("enter");
            if (next_level || freeze_screen) {
                gameReset();
            }
            break;
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    //    // console.log("calling method: app.js(keyup EventListener)");
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    console.log("dhanya pressed key # [" + e.keyCode + "]");
    player.handleInput(allowedKeys[e.keyCode]);
});

/* @Helper functions for rendering scores, lives and function to
   handle collisions with enemy */
var drawScore = function() {
    //    // console.log("calling method: app.js(drawScore)");
    ctx.fillRect(10, 0, 10, 40);
    drawText("Scores :" + " " + score, 10, 40);
};

var drawLives = function() {
    //    // console.log("calling method: app.js(drawLives)");
    ctx.fillRect(250, 0, 300, 40);
    drawText("Lives :" + " " + lives, 300, 40);
};

var handleCollisions = function() {
    //// console.log("calling method: app.js(handleCollisions)");
    if (lives > 0) {
        lives--;
    }
    if (lives === 0) {
        win = false;
        freeze_screen = true;
        gameOver();
    } else {
        player.reset();
    }
};

// Function to restart game when playes looses
var gameReset = function() {
    //// console.log("calling method: app.js(gameReset)");
    lives = 3;
    score = 0;
    player.reset();
    gem.status = 1;
    freeze_screen = false;
    start_new_game = true;
};

// Function to grey out for the gameover screen
var gameOver = function() {
    //// console.log("calling method: app.js(gameOver)");
    if (win === false && lives === 0) {
        var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 4) {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }
        ctx.putImageData(imgData, 0, 0);
        drawText("Game Over!", ctx.canvas.width / 4, ctx.canvas.height / 2);
        drawText("Press Enter to start the game", 50, ctx.canvas.height * 0.60);
    }
};

//General helper function for drawing text in the game.
var drawText = function(text, width, height) {
    // console.log("calling method: app.js(drawText)");
    ctx.font = "26pt Impact";
    ctx.fillStyle = "white";
    ctx.fillText(text, width, height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeText(text, width, height);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var gem = [new Gem(1, 1)];
var allEnemies = [new Enemy(0, 60, 2), new Enemy(0, 150, 4), new Enemy(270, 220, 5)];
var player = new Player(200, 400);