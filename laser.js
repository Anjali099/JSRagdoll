var nextlaserspawn = 5;
class Laser extends Phaser.Physics.Matter.Sprite {
    constructor(scene) {
        super(scene, xPos, yPos, "laser");
        // had to do this to create a physics body
        scene.physics.add.existing(this);
        //set up the physics properties
        this.setCollideWorldBounds(true);
        //add the walking animations
        scene.anims.create({

//timers look at moonflyer game

//          if(this.time.now > nextlaserspawn)
//   { 
//       console.log("next laser spawn");
//    for(var i=0;i<5;i++)
//        { 
//            var lasers = this.matter.add.image(Phaser.Math.Between(0, 700), 0, 'laser', null, { shape: 'circle', mass: 1});
//        };
//         nextlaserspawn = this.time.now + 5000;
//   }
}
)
}
}