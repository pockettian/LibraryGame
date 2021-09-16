/**********************/
// main game
/**********************/
class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame')
  }

  /*********************/
  // Phaser preload
  /*********************/
  preload() {

    // load board assets
    this.load.image("LibItem_0", 'Assets/Art/MatchSprites/Library_Item_0.png');
    this.load.image("LibItem_1", 'Assets/Art/MatchSprites/Library_Item_1.png');
    this.load.image("LibItem_2", 'Assets/Art/MatchSprites/Library_Item_2.png');
    this.load.image("LibItem_3", 'Assets/Art/MatchSprites/Library_Item_3.png');
    this.load.image("LibItem_4", 'Assets/Art/MatchSprites/Library_Item_4.png');
    this.load.image("LibItem_5", 'Assets/Art/MatchSprites/Library_Item_5.png');
    this.load.image("LibItem_6", 'Assets/Art/MatchSprites/Library_Item_6.png');
    this.load.image("LibItem_7", 'Assets/Art/MatchSprites/Library_Item_7.png');

    this.load.image("LibPlace_0", 'Assets/Art/MatchSprites/Library_Place_0.png');
    this.load.image("LibPlace_1", 'Assets/Art/MatchSprites/Library_Place_1.png');
    this.load.image("LibPlace_2", 'Assets/Art/MatchSprites/Library_Place_2.png');
    this.load.image("LibPlace_3", 'Assets/Art/MatchSprites/Library_Place_3.png');
    this.load.image("LibPlace_4", 'Assets/Art/MatchSprites/Library_Place_4.png');
    this.load.image("LibPlace_5", 'Assets/Art/MatchSprites/Library_Place_5.png');

    // load customers
    this.load.image("Customer_0",       'Assets/Art/Customers/Customer_0.png');
    this.load.image("Customer_Happy_0", 'Assets/Art/Customers/Customer_Happy_0.png');
    this.load.image("Customer_Angry_0", 'Assets/Art/Customers/Customer_Angry_0.png');

    this.load.image("Customer_1",       'Assets/Art/Customers/Customer_1.png');
    this.load.image("Customer_Happy_1", 'Assets/Art/Customers/Customer_Happy_1.png');
    this.load.image("Customer_Angry_1", 'Assets/Art/Customers/Customer_Angry_1.png');

    this.load.image("Customer_2",       'Assets/Art/Customers/Customer_2.png');
    this.load.image("Customer_Happy_2", 'Assets/Art/Customers/Customer_Happy_2.png');
    this.load.image("Customer_Angry_2", 'Assets/Art/Customers/Customer_Angry_2.png');

    this.load.image("Customer_3",       'Assets/Art/Customers/Customer_3.png');
    this.load.image("Customer_Happy_3", 'Assets/Art/Customers/Customer_Happy_3.png');
    this.load.image("Customer_Angry_3", 'Assets/Art/Customers/Customer_Angry_3.png');

    this.load.image("Customer_4",       'Assets/Art/Customers/Customer_4.png');
    this.load.image("Customer_Happy_4", 'Assets/Art/Customers/Customer_Happy_4.png');
    this.load.image("Customer_Angry_4", 'Assets/Art/Customers/Customer_Angry_4.png');

    this.load.image("Customer_5",       'Assets/Art/Customers/Customer_5.png');
    this.load.image("Customer_Happy_5", 'Assets/Art/Customers/Customer_Happy_5.png');
    this.load.image("Customer_Angry_5", 'Assets/Art/Customers/Customer_Angry_5.png');

    this.load.image("Customer_6",       'Assets/Art/Customers/Customer_6.png');
    this.load.image("Customer_Happy_6", 'Assets/Art/Customers/Customer_Happy_6.png');
    this.load.image("Customer_Angry_6", 'Assets/Art/Customers/Customer_Angry_6.png');

    this.load.image("CrossIcon", 'Assets/Art/UI/CrossX.png');

    this.load.image("WhiteBG", 'Assets/Art/UI/WhiteBG.png');

  }
  
  /*********************/
  // Phaser create
  /*********************/
  create() {

    this.MaxLibItemCount = 7;
    this.MaxLibPlaceCount = 5;
    
    // BG
    this.cameras.main.setBackgroundColor(0xECECC4);
        
    // where the customer ends up
    this.CreateDropZone();

    this.dragResponseHandler();

    this.CreateGhostDragItem();

    this.CreateBoard();

    this.CreateCustomerTemplate();

    this.CustomerEnterScene();

    this.CrossIcon = this.add.image(config.width * 0.5, config.height * 0.5, "CrossIcon");
    this.CrossIcon.setScale(0.2);
    this.CrossIcon.setVisible(false);

    // input blocker hack ?
    this.WhiteBG = this.add.image(config.width * 0.5, config.height * 0.5, "WhiteBG");
    this.WhiteBG.setScale(50);
    this.WhiteBG.setVisible(false);
    this.WhiteBG.setInteractive();
    this.WhiteBG.setAlpha(0.01);

    // // create confirm btn
    // this.ConfirmBtn = this.add.image(config.width * 0.5, config.height * 0.5, "ConfirmBtn");
    // this.ConfirmBtn.setVisible(false);
    // this.ConfirmBtn.on('pointerdown', this.buttonAnimEffect.bind(this, this.ConfirmBtn, function(){
    //   self.ConfirmBingoSelection();
    //   }));
  }
  
  /*********************/
  // Respond to drag events
  /*********************/
  dragResponseHandler() {

    var ownerScene = this;

    // drag update
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

      // set the ghost drag item's size etc etc
      ownerScene.draggedItem.displayWidth = gameObject.displayWidth;
      ownerScene.draggedItem.scaleY = ownerScene.draggedItem.scaleX;
      ownerScene.draggedItem.setTexture(gameObject.textureName);

      ownerScene.draggedItem.setVisible(true);
      ownerScene.draggedItem.x = dragX;
      ownerScene.draggedItem.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject, dragX, dragY) {
      ownerScene.draggedItem.setVisible(false);
      ownerScene.ToggleBoardInteractive(true);
    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {

      ownerScene.ToggleBoardInteractive(false);

      // check if the drop is valid
      if (gameObject.gameID == ownerScene.Customer.RequestID) {

        ownerScene.CustomerExitScene();
      }
      // incorrect drop
      else {

        ownerScene.CrossIcon.x = ownerScene.Customer.x;
        ownerScene.CrossIcon.y = ownerScene.Customer.y;

        ownerScene.CrossIcon.setVisible(true);
        ownerScene.Customer.setTexture("Customer_Angry_" + ownerScene.Customer.CustomerID);

        // reset after showing incorrect drop response
        var timer = ownerScene.time.addEvent({
          delay: 500,               
          callback: function()
          {
            // reset
            ownerScene.CrossIcon.setVisible(false);
            ownerScene.Customer.setTexture("Customer_" + ownerScene.Customer.CustomerID);
            ownerScene.ToggleBoardInteractive(true);
          }
      });

      }
    });

  }

  /*********************/
  // Create the grid cells
  /*********************/
  CreateBoard(){

    var ownerScene = this;
   
    this.GridCells = [];

    // create board
    let startCellPosX = 100;
    let startCellPosY = 100;
    let maxItems = this.MaxLibItemCount + this.MaxLibPlaceCount;

    let gapX = 130;
    let gapY = 130;
    let maxCol = 3;

    let colIndex = 0;
    let rowIndex = 0;

    let itemNameIndex = 0;

    // default
    let spawnItemName = "LibItem_";

    for(let itemIndex = 0; itemIndex < maxItems; ++itemIndex)
    {
      // set cell Position
      let currCellPosX = startCellPosX + colIndex * gapX;
      let currCellPosY = startCellPosY + rowIndex * gapY;

      // image name
      if (itemIndex == this.MaxLibItemCount) {
        itemNameIndex = 0;
        spawnItemName = "LibPlace_";
      }

      let textureName = spawnItemName + itemNameIndex;

      // Set parameters
      let libItem = this.add.image(currCellPosX, currCellPosY, textureName);

      libItem.displayWidth = 110;
      libItem.scaleY = libItem.scaleX;
      libItem.setInteractive();
      libItem.gameID = itemIndex;
      libItem.textureName = textureName;

      // cache this
      this.GridCells.push(libItem);

      this.input.setDraggable(libItem);

      libItem.on('dragstart', this.buttonAnimEffect.bind(this, libItem, function () {
        console.log("drag start");
        ownerScene.ToggleBoardInteractive(false);
      }));

      // check bounds
      if (colIndex + 1 == maxCol) {
        colIndex = 0;
        ++rowIndex;
      }
      else {
        ++colIndex;
      }
      
      ++itemNameIndex;
    }
  }

  /*********************/
  // Create customer drop zone
  /*********************/
  ToggleBoardInteractive(flag) {

    this.WhiteBG.setVisible(!flag);

    this.GridCells.forEach(function (element) {
      element.setInteractive(flag);

      if (flag) {
        element.setTint(0xFFFFFF);
        element.setAlpha(1.0);
      }
      else {
        element.setTint(0xBEBEBE);
        element.setAlpha(0.7);
      }
    });
  }

  /*********************/
  // Create customer drop zone
  /*********************/
  CreateDropZone() {
    
    var zone = this.add.zone(500, 300, 200, 200).setDropZone();

    //  Just a visual display of the drop zone
    var graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeRect(zone.x + zone.input.hitArea.x, 
                        zone.y + zone.input.hitArea.y, 
                        zone.input.hitArea.width * 0.5, 
                        zone.input.hitArea.height * 0.5);
  }

  /*********************/
  // create a ghost draggable item
  /*********************/
  CreateGhostDragItem()
  {
    this.draggedItem = this.add.image(0, 0, "LibPlace_0");
    this.draggedItem.setVisible(false);
  }

  /*********************/
  // create customer object
  /*********************/
  CreateCustomerTemplate()
  {
    this.Customer = this.add.image(0, 0, "Customer_0");
    this.Customer.setScale(0.7, 0.7);
    this.Customer.setVisible(false);
  }

  /*********************/
  // Customer Enters Scene
  /*********************/
  CustomerEnterScene()
  {
    this.Customer.setVisible(true);

    var maxCustomers = 7;

    // randomly reskin the customer
    this.Customer.CustomerID = Phaser.Math.Between(0, maxCustomers - 1);
    var textureName = "Customer_" + this.Customer.CustomerID;

    console.log(textureName);

    this.Customer.setTexture(textureName);

    // set initial pos
    this.Customer.x = config.width * 0.7;
    this.Customer.y = config.height;

    var maxRequestNumber = this.MaxLibItemCount + this.MaxLibPlaceCount;

    // randomly generate a request
    this.Customer.RequestID = Phaser.Math.Between(0, maxRequestNumber - 1);
    //console.log(" I want " + this.Customer.RequestID);

    this.tweens.add({
      targets: this.Customer,
      duration: 1100,
      y:  config.height * 0.7,
      ease: 'Power2',
      onComplete: function()
      {
      }
    });
  }

  /*********************/
  // Customer Exit Scene
  /*********************/
  CustomerExitScene()
  {
    console.log("CustomerExitScene");

    var ownerScene = this;

    this.tweens.add({
      targets: this.Customer,
      duration: 1100,
      y:  config.height,
      ease: 'Power2',
      onComplete: function()
      {
        console.log("I am done exiting");
        ownerScene.CustomerEnterScene();
      }
    });
  }
 
  /*********************/
  // Helper to enable/disable btn interactable
  /*********************/
  ToggleBtnState(btn, flag) {
    if (flag) {
      btn.setTint(0xffffff);
      btn.setInteractive();
    }
    else {
      btn.setTint(0x969696);
      btn.disableInteractive();
    }
  }

  /***************************/
  // Generic Btn Click Effect
  /***************************/
  buttonAnimEffect(img, callback) {
    this.tweens.add({
      targets: img,
      scaleX: img.scaleY * 1.2,
      scaleY: img.scaleX * 1.2,
      duration: 80,
      onComplete: callback,
      yoyo: true
    });

    //this.sound.play('ButtonClick_SFX');
  }

  /***************************/
  // Game Over
  /***************************/
  OnGameOver() {
  }
}

//////////////////
// Configurations
/////////////////
var config =
{
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  scene: [MainGame]
};

var game = new Phaser.Game(config);
game.scene.start('MainGame');


