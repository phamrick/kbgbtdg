var dice = (function() {

	var ToggleArrow = function(iImageName)
	{
		var arrowImg = document.getElementById(iImageName);

		if (arrowImg.style.visibility !== 'hidden')
		{
			arrowImg.style.visibility = 'hidden';
		} else {
			arrowImg.style.visibility = 'visible';
		}
	}

	var SetDiceUIbehavior = function()
	{
		$(document).ready(function(){

			dice.SetDiceToggles();

			$('.die-reroll-img').click(dice.RollDice);

		});
	}

	var ToggleArrowEvt = function(e) {
		var dieSideImg = e.target;
		var divToggle = dieSideImg.parentNode.parentNode;

		var imgName = divToggle.id + '-reroll-img';

		appsocket.EmitToggleDie(imgName);

		ToggleArrow(imgName);
	}

	var SetDiceToggles = function() {

		$('.die-toggle').each(function( index, divDieToggle ){

			if(isMobile) 
				divDieToggle.addEventListener('touchstart', ToggleArrowEvt);
			else 
				divDieToggle.addEventListener('click', ToggleArrowEvt);
		});
	}

	var RollDice = function () {

		const dice = [...document.querySelectorAll(".die-list")];
		var index = 0;
		var rolldict = {};

		dice.forEach(die => {
			var randNo = GetRandomNumber(1, 6);

			var imgName = die.id + '-reroll-img';
			var arrowImg = document.getElementById(imgName);
			if (arrowImg.style.visibility === "visible" || arrowImg.style.visibility === "")
				rolldict[index] = randNo;
			index++;
		});
		
		RollDiceDict(rolldict);
		appsocket.EmitRollDice(rolldict);
	}

	var RollDiceDict = function (iDict)
	{
		for(var key in iDict)
		{
			RollDie(key, iDict[key]);
		}
	}

	var RollDie = function(dieIndex, iRandomNo)
	{
		var x = document.getElementById("audio_roll_dice");  
		x.play(); 
		
		const dice = [...document.querySelectorAll(".die-list")];
		var die = dice[dieIndex];
		ToggleClasses(die);
		die.dataset.roll = iRandomNo;
		var rerollImg = document.querySelector("#" + die.getAttribute('id') + "-reroll-img");
		rerollImg.style.visibility  = 'hidden';
	}

	var ToggleClasses = function(die) {
		die.classList.toggle("odd-roll");
		die.classList.toggle("even-roll");
	}

	var GetRandomNumber = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {
		RollDice: RollDice,
		RollDiceDict: RollDiceDict,
		SetDiceToggles: SetDiceToggles,
		ToggleArrow: ToggleArrow,
		SetDiceUIbehavior: SetDiceUIbehavior
	}

})();