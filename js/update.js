function dptPop(year){

	var yearPicked=year;

	document.getElementById("yearClicked").innerHTML =year;

	g.selectAll("text")
		.remove();


	var format=d3.format(",");
	var formatGrowth=d3.format("%");	
	
	d3.json("data/FrancePopDpt.json", function(error,data){


	var popData=data.filter(function(d) {
		return(d.year==yearPicked)});

	console.log(popData);
	var minPop = d3.min(data.map(function(d) {return (d.density);} ));
	var maxPop = d3.max(data.map(function(d) {return (d.density);} ))+1;

	console.log(minPop);
	console.log(maxPop);

	var color = d3.scale.threshold()
	    .domain([minPop,minPop+1*(maxPop-minPop)/(1000),minPop+2*(maxPop-minPop)/(1000),minPop+3*(maxPop-minPop)/(1000),minPop+4*(maxPop-minPop)/(1000),minPop+5*(maxPop-minPop)/(1000),minPop+6*(maxPop-minPop)/(1000),minPop+7*(maxPop-minPop)/(1000),minPop+8*(maxPop-minPop)/(1000),maxPop])
	    //.domain([minpop,minpop+(maxpop-minpop)/999,minpop+2*(maxpop-minpop)/999,minpop+3*(maxpop-minpop)/999,minpop+4*(maxpop-minpop)/999,minpop+5*(maxpop-minpop)/999,minpop+6*(maxpop-minpop)/999,minpop+7*(maxpop-minpop)/999,minpop+8*(maxpop-minpop)/999,maxpop])
	    .range(["#fff","#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548","#d7301f","#b30000","#7f0000"]);



	d3.json("data/dpt2.json", function(error, dptFrance) {	
  		var rateById = {};
		popData.forEach(function(d) { rateById[d.dpt] = d.density; });
		
		console.log(rateById);
		console.log(color(rateById));
		dpts.selectAll("path")
			.data(dptFrance.features)
		    .transition().duration(500)
	        .style("fill", function(d) { return color(rateById[d.id]); });

	var  populationTotal =0;
	popData.forEach(function(d) { populationTotal = populationTotal + d.value; });
	
	var populationTotalFrance = "France density: " + d3.round(populationTotal/552000,1) + " inhabitants/km²"
	
	g.append("text")
	    .attr("class", "caption")
	    .attr("x", 0)
	    .attr("y", 525)
	    .text(populationTotalFrance);
	});

	g.selectAll("path")
		.on("mouseover", function(d) {
			var format=d3.format(",");
			var formatGrowth=d3.format("%");

			var xPosition =d3.event.pageX + 15;
			var yPosition =d3.event.pageY + 15;
			
			var department;
			popData.forEach(function(n){
		        	if (n.dpt==d.id)
		        		 department=n.name;
		        });

			console.log(department);

			//Update the tooltip position and value
			d3.select("#tooltip")
		        .style("left", xPosition + "px")
		        .style("top", yPosition + "px") 
		        .select("#departmentNameTooltip")
		        .text(department);

		    var dptID=" (" + d.id+")";
			d3.select("#tooltip")
		        .select("#departmentNumberTooltip")
		        .text(dptID);

			var dptValue;
			popData.forEach(function(n){
		        	if (n.dpt==d.id)
		        		 dptValue=n.value;
		        });

			console.log(dptValue);

			var dptDensity;
			popData.forEach(function(n){
		        	if (n.dpt==d.id)
		        		 dptDensity=n.density;
		        });
			console.log(dptDensity);

			d3.select("#tooltip")
		        .select("#densityTooltip")
		        .text(format(d3.round(dptDensity,1)));

			d3.select("#tooltip")
		        .select("#valueTooltip")
		        .text(format(dptValue));
			

			/*var dptGrowth;
			if (yearPicked!=1931){
				popData.forEach(function(n){
			        	if (n.dpt==d.id)
			        		if(n.growth>=0){
			        		 dptGrowth="+" + formatGrowth(n.growth) + " from previous period.";
			        		}else{
			        			dptGrowth=formatGrowth(n.growth) + " from previous period.";
			        		};
			        });
		    }
		    else{dptGrowth=""};

			d3.select("#tooltip")
		        .select("#growthTooltip")
		        .text(dptGrowth);*/


			d3.select("#tooltip").classed("hidden", false);
		})
		.on("mouseout", function() {
			d3.select("#tooltip").classed("hidden", true);
		})
	});
};