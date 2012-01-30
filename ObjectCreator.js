var ObjectCreator = {};

ObjectCreator.Unit = function(Parameters) {
    this.OwnerID = Parameters.OwnerID;
    this.SupportStrength = 0;
    this.isArmy = Parameters.isArmy;
};

ObjectCreator.Order = function(Parameters) {
    this.RecievingUnit = Parameters.RecievingUnit;
    this.Destination = Parameters.Destination;
    this.isSupport = Parameters.isSupport;
    this.SupportForID = Parameters.SupportForID;
};

ObjectCreator.Space = function(Parameters) {
    //These four are measured in percentages
    this.X = Parameters.X;
    this.Y = Parameters.Y;
    this.Width = Parameters.Width;
    this.Height = Parameters.Height;
    
    this.Label = Parameters.Label;
    this.acceptsArmy = Parameters.acceptsArmy;
    this.acceptsFleet = Parameters.acceptsFleet;
    this.isSupplyCenter = Parameters.isSupplyCenter;
    this.Connections = Parameters.Connections;
    
    this.Unit = null;
    this.UnitArray = [];
    this.OwnerID = "";
    this.OwnerInfluence = 0.0;
};


//Look at PlayingFieldData.xcls for the construction of this data
ObjectCreator.CreateTestingField = function() {
    var GameState = [];
    
    GameState.push(new ObjectCreator.Space({ X: 0, Y: 0, Width: 0.05, Height: 0.1, Label: 0, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [1, 10] }));
    GameState.push(new ObjectCreator.Space({ X: 0.1, Y: 0, Width: 0.05, Height: 0.1, Label: 1, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [0, 2, 11] }));
    GameState.push(new ObjectCreator.Space({ X: 0.2, Y: 0, Width: 0.05, Height: 0.1, Label: 2, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [1, 3, 12] }));
    GameState.push(new ObjectCreator.Space({ X: 0.3, Y: 0, Width: 0.05, Height: 0.1, Label: 3, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [2, 4, 13] }));
    GameState.push(new ObjectCreator.Space({ X: 0.4, Y: 0, Width: 0.05, Height: 0.1, Label: 4, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [3, 5, 14] }));
    GameState.push(new ObjectCreator.Space({ X: 0.5, Y: 0, Width: 0.05, Height: 0.1, Label: 5, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [4, 6, 15] }));
    GameState.push(new ObjectCreator.Space({ X: 0.6, Y: 0, Width: 0.05, Height: 0.1, Label: 6, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [5, 7, 16] }));
    GameState.push(new ObjectCreator.Space({ X: 0.7, Y: 0, Width: 0.05, Height: 0.1, Label: 7, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [6, 8, 17] }));
    GameState.push(new ObjectCreator.Space({ X: 0.8, Y: 0, Width: 0.05, Height: 0.1, Label: 8, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [7, 9, 18] }));
    GameState.push(new ObjectCreator.Space({ X: 0.9, Y: 0, Width: 0.05, Height: 0.1, Label: 9, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [8, 19] }));
    GameState.push(new ObjectCreator.Space({ X: 0, Y: 0.2, Width: 0.05, Height: 0.1, Label: 10, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [11, 20, 0] }));
    GameState.push(new ObjectCreator.Space({ X: 0.1, Y: 0.2, Width: 0.05, Height: 0.1, Label: 11, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [10, 12, 21, 1] }));
    GameState.push(new ObjectCreator.Space({ X: 0.2, Y: 0.2, Width: 0.05, Height: 0.1, Label: 12, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [11, 13, 22, 2] }));
    GameState.push(new ObjectCreator.Space({ X: 0.3, Y: 0.2, Width: 0.05, Height: 0.1, Label: 13, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [12, 14, 23, 3] }));
    GameState.push(new ObjectCreator.Space({ X: 0.4, Y: 0.2, Width: 0.05, Height: 0.1, Label: 14, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [13, 15, 24, 4] }));
    GameState.push(new ObjectCreator.Space({ X: 0.5, Y: 0.2, Width: 0.05, Height: 0.1, Label: 15, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [14, 16, 25, 5] }));
    GameState.push(new ObjectCreator.Space({ X: 0.6, Y: 0.2, Width: 0.05, Height: 0.1, Label: 16, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [15, 17, 26, 6] }));
    GameState.push(new ObjectCreator.Space({ X: 0.7, Y: 0.2, Width: 0.05, Height: 0.1, Label: 17, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [16, 18, 27, 7] }));
    GameState.push(new ObjectCreator.Space({ X: 0.8, Y: 0.2, Width: 0.05, Height: 0.1, Label: 18, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [17, 19, 28, 8] }));
    GameState.push(new ObjectCreator.Space({ X: 0.9, Y: 0.2, Width: 0.05, Height: 0.1, Label: 19, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [18, 29, 9] }));
    GameState.push(new ObjectCreator.Space({ X: 0, Y: 0.4, Width: 0.05, Height: 0.1, Label: 20, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [21, 30, 10] }));
    GameState.push(new ObjectCreator.Space({ X: 0.1, Y: 0.4, Width: 0.05, Height: 0.1, Label: 21, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [20, 22, 31, 11] }));
    GameState.push(new ObjectCreator.Space({ X: 0.2, Y: 0.4, Width: 0.05, Height: 0.1, Label: 22, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [21, 23, 32, 12] }));
    GameState.push(new ObjectCreator.Space({ X: 0.3, Y: 0.4, Width: 0.05, Height: 0.1, Label: 23, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [22, 24, 33, 13] }));
    GameState.push(new ObjectCreator.Space({ X: 0.4, Y: 0.4, Width: 0.05, Height: 0.1, Label: 24, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [23, 25, 34, 14] }));
    GameState.push(new ObjectCreator.Space({ X: 0.5, Y: 0.4, Width: 0.05, Height: 0.1, Label: 25, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: true, Connections: [24, 26, 35, 15] }));
    GameState.push(new ObjectCreator.Space({ X: 0.6, Y: 0.4, Width: 0.05, Height: 0.1, Label: 26, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [25, 27, 36, 16] }));
    GameState.push(new ObjectCreator.Space({ X: 0.7, Y: 0.4, Width: 0.05, Height: 0.1, Label: 27, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [26, 28, 37, 17] }));
    GameState.push(new ObjectCreator.Space({ X: 0.8, Y: 0.4, Width: 0.05, Height: 0.1, Label: 28, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: true, Connections: [27, 29, 38, 18] }));
    GameState.push(new ObjectCreator.Space({ X: 0.9, Y: 0.4, Width: 0.05, Height: 0.1, Label: 29, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [28, 39, 19] }));
    GameState.push(new ObjectCreator.Space({ X: 0, Y: 0.6, Width: 0.05, Height: 0.1, Label: 30, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [31, 40, 20] }));
    GameState.push(new ObjectCreator.Space({ X: 0.1, Y: 0.6, Width: 0.05, Height: 0.1, Label: 31, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [30, 32, 41, 21] }));
    GameState.push(new ObjectCreator.Space({ X: 0.2, Y: 0.6, Width: 0.05, Height: 0.1, Label: 32, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [31, 33, 42, 22] }));
    GameState.push(new ObjectCreator.Space({ X: 0.3, Y: 0.6, Width: 0.05, Height: 0.1, Label: 33, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [32, 34, 43, 23] }));
    GameState.push(new ObjectCreator.Space({ X: 0.4, Y: 0.6, Width: 0.05, Height: 0.1, Label: 34, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [33, 35, 44, 24] }));
    GameState.push(new ObjectCreator.Space({ X: 0.5, Y: 0.6, Width: 0.05, Height: 0.1, Label: 35, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [34, 36, 45, 25] }));
    GameState.push(new ObjectCreator.Space({ X: 0.6, Y: 0.6, Width: 0.05, Height: 0.1, Label: 36, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [35, 37, 46, 26] }));
    GameState.push(new ObjectCreator.Space({ X: 0.7, Y: 0.6, Width: 0.05, Height: 0.1, Label: 37, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [36, 38, 47, 27] }));
    GameState.push(new ObjectCreator.Space({ X: 0.8, Y: 0.6, Width: 0.05, Height: 0.1, Label: 38, acceptsArmy: false, acceptsFleet: true, isSupplyCenter: false, Connections: [37, 39, 48, 28] }));
    GameState.push(new ObjectCreator.Space({ X: 0.9, Y: 0.6, Width: 0.05, Height: 0.1, Label: 39, acceptsArmy: true, acceptsFleet: true, isSupplyCenter: false, Connections: [38, 49, 29] }));
    GameState.push(new ObjectCreator.Space({ X: 0, Y: 0.8, Width: 0.05, Height: 0.1, Label: 40, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [41, 30] }));
    GameState.push(new ObjectCreator.Space({ X: 0.1, Y: 0.8, Width: 0.05, Height: 0.1, Label: 41, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [40, 42, 31] }));
    GameState.push(new ObjectCreator.Space({ X: 0.2, Y: 0.8, Width: 0.05, Height: 0.1, Label: 42, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [41, 43, 32] }));
    GameState.push(new ObjectCreator.Space({ X: 0.3, Y: 0.8, Width: 0.05, Height: 0.1, Label: 43, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [42, 44, 33] }));
    GameState.push(new ObjectCreator.Space({ X: 0.4, Y: 0.8, Width: 0.05, Height: 0.1, Label: 44, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [43, 45, 34] }));
    GameState.push(new ObjectCreator.Space({ X: 0.5, Y: 0.8, Width: 0.05, Height: 0.1, Label: 45, acceptsArmy: false, acceptsFleet: false, isSupplyCenter: false, Connections: [44, 46, 35] }));
    GameState.push(new ObjectCreator.Space({ X: 0.6, Y: 0.8, Width: 0.05, Height: 0.1, Label: 46, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: true, Connections: [45, 47, 36] }));
    GameState.push(new ObjectCreator.Space({ X: 0.7, Y: 0.8, Width: 0.05, Height: 0.1, Label: 47, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [46, 48, 37] }));
    GameState.push(new ObjectCreator.Space({ X: 0.8, Y: 0.8, Width: 0.05, Height: 0.1, Label: 48, acceptsArmy: false, acceptsFleet: false, isSupplyCenter: false, Connections: [47, 49, 38] }));
    GameState.push(new ObjectCreator.Space({ X: 0.9, Y: 0.8, Width: 0.05, Height: 0.1, Label: 49, acceptsArmy: true, acceptsFleet: false, isSupplyCenter: false, Connections: [48, 39] }));

    return GameState;
};