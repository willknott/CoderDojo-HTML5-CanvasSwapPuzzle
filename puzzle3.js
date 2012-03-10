const PUZZLE_DIFFICULTY = 4;

var stage;
var canvas;

var img;
var pieces;
var puzzleWidth;
var puzzleHeight;
var pieceWidth;
var pieceHeight;

const PUZZLE_HOVER_TINT = '#FF0000';
var currentPiece;
var currentDropPiece;  
var mouse;

        function init(){
           img = new Image();
           img.addEventListener('load',onImage,false);
           img.src = "CDG.png";
        }
        function onImage(e){
           pieceWidth = Math.floor(img.width / PUZZLE_DIFFICULTY)
           pieceHeight = Math.floor(img.height / PUZZLE_DIFFICULTY)
           puzzleWidth = pieceWidth * PUZZLE_DIFFICULTY;
           puzzleHeight = pieceHeight * PUZZLE_DIFFICULTY;
            setCanvas();
            initPuzzle();
        }
        function setCanvas(){
            canvas = document.getElementById('canvas');
            stage = canvas.getContext('2d');
            canvas.width = puzzleWidth;
            canvas.height = puzzleHeight;
            canvas.style.border = "1px solid black";
        }

        function initPuzzle(){
            pieces = [];
            mouse = {x:0,y:0};
            currentPiece = null;
            currentDropPiece = null;
            stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
            buildPieces();
        }

        function buildPieces(){
            var i;
            var piece;
            var xPos = 0;
            var yPos = 0;
            for(i = 0;i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;i++){
                piece = {};
                piece.sx = xPos;
                piece.sy = yPos;
                pieces.push(piece);
                xPos += pieceWidth;
                if(xPos >= puzzleWidth){
                    xPos = 0;
                    yPos += pieceHeight;
                }
            }
            document.onmousedown = shufflePuzzle;
        }

		function shuffleArray(o){
            //We can put a more advanced shuffle in here later. For now just reverse it
            return o.reverse();
        }
		
        function shufflePuzzle(){
            pieces = shuffleArray(pieces);
            stage.clearRect(0,0,puzzleWidth,puzzleHeight);
            var i;
            var piece;
            var xPos = 0;
            var yPos = 0;
            for(i = 0;i < pieces.length;i++){
                piece = pieces[i];
                piece.xPos = xPos;
                piece.yPos = yPos;
                stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
                stage.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
                xPos += pieceWidth;
                if(xPos >= puzzleWidth){
                    xPos = 0;
                    yPos += pieceHeight;
                }
            }
            document.onmousedown = onPuzzleClick;
        }

        function checkPieceClicked(){
            var i;
            var piece;
            for(i = 0;i < pieces.length;i++){
                piece = pieces[i];
                if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
                    //PIECE NOT HIT
                }
                else{
                    return piece;
                }
            }
            return null;
        }


        function onPuzzleClick(e){
            if(e.layerX || e.layerX == 0){
                mouse.x = e.layerX - canvas.offsetLeft;
                mouse.y = e.layerY - canvas.offsetTop;
            }
            else if(e.offsetX || e.offsetX == 0){
                mouse.x = e.offsetX - canvas.offsetLeft;
                mouse.y = e.offsetY - canvas.offsetTop;
            }
            currentPiece = checkPieceClicked();
            if(currentPiece != null){
                stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
                stage.save();
                stage.globalAlpha = .9;
                stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
                stage.restore();
                document.onmousemove = updatePuzzle;
                document.onmouseup = pieceDropped;
            }
        }
		

		
		
		