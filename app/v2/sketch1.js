var x1=new Array(16);
var y1=new Array(16);
var x2=new Array(16);
var y2=new Array(16);
var x3=new Array(16);
var y3=new Array(16);

var mic;
var fft;
var backcolor=0;
var button;
var backcolorR;
var backcolorG;
var backcolorB;

var volhistory = [];
var lowhistory = [];
var midhistory = [];
var highistory = []; 
 

function setup(){
  createCanvas(1400,600);
  smooth();
  background(0);
  mic = new p5.AudioIn();
  fft = new p5.FFT(0, 256);
  fft.setInput(mic);

  //myRec.onResult = showResult;

  mic.start();

  //name=createInput('');
  //blendMode(SCREEN); 
  //frameRate(20);
}

function draw(){
    
    fill(0);
    backcolor=color(backcolorR,0,backcolorB);

    
    blendMode(NORMAL);
    background(backcolor);

    
    translate(width/2,height/2);

    push();

    //声音预处理
    var vol = mic.getLevel();
	
	volhistory.push(vol);
	
    var scale=500*vol;

    var spectrum = fft.analyze();

    var low = fft.getEnergy(40,120);
    var mid = fft.getEnergy(120,400);
    var high = fft.getEnergy(400,2600);

    var low_w= map(low, 0, 255, 0, 1);
	lowhistory.push(low_w);
    var mid_w= map(mid, 0, 255, 0, 1);
	midhistory.push(mid_w);
    var high_w= map(high, 0, 255, 0, 1);
	highistory.push(high_w);


    var spectralCentroid = fft.getCentroid();
    var nyquist = 22050;
    var meanfreq = spectralCentroid/(nyquist/spectrum.length);
    //console.log(meanfreq); 
    var meanfreq_w=map(meanfreq,0,100,1,0);
    var color1=meanfreq_w


    //音频线条
    colorMode(RGB);
    stroke(color1*80,135,229);
    strokeWeight(3);
    if (backcolorR>150) {
        stroke(140+color1*100,225,255);
    };
    push(); 
    for (var i = 0; i < spectrum.length; i++) {
      var amp = spectrum[i];
      var l = map(amp, 0, 256, 0, 320);
      var theta=2*Math.PI/spectrum.length
      line(0,0,l*cos(i*theta),l*sin(i*theta));
    }
	
    pop();

  

    //黑色遮挡
    blendMode(NORMAL);
    fill(backcolor);
    noStroke();
    shapex(x2, y2);

	
	
    //圆圈
    var basic_r=60;
    blendMode(SCREEN); 

     if (backcolorB>100 || backcolorR>100) {
        blendMode(NORMAL);
    };


    for (var i=0; i<16; i++){
      x1[i]=(basic_r+200*low_w*random(0.9,1.2))*sin(i*PI/8);
      y1[i]=(basic_r+200*low_w*random(0.9,1.2))*cos(i*PI/8);
      x2[i]=(basic_r+200*mid_w*random(0.9,1.2))*sin(i*PI/8);
      y2[i]=(basic_r+200*mid_w*random(0.9,1.2))*cos(i*PI/8);
      x3[i]=(basic_r+200*high_w*random(0.9,1.2))*sin(i*PI/8);
      y3[i]=(basic_r+200*high_w*random(0.9,1.2))*cos(i*PI/8);
    }

    colorMode(HSB);
    fill('rgba(95,223,225,0.05)');
    strokeWeight(16-14*low_w);
    stroke(270+76*low_w,75,100); //红紫渐变
    if (backcolorR>120) {
        stroke(30+60*low_w,100,100)

    };
    shapex(x1, y1);


    colorMode(RGB);
    fill('rgba(0,170,226,0.05)');
    strokeWeight(16-14*mid_w);
    stroke(130,255*mid_w,255); //天蓝紫渐变
    if (backcolorR>120) {
        stroke(0,230,140+80*mid_w);
    };
    shapex(x2, y2);

    noFill();
    strokeWeight(16-10*high_w);
    stroke(50,214,255); //天蓝色
    shapex(x3, y3);


    colorMode(HSB);
    fill(200+meanfreq_w*30,100,100,0.1);
    noStroke();
    ellipse(0,0,3*scale,3*scale);
    fill(200+meanfreq_w*100,100,100,0.1);
    ellipse(0,0,1.5*scale,1.5*scale);

    //rotate circle
    //colorMode(RGB);
    stroke('rgba(124,213,255,0.2)');
    if (backcolorR>180 || backcolorB>180) {
        stroke('rgba(168,144,205,0.7)');
    }; 
    noFill(); 
    //noStroke();
    //fill('rgba(124,213,255,0.1)');
    strokeWeight(5-10*vol);
    shapecircle(low_w,mid_w, high_w);
    
    pop();

    fill('rgba(255,255,255,0.2)');
    /*
    if (vol>0.1) {
        fill('rgba(255,255,255,0.1)');
    } ;*/
    textSize(24);
    textAlign(CENTER);
    textFont('Georgia');
    text('Listening..', 0, 300);

    if (keyIsPressed === true){
        var img = createImage(1000, 800)

        saveCanvas('myCanvas', 'png');
    }
	
	//录音
	stroke(0,100,100);
	noFill();
	//push();
	//var currentY = map(vol, 0, 1, height, 0);
	//translate(0, height / 2);
	beginShape();
	for (var i = 0; i < volhistory.length; i++) {
		var y = map(volhistory[i], 0, 1, 0,(height)/2);
		rect(i-width/2,height/3-y/2,1,y);
		//vertex(i- width/2, y);
	}
	endShape();
	pop();
		if (volhistory.length > width) {
		volhistory.splice(0, 1);
	}

    };



   


//creat the shape
function shapex(x, y){
    beginShape();
    curveVertex(x[0],y[0]);
    curveVertex(x[1],y[1]);
    curveVertex(x[2],y[2]);
    curveVertex(x[3],y[3]);
    curveVertex(x[4],y[4]);
    curveVertex(x[5],y[5]);
    curveVertex(x[6],y[6]);
    curveVertex(x[7],y[7]);
    curveVertex(x[8],y[8]);
    curveVertex(x[9],y[9]);
    curveVertex(x[10],y[10]);
    curveVertex(x[11],y[11]);
    curveVertex(x[12],y[12]);
    curveVertex(x[13],y[13]);
    curveVertex(x[14],y[14]);
    curveVertex(x[15],y[15]);
    curveVertex(x[0],y[0]);
    curveVertex(x[1],y[1]);
    curveVertex(x[2],y[2]);
    endShape();
}


function shapecircle(x,y,z){
    for (var i = 10; i >0; i--) {
        var rotate_degree=map(z, 0, 1, 1, PI);
        
        rotate(PI / rotate_degree);
        ellipse(0,0,900*x*x-i*i*x,900*y*y-i*i*y);
        
    };
}

function mousePressed(){
	return volhistory[width-mouseX];
	return lowhistory[width-mouseX];
	return midhistory[width-mouseX];
	return highistory[width-mouseX];
}

function touchMoved() {

    backcolorR=map(mouseX, 0, width, 0, 255);
    backcolorB=map(mouseY, 0, height, 0, 255);
  // prevent default
  return false;
}

/*function touchStarted() {
    saveCanvas('myCanvas', 'png');
}*/

   /* function showResult()
    {
        if(myRec.resultValue==true) {
            background(192, 255, 192);
            text(myRec.resultString, width/2, height/2);
            console.log(myRec.resultString);
        }
    }*/
