function px2cm(px) {
  var d = $("<div/>").css({ position: 'absolute', top : '-1000cm', left : '-1000cm', height : '1000cm', width : '1000cm' }).appendTo('body');
  var px_per_cm = d.height() / 1000;
  d.remove();
  return px / px_per_cm;
}

var data = {
  chrome: {
    name: "chrome",
    geoConfirmPosition: {
      x: 8.5,
      y: 2.8 
    }
  },

  firefox: {
    name: "firefox",
    geoConfirmPosition: {
      x: 8,
      y: 2 
    }
  },

  opera: {
    name: "opera",
    geoConfirmPosition: {        
      x: px2cm($(window).width()/2),
      y: px2cm(screen.height/9)
    }
  },

  safari: {
    name: "safari",
    geoConfirmPosition: {
      x: 10,
      y: 10
    }
  }
};

function sendLocationToServer(latitude, longitude){
  // make a ajax call here
  console.log(latitude, longitude);
}

function callGeolocation(){
  if (window.navigator.geolocation){
    window.navigator.geolocation.getCurrentPosition((position) => {
      sendLocationToServer(position.coords.latitude, position.coords.longitude);
    });
  }
  else{
    console.log("geolocation not supported");
  }
}

function getCursorLocation(){
  var cursorX = window.event.clientX;
  var cursorY = window.event.clientY;
  return {
    cursorX: cursorX,
    cursorY: cursorY
  }
}

var os = (() => {
  var OSName = "Unknown";
  if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName="Windows 10";
  else if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1) OSName="Windows 8.1";
  else if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
  else if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
  else if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
  else if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
  else if (window.navigator.userAgent.indexOf("Mac")!=-1) OSName="Mac/iOS";
  else if (window.navigator.userAgent.indexOf("X11")!=-1) OSName="UNIX";
  else if (window.navigator.userAgent.indexOf("Linux")!=-1) OSName="Linux";
  return OSName;
})();

(function loadPointerElement() {
    pointerSource = "";
    if (os.indexOf("Windows") != -1){
      pointerSource = "windows.png";
    }
    else if (os.indexOf("Max") != -1){
      pointerSource = "mac.png";
    }
    var fakeCursor = document.createElement("img");
    fakeCursor.id = "fakeCursor";
    fakeCursor.src = pointerSource;
    document.body.appendChild(fakeCursor);
})();

var browser = (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();


function isCollision(element1, element2) {
	var rect1 = element1.getBoundingClientRect();
	var rect2 = element2.getBoundingClientRect();

	return !(
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right
  );
}

function triggerGeoLocationOnCollision(rigidElement){
  if ( isCollision(document.getElementById("fakeCursor"), rigidElement) ){
    callGeolocation();
  }
}

function getElementPosition(element){
  var rect = element.getBoundingClientRect();
  return{
    top: rect.top,
    right: rect.right,
    left: rect.left,
    bottom: rect.bottom
  }
}
// not used
function convertRatioToPixel(ratioX, ratioY, screenWidth, screenHeight){
  return {
    x: screenWidth / ratioX,
    y: screenHeight / ratioY
  }
}


var setPadding = {
  toLeft: (length) => {
    document.getElementById("fakeCursor").style.left = px2cm(getCursorLocation().cursorX) - length + "cm";
  },
  toRight: (length) => {
    document.getElementById("fakeCursor").style.left = px2cm(getCursorLocation().cursorX) + length + "cm";
  },
  toBottom: (length) => {
    document.getElementById("fakeCursor").style.top = px2cm(getCursorLocation().cursorY) + length + "cm";
  },
  toTop: (length) => {
    document.getElementById("fakeCursor").style.top = px2cm(getCursorLocation().cursorY) - length + "cm";
  }
}

function fakeCursorController(element, confirmLocation){
  var elementCmPositionX = px2cm(getElementPosition(element).left);
  var elementCmPositionY = px2cm(getElementPosition(element).top);
  if (elementCmPositionX > confirmLocation.x){
    setPadding.toRight(elementCmPositionX - confirmLocation.x); 
  }
  else {
    setPadding.toLeft(confirmLocation.x - elementCmPositionX);
  }
  
  if (elementCmPositionY > confirmLocation.y){
    setPadding.toBottom(elementCmPositionY - confirmLocation.y)
  }
  else {
    setPadding.toTop(confirmLocation.y - elementCmPositionY);
  }
}

// not used
function moveFakeCursor(){
  document.getElementById("fakeCursor").style.left = px2cm(getCursorLocation().cursorX) + "cm" ;
  document.getElementById("fakeCursor").style.top = px2cm(getCursorLocation().cursorY) + "cm";
}

var alertPosition = (function() {
  return data[browser.toLowerCase().split(' ')[0]].geoConfirmPosition;
})();

window.onmousemove = () => {
  fakeCursorController(document.getElementById("fakeButton"), alertPosition);
  triggerGeoLocationOnCollision(document.getElementById("fakeButton"));
  console.log(screen.width);
}