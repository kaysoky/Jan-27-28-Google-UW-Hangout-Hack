/** README
 * This file contains the entry point to the Google+ Hangout
 * Must be called after Diplomacy.js
 */
 
/**
 * INCOMPLETE
 * Tells the script to load the application after the Hangout is ready
 */
gapi.hangout.onApiReady.add(
	function(eventObj) {
		if (eventObj.isApiReady) {
			Diplomacy.InitializeClientScreen();
			
			////Decide whom calculates the data of the game
			//gapi.hangout.data.submitDelta( { "GameMaster": GetParticipantID() } );
			//SetCurrentGameState(PlayingFieldData);
			//gapi.hangout.data.submitDelta( { "CurrentGameTurn": "0" } );
			//
			////DEBUG Seed the game with units
			//var gameState = GetCurrentGameState();
			//for (var i = 0; i < gameState.length; i++) {
			//	if (gameState[i].isSupplyCenter) {
			//		gameState[i].Unit = 
			//		{
			//			OwnerID: GetParticipantID()
			//			, SupportStrength: 1.5
			//			, isArmy: true
			//		};
			//	}
			//}
			//SetCurrentGameState(gameState);
		}
	}
);

/**
 * 
 */


////Gets rid of periods in the participant IDs
//var DePeriodExpression = new RegExp("(\\W+)", "g");
//var GetParticipantID = function () {
//	return gapi.hangout.getParticipantId().replace(DePeriodExpression, "");
//};
//var GetParticipantIDs = function () {
//	var parties = gapi.hangout.getParticipants();
//	var IDs = [];
//	for (var i = 0; i < parties.length; i++) {
//		IDs.push(parties[i].id.replace(DePeriodExpression, ""));
//	}
//	return IDs;
//};
////Breaks up the GameState into many, many objects so that no string limits are reached
//var GetCurrentGameState = function () {
//	var length = parseInt(gapi.hangout.data.getValue("GameStateLength"));
//	var gameState = [];
//	for (var i = 0; i < length; i++) {
//		gameState.push(JSON.parse(gapi.hangout.data.getValue("CurrentGameState" + i)));
//	}
//	return gameState;
//};
//var SetCurrentGameState = function (gameState) {
//	gapi.hangout.data.submitDelta( { "GameStateLength": "" + gameState.length } );
//	for (var i = 0; i < gameState.length; i++) {
//		eval("gapi.hangout.data.submitDelta( { CurrentGameState" + i + ": JSON.stringify(gameState[i]) } );");
//	}
//};
//var CurrentGameTurn = 0;

//var isUpdating = false;
//gapi.hangout.data.onStateChanged.add(
//    function(eventObj) {
//        //Only one client does the calculations
//		var gameMaster = gapi.hangout.data.getValue("GameMaster");
//		var participant = GetParticipantID();
//        if (!isUpdating && gapi.hangout.data.getValue("GameMaster") == GetParticipantID()) {
//            var Participants = GetParticipantIDs();
//            var AllMovesSubmitted = true;
//            for (var i = 0; i < Participants.length; i++) {
//                try {
//                    if (JSON.parse(gapi.hangout.data.getValue("Orders_" + Participants[i])) == null) {
//                        AllMovesSubmitted = false;
//                    }
//                } catch (notThere) {
//                    AllMovesSubmitted = false;
//                }
//            }
//            if (AllMovesSubmitted) {
//				isUpdating = true;
//                //This will clear the "Orders_" values in the State
//                ProcessMoveQueue();
//				isUpdating = false;
//            }
//        }
//        if (parseInt(gapi.hangout.data.getValue("CurrentGameTurn")) != CurrentGameTurn) {
//            CurrentGameTurn++;
//            //Display which blocks have units
//            var gameState = GetCurrentGameState();
//            for (var i = 0; i < gameState.length; i++) {
//                if (gameState[i].Unit != null) {
//                    window.document.getElementById("Block" + i).innerHTML = "Unit";
//                } else {
//                    window.document.getElementById("Block" + i).innerHTML = "";
//                }
//            }
//        }
//    }
//);

/*
Array 
	Order
		Destination
		RecievingUnit
		isSupport
		SupportForID
*/
//var PlayerOrders = [];
//var SentMovesToState = function() {
//	if (isHangout) {
//		eval("gapi.hangout.data.submitDelta( { Orders_" + GetParticipantID() + ": JSON.stringify(PlayerOrders) } );");
//	} else {
//		ProcessMoveQueue();
//	}
//};
//