# The Cost of Natural Disasters
Author: Taylor Senters

Course: Engineering Interactive Visual Interfaces for Data Science (CS6024)

## Overview
This project is an interactive data visualization dashboard built with D3.js that explores the economic impact of natural disasters over time. It was created as a homework assignment (with provided data and a starter template) and features a recreation of a well-known visualization, supplemented by an aggregated trends chart and interactive data exploration tools.

Inspiration: The Cost of Hurricane Harvey: Only One Storm Comes Close (The New York Times)

## Features
Timeline Chart: A scatterplot-style timeline showing individual natural disasters.

Y-axis: Year of the event.

X-axis: Day of the year the event started.

Size: Radius maps to the financial cost of the disaster.

Color: Represents the category of the disaster (e.g., Tropical Cyclone, Severe Storm, Drought/Wildfire).

Total Cost Line Chart: A supplementary line chart that displays the aggregated cost of all natural disasters per year, providing a clear view of macro-level trends.

Interactive Filtering: A clickable legend allows users to filter the timeline chart by natural disaster type. Unselected categories are grayed out, and the chart updates dynamically to reflect the filtered data.

Details on Demand: Custom tooltips appear when hovering over data points in either chart, revealing specific information such as the disaster's name, exact date, and total cost in billions.

Responsive Design: The dashboard utilizes CSS Flexbox and media queries to ensure the layout stacks vertically on smaller screens (under 950px).

## Technologies Used
HTML5 / CSS3: Page structure, layout (Flexbox), and styling.

JavaScript (ES6): Data processing and application logic.

D3.js (v6): Data binding, DOM manipulation, scales, axes, and SVG rendering.

## File Structure
index.html: The main markup file containing the dashboard layout, SVG containers, and legend.

css/style.css: Styling for the dashboard, responsive media queries, tooltips, and interactive buttons.

js/main.js: Handles loading the CSV data, processing dates and yearly cost aggregations, and orchestrating the chart classes.

js/timelineCircles.js: A class defining the setup, drawing, and updating of the scatterplot timeline and its tooltips.

js/line.js: A class defining the setup, drawing, and updating of the line chart and its invisible data-point tooltips.

data/disasters.csv: The dataset containing the natural disaster records