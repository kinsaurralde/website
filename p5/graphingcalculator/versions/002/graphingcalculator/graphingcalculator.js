var mode = [0, 1, 1, 1];                                                     // Type of graph
var graphw = 1280, graphh = 720, windowScale;                                // Graph settings
var scroll = 50, translateX = 0, translateY = 0;                             // Transformation settings
var num = 1000, graphMax = 1;                                                // Graph min/max and density
var startTime = 0, endTime = 0, solveTime = 0;                               // Speed of graph
var inputSelected = 0;                                                       // Where to type
var idk = 0, i = 0;                                                          // Calculator
var clicked;                                                                 // Is mouse clicked
var updateDraw = false;                                                      // Redraw graph
var decimal = false;                                                         // Calculator decimal
var x, y, r, theta;                                                          // Graph variables
var graphScale = 400;                                                        // Graph magnifier
var prev2 = 0, display = 0, display2, number1, number2, function2;           // Calculator
var px = new Array(2001);                                                    // Graph x coordinates
var py = new Array(2001);                                                    // Graph y coordinates
var highlightButton = new Array(40);                                         // Which buttons highlighted
var storage = new Array(40);                                                 // Stores number values in equation
var inputstorage = new Array(40);                                            // Temporary storage when reformatting
var functions = new Array(10);                                               // Function stored
var calcdis = "0";                                                           // Calculator
var input = [ "", "", "" ];                                                  // Textbox input
var currentFunction = [ "", "", "" ];                                        // Displayed function
var examples = [ 
  ["3", "2000", "3/2*cos(x)-cos(9*3*x)", "3/2*sin(x)-sin(9*3*x)"], 
  ["3", "2000", "cos(5*x)", "sin(7*x)"], 
  ["1", "1000", "x", "x+1"], 
  ["1", "1000", "tan(x)", "1/tan(x)"], 
  ["2", "1000", "sin(x)/cos(x)+1", "sin(tan(x*p))-1"], 
  ["2", "1000", "x*x", "1/(x*x)"] ];
var show = [[1, 0, 255, 0, 0], [1, 0, 0, 0, 255], [1, 0, 0, 255, 0]];        // Show points, lines or colors


function setup() {
  console.log("Version 002: 6/5/2018");
  var canvas = createCanvas(1920, 1080);
  canvas.parent('sketch-holder');
  setWindowSize();
  background(255);
  highlightButton[1] = 1;
  highlightButton[4] = 1;
  highlightButton[8] = 1;
  highlightButton[12] = 1;
  mode[1] = 1;
  mode[2] = 1;
  input[1] = "";
  input[2] = "";
  currentFunction[1] = "";
  currentFunction[2] = "";
  for (i = 0; i < 2001; i++) {
    px[i] = new Array(6);
    py[i] = new Array(6);
  }
  for (i = 0; i < 40; i++) {
    storage[i] = new Array(4);
    inputstorage[i] = new Array(4);
  }
  for (i = 0; i < 10; i++) {
    functions[i] = new Array(10);
    for (i2 = 0; i2 < 10; i2++) {
      functions[i][i2] = new Array(4);
    }
  }
  functions[0][0][1] = str(0);
  input[1] = examples[0][2];
  input[2] = examples[0][3];    
  num = int(examples[0][1]);
  mode[1] = int(examples[0][0]); 
  mode[2] = int(examples[0][0]);
  removeHighlightType();
  highlightButton[mode[1]] = 1;
  highlightButton[mode[1]+7] = 1;
  update();
}

