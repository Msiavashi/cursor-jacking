var metaData = {
  chrome: {
    name: "chrome",
    confirmPosition: {
      
    }
  },

  firefox: {
    name: "firefox",
    confirmPosition: {
      ratioX: 4.5,
      ratioY: 3.6 
    }
  },

  opera: {
    name: "opera",
    confirmPosition: {

    }
  },

  safari: {
    name: "safari",
    confirmPosition: {

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

function moveFakeCursor(realCursorPosition){
  document.getElementById("fakeCursor").style.left = realCursorPosition.cursorX ;
  document.getElementById("fakeCursor").style.top = realCursorPosition.cursorY;
}

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
  if ( isCollision(document.getElementById("fakeCursor"), document.getElementById(rigidElement))  ){
    callGeolocation();
  }
}

function getScreenResolution(){
  return {
    width: $(window).width(), 
    height:$(window).height() 
  }
}

function setFakeCursorPadding(elemenet){
    
}


function getElementPosition(element){
  var rect = element.getBoundingClientRect();
  console.log(rect.top, rect.right, rect.bottom, rect.left);
  return{
    top: rect.top,
    right: rect.right,
    left: rect.left,
    bottom: rect.bottom
  }
}


function convertRationToPixel(ratioX, ratioY, screenWidth, screenHeight){
  return {
    x: screenWidth / ratioX,
    y: screenHeight / ratioY
  }
}

getElementPosition(document.getElementById("fakeButton"));

window.onmousemove = () => {
}