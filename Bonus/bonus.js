// Setting up width and height of chart 
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG wrapper and appending an SVG group that will hold the chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".row")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Appending an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//////////////////////////////////////////////////////////////////////////////////
////////////// Initial x Params///////////////////////////////////////////////////
var chosenXAxis = "poverty";

// Updating x-scale var upon click on axis label
function xScale(povertyData, chosenXAxis) {

//Creating X scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
      d3.max(povertyData, d => d[chosenXAxis]) * 2.8
    ])
    .range([0, width]);

  return xLinearScale;

}

// Updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  //Updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

////////////////////////////////////////////////////
  // Updating circles group with new tooltip//
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "In Poverty(%):";
    } else if (chosenXAxis === "age"){
      label = "Age (Median)";
    }
    else {
      label = "Household Income(Median)";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
//Setting up onmouseout event so that information dissapears once removing mouse from circle in scatter plot
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

  // Retrieving data from the CSV file and executing everything below
d3.csv("data.csv").then(function(povertyData, err) {
    if (err) throw err;
  /////////////////////////////////////////////////////
    // Parse data..Converting everything to numbers///
    povertyData.forEach(function(data) {
      data.obese_percentage = +data.obesity;
      data.smokes_percentage = +data.smokes;
      data.healthcare_percentage = +data.healthcare;
      data.poverty_percentage = +data.poverty;
      data.median_age = +data.age;
      data.Income = +data.income;
    }); 

    // xLinearScale function above csv import
var xLinearScale = xScale(povertyData, chosenXAxis);

//////////////////////////////////////////////////////////////////////////
/////////////// Initial y Params//////////////////////////////////////////
var chosenYAxis = "healthcare";

// Updating x-scale var upon click on axis label
///// function YScale(povertyData, chosenYAxis) {

//Creating Y scales
    var yLinearScale = d3.scaleLinear() 
    .domain([0, d3.max(povertyData, d => d[chosenYAxis])*2.8])
    .range([height, 0]);

// //////    return yLinearScale;
// }



///THIS WILL CAUSE X SCALE TO SHIFT TO Y SCALE:
// Updating yAxis var upon click on axis label
// function renderAxes(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(leftAxis);

//   return yAxis;
// }





 //Updating circles group with a transition to new circles
function renderCircles(circlesGroup, /*newYScale,*/ chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

////////////////////////////////////////////////////
  // Updating circles group with new tooltip//
function updateToolTip(chosenYAxis, circlesGroup) {

      var label;
      
    if (chosenYAxis === "obesity") {
      label = "Obese (%):";
    } else if (chosenYAxis === "smokes"){
      label = "Smokes (%)";
    }
    else {
      label = "Lacks Healthcare (%)";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      //Setting up onmouseout event so that information dissapears once removing mouse from circle in scatter plot
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }



// Creating initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale); 

// Appending x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// Append y axis
chartGroup.append("g")
.call(leftAxis);

// Appending initial circles
var circlesGroup = chartGroup.selectAll("circle")
.data(povertyData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", 15)
.attr("fill", "dodgerblue")
.attr("opacity", ".5");

// Add state labels to the points
var circleLabels = chartGroup.selectAll(null).data(povertyData).enter().append("text");
///////////////////////////////////////////////////////////////////
circleLabels
  .attr("x", function(d) {
    if (chosenXAxis === "poverty"){
      return xLinearScale(d.poverty);
    } else if (chosenXAxis === "age"){
      return xLinearScale(d.age);
    } else {xLinearScale(d.income);}
  })
 
  /////////////////////////////////////////////////////////////////////
  .attr("y", function(d) {
    if (chosenYAxis === "obesity") {
      label = "Obese (%):";
    } else if (chosenYAxis === "smokes"){
      label = "Smokes (%)";
    }
    else {
      label = "Lacks Healthcare (%)";
    }



 return yLinearScale(d[chosenYAxis]);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

// Creating group for two x-axis labels
var XlabelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 3}, ${height + 20})`);

var PovertyPercentageLable = XlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("In Poverty (%)");

var AgeMedianLabel = XlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "age") // value to grab for event listener
.classed("inactive", true)
.text("Age (Median)");

var IncomeLabel = XlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "income") // value to grab for event listener
.classed("inactive", true)
.text("Household Income (Median)");


// Appending y axis
var YlabelsGroup = chartGroup.append("g")

var ObesityPercentageLable = YlabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("axis-text", true)
.classed("active", true)
.text("Obese (%)");

var SmokersPercentageLable = YlabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "2.5em")
.classed("axis-text", true)
.classed("active", true)
.text("Smokers (%)");

var LsckHealthcarePercentageLable = YlabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "4em")
.classed("axis-text", true)
.classed("active", true)
.text("Smokers (%)");



 // Setting updateToolTip function above csv import
 var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

 // x axis labels event listener
 XlabelsGroup.selectAll("text")
 .on("click", function() {
   // getting value of selection
   var value = d3.select(this).attr("value");
   if (value !== chosenXAxis) {

     // replaces chosenXAxis with value
     chosenXAxis = value;
     //functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(povertyData, chosenXAxis);

     // updates x axis with transition
     xAxis = renderAxes(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

///////////////////////////////////////////////////////////
 // Setting updateToolTip function above csv import
// var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

//  // y axis labels event listener
//  YlabelsGroup.selectAll("text")
//  .on("click", function() {
//    // getting value of selection
//    var value = d3.select(this).attr("value");
//    if (value !== chosenYAxis) {

//      // replaces chosenXAxis with value
//      chosenYAxis = value;
//      //functions here found above csv import
//      // updates x scale for new data
//      YLinearScale = yScale(povertyData, chosenYAxis);

//      // updates x axis with transition
//      yAxis = renderAxes(yLinearScale, yAxis);

//      // updates circles with new x values
//      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

//      // updates tooltips with new info
//      circlesGroup = updateToolTip(chosenYAxis, circlesGroup);






// changes classes to change bold text
if (chosenXAxis === "Age (Median)") {
   AgeMedianLabel
      .classed("active", true)
      .classed("inactive", false);
    PovertyPercentageLable
      .classed("active", false)
      .classed("inactive", true);
    IncomeLable
      .classed("active", false)
      .classed("inactive", true);
  }
  else  {
    AgeMedianLabel
      .classed("active", false)
      .classed("inactive", true);
    PovertyPercentageLable
      .classed("active", true)
      .classed("inactive", false);
    IncomeLable
      .classed("active", true)
      .classed("inactive", false);
  }

}
});
}).catch(function(error) {
console.log(error);
});