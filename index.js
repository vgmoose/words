var data = JSON.parse(localStorage.data || "{}");

function drawChart(allDataPoints)
{
	var chart = new CanvasJS.Chart("chartContainer",
	{
	  title:{
		text: "Words Written Every Day"    
	  },
	  animationEnabled: true,
	  axisY: {
		title: "Words"
	  },
	  legend: {
		verticalAlign: "bottom",
		horizontalAlign: "center"
	  },
	  theme: "theme1",
	  data: [

	  {        
		type: "column",  
		showInLegend: true, 
		legendMarkerColor: "white",
		legendText: "Date",
		dataPoints: allDataPoints
	  }   
	  ]
	});

	chart.render();
}

function datetostring(date) {
	return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
}

function repaint() {
	var chartdata = [];
	var total = 0;
	
	// create objects 
	for (var date in data)
	{
		// add it to the chart data
		chartdata.push( { "y" : data[date], "label" : date } );
		
		// increase the total
		total += data[date];
	}
	
	// update the total
	document.getElementById("count").innerHTML = total;
	
	// sort the chart data
	chartdata.sort(comparedates);
	
	// fill in any gaps in the chart data
	for (var x=0; x<chartdata.length-1; x++)
	{
		var cur_date = new Date(chartdata[x].label);
		var next_date = new Date();
		next_date.setDate(cur_date.getDate() + 1);
		var next_elem = new Date(chartdata[x+1].label);
		
		// if the next real date is valid and less than the next date in our data
		while (next_date < next_elem)
		{
			// insert next_date into our array
			x++;
			var nextdatekey = datetostring(next_date);
			chartdata.splice(x, 0, { "y": 0, "label": nextdatekey} );
			next_date.setDate(next_date.getDate() + 1);
		}
	}
	
	drawChart(chartdata);
}

function comparedates(a, b) {
	var date1 = new Date(a.label);
	var date2 = new Date(b.label);
	
	if (date1 < date2) return -1;
	if (date1 > date2) return 1;
	return 0;
}

//var debugdate = new Date("8/24/2016");

function getdate() {
//	var date = debugdate;
	var date = new Date();
	var key = datetostring(date);
	
	return key;
}

//function debuginc() {
//	debugdate.setDate(debugdate.getDate() + 1);
//}

function addwords() {
	var input = prompt("Paste the words to add in the box below");
	if (input === null || input == '') return;
	
	var date = getdate();
	
	var wc = input.split(/\s+/).length;
		
	// add to current key or create key
	if (date in data)
		data[date] += wc;
	else
		data[date] = wc;
	
	save();
}

function save() {
	// save the data
	localStorage.data = JSON.stringify(data);
	repaint();
}

function clear2() {
	var cur = getdate();
	delete data[cur];
	save();
}

function backup() {
	var txt = btoa(JSON.stringify(data, null, "\t"));
    
    document.getElementById("downloaddiv").innerHTML = "<a id='downlink' download='words_backup_"+getdate().replace(/\//g, "-")+".txt' href='data:text/x-txt;base64,"+txt+"'>download</a>";
    
    actuateLink(document.getElementById("downlink"));
}



function edit() {
	var input = prompt("Make small adjustments, or paste a backup here. It is advised to make a backup before using this function.", JSON.stringify(data));
	
	if (input === null || input == "") return;
	
	data = JSON.parse(input);
	
	save();
}

window.onload = function () {
	
	repaint();
}

function actuateLink(link)
{
    var allowDefaultAction = true;
    
    if (link.click)
    {
        link.click();
        return;
    }
    else if (document.createEvent)
    {
        var e = document.createEvent('MouseEvents');
        e.initEvent(
                    'click'     // event type
                    ,true      // can bubble?
                    ,true      // cancelable?
                    );
        allowDefaultAction = link.dispatchEvent(e);
    }
    
    if (allowDefaultAction)
    {
        var f = document.createElement('form');
        f.action = link.href;
        document.body.appendChild(f);
        f.submit();
    }
}