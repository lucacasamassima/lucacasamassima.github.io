var speed = 1;
const X_START = 202;
const Y_START = 415;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0; //start at the left end site
    this.y = y;
    this.speed = speed;
    this.height = 83;
    this.width = 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < ctx.canvas.width) {
        this.x += (this.speed * dt);
    } else {
        //bug enters again
        this.x = 0;
        this.x += (this.speed * dt);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function(x, y) {
    this.height = 83;
    this.width = 70;
    this.sprite = 'images/char-boy.png';
    this.x = X_START;
    this.y = Y_START;
    this.lives = 3;
    this.score = 0;
    this.items = 0;
    this.gameOver = false;
    this.gameWon = false;
};

Player.prototype.update = function() {
     this.y = this.y;
};

Player.prototype.reset = function() {
    this.x = X_START;
    this.y = Y_START;
};

//Once reached the water, player can stay there as long as she likes
//Once she press a key, she is obliged to go to the restart position
//505 is the canvas-width, 498 the canvas height, 101 the box width, 83 the box height
Player.prototype.handleInput = function(allowedKeys) {
    switch (allowedKeys) {
        case 'left':
            if (this.x > this.width) {
                this.x -= 101;
            }
            if (this.y === 0) {
                this.reset();
            }
            break;
        case 'right':
            if (this.x + 101 < 505 - this.width) {
                this.x += 101;
            }
            if (this.y === 0) {
                this.reset();
            }
            break;
        case 'up':
            if (this.y > this.height) {
                this.y -= 83;
            } else if (this.y === this.height) {
                this.y = 0;
                this.score += 100;
                document.getElementById("myScoreDivId").innerHTML = this.score;
            } else {
                this.reset();
            }
            break;
        case 'down':
            if (this.y < (498 - this.height) && this.y !== 0) {
                this.y += 83;
            }
            if (this.y === 0) {
                this.reset();
            }
            break;
    }
};


Player.prototype.collision = function() {
    if (this.lives > 1) {
        this.lives -= 1;
        this.reset();
    } else {
        this.lives = 0;
    }
    document.getElementById("myLivesDivId").innerHTML = this.lives;
};


Player.prototype.won = function() {
    this.gameWon = true;
    this.x = 202 + this.width;
    this.y = 200;
    allEnemies.forEach(function(enemy) {
        enemy.sprite = 'images/heart.png';
    });
    document.getElementById("myResultDivId").innerHTML = 'You found your friend! Please refresh the page to restart the game';
};

Player.prototype.over = function() {
    this.gameOver = true;
    //make the player disappear
    this.x = -200;
    document.getElementById("myResultDivId").innerHTML = 'Game over...you have not found your friend...Please refresh the page to restart the game';;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Gem class
var Gem = function() {
    //the gem appears in a random position
    this.height = 70;
    this.width = 70;
    this.x = Math.floor(Math.random() * (505 - this.width));
    //gems cannot appear on water and grass
    this.y = Math.floor(Math.random() * (332 - this.height));
    if (this.y < 83) {
        this.y += 83;
    }
};

var Blugem = function(x, y) {
    Gem.call(this, x, y);
    this.sprite = 'images/gem-blu.png';
};

var Greengem = function(x, y) {
    Gem.call(this, x, y);
    this.sprite = 'images/gem-green.png';
};

var Orangegem = function(x, y) {
    Gem.call(this, x, y);
    this.sprite = 'images/gem-orange.png';
};

Blugem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Greengem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Orangegem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Blugem.prototype.reset = function() {
    //Make the gem disappear out of the canvas
    this.y = -200;
    player.lives += 1;
    document.getElementById("myLivesDivId").innerHTML = player.lives;
};

Greengem.prototype.reset = function() {
    //Make the gem disappear out of the canvas
    this.y = -200;
    player.lives += 1;
    document.getElementById("myLivesDivId").innerHTML = player.lives;
};

Orangegem.prototype.reset = function() {
    //Make the gem disappear out of the canvas
    this.y = -200;
    player.lives += 1;
    document.getElementById("myLivesDivId").innerHTML = player.lives;
};

Gem.prototype.update = function() {
    this.x = this.x;

};

//Item class
var Item = function(x, y) {
    //the item can appear in a random position, but not in water or where there is a gem
    this.height = 70;
    this.width = 70;
    this.x = Math.floor(Math.random() * (505 - this.width));
    this.y = Math.floor(Math.random() * (332 - this.height));
    if (this.y < 83) {
        this.y += 83;
    }
};

var Key = function(x, y) {
    Item.call(this, x, y);
    this.sprite = 'images/key.png';
};

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Key.prototype.reset = function(x, y) {
    //make the key appears left above the canvas
    this.x = 0;
    this.y = -10;
    this.sprite = 'images/small_key.png'
    player.items += 1;
    document.getElementById("myItemsDivId").innerHTML = player.items;
};

var Heart = function(x, y) {
    Item.call(this, x, y);
    this.sprite = 'images/heart.png';
};

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Heart.prototype.move = function(x, y) {
    //make the heart move 1 box on the right or left in case with gem collision
    if (this.x > this.width) {
        this.x -= 101;
    } else {
        this.x += 101;
    }
};

Heart.prototype.reset = function(x, y) {
    //make the heart appear next to key
    this.x = key.width;
    this.y = -10;
    this.sprite = 'images/small_heart.png';
    player.items += 1;
    document.getElementById("myItemsDivId").innerHTML = player.items;
};

Item.prototype.update = function(x, y) {
    this.x = this.x;
    this.y = this.y;
};
//Friend object: the aim of the game
var Friend = function(x, y) {
    this.x = 202;
    this.y = 200;
    this.sprite = 'images/char-boy.png';
};

Friend.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

var allEnemies = [];
for (var i = 1; i < 4; i++) {
    allEnemies.push(new Enemy(this.x, (i * 83) - 20, this.speed * 100 * i));
}
// Place the player object in a variable called player
var player = new Player();

//TODO make use of inheritance
// Place the gem objects in their variables called colorGem
var gem = new Gem();
var bluGem = new Blugem();
var greenGem = new Greengem();
var orangeGem = new Orangegem();

//Place the item obejcts in their variables called item, key and heart;
var item = new Item();
var key = new Key();
var heart = new Heart();

//Place the beloved one in a variable called friend
var friend = new Friend();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
