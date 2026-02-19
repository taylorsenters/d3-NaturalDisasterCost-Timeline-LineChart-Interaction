console.log("Hello world");
let data, timelineCircles;

d3.csv('data/disasters.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
  	data = _data;
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	d.cost = +d.cost; // convert string 'cost' to number
      	d.daysFromYrStart = computeDays(d.start); //note- I just created this field in each object in the array on the fly

		let tokens = d.start.split("-");
  		d.year = +tokens[0];

  	});

	// Create an instance (for example in main.js)
	timelineCircles = new TimelineCircles({
		'parentElement': '#timeline',
		'containerHeight': 1000,
		'containerWidth': 1000
	}, data);


	//lets compute costs per year for the line chart
	let minYear = d3.min( data, d => d.year);
	let maxYear = d3.max( data, d => d.year );

	let costsPerYear = []; //this will be our data for the line chart
	for(let i = minYear; i < maxYear + 1; i++){

		let justThisYear = data.filter( d => d.year == i ); //only include the selected year
		let cost = d3.sum(justThisYear, d => d.cost); //sum over the filtered array, for the cost field

		costsPerYear.push( {"year": i, "cost":cost});

	}

	lineChart = new LineChart({
	'parentElement': '#line',
	'containerHeight': 1000,
	'containerWidth': 1000
	}, costsPerYear); 

})
.catch(error => {
    console.error('Error:');
    console.log(error);
});

/**
 * Event listener: use color legend as filter
 */
d3.selectAll('.legend-btn').on('click', function() {
  console.log("button! ");
  // Toggle 'inactive' class
  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
  
  // Check which categories are active
  let selectedCategory = [];
  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
    selectedCategory.push(d3.select(this).attr('category'));
  });

  // Filter data accordingly and update vis
  timelineCircles.data = data.filter(d => selectedCategory.includes(d.category)) ;
  timelineCircles.updateVis();

});


function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }