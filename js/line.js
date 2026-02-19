class LineChart {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 60, bottom: 30, right: 30, left: 50 },
      tooltipPadding: _config.tooltipPadding || 15
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
    let vis = this; 
    
    console.log(vis.data);
    
    //TO DO - make a line chart here 
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
    
    // Initialize linear axis scales (input domain and output range)
    vis.xScale = d3.scaleLinear()
      .domain(d3.extent(vis.data, d=> d.year))
      .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
      .domain([0, d3.max(vis.data, d => d.cost)]) 
      .range([vis.height, 0])
      .nice();

  // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickValues(d3.range(d3.min(vis.data, d => d.year), 1 + d3.max(vis.data, d => d.year))) // ticks for every year
      .tickFormat(d => {return (d % 2 === 0 ? d : "");}) // only label every other tick so it's not as crowded
      .tickPadding(10);
  
    vis.yAxis = d3.axisLeft(vis.yScale)
      .tickSize(-vis.width) // extend tick marks entire width
      .tickFormat(d => `$${d3.format(',')(d)}`) // format as currency $
      .tickPadding(10);
    
    // Draw the axes
    vis.xAxisGroup = vis.chart.append('g')
      .attr('class', 'axis x-axis') 
      .attr('transform', `translate(0, ${vis.height})`) // move x-axis to bottom of chart
      .call(vis.xAxis);

    vis.yAxisGroup = vis.chart.append('g')
      .attr('class', 'axis y-axis')
      .call(vis.yAxis);

      vis.updateVis(); 
  }

 updateVis() {
  let vis = this;
    // helper function
    vis.line = d3.line()
      .x(d => vis.xScale(d.year))
      .y(d => vis.yScale(d.cost));

    // Add line path
    vis.chart.selectAll('.chart-line')
      .data([vis.data]) 
      .join('path')
      .attr('class', 'chart-line')
      .attr('d', vis.line)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 3);

      // create invisible data points for each year to more easily hover to see tooltip
      vis.chart.selectAll('.data-point')
        .data(vis.data)
        .join('circle')
        .attr('class', 'data-point')
        .attr('cx', d => vis.xScale(d.year))
        .attr('cy', d => vis.yScale(d.cost))
        .attr('r', 10) 
        .attr('fill', 'transparent')
        

        .on('mouseover', (event,d) => {
          console.log("mouse over! ");
          console.log(event);
          console.log(d);

          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.year}</div>
                <ul>
                  <li>
                    <span class="tooltip-label">Cost: </span>
                    <span class="tooltip-data">$${d3.format(",.1f")(d.cost)} Billion</span>
                  </li>
                </ul>

            `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
        }
      );
 }


 // //leave this empty for now...
 // renderVis() { 

 //  }



}