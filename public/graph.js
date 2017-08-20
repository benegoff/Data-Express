var data =  
    [
        {
            userQuestion: "Question Here",
            userAnswers: [
                [4, "Yes"],
                [2, "No"], 
                [8, "Maybe"], 
                [3, "Hey look at Me"]
            ]
        }, 
        {
            userQuestion: "Another Question Here",
            userAnswers: [
                [10, "A"],
                [7, "B"], 
                [2, "C"], 
                [5, "Hello World"]
            ]
        } 
    ]

var userData = document.getElementById("data").value;
var JSONData = JSON.parse(userData);
var possibleColors = ['#D90000', '#FF2D00', '#FF8C00', '#80900']

function calculateUserData(userData){
    var graphData = [
    {
      questionText: "What do you like more?",
      answers: [
        [0, 'Sushi'],
        [0, 'Pizza'],
        [0, 'World Domination'],
        [0, 'A Good Book']
      ]
    },
    {
      questionText: "Who is the better cook?",
      answers: [
        [0, 'Gordon Ramsay'],
        [0, 'Julia Child'],
        [0, 'Alton Brown'],
        [0, 'Bobby Flay']
      ]
    },
    {
      questionText: "Where would you like to live?",
      answers: [
        [0, 'The Bahamas'],
        [0, 'Iceland'],
        [0, 'The Land Down Undah'],
        [0, 'At The Bottom of a Well']
      ]
    }
  ];
  
  userData.forEach(function(user) {
    user.answers.forEach(function(userAnswer) {
      graphData.forEach(function(question) {
        if(userAnswer.questionText == question.questionText){
          question.answers.forEach(function(answer) {
            if(userAnswer.answerText == answer[1]){
              answer[0] += 1;
            }
          }, this);
        }
      }, this);
    }, this);
  }, this);

  return graphData;
}

function generateGraph(graphData){
    console.log(graphData);
    var graphHeader = document.createElement('H2');
    var canvas = document.createElement('Canvas');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    canvas.height = 500;
    canvas.width = 500;

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
    }
}

function getRandomColor(){
    var color = possibleColors[Math.floor(Math.random() * possibleColors.length)];

    var hexChars = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    var possibleChangeIndex = [1, 3, 5];

    var hexIngection = hexChars[Math.floor(Math.random() * hexChars.length)];
    hexIngection += hexChars[Math.floor(Math.random() * hexChars.length)];

    var changeIndex = possibleChangeIndex[Math.floor(Math.random() * possibleChangeIndex.length)];

    return color.substr(0, changeIndex) + hexIngection + color.substr(changeIndex + hexIngection.length);
}

// for(var i = 0; i < data.length; i++){
//     var canvasLabel = document.createElement("H2");
//     canvasLabel.innerHTML = data[i].userQuestion;
//     document.body.appendChild(canvasLabel);
//     generateGraph(data[i].userAnswers);
// }

var graphData = calculateUserData(JSONData);

for(var i = 0; i < graphData.length; i++){
    var graphHeader = document.createElement("h2");
    graphHeader.innerHTML = graphData[i].questionText;
    document.body.appendChild(graphHeader);
    generateGraph(graphData[i].answers);    
}