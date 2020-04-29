var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('images'))
app.use(express.static('js'))
app.use(express.static('styles'))
app.use(express.static('html'))
app.use(express.static('sound'))

var char_cards = {
	"char_willy_the_kid": "char_willy_the_kid",
	"char_black_jack": "char_black_jack",
	"char_calamity_janet": "char_calamity_janet",
	"char_el_gringo": "char_el_gringo",
	"char_jesse_jones": "char_jesse_jones",
	"char_jourdonnais": "char_jourdonnais",
	"char_kit_carlson": "char_kit_carlson",
	"char_lucky_duke": "char_lucky_duke",
	"char_paul_regret": "char_paul_regret",
	"char_pedro_ramirez": "char_pedro_ramirez",
	"char_rose_doolan": "char_rose_doolan",
	"char_sid_ketchum": "char_sid_ketchum",
	"char_slab_the_killer": "char_slab_the_killer",
	"char_suzy_lafayette": "char_suzy_lafayette",
	"char_vulture_sam": "char_vulture_sam"
}

var role_cards_one_each  = {
	card_role_sheriff: 'card_role_sheriff',
	card_role_deputy_: 'card_role_deputy',
	card_role_outlaw: 'card_role_outlaw',
	card_role_renegade: 'card_role_renegade'
}

var role_cards_four_players = { 

	card_role_sheriff: 'card_role_sheriff',
	card_role_outlaw_01: 'card_role_outlaw',
	card_role_outlaw_02: 'card_role_outlaw',
	card_role_renegade_01: 'card_role_renegade'
}

var role_cards_five_players = { 

	card_role_sheriff: 'card_role_sheriff',
	card_role_deputy_01: 'card_role_deputy',
	card_role_outlaw_01: 'card_role_outlaw',
	card_role_outlaw_02: 'card_role_outlaw',
	card_role_renegade_01: 'card_role_renegade'
}

var role_cards_six_players = { 

	card_role_sheriff: 'card_role_sheriff',
	card_role_deputy_01: 'card_role_deputy',
	card_role_outlaw_01: 'card_role_outlaw',
	card_role_outlaw_02: 'card_role_outlaw',
	card_role_outlaw_03: 'card_role_outlaw',
	card_role_renegade_01: 'card_role_renegade'
}

var role_cards_seven_players = { 

	card_role_sheriff: 'card_role_sheriff',
	card_role_deputy_01: 'card_role_deputy',
	card_role_deputy_02: 'card_role_deputy',
	card_role_outlaw_01: 'card_role_outlaw',
	card_role_outlaw_02: 'card_role_outlaw',
	card_role_outlaw_03: 'card_role_outlaw',
	card_role_renegade_01: 'card_role_renegade'
}

var role_cards_eight_players = { 

	card_role_sheriff: 'card_role_sheriff',
	card_role_deputy_01: 'card_role_deputy',
	card_role_deputy_02: 'card_role_deputy',
	card_role_outlaw_01: 'card_role_outlaw',
	card_role_outlaw_02: 'card_role_outlaw',
	card_role_outlaw_03: 'card_role_outlaw',
	card_role_renegade_01: 'card_role_renegade',
	card_role_renegade_02: 'card_role_renegade'
}

var connections = {};

io.on('connection', function(socket){
	
	if(!(socket.id in connections))
	{
		connections[socket.id] = socket;
		console.log('new connection socket.id: ' + socket.id);
	}

	socket.on('assignroles', function(data){

		var connectedusers = data;
		
		var numPlayers = Object.keys(connectedusers).length;

		console.log('assignroles numPlayers: ' + numPlayers);

		var roleCards = Object.assign({},role_cards_four_players);

		if(numPlayers === 4)
		{
			//role_cards = Object.assign({},role_cards_four_players);
		} else if(numPlayers === 5) 
		{
			roleCards = Object.assign({},role_cards_five_players);
		} else if(numPlayers === 6) 
		{
			roleCards = Object.assign({},role_cards_six_players);
		} else if(numPlayers === 7) 
		{
			roleCards = Object.assign({},role_cards_seven_players);
		} else if(numPlayers === 8) 
		{
			roleCards = Object.assign({},role_cards_eight_players);
		}

		var charsUsed = {};
		var rolesUsed = {};

		var charCardsCopy = Object.assign({}, char_cards);

		var usersCopy = Object.assign({}, connectedusers);
		var keysUsers = Object.keys(usersCopy);
		var randUserKey = keysUsers[Math.floor(Math.random() * keysUsers.length)];

		var keysCharacters = Object.keys(charCardsCopy);
		var randomCharKey = keysCharacters[Math.floor(Math.random() * keysCharacters.length)];

		charsUsed[randomCharKey] = randomCharKey;
		rolesUsed['card_role_sheriff'] = 'card_role_sheriff';

		var socketidSheriff = usersCopy[randUserKey];

		connections[socketidSheriff].emit('assignrole', { role: roleCards['card_role_sheriff'], char: charCardsCopy[randomCharKey]});

		delete roleCards['card_role_sheriff'];
		delete charCardsCopy[randomCharKey];
		delete usersCopy[randUserKey];


		for(var username in usersCopy)
		{
			var keysCards = Object.keys(roleCards);
			var randomRoleKey = keysCards[Math.floor(Math.random() * keysCards.length)];
			
			keysCharacters = Object.keys(charCardsCopy);
			randomCharKey = keysCharacters[Math.floor(Math.random() * keysCharacters.length)];

			charsUsed[randomCharKey] = randomCharKey;
			rolesUsed[randomRoleKey] = roleCards[randomRoleKey];

			var socketid = usersCopy[username];

			connections[socketid].emit('assignrole', { role: roleCards[randomRoleKey], char: charCardsCopy[randomCharKey]});

			delete roleCards[randomRoleKey];
			delete charCardsCopy[randomCharKey];

		}

		var hostCards = Object.keys(charsUsed);

		socket.emit('instantiatehostcards', hostCards);
	});
	
	socket.on('rolldice', function(data) {
		socket.broadcast.emit('rolldice', data);
	});
	
	socket.on('toggledie', function(data) {
		socket.broadcast.emit('toggledie', data);
	});

	socket.on('userconnected', function(data) {
		console.log(data);
		socket.broadcast.emit('userconnected', {username: data, socketid: socket.id});
	});

});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
