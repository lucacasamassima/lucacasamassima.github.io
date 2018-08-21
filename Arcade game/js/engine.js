/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    //Determine if player share the same location with enemy, gems and items
    //From developer.mozilla.org: 2D collision detection non-rotating rectangles
    function checkCollisions() {
        //player with enemy
        allEnemies.forEach(function(enemy) {
            if (player.x < (enemy.x + enemy.width) && (player.x + player.width) > enemy.x && player.y < (enemy.y + enemy.height) && (player.y + player.height) > enemy.y) {
                player.collision();
            }
        });
        //TODO: make use of inheritance
        //player with gem
        if (player.x < (bluGem.x + bluGem.width) && (player.x + player.width) > bluGem.x && player.y < (bluGem.y + bluGem.height) && (player.y + player.height) > bluGem.y) {
            bluGem.reset();
        }

        if (player.x < (greenGem.x + greenGem.width) && (player.x + player.width) > greenGem.x && player.y < (greenGem.y + greenGem.height) && (player.y + player.height) > greenGem.y) {
            greenGem.reset();
        }
        if (player.x < (orangeGem.x + orangeGem.width) && (player.x + player.width) > orangeGem.x && player.y < (orangeGem.y + orangeGem.height) && (player.y + player.height) > orangeGem.y) {
            orangeGem.reset();
        }
        //player with item
        if (player.items < 1) {
            if (player.x < (key.x + key.width) && (player.x + player.width) > key.x && player.y < (key.y + key.height) && (player.y + player.height) > key.y) {
            key.reset();
            }
        }

        if (player.items < 2) {
            if (player.x < (heart.x + heart.width) && (player.x + player.width) > heart.x && player.y < (heart.y + heart.height) && (player.y + player.height) > heart.y) {
            heart.reset();
            }
        }
        //items with gems
        if (key.x < (bluGem.x + bluGem.width) && (key.x + key.width) > bluGem.x && key.y < (bluGem.y + bluGem.height) && (key.y + key.height) > bluGem.y) {
            key.move();
        }
        if (key.x < (greenGem.x + greenGem.width) && (key.x + key.width) > greenGem.x && key.y < (greenGem.y + greenGem.height) && (key.y + key.height) > greenGem.y) {
            key.move();
        }
        if (key.x < (orangeGem.x + orangeGem.width) && (key.x + key.width) > orangeGem.x && key.y < (orangeGem.y + orangeGem.height) && (key.y + key.height) > orangeGem.y) {
            key.move();
        }
        if (heart.x < (bluGem.x + bluGem.width) && (heart.x + heart.width) > bluGem.x && heart.y < (bluGem.y + bluGem.height) && (heart.y + heart.height) > bluGem.y) {
            heart.move();
        }
        if (heart.x < (greenGem.x + greenGem.width) && (heart.x + heart.width) > greenGem.x && heart.y < (greenGem.y + greenGem.height) && (heart.y + heart.height) > greenGem.y) {
            heart.move();
        }
        if (heart.x < (orangeGem.x + orangeGem.width) && (heart.x + heart.width) > orangeGem.x && heart.y < (orangeGem.y + orangeGem.height) && (heart.y + heart.height) > orangeGem.y) {
            heart.move();
        }
    }
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkPlayer();
    }

    function checkPlayer () {
        if (player.score === 1200 && player.items === 2) {
            player.won();
        }
        //cover also the case the players has not collected both items
        if (player.lives === 0 || (player.score === 1200 && player.items < 2)) {
            player.over();
        }
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt,score) {
        if (player.gameWon != true) {
            allEnemies.forEach(function(enemy) {
                enemy.update(dt);
            });
        }
        /*In this case it seems working not to use the subclasses, why?
        bluGem.update();
        greenGem.update();
        orangeGem.update();*/
        player.update();
        gem.update(score);
        item.update(score);
    }
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.*/
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        key.render();

        //Different gems appear as function of score
        if (player.score >= 300 && player.score < 600) {
            bluGem.render();
        }

        if (player.score >= 600 && player.score < 900) {
            greenGem.render();
        }

        if (player.score >= 900 && player.score < 1200) {
            orangeGem.render();
        }

        //Once player picks key, heart appears on canvas
        if (player.items >= 1 && player.score > 200) {
            heart.render();
        }
        //Friend appears when players has both items and a score of 1200
        if (player.gameWon === true) {
            friend.render();
        }
    }

    // This function handle the game reset when game over and also the reset of all variables
    function reset() {
        if (player.gameOver !== true) {
            player.reset();
            key.reset();
            heart.reset();
            bluGem.reset();
            greenGem.reset();
            orangeGem.reset();
        }
    }

    // This function move the items in case of collisions with gems. Enemies run over items and gems
    function move() {
        if (player.gameOver !== true) {
            key.move();
            heart.move();
        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/gem-blu.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/key.png',
        'images/small_key.png',
        'images/heart.png',
        'images/small_heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object and the main function to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    //Put next line into comment to avoid warnings. How to use main as global to restart the game?
    //global.main() = main();
})(this);
