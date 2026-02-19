class TimelineCircles {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: {top: 80, right: 50, bottom: 30, left: 50},
      tooltipPadding: _config.tooltipPadding || 15
    }

    this.data = _data; 

    this.initVis();
  }

  initVis() {
    //setting up the chart- things that won't need to update on user actions
    console.log("Let's draw a chart!!");


    // I recommend avoiding simply using the this keyword within complex class code
    // involving SVG elements because the scope of this will change and it will cause
    // undesirable side-effects. Instead, we recommend creating another variable at
    // the start of each function to store the this-accessor
    let vis = this; 


    // Width and height as the inner dimensions of the chart area- as before
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    // Add <svg> element (drawing space)
    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight)

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

    // Initialize linear and ordinal scales (input domain and output range)
    vis.xScale = d3.scaleLinear()
      .domain([0, 365])
      .range([0, vis.width]);


    vis.yScale = d3.scaleLinear()
      .domain([d3.max(vis.data, d => d.year), d3.min( vis.data, d => d.year)]) 
      .range([0, vis.height]);


    vis.rScale = d3.scaleLinear()
      .domain(d3.extent(vis.data, d=> d.cost))
      .range([5, 100]);


    vis.colorPalette = d3.scaleOrdinal()
      .domain(["tropical-cyclone", "drought-wildfire", "severe-storm", "flooding", "winter-storm-freeze"])
      .range(["#081d58", "#ffffd9", "#c7e9b4", "#41b6c4", "#ccc"]);


    // Initialize axes
    vis.xAxis = d3.axisTop(vis.xScale)
      .tickValues([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]) // days into the year at the start of each month
      .tickFormat((d, i) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]) // month labels
      .tickSize(10)
      .tickPadding(10);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .tickValues(d3.range(d3.min(vis.data, d => d.year), 1 + d3.max(vis.data, d => d.year))) // tick for each year
      .tickSize(-vis.width) // make tick span whole width
      .tickPadding(10)
      .tickFormat(d3.format('d')); // format as date

    // Draw the axis
    vis.xAxisGroup = vis.chart.append('g')
      .attr('class', 'axis x-axis') 
      .attr('transform', `translate(0, -20)`) // movethe x-axis/labels up off the 2017 line
      .call(vis.xAxis);

    vis.yAxisGroup = vis.chart.append('g')
      .attr('class', 'axis y-axis')
      .call(vis.yAxis);

    vis.updateVis(); //call updateVis() at the end 
  }

 updateVis() {
  let vis = this;
  //Add circles for each event in the data
    const circles = vis.chart.selectAll('circle')
      .data(vis.data)
      // update according to button filters
        .join(
            enter => enter.append('circle'),
            update => update,
            exit => exit.remove()
        )
        .attr('fill', (d) => vis.colorPalette(d.category) )
        .attr('opacity', .8)
        .attr('stroke', "gray")
        .attr('stroke-width', 2)
        .attr('r', (d) => vis.rScale(d.cost) ) 
        .attr('cy', (d) => vis.yScale(d.year) ) 
        .attr('cx',(d) =>  vis.xScale(d.daysFromYrStart) );

    // implement tooltip
    circles
      .on('mouseover', (event,d) => {
        console.log("mouse over! ");
        console.log(event);
        console.log(d);

        // format date
        const parseDate = d3.timeParse("%Y-%m-%d");
        const formatDate = d3.timeFormat("%b %d, %Y");
      
        d3.select('#tooltip')
          .style('display', 'block')
          .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
          .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
          .html(`
            <div class="tooltip-title">${d.display_name}</div>
              <ul>
                <li>
                  <span class="tooltip-label">Cost: </span>
                  <span class="tooltip-data">$${d.cost} Billion</span>
                </li>
                <li>
                  <span class="tooltip-label">Date: </span>
                  <span class="tooltip-data">${formatDate(parseDate(d.start))}</span>
                </li>
              </ul>

          `);
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
    });
 }

 /* renderVis() { 

  } */
}