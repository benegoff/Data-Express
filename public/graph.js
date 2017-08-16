var data = [
    [4, "Yes"],
    [2, "No"], 
    [8, "Maybe"], 
    [3, "Hey look at Me"]
];

var possibleColors = [ '#D90000', '#FF2D00', '#FF8C00', '#2E0927']

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function generateGraph(graphData){

    canvas.height = 500;
    canvas.width = 500;
    canvas.style.border = "thick solid #0000FF";

    var barMargin = 5;
    var height = canvas.height;
    var width = canvas.width;
    var numOfBars = graphData.length;
    var barWidth = width / numOfBars - barMargin * 2;
    var barMaxHeight = height - barMargin * 4;
    
    
    var largestVal = 0;
    for(var i = 0; i < graphData.length; i++){
        if(graphData[i][0] > largestVal){
            largestVal = graphData[i][0];
        }
    }    
    
    for(var i = 0; i < graphData.length; i++){
        var barRatio = graphData[i][0] / largestVal;

        var barHeight =  barRatio * barMaxHeight;

        if(!possibleColors[i]){
            var newColor = getRandomColor();
            possibleColors.push(newColor);
            ctx.fillStyle = newColor;
        }		
        else{
            ctx.fillStyle = possibleColors[i];	
        }
        	
        ctx.fillRect(barMargin + i * width / numOfBars, height - barHeight - (barMargin * 20), barWidth, barHeight);
    }        
    
    ctx.save();
    for(var i = 0; i < graphData.length; i++){
        ctx.save();
        ctx.translate( canvas.width / 2, canvas.height - (canvas.height / 6) + barMargin);
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = possibleColors[i];	
        ctx.fillRect(-barMargin * 4, i * (barMargin * 4) - barMargin * 2, 12, 12);
        ctx.textAlign = "left";
        ctx.fillStyle = "black";
        ctx.fillText(graphData[i][1], 0, i * (barMargin * 4));
        ctx.restore();
        // ctx.translate( 0, canvas.height / 2 );
        // // ctx.rotate(Math.PI / -4)
        // // ctx.fillText(graphData[i][1], i * width / numOfBars + (width / numOfBars) / 2, height / i);
        // ctx.fillText(graphData[i][1], i * width / numOfBars + (width / numOfBars) / 2, 0);
        // ctx.restore();
    }
}

function getRandomColor(){
    var color = '#';
    var hexChars = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']

    for(var i = 0; i < 6; i++){
        color += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return color;
}


generateGraph(data);