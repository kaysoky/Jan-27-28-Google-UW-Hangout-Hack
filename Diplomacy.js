/** README
 * This file contains the vital methods of the Diplomacy application
 */
 
var Diplomacy = {};

/**
 * Initializes the playing field ([TEMP] based on a field "PlayingFieldData")
 * Creates a HUD of buttons to the right side of the screen
 *    [TEMP] Just the EndTurn button
 */
Diplomacy.InitializeClientScreen = function () {

	Diplomacy.CreatePlayingField(Diplomacy.PlayingFieldData);
	
	var body = window.document.getElementsByTagName("BODY")[0];
	var PlayingField = window.document.getElementById("PlayingField");
	
	//Create the EndTurn button
	var EndTurn = window.document.createElement("div");
	EndTurn.style.position = "absolute";
	EndTurn.style.left = PlayingField.offsetLeft + PlayingField.offsetWidth + "px";
	EndTurn.style.top = PlayingField.offsetLeft.offsetTop + "px";
	EndTurn.style.width = (body.offsetWidth - PlayingField.offsetWidth - PlayingField.offsetLeft) + "px";
	EndTurn.style.height = PlayingField.offsetHeight + "px";
	EndTurn.style.textAlign = "center";
	EndTurn.style.fontSize = "16pt";
	EndTurn.style.backgroundColor = "rgb(0, 0, 200)";
	body.appendChild(EndTurn);
	EndTurn.appendChild(window.document.createTextNode("End Turn"));
	EndTurn.style.lineHeight = EndTurn.offsetHeight + "px";
	
	EndTurn.addEventListener("mousedown"
	    , function (evt) {
	        SentMovesToState();
	    }
	);
};


/** 
 * Draws the playing field based on the parameter "Array_LandData"
 *    [TEMP] Takes up 100% of Height, 90% of Width
 */
Diplomacy.CreatePlayingField = function(Array_LandData) {
	//Get the tag into which the playing field will be drawn
	var body = window.document.getElementsByTagName("BODY")[0];
	
	//Create the <div> that houses the playing field
	var PlayingField = window.document.createElement("div");
	PlayingField.id = "PlayingField";
	PlayingField.style.position = "absolute";
	PlayingField.style.left = "0px";
	PlayingField.style.top = "0px";
	PlayingField.style.width = "90%";
	PlayingField.style.height = "100%";
	body.appendChild(PlayingField);
	
	//Create the background with the node connectors
	(function () {
		//Create the <canvas> that is shows the connections between nodes
		var Background = window.document.createElement("canvas");
		Background.style.position = "absolute"
		Background.style.left = "0px";
		Background.style.top = "0px";
		Background.width = PlayingField.offsetWidth;
		Background.height = PlayingField.offsetHeight;
		body.insertBefore(Background, PlayingField);
		
		var context = Background.getContext("2d");
		context.lineStyle = "rgb(0, 0, 0)";
		context.lineWidth = 1;
		//Calculate the centers of all the nodes
		var StartX = [];
		var StartY = [];
		for (var i = 0; i < Array_LandData.length; i++) {
			StartX.push(Background.width * (Array_LandData[i].X + Array_LandData[i].Width / 2));
			StartY.push(Background.height * (Array_LandData[i].Y + Array_LandData[i].Height / 2));
		}
		//Draw all the lines between nodes (each will be drawn twice due to two-way connections)
		for (var i = 0; i < Array_LandData.length; i++) {
			for (var j = 0; j < Array_LandData[i].Connections.length; j++) {
				context.beginPath();
				context.moveTo(StartX[i], StartY[i]);
				context.lineTo(StartX[Array_LandData[i].Connections[j]]
					, StartY[Array_LandData[i].Connections[j]]);
				context.stroke();
			}
		}
	}) ();
	
	//Create all the nodes of the playing field
	for (var i = 0; i < Array_LandData.length; i++) {
		var block = window.document.createElement("div");
		block.id = "Block" + i;
		block.style.position = "absolute";
		block.style.left = 100 * Array_LandData[i].X + "%";
		block.style.top = 100 * Array_LandData[i].Y + "%";
		block.style.width = 100 * Array_LandData[i].Width + "%";
		block.style.height = 100 * Array_LandData[i].Height + "%";
		block.style.borderWidth = "2px";
		block.style.borderStyle = "solid";
		block.style.borderRadius = "50%";
		block.style.borderColor = "rgb(50, 50, 50)";
		block.style.backgroundColor = "rgb(" + i * 5 + ", 150, 150)";
		PlayingField.appendChild(block);
	}
};

