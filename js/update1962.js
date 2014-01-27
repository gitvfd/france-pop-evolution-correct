function dptPop1962(year){

        var yearPicked=year;

        document.getElementById("yearClicked").innerHTML =year;

        g.selectAll("text")
                .remove();



    g.selectAll("circle")
        .remove();

        var format=d3.format(",");
        var formatGrowth=d3.format("%");        
        
        d3.json("data/FrancePopDpt.json", function(error,data){


            var popData=data.filter(function(d) {
                    return(d.year==yearPicked)});
            popData.sort(function(a, b) { return d3.descending(a.value, b.value); });

            //console.log(popData);
            var minpop = d3.min(data.map(function(d) {return (d.value);} ))-1;
            var maxpop = d3.max(data.map(function(d) {return (d.value);} ))+1;

            console.log(minpop);
            console.log(maxpop);


            var area = d3.scale.linear().domain([minpop,maxpop]).range([1,900]);

            d3.json("data/dpt2.json", function(error, dptFrance) {        
                var rateById = {};
                dptFrance.features.forEach(function(d, i) { 
                            rateById[d.id] = path.centroid(d); 
                   
                });



                var circle=g.selectAll("a.node")
                    .data(popData)
                    .enter().append("a")

                circle.append("circle") 
                    .attr("cx", function(d) {
                       return rateById[d.dpt][0];
                       })
                    .attr("cy", function(d) {
                       return rateById[d.dpt][1];
                       })
                    .transition().duration(1000)
                    .attr("r",function(d){return Math.sqrt(area(d.value)/Math.PI);})
                    .style("fill", "red")
                    .style("stroke", "white")
                    .style("stroke-width","0.25 px");
                

                var  populationTotal =0;
                popData.forEach(function(d) { populationTotal = populationTotal + d.value; });
                
                var populationTotalFrance = "France total population: " + format(populationTotal) + " inhabitants"
                
                g.append("text")
                    .attr("class", "caption")
                    .attr("x", 0)
                    .attr("y", 525)
                    .text(populationTotalFrance);
                

                g.selectAll("circle")
                    .on("mouseover", function(d) {
                            var format=d3.format(",");
                            var formatGrowth=d3.format("%");



                            var xPosition = parseFloat(d3.select(this).attr("cx"))+10+document.getElementById("area1").offsetLeft;
                                                          
                            var yPosition = parseFloat(d3.select(this).attr("cy"))+10+document.getElementById("area1").offsetTop  ;
                                            
                            var department;
                            /*popData.forEach(function(n){
                                    if (n.dpt==d.dpt)
                                             department=n.name;
                            });*/


                            //Update the tooltip position and value
                            d3.select("#tooltip")
                            .style("left", xPosition + "px")
                            .style("top", yPosition + "px") 
                            .select("#departmentNameTooltip")
                            .text(d.name);

                            var dptID=" (" + d.dpt+")";
                            
                            d3.select("#tooltip")
                            .select("#departmentNumberTooltip")
                            .text(dptID);

                            var dptValue;
                            popData.forEach(function(n){
                                    if (n.dpt==d.id)
                                             dptValue=n.value;
                            });

                            d3.select("#tooltip")
                            .select("#valueTooltip")
                            .text(format(d.value));
                            

                            var dptGrowth;
                            if (yearPicked!=1962){
                                if(d.growth>=0){
                                 dptGrowth="+" + formatGrowth(d.growth) + " from previous period.";
                                }else{
                                        d.growth=formatGrowth(d.growth) + " from previous period.";
                                };
                            }
                            else{dptGrowth=""};

                            d3.select("#tooltip")
                            .select("#growthTooltip")
                            .text(dptGrowth);


                            d3.select("#tooltip").classed("hidden", false);
                    })
                    .on("mouseout", function() {
                            d3.select("#tooltip").classed("hidden", true);
                    });
            });
        });
};
