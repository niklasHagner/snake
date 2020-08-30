window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPress);
    setInterval(game, 60);
    appleCounterEl = document.getElementById("score");
    statusEl = document.getElementById("status");
    deathEl = document.getElementById("deaths");
}

tileCount = 20;
tileSize = canvas.width / tileCount;
player = { x: 10, y: 10, tailLength: 5, trail: [] };
apple = { x: 15, y: 15 };
velocity = { x: 0, y: 0 };
state = { appleCounter: 0, score: 0, paused: true, deaths: 0 };

let countScore = false;

game = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lime";

    if (state.paused === false) {
        player.x += velocity.x;
        player.y += velocity.y;
        if (player.x < 0) {
            player.x = tileCount - 1;
        } else if (player.x > tileCount - 1) {
            player.x = 0;
        }
    
        if (player.y < 0) {
            player.y = tileCount - 1;
        }
        else if (player.y > tileCount - 1) {
            player.y = 0;
        }

        checkForCollisionWithTail();
            
        if (countScore === true) {
            state.deaths++;
            deathEl.innerText = state.deaths;
            state.score = state.score-10;
            countScore = false;
        }
    }
    
    player.trail.push({ x: player.x, y: player.y });
    while (player.trail.length > player.tailLength) {
        player.trail.shift();
    }
    checkAppleCollision();
    ctx.fillStyle = "crimson";
    ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize - 2, tileSize - 2);
}

checkForCollisionWithTail = () => {
    for (let i = 0; i < player.trail.length; i++) {
        ctx.fillRect(player.trail[i].x * tileSize, player.trail[i].y * tileSize, tileSize - 2, tileSize - 2);
        if (player.trail[i].x === player.x && player.trail[i].y === player.y) {
            collisionWithTail(i);
            break;
        }
    }
}

checkAppleCollision = () => {
    let isAppleHit = apple.x === player.x && apple.y === player.y;
    if (!isAppleHit)
        return;

    player.tailLength++;
    state.score++;
    state.appleCounter++;
    changeAppleLocation();
    appleCounterEl.innerText = state.appleCounter;

    let msg = "tail " + player.tailLength;
    printTextToStatusField(msg);
}

collisionWithTail = (i) => {
    console.log("collisionWithTail: ", player.trail[i].x , ",", player.trail[i].y, "player info:", player);
    if (!state.paused) {
        countScore = true;
        let msg = "you died with tail " + player.tailLength;
        printTextToStatusField(msg);
    }
    player.tailLength = 5;
}

changeAppleLocation = () => {
    let newX, newY;
    newX = Math.floor(Math.random() * tileCount);
    newY = Math.floor(Math.random() * tileCount);
    while (newX === player.x) {
        newX = Math.floor(Math.random() * tileCount);
    }
    while (newY === player.y) {
        newY = Math.floor(Math.random() * tileCount);
    }
    apple.x = newX;
    apple.y = newY;
}

keyPress = (ev) => {

    if([32, 37, 38, 39, 40].indexOf(ev.keyCode) > -1) { //prevent space and arrow keys from scrolling the page
        ev.preventDefault();
    }

    if([37, 38, 39, 40].indexOf(ev.keyCode) > -1) { //unpause when using arrow-keys
        state.paused = false;
    }

    switch (ev.keyCode) {
        case 32: //Space
            state.paused = !state.paused;
            printTextToStatusField(state.paused ? "paused" : "");
            break;
        case 37: //Left
            if (velocity.x !== 1) {
                velocity.x = -1; velocity.y = 0;
            }
            break;
        case 38: //Up
            if (velocity.y !== 1) {
                velocity.x = 0; velocity.y = -1;
            }
            break;
        case 39: //Right
            if (velocity.x !== -1) {
                velocity.x = 1; velocity.y = 0;
            }
            break;
        case 40: //Down
            if (velocity.y !== -1) {
                velocity.x = 0; velocity.y = 1;
            }
            break;
        default:
            if (state.paused) {
                state.paused = false;
            }
            break;
    }
}

printTextToStatusField = (message) => {
    statusEl.innerText = message;
    setTimeout(() => {
        statusEl.innerText = "";
    }, 5000);
}