function draw() {
  rectMode(CENTER);
  stroke(0);
  noFill();
  strokeWeight(3);
  rect(width/2, height/2, graphw, graphh);
  translate(width/2, height/2);    // Center of screen is now 0,0
  if (mouseX > width/2-graphw/2 && mouseX < width/2+graphw/2 && mouseY > height/2-graphh/2 && mouseY < height/2+graphh/2) {
    if (mouseButton == LEFT && mouseIsPressed) {
      translateX -= pmouseX - mouseX;
      translateY -= pmouseY - mouseY;
      updateDraw = true;
    }
  }

  /************************************************** Update Graph **************************************************/

  if (scroll <= 10) {
    graphScale = scroll*.1;
  } else {
    if (scroll <= 20) {
      graphScale = (scroll-10)*1;
    } else {
      if (scroll <= 50) {
        graphScale = ((scroll-20) *3)+10;
      } else {
        if (scroll <= 70) {
          graphScale = (scroll-30) *5;
        } else {
          if (scroll <= 90) {
            graphScale = (scroll-50) *10;
          } else {
            if (scroll <= 100) {
              graphScale = (scroll-70) *20;
            } else {
              if (scroll <= 110) {
                graphScale = (scroll-85) *40;
              } else {
                if (scroll <= 120) {
                  graphScale = (scroll-100) *100;
                } else {
                  graphScale = (scroll-118)*1000;
                }
              }
            }
          }
        }
      }
    }
  }

  if (updateDraw) {
    background(255);
    for (  i = 1; i < num+1; i++) {
      for (  i2 = floor(mode[1]/3)*2; i2 < 2+(floor(mode[1]/3)); i2++) {
        stroke(int(show[i2][2]), show[i2][3], show[i2][4]);
        if (show[i2][0] == 1 && mode[i2+1] != 0) {
          strokeWeight(2);
          line((px[i][i2]*graphScale*windowScale)+translateX, (py[i][i2]*-graphScale*windowScale)+translateY, (px[i-1][i2]*graphScale*windowScale)+translateX, (py[i-1][i2]*-graphScale*windowScale)+translateY);
        }
        if (show[i2][1] == 1 && mode[i2+1] != 0) {
          strokeWeight(5);
          point((px[i][i2]*graphScale*windowScale)+translateX, (py[i][i2]*-graphScale*windowScale)+translateY);
        }
      }
    }
    updateDraw = false;
  }


  /*************************************************** Non Graph Background **************************************************/

  rectMode(CORNER);
  noStroke();
  fill(200, 200, 200);
  rect(-width/2, -height/2, (width-graphw)/2, height);
  rect(graphw/2, -height/2, (width-graphw)/2, height);
  rect(-width/2, -height/2, width, (height-graphh)/2);
  rect(-width/2, graphh/2, width, (height-graphh)/2);

  /*************************************************** Graph Window **************************************************/

  fill(0);
  textSize(15*windowScale);
  textAlign(CENTER);
  text("FPS: "+round(frameRate())+" Solve Time: "+solveTime+"ms"+" Scale: "+graphScale+" Points: "+num, 0, -370*windowScale);
  textAlign(LEFT, CENTER);
  stroke(0);
  strokeWeight(4);
  line(constrain(translateX, -graphw/2, graphw/2), graphh/2, constrain(translateX, -graphw/2, graphw/2), -graphh/2);
  line(-graphw/2, constrain(translateY, -graphh/2, graphh/2), graphw/2, constrain(translateY, -graphh/2, graphh/2));
  rectMode(CENTER);
  noFill();
  rect(0, 0, graphw, graphh);

  /*********************************************** Buttons and Textboxes **********************************************/

  textbox(0, -410, 790, 50, 0, true);                                     // Lower text box  Input slecected == 1
  button("r(\u03B8)", -440, -410, 70, 50, 1, true, 0);                    // \u03B8 is theta symbol
  button("f(x)", -520, -410, 70, 50, 2, true, 0);
  button("x(t)", -600, -410, 70, 50, 3, true, 0);
  button("Points", 440, -410, 70, 50, 5, true, 0);
  button("Line", 520, -410, 70, 50, 4, true, 0); 
  button("Clear", 600, -410, 70, 50, 6, false, 0);
  textbox(0, -470, 790, 50, 7, true);                                    // Upper text box  Input slecected == 2
  button("r(\u03B8)", -440, -470, 70, 50, 8, true, 1);
  button("f(x)", -520, -470, 70, 50, 9, true, 1);
  button("y(t)", -600, -470, 70, 50, 10, true, 1);
  button("Points", 440, -470, 70, 50, 11, true, 1);
  button("Line", 520, -470, 70, 50, 12, true, 1); 
  button("Clear", 600, -470, 70, 50, 13, false, 1);

  button("Example: Parametric", -533, 410, 204, 50, 40, false, 0);
  button("Example: Parametric", -320, 410, 204, 50, 41, false, 0);
  button("Example: Polar", -107, 410, 204, 50, 42, false, 0);
  button("Example: Polar", 107, 410, 204, 50, 43, false, 0); 
  button("Example: f(x)", 320, 410, 204, 50, 44, false, 0);
  button("Example: f(x)", 533, 410, 204, 50, 45, false, 0); 

  button("1", 690, 160, 50, 50, 15, false, 0);
  button("2", 750, 160, 50, 50, 16, false, 0);
  button("3", 810, 160, 50, 50, 17, false, 0);
  button("+", 870, 160, 50, 50, 24, false, 0);
  button("4", 690, 100, 50, 50, 18, false, 0);
  button("5", 750, 100, 50, 50, 19, false, 0);
  button("6", 810, 100, 50, 50, 20, false, 0);
  button("-", 870, 100, 50, 50, 25, false, 0);  
  button("7", 690, 40, 50, 50, 21, false, 0);
  button("8", 750, 40, 50, 50, 22, false, 0);
  button("9", 810, 40, 50, 50, 23, false, 0);
  button("x", 870, 40, 50, 50, 26, false, 0);
  button("AC", 690, -20, 50, 50, 27, false, 0);
  button("+/-", 750, -20, 50, 50, 28, false, 0);
  button("%", 810, -20, 50, 50, 29, false, 0);
  button("/", 870, -20, 50, 50, 30, false, 0);
  button("0", 720, 220, 110, 50, 14, false, 0);
  button(".", 810, 220, 50, 50, 31, false, 0);
  button("=", 870, 220, 50, 50, 32, false, 0);

  textbox(780, -80, 230, 50, 33, false);

  if (isMobileDevice()) {
    fill(255);
    rect(0*windowScale,0*windowScale,800*windowScale,60*windowScale);
    fill(0);
    text("User input doesnt work on mobile devices", 0*windowScale, -0*windowScale);
  }
}