//Look at PlayingFieldData.xcls for the construction of this data
/*
Array
	Object of structure:
		X
		Y
		Width
		Height
		Label
		acceptsArmy
		acceptsFleet
		isSupplyCenter
		Connections (Array)
	Scripts will append the following to the object
		Unit
		UnitArray
		OwnerID
		OwnerInfluence
*/
Diplomacy.PlayingFieldData =
[
	{ X: 0, Y:0, Width: 0.05, Height: 0.1, Label: 0, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [1, 10] }
	, { X: 0.1, Y:0, Width: 0.05, Height: 0.1, Label: 1, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [0, 2, 11] }
	, { X: 0.2, Y:0, Width: 0.05, Height: 0.1, Label: 2, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [1, 3, 12] }
	, { X: 0.3, Y:0, Width: 0.05, Height: 0.1, Label: 3, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [2, 4, 13] }
	, { X: 0.4, Y:0, Width: 0.05, Height: 0.1, Label: 4, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [3, 5, 14] }
	, { X: 0.5, Y:0, Width: 0.05, Height: 0.1, Label: 5, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [4, 6, 15] }
	, { X: 0.6, Y:0, Width: 0.05, Height: 0.1, Label: 6, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [5, 7, 16] }
	, { X: 0.7, Y:0, Width: 0.05, Height: 0.1, Label: 7, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [6, 8, 17] }
	, { X: 0.8, Y:0, Width: 0.05, Height: 0.1, Label: 8, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [7, 9, 18] }
	, { X: 0.9, Y:0, Width: 0.05, Height: 0.1, Label: 9, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [8, 19] }
	, { X: 0, Y:0.2, Width: 0.05, Height: 0.1, Label: 10, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [    11, 20, 0] }
	, { X: 0.1, Y:0.2, Width: 0.05, Height: 0.1, Label: 11, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [10, 12, 21, 1] }
	, { X: 0.2, Y:0.2, Width: 0.05, Height: 0.1, Label: 12, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [11, 13, 22, 2] }
	, { X: 0.3, Y:0.2, Width: 0.05, Height: 0.1, Label: 13, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [12, 14, 23, 3] }
	, { X: 0.4, Y:0.2, Width: 0.05, Height: 0.1, Label: 14, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [13, 15, 24, 4] }
	, { X: 0.5, Y:0.2, Width: 0.05, Height: 0.1, Label: 15, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [14, 16, 25, 5] }
	, { X: 0.6, Y:0.2, Width: 0.05, Height: 0.1, Label: 16, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [15, 17, 26, 6] }
	, { X: 0.7, Y:0.2, Width: 0.05, Height: 0.1, Label: 17, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [16, 18, 27, 7] }
	, { X: 0.8, Y:0.2, Width: 0.05, Height: 0.1, Label: 18, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [17, 19, 28, 8] }
	, { X: 0.9, Y:0.2, Width: 0.05, Height: 0.1, Label: 19, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [18,     29, 9] }
	, { X: 0, Y:0.4, Width: 0.05, Height: 0.1, Label: 20, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [    21, 30, 10] }
	, { X: 0.1, Y:0.4, Width: 0.05, Height: 0.1, Label: 21, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [20, 22, 31, 11] }
	, { X: 0.2, Y:0.4, Width: 0.05, Height: 0.1, Label: 22, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [21, 23, 32, 12] }
	, { X: 0.3, Y:0.4, Width: 0.05, Height: 0.1, Label: 23, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [22, 24, 33, 13] }
	, { X: 0.4, Y:0.4, Width: 0.05, Height: 0.1, Label: 24, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [23, 25, 34, 14] }
	, { X: 0.5, Y:0.4, Width: 0.05, Height: 0.1, Label: 25, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: true, Connections: [24, 26, 35, 15] }
	, { X: 0.6, Y:0.4, Width: 0.05, Height: 0.1, Label: 26, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [25, 27, 36, 16] }
	, { X: 0.7, Y:0.4, Width: 0.05, Height: 0.1, Label: 27, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [26, 28, 37, 17] }
	, { X: 0.8, Y:0.4, Width: 0.05, Height: 0.1, Label: 28, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [27, 29, 38, 18] }
	, { X: 0.9, Y:0.4, Width: 0.05, Height: 0.1, Label: 29, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [28,     39, 19] }
	, { X: 0, Y:0.6, Width: 0.05, Height: 0.1, Label: 30, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [    31, 40, 20] }
	, { X: 0.1, Y:0.6, Width: 0.05, Height: 0.1, Label: 31, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [30, 32, 41, 21] }
	, { X: 0.2, Y:0.6, Width: 0.05, Height: 0.1, Label: 32, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [31, 33, 42, 22] }
	, { X: 0.3, Y:0.6, Width: 0.05, Height: 0.1, Label: 33, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [32, 34, 43, 23] }
	, { X: 0.4, Y:0.6, Width: 0.05, Height: 0.1, Label: 34, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [33, 35, 44, 24] }
	, { X: 0.5, Y:0.6, Width: 0.05, Height: 0.1, Label: 35, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [34, 36, 45, 25] }
	, { X: 0.6, Y:0.6, Width: 0.05, Height: 0.1, Label: 36, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [35, 37, 46, 26] }
	, { X: 0.7, Y:0.6, Width: 0.05, Height: 0.1, Label: 37, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [36, 38, 47, 27] }
	, { X: 0.8, Y:0.6, Width: 0.05, Height: 0.1, Label: 38, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [37, 39, 48, 28] }
	, { X: 0.9, Y:0.6, Width: 0.05, Height: 0.1, Label: 39, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [38,     49, 29] }
	, { X: 0, Y:0.8, Width: 0.05, Height: 0.1, Label: 40, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [    41, 30] }
	, { X: 0.1, Y:0.8, Width: 0.05, Height: 0.1, Label: 41, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [40, 42, 31] }
	, { X: 0.2, Y:0.8, Width: 0.05, Height: 0.1, Label: 42, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [41, 43, 32] }
	, { X: 0.3, Y:0.8, Width: 0.05, Height: 0.1, Label: 43, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [42, 44, 33] }
	, { X: 0.4, Y:0.8, Width: 0.05, Height: 0.1, Label: 44, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [43, 45, 34] }
	, { X: 0.5, Y:0.8, Width: 0.05, Height: 0.1, Label: 45, acceptsArmy: false, acceptsFleet: false, isSupplyCenter: false, Connections: [44, 46, 35] }
	, { X: 0.6, Y:0.8, Width: 0.05, Height: 0.1, Label: 46, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [45, 47, 36] }
	, { X: 0.7, Y:0.8, Width: 0.05, Height: 0.1, Label: 47, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [46, 48, 37] }
	, { X: 0.8, Y:0.8, Width: 0.05, Height: 0.1, Label: 48, acceptsArmy: false, acceptsFleet: false, isSupplyCenter: false, Connections: [47, 49, 38] }
	, { X: 0.9, Y:0.8, Width: 0.05, Height: 0.1, Label: 49, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [48,     39] }
];

