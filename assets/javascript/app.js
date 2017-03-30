var config = {
    apiKey: "AIzaSyDwII3CMgTiTVFTSHq6d3tGvYvbf64Y9p0",
    authDomain: "train-schedule-4139f.firebaseapp.com",
    databaseURL: "https://train-schedule-4139f.firebaseio.com",
    storageBucket: "train-schedule-4139f.appspot.com",
    messagingSenderId: "886924549039"
  };
  firebase.initializeApp(config);


$( document ).ready(function() {

var train = '';
var destination = '';
var firstTrain = '';
var frequency = '';


var dataRef = new Firebase("https://train-schedule-4139f.firebaseio.com/");


//new train
	$('#addTrainBtn').on('click', function() {
	  train = $('#trainNameInput').val().trim();
		destination = $('#destinationInput').val().trim();
		firstTrain = $('#firstTrainInput').val().trim();
		frequency = $('#frequencyInput').val().trim();

	// Empties Fields After Submitting Data
		$('#trainNameInput').val('');
		$('#destinationInput').val('');
		$('#firstTrainInput').val('');
		$('#frequencyInput').val('');

		firebase.database().ref.push({

			train: train,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency

		});

		return false;



	});

// Child Added 

		dataRef.on("child_added", function(snapshot) {

		console.log(snapshot.val().train + " = train");
		console.log(snapshot.val().destination + " = destination");
		console.log(snapshot.val().firstTrain + " = nextTrain");
		console.log(snapshot.val().frequency +" = frequency");

		
		var train = snapshot.val().train;
		var destination = snapshot.val().destination;
		var firstTrain = snapshot.val().firstTrain;
		var frequency = snapshot.val().frequency;

		var timeHour = moment().format('H');
		var timeMin = moment().format('m');
		var ftHour = moment(firstTrain, "HH:mm").format('H');
		var ftMin = moment(firstTrain, "HH:mm").format('m');

		var ftMoment = (ftHour * 60) + (ftMin * 1);
		var timeMoment = (timeHour * 60) + (timeMin * 1);

	
		var diff = timeMoment - ftMoment;

		var trainsSinceFirst = Math.floor(diff/frequency);

		var nextArrival = ((trainsSinceFirst + 1) * frequency) + ftMoment;

		if (ftMoment < timeMoment) {
			var minAway = nextArrival - timeMoment;
			var nextArrival = moment().add(minAway, 'minutes').format('HH:mm');
		} 
		else {
			var nextArrival = firstTrain;
			var minAway = ftMoment - timeMoment;
		};

	// Appends new information to table
	$("#trainData").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");

			}, function (errorObject) {
					console.log('The read failed' + errorObject.code);

		}); 

});