/************************************************************************************************************************
 
 Mouse/Keyboard
 
 ***********************************************************************************************************************/

function mouseWheel(event) {
  if (mouseX > width/2-graphw/2 && mouseX < width/2+graphw/2 && mouseY > height/2-graphh/2 && mouseY < height/2+graphh/2) {
    if (event.delta > 0) {
      var amount = 1;
    } else {
      amount = -1;
    }
    var wheel = -1*amount;
    scroll = constrain(scroll + wheel, 0, 128);
    update();
    return false;
  }
}

function keyPressed() {
  if (key == ' ') {
    scroll = 50;
    translateX = 0;
    translateY = 0;
    updateDraw = true;
  }

  if (keyCode == 70) { // key == f
    fullscreen(!fullscreen());
  }

  if (keyCode == BACKSPACE) {
    if (input[inputSelected].length > 0) {
      input[inputSelected] = input[inputSelected].substring(0, input[inputSelected].length-1);
      updateInput();
      update();
    }
  }
  if (keyCode == UP_ARROW) {
    graphMax++;
    graphMax = constrain(graphMax, 1, 10);
    update();
  }
  if (keyCode == DOWN_ARROW) {
    graphMax--;
    graphMax = constrain(graphMax, 1, 10);
    update();
  }
  if (keyCode == LEFT_ARROW) {
    num -= 100;
    num = constrain(num, 100, 2000);
    update();
  }
  if (keyCode == RIGHT_ARROW) {
    num += 100;
    num = constrain(num, 100, 2000);
    update();
  }
}

function keyTyped() {
  if (inputSelected > 0) {
    if (keyCode == ENTER) {
      store(input[inputSelected], inputSelected);
    } else {
      if (key != ' ' && key != 'f') {
        input[inputSelected] = input[inputSelected]+key;
      }
    }
    updateInput();
  }
  update();
}

function mousePressed() {
  clicked = true;
  setWindowSize();
}

function mouseReleased() {
  clicked = false;
}

/******************************************************************************************************************
 
 Functions
 
 *****************************************************************************************************************/

