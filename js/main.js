
var main = (function() {
 
	var images = {};
	var connectedusers = {};
	var isMobile = false;

	var LoadImages = function(iJsonConfig) {

		var loadedImages = 0;
		var numImages = 0;
		var imgSources = iJsonConfig.imgSources;

		var allSources = {};

		for(var keySrc in imgSources)
		{
			var subSource = imgSources[keySrc];
			Object.assign(allSources, subSource);
		}

		for (var keySrc in allSources) {
			numImages++;
		}

		for (var keySrc in allSources) {
			images[keySrc] = new Image();
			images[keySrc].onload = function() {
				loadedImages++;
				console.log('loadedImages: ' + loadedImages.toString());
				if (loadedImages >= numImages) {
					appkonvas.CreateStage();

					if(isHost === true)
					{
						appkonvas.CreatePieces(iJsonConfig.pieces_tokens);
						//appkonvas.CreatePieces(iJsonConfig.cards_roles_examples);
						appsocket.SetOnInstantiateHostCards();
					}

					$(document).ready(dice.SetDiceToggles());
					appsocket.SetOnToggleDie();
					dice.SetDiceShiftOnMobile();
				}
			};

			images[keySrc].src = allSources[keySrc];
		}
	}

	var LoadJSON = function (callbackLoadImgs) {

		// read in the json configuration file
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', 'appconfig.json', true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callbackLoadImgs(JSON.parse(xobj.responseText));
			}
		};

		xobj.send(null);  
	}

	var StartApp = function()
	{
		LoadJSON(LoadImages);
	}

	var AddConnectedUser = function(iUsername, iSocketid)
	{
		connectedusers[iUsername] = iSocketid;
	}

    return {
		images: images,
		connectedusers: connectedusers,
		isMobile: isMobile,
		StartApp: StartApp,
		AddConnectedUser: AddConnectedUser
	};

})(); 