/**
 * INCOMPLETE
 * Changes and returns the parameter "GameState" based on "MoveQueue"
 * "MoveQueue" should be a single array of orders (not a jagged array)
 */
Diplomacy.ProcessMoveQueue = function (GameState, MoveQueue) {
	//Reset some intermediate processing variables within "GameState"
	for (var i = 0; i < GameState.length; i++) {
		GameState[i].UnitArray = [];
		if (GameState[i].Unit != null) {
			GameState[i].Unit.SupportStrength = 0;
		}
	}
	
	//Move all into their destinations
	//   Support/Holding units move onto their own space
	for (var i = 0; i < MoveQueue.length; i++) {
		GameState[MoveQueue[i].RecievingUnit].Unit.OriginalLocation = MoveQueue[i].RecievingUnit;
		GameState[MoveQueue[i].Destination].UnitArray.push(GameState[MoveQueue[i].RecievingUnit].Unit);
		GameState[MoveQueue[i].RecievingUnit].Unit = null;
	}
	
	//Add support strength to allies
	for (var i = 0; i < MoveQueue.length; i++) {
		//Only units in non-contested space can give support
		if (MoveQueue[i].isSupport && GameState[MoveQueue[i].RecievingUnit].UnitArray.length == 1) {
			//Look through the destination for the support target
			for (var j = 0; j < GameState[MoveQueue[i].Destination].UnitArray.length; j++) {
				if (GameState[MoveQueue[i].Destination].UnitArray[j].OwnerID == MoveQueue[i].SupportForID) {
					GameState[MoveQueue[i].Destination].UnitArray[j].SupportStrength++;
					//Only one ally unit can be supported per support
					break;
				}
			}
		}
	}
		
	//Resolve all conflicts
	for (var i = 0; i < MoveQueue.length; i++) {
		Diplomacy.ProcessMoveConflicts(GameState, i);
	}
	//for (var i = 0; i < NextGameStatus.length; i++) {
	//	ProcessMoveConflicts(NextGameStatus, i);
	//}
	//for (var i = 0; i < NextGameStatus.length; i++) {
	//	//Commit the Unit moves
	//	if (NextGameStatus[i].UnitArray.length == 1) {
	//		NextGameStatus[i].Unit = NextGameStatus[i].UnitArray[0];
	//	}
	//	//Reset Unit arrays
	//	NextGameStatus[i].UnitArray = [];
	//	//Reset the support to zero
	//	if (NextGameStatus[i].Unit != null) {
	//		NextGameStatus[i].Unit.SupportStrength = 0;
	//	}
	//}
	////Start the next turn
	//BeginTurn(NextGameStatus);
	////Finally, submit the changed state
	//SetCurrentGameState(NextGameStatus);
	//gapi.hangout.data.submitDelta( { "CurrentGameTurn": "" + (1 + parseInt(gapi.hangout.data.getValue("CurrentGameTurn"))) } );
};