function button(buttontext, buttonx, buttony, buttonw, buttonh, buttonnum, highlight, buttonMode) {
  buttonx *= windowScale
    buttony *= windowScale
    buttonw *= windowScale
    buttonh *= windowScale
    if (mouseX-width/2 > buttonx-buttonw/2 && mouseX-width/2 < buttonx+buttonw/2 && mouseY-height/2 > buttony-buttonh/2 && mouseY-height/2 < buttony+buttonh/2 && clicked == true) {
    if (highlight == true) {
      highlightButton[buttonnum] = int(!boolean(highlightButton[buttonnum]));
      updateDraw = true;
    }
    if (buttonnum == 0) {                                  // Text box 1            
      if (highlightButton[buttonnum] == 1) {
        highlightButton[7] = 0;
        inputSelected = 1;
      } else {
        inputSelected = 0;
      }
    }
    if (buttonnum == 7) {                                    // Text box 2                             
      if (highlightButton[7] == 1) {
        inputSelected = 2;
        highlightButton[0] = 0;
      } else {
        inputSelected = 0;
      }
    }
    if (buttonnum == 8 || buttonnum == 1) {                // #1 r(theta) 1 , #8 r(theta) 2
      if (highlightButton[buttonnum] == 1) {
        highlightButton[buttonnum+1] = 0;
        highlightButton[buttonnum+2] = 0;
        mode[buttonMode+1] = 1;
        store(input[buttonMode+1], buttonMode+1);
      } else {
        mode[buttonMode+1] = 0;
      }
    }
    if (buttonnum == 2 || buttonnum == 9) {                // #2 f(x) 1 , #9 f(x) 2
      if (highlightButton[buttonnum] == 1) {
        highlightButton[buttonnum+1] = 0;
        highlightButton[buttonnum-1] = 0;
        mode[buttonMode+1] = 2;
        store(input[buttonMode+1], buttonMode+1);
      } else {
        mode[buttonMode+1] = 0;
      }
    }
    if (buttonnum == 4 || buttonnum == 5 || buttonnum == 11 || buttonnum == 12) {            // #4 Line 1 , #5 Points 1, #11 Points 2, #12 Line 2
      show[buttonMode][buttonnum % 2] = int(!boolean(show[buttonMode][buttonnum % 2]));
      if (show[0][buttonnum % 2] == 1 || show[1][buttonnum % 2] == 1) {
        show[2][buttonnum % 2] = 1;
      } else {
        show[2][buttonnum % 2] = 0;
      }
    }
    if (buttonnum == 3 || buttonnum == 10) {                                  // parametrics 
      if (highlightButton[3] == 1 || highlightButton[10] == 1) {
        removeHighlightType();
        highlightButton[10] = 1;
        highlightButton[3] = 1;
        mode[1]= 3;
        mode[2] = 3;
        update();
      } else {
        mode[1]= 0;
      }
    }
    if (buttonnum == 6 || buttonnum == 13) {                                  // Clear
      input[buttonMode+1] = "";
      store(input[buttonMode+1], buttonMode+1);
    }
    if (buttonnum >= 40 && buttonnum <= 47) {
      input[1] = examples[buttonnum-40][2];
      input[2] = examples[buttonnum-40][3];    
      num = int(examples[buttonnum-40][1]);
      mode[1] = int(examples[buttonnum-40][0]); 
      mode[2] = int(examples[buttonnum-40][0]);
      removeHighlightType();
      highlightButton[mode[1]] = 1;
      highlightButton[mode[1]+7] = 1;
      update();
    }
    if (buttonnum >= 14 && buttonnum <= 23) {
      buttonfunc(buttonnum-14);
    }
    if (buttonnum == 29) {
      calcdis = calcdis * .01;
      calcdis = round(calcdis*10000000)/10000000;
    }
    if (buttonnum == 24) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 1;
      decimal = false;
      idk = 1;
    }
    if (buttonnum == 25) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 2;
      decimal = false;
      idk = 1;
    }
    if (buttonnum == 26) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 3;
      decimal = false;
      idk = 1;
    }
    if (buttonnum == 30) {
      number1 = float(calcdis);
      calcdis = "0";
      display = 0;
      function2 = 4;
      decimal = false;
      idk = 1;
    }
    if (buttonnum == 27) {
      calcdis = "0";
      display = 0;
      prev2 = 0;
      number1 = 0;
      number2 = 0;
      decimal = false;
      idk = 1;
    }
    if (buttonnum == 28) {
      display = display * -1;
      calcdis = str(display);
      idk += 2;
    }
    if (buttonnum == 31) {
      decimal = true;
    }
    if (buttonnum == 32) {
      if (function2 == 1) {
        number2 = display;
        display2 = number1 + number2;
      }
      if (function2 == 2) {
        number2 = display;
        display2 = number1 - number2;
      }
      if (function2 == 3) {
        number2 = display;
        display2 = number1 * number2;
      }
      if (function2 == 4) {
        number2 = display;
        display2 = number1 / number2;
      }
      display2 = round(display2*10000);
      display2 /= 10000;      
      calcdis = str(display2);
      display = 0;
      decimal = false;
      idk = 1;
    }
    clicked = false;
  }
  if (highlightButton[buttonnum] == 1) {
    fill(255, 255, 0);
  } else {
    noFill();
  }
  stroke(0);
  strokeWeight(3);
  rectMode(CENTER);
  rect(buttonx, buttony, buttonw, buttonh);
  textSize(20*windowScale);
  fill(0);
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  if (buttontext != "Text Box") {
    text(buttontext, buttonx, buttony );
  }
}

