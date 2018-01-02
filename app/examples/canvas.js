//CONSTS
const RIGHT_KEY_CODE = 68;
const LEFT_KEY_CODE = 65;
const UP_KEY_CODE = 87;
const DOWN_KEY_CODE = 83;

const keysPressed = {};
keysPressed[RIGHT_KEY_CODE] = false;
keysPressed[LEFT_KEY_CODE] = false;
keysPressed[UP_KEY_CODE] = false;
keysPressed[DOWN_KEY_CODE] = false;

function printSkills(data) {

    const TILE_SIZE = 100;
    const TILES_IN_A_LINE = Math.ceil(Math.sqrt(data.length));
    const WORLD_SIZE = TILES_IN_A_LINE * TILE_SIZE;
    const VIEW_WIDTH = window.innerWidth;
    const VIEW_HEIGHT = window.innerHeight;
    const VIEW_TILE_WIDTH = Math.ceil( VIEW_WIDTH / TILE_SIZE ) + 1;
    const VIEW_TILE_HEIGHT = Math.ceil( VIEW_HEIGHT / TILE_SIZE ) + 1;
    const maxOut = 100;
    let playerX = -maxOut || Math.floor(WORLD_SIZE / 2); //center
    let playerY = playerX; //center
    const moveSize = 10;

    const limitTopLeft = -maxOut;
    const limitBottomRight = WORLD_SIZE + maxOut;

    const canvas = document.getElementById('skills-canvas');
    const ctx = canvas.getContext('2d');
    const tileGrid = [];
    const totalSkills = data.length;
    const totalRows = totalSkills / TILES_IN_A_LINE;

    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;

    for (let rowIndex = 0 ; rowIndex < totalRows ; rowIndex ++) {
        tileGrid.push(skills.splice(0, TILES_IN_A_LINE));
    }

    window.requestAnimationFrame(onEnterFrame);

    function onEnterFrame() {
        if (keysPressed[RIGHT_KEY_CODE]) playerX = playerX + moveSize;
        if (keysPressed[LEFT_KEY_CODE]) playerX = playerX - moveSize;
        if (keysPressed[UP_KEY_CODE]) playerY = playerY - moveSize;
        if (keysPressed[DOWN_KEY_CODE]) playerY = playerY + moveSize;
        
        if (playerX <= limitTopLeft) playerX = limitTopLeft;
        if (playerX >= limitBottomRight) playerX = limitBottomRight;
        
        if (playerY <= limitTopLeft) playerY = limitTopLeft;
        if (playerY >= limitBottomRight) playerY = limitBottomRight;
        
        const left = playerX - VIEW_WIDTH / 2;
        const top = playerY - VIEW_HEIGHT / 2;
        
        const leftTile = Math.floor( left / TILE_SIZE );
        const topTile = Math.floor( top / TILE_SIZE );
        
        // Allow to move for smaller than the size of a tile
        const tileOffsetX = left % TILE_SIZE;
        const tileOffsetY = top % TILE_SIZE;

        ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

        for (let x = 0; x < VIEW_TILE_WIDTH; x++) {
            for (let y = 0; y < VIEW_TILE_HEIGHT; y++) {
                const row = tileGrid[topTile + y];

                if (row) {
                    const skill = row[leftTile + x];

                    if (skill) {
                        drawBadge(ctx, skill, x, y, tileOffsetX, tileOffsetY);
                    }
                }
            }
        }
        
        window.requestAnimationFrame(onEnterFrame);
    }
}

/*
 * {
 *   OGR_CODE
 *   SKILL_NAME
 *   SKILL_TYPE_NAME
 * }
*/
function drawBadge(ctx, badge, x, y, tileOffsetX, tileOffsetY) {
    const xPos = x * TILE_SIZE - tileOffsetX;
    const yPos = y * TILE_SIZE - tileOffsetY;

    ctx.font = '16px serif';
    ctx.fillStyle = '#000000';

    ctx.fillRect (
        xPos, 
        yPos, 
        TILE_SIZE, 
        TILE_SIZE
    );
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect (
        xPos + 1, 
        yPos + 1, 
        TILE_SIZE, 
        TILE_SIZE
    );   

    ctx.fillStyle = '#000000';
    ctx.fillText(
        badge.SKILL_NAME, 
        xPos, 
        yPos + (TILE_SIZE / 2 + 4), 
        TILE_SIZE - 10
    ); 
}

function keyDown(e) {
    if ( e.keyCode in keysPressed ) keysPressed[e.keyCode] = true;
}

function keyUp(e) {
    if ( e.keyCode in keysPressed ) keysPressed[e.keyCode] = false;
}

export default function(data) {
    printSkills(data);

    document.addEventListener ( 'keydown', keyDown, false );
    document.addEventListener ( 'keyup', keyUp, false );
}