/**
 * INCOMPLETE
 * Recursive method that processes each space in the "GameState" 
 * Ends once up to one unit exists in the UnitArray of each space
 */
Diplomacy.ProcessMoveConflicts = function (GameState, Location) {
	if (GameState[Location].UnitArray.length >= 1 ) {
		var winner;
		var winnerStrength = 0;
		//Find the winner
		for (var i = 0; i < GameState[Location].UnitArray.length; i++) {
			if (1 + GameState[Location].UnitArray[i].SupportStrength > winnerStrength) {
				winner = GameState[Location].UnitArray[i];
				winnerStrength = 1 + GameState[Location].UnitArray[i].SupportStrength;
			} else if (1 + GameState[Location].UnitArray[i].SupportStrength == winnerStrength) {
				winner = null;
			}
		}
		//Make all losers retreat
		for (var i = 0; i < GameState[Location].UnitArray.length; i++) {
			if (GameState[Location].UnitArray[i] != winner) {
				//Bounce back losers
				//If losers bounce back to same area
				if (GameState[Location].UnitArray[i].OriginalLocation == Location) {
					//Bounce away allies and weaker enemies
					for (var j = 0; j < GameState[Location].UnitArray.length; j++) {
						if (i != j 
							&& (GameState[Location].UnitArray[j].OwnerID == GameState[Location].UnitArray[i].OwnerID
								|| GameState[Location].UnitArray[j].SupportStrength == 0)) {
							//Push the Unit back to its original location
							GameState[GameState[Location].UnitArray[j].OriginalLocation].UnitArray.push(GameState[Location].UnitArray[j]);
							//Process the location the Unit was pushed back to 
							ProcessMoveConflicts(GameState, GameState[Location].UnitArray[j].OriginalLocation);
							//Remove the Unit from this location
							GameState[Location].UnitArray.remove(j);
							//Maintain the "i" value so that it points to the same Unit
							if (j < i) {
								i--;
							}
						}
					}
					//If a stronger force still exists, retreat
					var emptyAdjacents = [];
					for (var j = 0; j < GameState[Location].Connections.length; j++) {
						if (GameState[GameState[Location].Connections[j]].UnitArray.length == 0) {
							emptyAdjacents.push(GameState[GameState[Location].Connections[j]]);
						}
					}
					//Choose retreat location randomly
					if (emptyAdjacents.length > 0) {
						var retreatIndex = Math.floor(Math.random() * emptyAdjacents.length);
						emptyAdjacents[retreatIndex].UnitArray.push(GameState[Location].UnitArray[i])
						GameState[Location].UnitArray.remove(i--);
					} else {
						//Doom, Death, No Retreat
						GameState[Location].UnitArray.remove(i--);
					}
				} else {
					//Push the Unit back to its original location
					GameState[GameState[Location].UnitArray[i].OriginalLocation].UnitArray.push(GameState[Location].UnitArray[i]);
					//Process the location the Unit was pushed back to 
					ProcessMoveConflicts(GameState, GameState[Location].UnitArray[i].OriginalLocation);
					//Remove the Unit from this location
					GameState[Location].UnitArray.remove(i--);
				}
			}
		}
	}
};

/**
 * INCOMPLETE
 */
Diplomacy.BeginTurn = function (GameState) {
	for (var i = 0; i < GameState.length; i++) {
		//Increment the Player's control over the regions
		if (GameState[i].Unit != null) {
			//Convert enemy regions into Player regions
			if (GameState[i].OwnerID != GameState[i].Unit.OwnerID) {
				GameState[i].OwnerInfluence--;
				if (GameState[i].OwnerInfluence < 0) {
					GameState[i].OwnerID = GameState[i].Unit.OwnerID;
					GameState[i].OwnerInfluence *= -1;
				}
			} else {
				//Over time, influence converges to 3.0
				GameState[i].OwnerInfluence = 0.15 + 0.95 * GameState[i].OwnerInfluence;
			}
		} else if (GameState[i].isSupplyCenter 
		&& GameState[i].OwnerInfluence > 1.5 
		&& GameState[i].OwnerID != null) {
			//This is the only place where units are created
			GameState[i].Unit = 
			{
				OwnerID: GameState[i].OwnerID
				, SupportStrength: 0
				, isArmy: true
			};
		}
	}
};