function textbox(  x, y, w, h, buttonnum, highlight) {
  button("Text Box", x, y, w, h, buttonnum, highlight, 0);
  rectMode(CENTER);
  stroke(0);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(h*.8*windowScale);
  if (buttonnum != 33) {
    text(currentFunction[(buttonnum % 2) + 1], x*windowScale, y*windowScale);
  } else {
    text(calcdis, x*windowScale, y*windowScale);
  }
}

function buttonfunc(  number) {
  if (decimal == false) {
    prev2 = float(display);
    display = prev2 * 10 + number;
    calcdis = str(display);
  } else {
    for (i=0; i < idk; i+=1) {
      number = number * 0.1;
    }
    display = display + number;
    calcdis = str(display);
  }
  calcdis = round(float(calcdis)*100000)/100000;
  idk += 1;
}
/************************************************* Store Function **********************************************/

function store(  input, inputSelected) {
  updateInput();
  var i;
  var i2;
  var i3;
  var place;
  var amount = 0;
  var oldi2;
  var storageLength;
  var inputlength;
  var newinput = "";
  for (i = 0; i < 10; i++) {    // Clears Arrays
    storage[i][inputSelected-1] = "";
    storage[i+10][inputSelected-1] = "";
    for (i2 = 0; i2 < 10; i2++) {
      for (i3 = inputSelected*2-2; i3 < inputSelected*2; i3++) {
        functions[i][i2][i3] = "";
      }
    }
  }
  for (i = 0; i < 40; i++) {
    inputstorage[i][inputSelected-1] = "";
  }
  i = 0;
  i2 = 0;
  i3 = 0;
  storageLength = 0;

  try {     // Stops graphing if input incorrect
    for (place = 0, i = 0; place < input.length; place++, i++) {    // Changes input formatting
      if (int(input.charAt(place)) >= 0 && int(input.charAt(place)) <= 9 || input.charAt(place) == 'p') {
        if (input.charAt(place) == 'p') {
          storage[storageLength][inputSelected-1] = str(PI);
        } else {
          storage[storageLength][inputSelected-1] = str(input.charAt(place));
        }
        inputstorage[i][inputSelected-1] = "#"+storageLength;
        storageLength++;
      } else {
        if (input.charAt(place) == 'c' || input.charAt(place) == 's' || input.charAt(place) == 't') {
          inputstorage[i][inputSelected-1] = str(input.charAt(place));
          place += 2;
        } else {
          if (input.charAt(place) == '(') {
            if (place > 0) {
              if (int(input.charAt(place-1)) >= 48 && int(input.charAt(place-1)) <= 57 || input.charAt(place-1) == 'x') {
                inputstorage[i][inputSelected-1] = "*";
                i++;
              }
            }
            inputstorage[i][inputSelected-1] = str(input.charAt(place));
          } else {
            if (input.charAt(place) == 'x') {
              inputstorage[i][inputSelected-1] = "xx";
            } else {
              inputstorage[i][inputSelected-1] = str(input.charAt(place));
            }
          }
        }
      }
    }
    for (place = 0; place < i; place++) {    // Adds parenthesis to * and /
      if (inputstorage[place][inputSelected-1].charAt(0) == '*' || inputstorage[place][inputSelected-1].charAt(0) == '/') {
        amount = 0;
        if (inputstorage[place-1][inputSelected-1].charAt(0) == ')') {
          ;
          while (inputstorage[place+amount-1][inputSelected-1].charAt(0) != '(') {
            amount--;
          }
        }
        splice2D("(", place-1+amount, inputSelected);
        place++;
        amount = 0;
        if (inputstorage[place+1][inputSelected-1].charAt(0) == '(' || inputstorage[place+1][inputSelected-1].charAt(0) == 'c' || inputstorage[place+1][inputSelected-1].charAt(0) == 's' || inputstorage[place+1][inputSelected-1].charAt(0) == 't') {
          while (inputstorage[place+amount+2][inputSelected-1].charAt(0) != ')') {
            amount++;
          }
        }
        splice2D(")", place+2+amount, inputSelected);
        place++;
        storageLength += 2;
        i += 2;
      }
    }
    for (place = 0; place < i; place++) {    // Puts new function into string form
      newinput += inputstorage[place][inputSelected-1];
    }
    i = 0;
    i2 = 0;
    i3 = 0;
    inputlength = newinput.length;
    for (place = 0; place < inputlength; place++) {    // Split function by ()
      if (newinput.charAt(place) == '(') { 
        i++;
        oldi2 = i2;
        i2 = 0;
        while (functions[i][i2][(inputSelected-1)*2] != "") {
          i2++;
        }
        functions[i-1][oldi2][(inputSelected-1)*2] += ("@" + i2);
      } else {
        if (newinput.charAt(place) == ')' ) { 
          i--;
          i2 = 9;
          while (functions[i][i2][(inputSelected-1)*2] == "") {
            i2--;
          }
        } else {
          functions[i][i2][(inputSelected-1)*2] += str(newinput.charAt(place));
        }
      }
    }
  } 
  catch (b) {
    console.log("Incorrect Input: "+b);
  }
  plot(inputSelected);
}

