

var appsocket = (function() {

    var socket = io();

    var SetOnUserConnected = function()
    {
        socket.on('userconnected', function(data){

            var username = data.username;
            var socketid = data.socketid;
            
            var userDiv = appui.CreateDiv('userbox', username, username, document.body, null);

            appui.SetElementDraggable(userDiv);

            main.AddConnectedUser(username, socketid);
        });
    }

    var SetOnAssignRole = function()
    {
        socket.on('assignrole', function(data){

            var role = data.role;
            var char = data.char;
            appkonvas.InstantiateImg(role, 10, 10, true, true);
            appkonvas.InstantiateImg(char, 110, 10, true, true);
        });
    }
    
    var SetOnInstantiateHostCards = function()
    {
        socket.on('instantiatehostcards', function(data){
            for (var i = 0, len = data.length; i < len; i++) {
                appkonvas.InstantiateImg(data[i], 10, 10, true, true);
            }
        });
    }

	var SetOnRollDice = function()
    {
		socket.on('rolldice', function(data){
			dice.RollDiceDict(data);
		});
    }

	var SetOnToggleDie = function()
    {
		socket.on('toggledie', function(data){
			dice.ToggleArrow(data);
		});
    }

    var EmitUserConnected = function(iUsername)
    {
        socket.emit('userconnected', iUsername);
    }

    var EmitAssignRoles = function()
    {
        socket.emit('assignroles', main.connectedusers);
    }
	
	var EmitRollDice = function(iRollDict)
    {
        socket.emit('rolldice', iRollDict);
    }

	var EmitToggleDie = function(iDieArrowImgName)
    {
        socket.emit('toggledie', iDieArrowImgName);
    }

    return {
        SetOnUserConnected: SetOnUserConnected,
        EmitUserConnected: EmitUserConnected,
        SetOnAssignRole: SetOnAssignRole,
        EmitAssignRoles: EmitAssignRoles,
		EmitRollDice: EmitRollDice,
        SetOnRollDice: SetOnRollDice,
        SetOnInstantiateHostCards: SetOnInstantiateHostCards,
        EmitToggleDie: EmitToggleDie,
        SetOnToggleDie: SetOnToggleDie
      };

})();
