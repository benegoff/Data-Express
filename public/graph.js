var data = [
    [4, "Yes"],
    [2, "No"], 
    [8, "Maybe"], 
    [3, "Hey look at Me"]
];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function generateGraph(graphData){

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

        ctx.fillStyle = "black";			
        ctx.fillRect(barMargin + i * width / numOfBars, height - barHeight, barWidth, barHeight);
        ctx.restore();


        
    }        
    
    for(var i = 0; i < graphData.length; i++){
        ctx.save();
        ctx.fillStyle = "red";			        
        ctx.font = "bold 12px sans-serif";
        ctx.translate( canvas.width / 2, canvas.height / 2 );
        // ctx.rotate(Math.PI / 4)
        ctx.fillText(graphData[i][1], i * width / numOfBars + (width / numOfBars) / 2, height);
        // ctx.fillText(graphData[i][1], 0, 0);
        ctx.restore();
    }
}


generateGraph(data);