/***************************************************** Plot **************************************************/

function plot(inputSelected) {
  if ((mode[1]== 1 && inputSelected == 1) || (mode[2] == 1 && inputSelected == 2)) {
    theta = 0;
  }
  if ((mode[1]== 2 && inputSelected == 1) || (mode[2] == 2 && inputSelected == 2) || mode[1] == 3) {
    theta = -graphMax*20;
  }
  startTime = millis();
  for (  current = 0; current < num+1 && inputSelected != 0; current++) {
    if ((mode[1] == 1 && inputSelected == 1) || (mode[2] == 1 && inputSelected == 2)) {
      r = prepareToSolve(theta, inputSelected);
      x = r * cos(theta);
      y = r * sin(theta);
      theta = theta+(.002*graphMax*1000/num)*PI;
    }
    if ((mode[1] == 2 && inputSelected == 1) || (mode[2] == 2 && inputSelected == 2)) {
      y = prepareToSolve(theta, inputSelected);
      x = theta;
      theta = (theta+(.04*graphMax*1000/num));
    }
    px[current][inputSelected-1] = x;
    py[current][inputSelected-1] = y;
    if (mode[1]== 3 && mode[2] == 3) {
      x = prepareToSolve(theta, 1);
      y = prepareToSolve(theta, 2);     
      theta = (theta+(.04*graphMax*1000/num));
      py[current][2] = y;
      px[current][2] = x;
    }
  }
  endTime = millis();
  solveTime = endTime-startTime;
  updateDraw = true;
}

/***************************************************** Solve **************************************************/

function prepareToSolve(theta, inputSelected) {
  try {
    for (  i = 9; i > -1; i--) {
      for (  i2 = 9; i2 > -1; i2--) {
        if (functions[i][i2][(inputSelected-1)*2] != "") {
          functions[i][i2][(inputSelected-1)*2+1] = solve(str(functions[i][i2][(inputSelected-1)*2]), theta, i, inputSelected);
        }
      }
    } 
    return float(functions[0][0][(inputSelected-1)*2+1]);
  } 
  catch (a) {          // Does this if parametric is input before other types
    console.log("error "+a);
    return float(0);
  }
}

