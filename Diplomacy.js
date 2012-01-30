/** README
 * This file contains the vital methods of the Diplomacy application
 * "[TEMP]" or "INCOMPLETE" marks areas to work on
 */
 
var Diplomacy = {};

/**
 * Initializes the playing field ([TEMP] based on a field "PlayingFieldData")
 * Creates a HUD of buttons to the right side of the screen
 *    [TEMP] Just the EndTurn button
 */
Diplomacy.InitializeClientScreen = function () {

    Diplomacy.CreatePlayingField(ObjectCreator.CreateTestingField());
	
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
	        //SentMovesToState();
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

/**
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
	
	//Commit all the Unit moves
	for (var i = 0; i < MoveQueue.length; i++) {
		if (MoveQueue[i].UnitArray.length == 1) {
			MoveQueue[i].Unit = MoveQueue[i].UnitArray.length[0]
		} else if (MoveQueue[i].UnitArray.length > 1) {
			alert("Diplomacy.ProcessMoveConflicts has failed");
		}
	}
	//Start the next turn
	Diplomacy.IncrementTurn(GameState);
};

/**
 * Recursive method that processes each space in the "GameState" 
 *    "GameState" is changed in the process
 * Ends once up to one unit exists in the UnitArray of each space
 */
Diplomacy.ProcessMoveConflicts = function (GameState, Location) {
	if (GameState[Location].UnitArray.length >= 1 ) {
		//When in conflict, unit allegiance does not matter
		//   Only the strongest unit may stay
		//   In the event of a draw, all units are bounced back
		var winner = null;
		var winnerStrength = 0;
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
				//Since ProcessConflictLoser is a complex removeAt(index)
				//   the iterator must de-increment
				i = Diplomacy.ProcessConflictLoser(GameState, Location, i) - 1;
			}
		}
	}
};

/**
 * Recursive method that removes GameState[Location].UnitArray[UnitIndex]
 *    Calls itself to remove other units
 *    Also calls ProcessMoveConflicts
 * Returns the resulting index of the removed unit
 */
Diplomacy.ProcessConflictLoser = function (GameState, Location, UnitIndex) {
	//There can only be one Unit per space where this is true
	if (GameState[Location].UnitArray[UnitIndex].OriginalLocation == Location) {
		//Bounce away allies and enemies of <= strength
		for (var i = 0; i < GameState[Location].UnitArray.length; i++) {
			if (i != UnitIndex
				&& (GameState[Location].UnitArray[i].OwnerID == GameState[Location].UnitArray[UnitIndex].OwnerID
					|| GameState[Location].UnitArray[i].SupportStrength <= GameState[Location].UnitArray[UnitIndex].supportStrength)
				) {
				Diplomacy.ProcessConflictLoser(GameState, Location, i);
				//Maintain the "UnitIndex" value so that it points to the same Unit
				if (i < UnitIndex) {
					UnitIndex--;
				}
				i--;
			}
		}
		
		//If a stronger force still exists
		if (GameState[Location].UnitArray.length > 1) {
			//Find a place to retreat to 
			var emptyAdjacents = [];
			for (var i = 0; i < GameState[Location].Connections.length; i++) {
				if (GameState[GameState[Location].Connections[i]].UnitArray.length == 0) {
					emptyAdjacents.push(GameState[Location].Connections[i]);
				}
			}
			//Choose retreat location randomly
			if (emptyAdjacents.length > 0) {
				var retreatIndex = emptyAdjacents[Math.floor(Math.random() * emptyAdjacents.length)];
				GameState[retreatIndex].UnitArray.push(GameState[Location].UnitArray[UnitIndex])
				GameState[Location].UnitArray.splice(UnitIndex, 1);
			} else {
				//Doom and Death ... No retreat
				GameState[Location].UnitArray.remove(UnitIndex, 1);
			}
		}
	} else {
		//Push the Unit back to its original location
		GameState[GameState[Location].UnitArray[UnitIndex].OriginalLocation].UnitArray.push(GameState[Location].UnitArray[i]);
		
		//Process the location the Unit was pushed back to 
		Diplomacy.ProcessMoveConflicts(GameState, GameState[Location].UnitArray[i].OriginalLocation);
		
		//Remove the Unit from this location
		GameState[Location].UnitArray.splice(UnitIndex, 1);
	}
	
	return UnitIndex;
};

/**
 * Calculates the ownership of space and automatically creates units
 */
Diplomacy.IncrementTurn = function (GameState) {
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
		    && GameState[i].OwnerID != null) 
		{
			//This is the only place where units are created
		    GameState[i].Unit = new ObjectCreator.Unit(
			    {
				    OwnerID: GameState[i].OwnerID
				    , isArmy: true
			    }
			);
		}
	}
};