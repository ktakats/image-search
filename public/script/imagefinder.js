var num=1;
var prevsearch="";

function tryEnter(event) {
  if (event.keyCode == 13) {
    searching();
    event.preventDefault();
  };
};

function searching() {
  $("#output").html("");
  var myinput = document.getElementById("in").value;
  var arr = myinput.split(" ");
  myinput = arr.join("%20");
  if(prevsearch==myinput){num++}
  var address = "./search/" + myinput + "/"+num ;
  prevsearch=myinput;
  console.log(address);
  $.get(address, function(data) {
    var results = data;
    produceResult(results);

  }, "json");

};

function produceResult(results) {
  //  var results = data.query.search;

  results.forEach(function(result) {
    var url=result['thumbnail'];
    var snip=result['snippet'];
    console.log(url, snip);
    var mainDiv = document.getElementById("output")

    var mydiv = document.createElement("div");
    mydiv.className = "searchResult";
    mydiv.className="col-sm-3";
    mydiv.setAttribute('style', 'padding: 5px');
    var image=document.createElement("img")
    image.setAttribute('src', url);
    image.setAttribute('alt', snip);
    image.setAttribute('style', "height:150px;")
    //   var extractTxt = document.createTextNode(result.snippet);
    mainDiv.appendChild(mydiv);
    mydiv.appendChild(image);

    //mydiv.appendChild(extractTxt);
  });
};

function recent() {
  var address = "./recent";
  $.get(address, function(data) {
    var results = data;
    produceTabel(results);
  }, "json");
}

function produceTabel(results){
  var newRes=results.forEach(function(result){
    var date=new Date(result["date"]);
    date.toDateString();
    result["date"]=date;
    return result;
  })
  $("#output").html("");
  var mainDiv = document.getElementById("output")
  var mytable=results.reduce(function(prev,curr){
    return prev + "<tr><td>"+curr["date"]+"</td><td>"+curr["query"]+"</td><td>"+curr["page"]+"</td></tr>";
  }, "");
  mainDiv.innerHTML =
      '<table class="table table-striped" style="width: 60%, text-align:left"><thead><tr><th>Date</th><th>Query</th><th>Offset</th></tr></thead>' +
      '<tbody>' + mytable + '</tbody>' +
      '</table>';
  }
