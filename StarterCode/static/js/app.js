// FUNCTION TO INITIALIZE WEBPAGE
function init() {
  PopulateDropDownList()
};

// FUNCTION TO POPULATE DROPDOWN MENU WITH ALL TEST SUBJECT ID NOs
function PopulateDropDownList() {
  // Pull data from JSON file
  d3.json("samples.json").then((data) => {
    // Create array containing subject IDs
    var subjectsIDs = data.names
    // Create variable containing the selected id 
    var ddlIDs = document.getElementById("selDataset");

    // Loop through and add each subject ID to the DropDownList
    subjectsIDs.forEach((subject) => {
      // Create an option tag
      var option = document.createElement("OPTION");
      // Set subject ID in text property
      option.innerHTML = subject;
      // Set subject ID in value property
      option.value = subject;
      // Add the option element to DropDownList
      ddlIDs.options.add(option); 
    })
    // Get the first subject ID for the initial plots
    optionChanged(subjectsIDs[0])
  })
  
};


// FUNCTION CALLED WHEN SOMETHING IS CHANGED IN THE DROPDOWN
function optionChanged(subjectID) {
  // Create a counter to check if webpage needs to first be initialized
  console.log(subjectID)
  var counter = + 1
  console.log(counter)
  // Calls function to go get data with selected subject ID
  getData(subjectID, counter);
};


// FUNCTION TO GET DATA FOR A SPECIFIC SUBJECT ID
function getData(subjectID, counter) {
  // Pull data from JSON file
  d3.json("samples.json").then((data) => {

    // Get metadata for that subject ID
    var metadata = data.metadata
    intsubjectID = parseInt(subjectID)
    metadata = metadata.filter(metadata => metadata.id === intsubjectID);
    metadata = metadata[0]

    // Get data for plots for that subject ID
    var samples_array = data.samples
    samples_array = samples_array.filter(samples_array => samples_array.id === subjectID);
    samples_array = samples_array[0]

    var otu_ids = samples_array.otu_ids
    console.log(otu_ids)

    var sample_values = samples_array.sample_values
    console.log(sample_values)

    var otu_labels = samples_array.otu_labels
    console.log(otu_labels)

    // Check counter to see if we need to first build initial plots
    if (counter == 1) {
      // Build initial demo 
      buildDemo(metadata)
      // Build initial plots
      buildPlots(otu_ids, sample_values, otu_labels);
    }
    else {
      // Build initial demo 
      buildDemo(metadata)
      // Call function to build plots
      updatePlots(otu_ids, sample_values, otu_labels);

    }
  })
};


// FUNCTION TO BUILD AND UPDATE DEMO GRAPHIC
function buildDemo(metadata) {
  var demoInfo = d3.select("#sample-metadata");
  demoInfo.html("");
  demoInfo.append("p").text(`ID: ${metadata.id}`);
  demoInfo.append("p").text(`ethnicity: ${metadata.ethnicity}`);
  demoInfo.append("p").text(`gender: ${metadata.gender}`);
  demoInfo.append("p").text(`age: ${metadata.age}`);
  demoInfo.append("p").text(`location: ${metadata.location}`);
  demoInfo.append("p").text(`btype: ${metadata.btype}`);
  demoInfo.append("p").text(`wfreq: ${metadata.wfreq}`);
};


// FUNCTION TO BUILD INITIAL PLOTS
function buildPlots(otu_ids, sample_values, otu_labels) {
  // Adds a OTU string before each id
  otu_ids_string = otu_ids.map(i => 'OTU ' + i);

  // CREATE HORIZONTAL BAR CHART
  // Create the Trace
  var trace1 = {
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids_string.slice(0, 10).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: 'h'
  };

  // Create the data array for the plot
  var data = [trace1];

  // Define the plot layout
  var layout = {
    xaxis: { title: "Sample Value" },
  };

  // Plot the chart to a div tag with id "bar"
  Plotly.newPlot("bar", data, layout);

  // CREATE BUBBLE CHART
  // Create the Trace
  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: otu_ids,
      size: sample_values
    }
  };

  // Create the data array for the plot
  var data = [trace1];

  // Define the plot layout
  var layout = {
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Value" },
  };

  // Plot the chart to a div tag with id "bubble"
  Plotly.newPlot("bubble", data, layout);
};



// FUNCTION TO UPDATE ALREADY BUILT PLOTS
function updatePlots(otu_ids, sample_values, otu_labels) {

  // Add a OTU string before each id
  otu_ids_string = otu_ids.map(i => 'OTU ' + i);

  // UPDATE HORIZONTAL BAR CHART
  var x1 = sample_values.slice(0, 10).reverse();
  var y1 = otu_ids_string.slice(0, 10).reverse();

  Plotly.restyle("bar", "x", [x1]);
  Plotly.restyle("bar", "y", [y1]);

  // UPDATE BUBBLE CHART
  var x2 = otu_ids
  var y2 = sample_values
  var hovertext = otu_labels
  var color = otu_ids
  var size = sample_values

  Plotly.restyle("bubble", "x", [x2]);
  Plotly.restyle("bubble", "y", [y2]);
  Plotly.restyle("bubble", "text", [hovertext]);
  Plotly.restyle("bubble", "color", [color]);
  Plotly.restyle("bubble", "size", [size]);
};



// Initialize webpage
init();