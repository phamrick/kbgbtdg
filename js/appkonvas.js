// outside libraries used: konvas
// other modules used: main.js


var appkonvas = (function() {
 
  var layerMap;
  var layerPieces;
  var stage;
  var objectID = 0;

  var CreateStage =  function()
  {
    stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    });

    layerMap = new Konva.Layer();
    layerPieces = new Konva.Layer();
    
    stage.add(layerMap);
    stage.add(layerPieces);
    
    //stage.scale({ x: xscale, y: xscale });
    
    layerMap.draw();
    layerPieces.draw();

  }

  var EvtDragStart = function(e) {
		
    var draggedObj = e.target;
    draggedObj.moveToTop();
    draggedObj.getLayer().draw();
  };

  var EvtNodeTopMostAndSelected = function(e) {
					
    var oNode = e.target;
    oNode.moveToTop();
    oNode.getLayer().draw();
  };

  var InstantiateImg = function (iImgKey, iX, iY, iDraggable, iDrawLayer)
  {
    objectID++;

    var oKimg = new Konva.Image({
      image: main.images[iImgKey],
      x: parseInt(iX),
      y: parseInt(iY),
      id: objectID.toString(),
      draggable: iDraggable
    });

    layerPieces.add(oKimg);

    if (iDraggable)
    {
       oKimg.on('click', EvtNodeTopMostAndSelected);
       oKimg.on('dragstart', EvtDragStart);

      //  oKimg.on('dragmove', function(e) {
      //    var oNode = e.target;
      //    socket.emit('dragKnode', { nodeID: oNode.id(),
      //                                x: oNode.x(),
      //                                y: oNode.y()}
      //    );
      //  });
     }

     if (iDrawLayer === true)
     {
      layerPieces.draw();
     }
  }

  var CreatePieces = function(iPiecesConfig)
  {
    for(var piecesKey in iPiecesConfig)
    {
      var pieceVal = iPiecesConfig[piecesKey];
      var srcKey = pieceVal.srcKey;
      var insts = pieceVal.instances;

      var index = 0; 
      while (index < insts.length) { 
        var inst = insts[index];
        InstantiateImg(srcKey, inst.x, inst.y, true, false);
        index++; 
      }

      var instsRepeat = pieceVal.instancerepeated;
      var count = parseInt(instsRepeat.count);

      index = 0;
      while (index < count) { 
        InstantiateImg(srcKey, instsRepeat.x, instsRepeat.y, true, false);
        index++; 
      }

    }

    layerPieces.draw();
  }

  var CreateBackground = function()
  {
    var imgBg = main.images['background'];
    var oKimg = new Konva.Image({
      image: imgBg,
      x: 0,
      y: 0
    });

    layerMap.add(oKimg);

    layerMap.scale({x: screen.width/imgBg.width, y: screen.height/imgBg.height});

    layerMap.draw();
    stage.draw();
  }

  return {
    CreateStage: CreateStage,
    CreatePieces: CreatePieces,
    InstantiateImg: InstantiateImg,
    CreateBackground: CreateBackground
  };

})();