function solve(equation, theta, i, inputSelected) {
  var place = 0;
  var valueA = 0;
  var valueB = 0;  
  if (equation.length > 1) {
    if (equation.charAt(0) == 'c' || equation.charAt(0) == 's' || equation.charAt(0) == 't') {
      valueA = getValue(equation.charAt(0), equation.charAt(1), int(str(equation.charAt(2))), i, theta, inputSelected);
    } else {
      valueA = getValue('!', equation.charAt(0), int(str(equation.charAt(1))), i, theta, inputSelected);
    }
  } else {
    valueA = getValue('!', equation.charAt(0), 0, i, theta, inputSelected);
  }

  for (place = 0; place < equation.length; place++) {
    if (equation.charAt(place) == '*' || equation.charAt(place) == '/' || equation.charAt(place) == '+' || equation.charAt(place) == '-') {
      if (equation.charAt(place+1) == 'c' || equation.charAt(place+1) == 's' || equation.charAt(place+1) == 't') {
        valueB = getValue(equation.charAt(place+1), equation.charAt(place+2), int(str(equation.charAt(place+3))), i, theta, inputSelected);
      } else {
        valueB = getValue('!', equation.charAt(place+1), int(str(equation.charAt(place+2))), i, theta, inputSelected);
      }
    }

    if (equation.charAt(place) == '*') {
      valueA *= valueB;
    }
    if (equation.charAt(place) == '/') {
      valueA /= valueB;
    }
    if (equation.charAt(place) == '+') {
      valueA += valueB;
    }
    if (equation.charAt(place) == '-') {
      valueA -= valueB;
    }
  }
  return str(valueA);
}

function getValue(trig, symbol, number, i, theta, inputSelected) {
  var value = 0;
  if (symbol == 'x') {
    value = theta;
  }
  if (symbol == '@') {
    value = float(functions[i+1][number][inputSelected*2-1]);
  }
  if (symbol == '#') {
    value = float(storage[number][inputSelected-1]);
  }

  if (trig != '!') {
    if (trig == 's') {
      value = sin(getValue('!', symbol, number, i, theta, inputSelected));
    }
    if (trig == 'c') {
      value = cos(getValue('!', symbol, number, i, theta, inputSelected));
    }
    if (trig == 't') {
      value = tan(getValue('!', symbol, number, i, theta, inputSelected));
    }
  }
  return value;
}

/***************************************************** Other **************************************************/

function splice2D(  character, amount, inputSelected) {
  var placeholder = new Array(40);
  for (  i = 0; i < 40; i++) {
    placeholder[i] = inputstorage[i][inputSelected-1];
  }
  placeholder = splice(placeholder, character, amount);
  for (  i = 0; i < 40; i++) {
    inputstorage[i][inputSelected-1] = placeholder[i];
  }
}

function update() {
  store(input[1], 1);
  store(input[2], 2);
}

function updateInput() {
  currentFunction[1] = "";
  currentFunction[2] = "";
  for (selected = 1; selected < 3; selected++) {
    input[selected] = input[selected].toLowerCase();
    for (i = 0; i < input[selected].length; i++) {
      if (input[selected].charAt(i) == 'x') {
        if (mode[selected] == 1) {
          currentFunction[selected] += "\u03B8";                      // \u03B8 is theta symbol
        }
        if (mode[selected] == 2) {
          currentFunction[selected] += "x";
        }
        if (mode[selected] == 3) {
          currentFunction[selected] += "t";
        }
      } else {
        if (input[selected].charAt(i) == 'p') {
          currentFunction[selected] += "\u03C0";                      // \u03C0 is pi symbol
        } else {
          currentFunction[selected] += input[selected].charAt(i);
        }
      }
    }
  }
}

function removeHighlightType() {
  highlightButton[1] = 0;
  highlightButton[2] = 0;
  highlightButton[3] = 0;
  highlightButton[8] = 0;
  highlightButton[9] = 0;
  highlightButton[10] = 0;
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function windowResized() {
  setWindowSize();
}

function setWindowSize() {
  background(200, 200, 200);
  if (!isMobileDevice()) {
    var container = document.getElementById('sketch-holder');
    var positionInfo = container.getBoundingClientRect();
    var divWidth = positionInfo.width;
    var divHeight;
  } else {
    var divWidth = windowWidth;
    var divHeight;
  }
  windowScale = divWidth/1920;
  divHeight = divWidth*9/16;
  resizeCanvas(divWidth, divHeight);
  graphw = 1280*windowScale;
  graphh = 720*windowScale;
  updateDraw = true;
}

// Version 002: 6/5/2018
