/** README
 * This file contains the entry point to the Google+ Hangout
 * Must be called after Diplomacy.js
 * TODO: functions to create orders
 *    Mini-grouping for talking/negociating
 */
 
/**
 * Allows the game master to check if the GameState must be updated
 */
var CurrentGameTurn = 0;

/**
 * INCOMPLETE
 * Tells the script to load the application after the Hangout is ready
 */
gapi.hangout.onApiReady.add(
	function(eventObj) {
		if (eventObj.isApiReady) {
			//Initialize the playing field
			var playingField = ObjectCreator.CreateTestingField();
			Diplomacy.InitializeClientScreen(playingField);
			
			//Add event listeners to the UI
			//... must create UI first
			window.document.getElementbyId("EndTurnButton").addEventListener("mousedown"
				, function (evt) {
					SubmitOrders();
				}
			);
			
			//Get or set the current turn
			var turn = gapi.hangout.data.getValue("CurrentGameTurn");
			turn = parseInt(turn);
			if (turn == null || turn == undefined) {
				CurrentGameTurn = 0;
				gapi.hangout.data.submitDelta( { CurrentGameTurn: "" + CurrentGameTurn } );
			} else {
				CurrentGameTurn = turn;
			}
			
			//Decide whom calculates the data of the game
			DesignateGameMaster();
			
			//Save the GameState
			SetCurrentGameState(playingField);
		}
	}
);
 
/**
 * This Regex gets matches all non-hexadecimal characters
 * Used to regularize Particiant ID's such that they can be used in eval() expressions
 */
var ParticipantRegex = new RegExp('[^a-fA-F0-9]', "g");

/**
 * Returns the ID of this participant in regularized, usable form
 */
var GetParticipantID = function () {
	return gapi.hangout.getParticipantId().replace(ParticipantRegex, "");
};

/**
 * Returns the ID's of all participants in this Hangout, in regularized, usable form
 */
var GetParticipantIDs = function () {
	var Participants = gapi.hangout.getParticipants();
	var IDs = [];
	for (var i = 0; i < Participants.length; i++) {
		IDs.push(Participants[i].id.replace(ParticipantRegex, ""));
	}
	return IDs;
};

/**
 * Constructs and returns the GameState from the object pieces it is stored as
 */
var GetCurrentGameState = function () {
	var length = parseInt(gapi.hangout.data.getValue("GameStateLength"));
	var GameState = [];
	for (var i = 0; i < length; i++) {
		GameState.push(JSON.parse(gapi.hangout.data.getValue("CurrentGameState" + i)));
	}
	return GameState;
};

/**
 * Deconstructs and stores the GameState so that (hopefully) no string limits are breached
 * Deletes all orders from the shared state
 */
var SetCurrentGameState = function (GameState) {
	//Construct the expression to create the update object
	var constructor = "gapi.hangout.data.submitDelta( { GameStateLength: " + GameState.length;
	for (var i = 0; i < GameState.length; i++) {
		constructor += ", CurrentGameState" + i + ": JSON.stringify(GameState[i])";
	}
	constructor += " }";
	
	//Construct the expression to remove the orders
	var IDs = GetParticipantIDs();
		if (IDs.length > 0) {
		constructor += ", { Orders_" + IDs[0];
		for (var i = 1; i < IDs.length; i++) {
			constructor += ", Orders_" + IDs[i];
		}
		constructor += " }";
	} else {
		alert("There is nobody in this hangout");
	}
	
	//Close the call to submitDelta()
	constructor += " );";
	
	//Evaluate the expression
	eval(constructor);
};

/**
 * Disallows further calls to the updateCallBack
 */
var isUpdating = false;

/**
 * Prevents rapid fire of the onStateChanged event
 */
var updateDelay = 0;

/**
 * Throttles calls to the updateCallBack 
 */
gapi.hangout.data.onStateChanged.add(
    function(eventObj) {
		updateDelay = 500;
		if (!isUpdating) {
			isUpdating = true;
			updateCallBack();
		}
    }
);

/**
 * Delays updates and calls itself back with a delay
 * After the delay, updates the screen
 * [TEMP] Changes the style of blocks to show updates
 */
var updateCallBack = function () {
	if (updateDelay > 0) {
		setTimeout(updateCallBack, 50);
		updateDelay -= 50;
	} else {
		//Only the game master changes the GameState
		if (gapi.hangout.data.getValue("GameMaster") == GetParticipantID()) {
			//Check to see if all orders have been submitted
			var IDs = GetParticipantIDs();
			var AllMovesSubmitted = true;
			for (var i = 0; i < IDs.length; i++) {
				try {
					if (JSON.parse(gapi.hangout.data.getValue("Orders_" + IDs[i])) == null) {
						AllMovesSubmitted = false;
					}
				} catch (notThere) {
					AllMovesSubmitted = false;
				}
			}
			
			//Construct the order queue and process the GameState
			if (AllMovesSubmitted) {
				var orderQueue = [];
				for (var i = 0; i < IDs.length; i++) {
					orderQueue.concat(JSON.parse(gapi.hangout.data.getValue("Orders_" + IDs[i])));
				}
				
				//Get, process, then set the GameState
				SetCurrentGameState(Diplomacy.ProcessMoveQueue(GetCurrentGameState(), orderQueue));
			}
		}
		
		//Change the display to reflect the current GameState
		var stateTurn = parseInt(gapi.hangout.data.getValue("CurrentGameTurn"));
		if (stateTurn != CurrentGameTurn) {
			CurrentGameTurn = stateTurn;
			
			//Display which blocks have units
			var GameState = GetCurrentGameState();
			for (var i = 0; i < GameState.length; i++) {
				if (GameState[i].Unit != null) {
					window.document.getElementById("Block" + i).innerHTML = "Unit";
				} else {
					window.document.getElementById("Block" + i).innerHTML = "";
				}
			}
			
			//Reset the orders array
			PlayerOrders = [];
		}
		
		isUpdating = false;
	}
};

/**
 * Checks to see if there is an active Game Master
 * If not, sets the caller of this function as the Game Master
 */
var DesignateGameMaster = function () {
	var gameMaster = gapi.hangout.data.getValue("GameMaster");
	var IDs = GetParticipantIDs();
	var gameMasterExists = false;
	for (var i = 0; i < IDs.length; i++) {
		if (gameMaster == IDs[i]) {
			gameMasterExists = true;
			break;
		}
	}
	
	if (!gameMasterExists) {
		gapi.hangout.data.submitDelta( { GameMaster: GetParticipantID() } );
	}
};

/**
 * INCOMPLETE - no pushes to this array exist
 * Stores an array of ObjectCreator.Order objects
 * Reset at the beginning of each turn (see updateCallBack)
 */
var PlayerOrders = [];

/**
 * Overwrites this Participants orders with the current array
 */
var SubmitOrders = function() {
	eval("gapi.hangout.data.submitDelta( { Orders_" + GetParticipantID() + ": JSON.stringify(PlayerOrders) } );");
};