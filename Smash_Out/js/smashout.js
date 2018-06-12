var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});
var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var levelText;
var playAgainText;
var gameoverText;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var playing = false;
var startButton;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#000';

    // game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('brick', 'img/brick.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
    game.load.spritesheet('button', 'img/button.png', 120, 40);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Configuring the Ball
    ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    // ball.body.velocity.set(150, -150);
    ball.anchor.set(0.5);

    // Configuring the Paddle
    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    // Configuring the Brick
    initBricks();

    // Define a default text style for all the text on screen
    textStyle = { font: '18px Arial', fill: '#FFFFFF' };

    // Losing the game
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);
    gameoverText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Game Over', textStyle);
    gameoverText.anchor.set(0.5);
    gameoverText.visible = false;

    //Display the score
    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);

    //Display the lives
    livesText = game.add.text(game.world.width-5, 5, 'Lives: '+lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Life lost, click to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    //Adding a START button
    startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);

    //Display on level complete
	levelText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Level Complete!', textStyle);
    levelText.anchor.set(0.5);
    levelText.visible = false;
    playAgainText = game.add.text(game.world.width*0.5, game.world.height*0.5 + 30, 'Click to Play again..', textStyle);
    playAgainText.anchor.set(0.5);
    playAgainText.visible = false;


}
function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    if(playing){
        paddle.x = game.input.x || game.world.width*0.5;
    }
}

function initBricks(){
    brickInfo = {
        width: 50,
        height: 20,
        count: {row: 3, col: 7},
        offset: {top: 50, left: 60},
        padding: 10
    };

    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++){
        for(r=0; r<brickInfo.count.row; r++){
            // create new brick and add it to the group
            var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function ballHitBrick(ball, brick) {
    // Instead of killing the brick right away, add a tween to show a
    // smooth disappearing of the bricks.
    // brick.kill();

    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();
    // Shorter syntax for the above code
    // game.add.tween(brick.scale).to({x:2,y:2}, 500, Phaser.Easing.Elastic.Out, true, 100);
    // This tween will double the brick's scale in half a second using Elastic easing,
    // will start automatically, and have a delay of 100 miliseconds.

    score += 10;
    scoreText.setText('Points: '+score);
    ball.animations.play('wobble');

    if (score === brickInfo.count.row*brickInfo.count.col*10) {
        // alert('You won the game, congratulations!');
		levelText.visible = true;
		playAgainText.visible = true;
		game.add.tween(levelText.scale).to({x:2, y:2}, 1500, Phaser.Easing.Elastic.Out, true, 100);

        game.add.tween(ball.scale).to({x:0,y:0}, 1000, Phaser.Easing.Elastic.Out, true, 500);
        game.add.tween(paddle.scale).to({x:0,y:0}, 1000, Phaser.Easing.Elastic.Out, true, 500);
        ball.destroy();
        paddle.destroy();
        game.input.onDown.addOnce(function(){
            location.reload();
        }, this);
    }
}

function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Lives: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
        }, this);
    }
    else {
        // alert('You lost, game over!');
        // location.reload();
        livesText.setText('Lives: '+lives);
        gameoverText.visible = true;
        playAgainText.visible = true;
        game.add.tween(gameoverText.scale).to({x:2, y:2}, 1500, Phaser.Easing.Elastic.Out, true, 100);

        game.add.tween(ball.scale).to({x:0,y:0}, 500, Phaser.Easing.Elastic.Out, true, 100);
        game.add.tween(paddle.scale).to({x:0,y:0}, 500, Phaser.Easing.Elastic.Out, true, 100);
        ball.destroy();
        paddle.destroy();
        game.input.onDown.addOnce(function(){
            location.reload();
        }, this);
    }
}

function ballHitPaddle(ball, paddle) {
    // ball.animations.play('wobble');
    ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}

function startGame() {
    startButton.destroy();
    ball.body.velocity.set(150, -150);
    playing = true;
}