//const GAMEHEIGHT = 800;
//const GAMEWIDTH = 800;
//class ragdoll extends Phaser.GameObjects.Sprite {
// cat 1 = laser
// cat 2 = ragdoll right? 
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: '#77919d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            debugShowJoint: true,
            debugJointColor: '#FF2929',
            gravity: {
                x: 0,
                y: 1
            }

        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin, // The plugin class
                key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
                mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var laser;
var head;
var cursors;
var nextlaserspawn = 5;
var lasers_arr = new Array(); //<----- laser array??
var body_bits_arr = new Array(); //<----- body bitz array??
function preload()

{
    this.load.image('bg', 'assests/background.jpg'); //head
    this.load.image('head', 'assests/head2.png'); //head
    this.load.image('body', 'assests/body.png'); //body
    this.load.image('leg', 'assests/leg.png'); //leg + arms


    this.load.image('laser', 'assests/testlaser.png'); // lasers
    this.load.audio('plop', ['assests/plop.wav', 'assests/plop.ogg']);
}


function create() //creating doll
{
    this.add.image(400, 400, 'bg')
    //this.matter.world.setBounds(-100, -100, 1250, 1250); //<--- setting world bounds 
    var music = this.sound.add('plop');
    head = this.matter.add.image(400, 150, 'head', null, {
        shape: 'circle',
        ignoreGravity: true
    });
    info = this.add.text(10, 10, '', {
        font: '20px Arial',
        fill: '#000000'
    });
    timer = this.time.addEvent({
        delay: 10000,
        callback: gameOver,
        callbackScope: this
    }); // mess with these values :P bc i dunno what they do exactly :I
    //--------------------------------RAGDOLL START--------------------------------------------------
    head.setFixedRotation();
    head.setMass(500);
    //--------------------------------UPPER HALF--------------------------------------------------
    //body
    var y = 150;
    var body = this.matter.add.image(400, y, 'body', null, {
        shape: 'circle',
        mass: 1
    });
    body.part = "body";
    var main = head;
    var crit = this.matter.add.constraint(main, body, 65, 1);
    body.setFixedRotation();
    //arm
    var arm = this.matter.add.image(400, 400, 'leg', null, {
        shape: 'circle',
        mass: 0.1
    });
    arm.part = "arm";
    var arm_to_body = this.matter.add.constraint(body, arm, 65, 1);
    arm.setFixedRotation();
    //larm
    var larm = this.matter.add.image(400, 400, 'leg', null, {
        shape: 'circle',
        mass: 0.1
    });
    larm.part = "larm";
    var arm_to_lower = this.matter.add.constraint(arm, larm, 65, 1);
    larm.setFixedRotation();
    //arm2
    var arm2 = this.matter.add.image(400, -400, 'leg', null, {
        shape: 'circle',
        mass: 0.1
    });
    arm2.part = "arm2";
    var arm2_to_body = this.matter.add.constraint(body, arm2, 65, 1);
    arm2.setFixedRotation();
    //larm2
    var larm2 = this.matter.add.image(400, -400, 'leg', null, {
        shape: 'circle',
        mass: 0.1
    });
    larm2.part = "larm2";
    var arm2_to_lower2 = this.matter.add.constraint(arm2, larm2, 65, 1);
    larm2.setFixedRotation();
    //--------------------------------LOWER HALF-------------------------------------------------- 
    //lower body
    var lowb = this.matter.add.image(400, y, 'body', null, {
        shape: 'circle',
        mass: 1
    });
    lowb.part = "lowb";
    var body_to_lower = this.matter.add.constraint(body, lowb, 65, 1);
    lowb.setFixedRotation();
    //leg
    var leg = this.matter.add.image(400, 400, 'leg', null, {
        shape: 'circle',
        mass: 1
    });
    leg.part = "leg";
    var leg_to_lowbody = this.matter.add.constraint(lowb, leg, 65, 1);
    leg.setFixedRotation();
    //lowleg
    var lowleg = this.matter.add.image(400, 400, 'leg', null, {
        shape: 'circle',
        mass: 1
    });
    lowleg.part = "lowleg";
    var leg_to_lowleg = this.matter.add.constraint(leg, lowleg, 65, 1);
    lowleg.setFixedRotation();
    //leg2
    var leg2 = this.matter.add.image(400, -400, 'leg', null, {
        shape: 'circle',
        mass: 1
    });
    leg2.part = "leg2";
    var leg2_to_lowbody = this.matter.add.constraint(lowb, leg2, 65, 1);
    leg2.setFixedRotation();
    //lowleg2
    var lowleg2 = this.matter.add.image(400, -400, 'leg', null, {
        shape: 'circle',
        mass: 1
    });
    lowleg2.part = "lowleg2";
    var leg2_to_lowleg2 = this.matter.add.constraint(leg2, lowleg2, 65, 1);
    lowleg2.setFixedRotation();
    // end of ragdoll
    for (var i = 0; i <= lasers_arr.length; i++) {
        var laser = lasers_arr[i];
    }
    //  body_bits_arr.push(body, lowb, arm, arm2, larm, larm2, leg, leg2, lowleg, lowleg2);
    //  var laser = this.matter.add.image(Phaser.Math.Between(0, 800), 0, 'laser', null, { name: 'laser', shape: 'circle', mass: 1});
    //    var laser2 = this.matter.add.image(Phaser.Math.Between(0, 800), 0, 'laser', null, { name: 'laser', shape: 'circle', mass: 1});
    //    var lasers_arr = [laser,laser2]; 
    //this.matter.add.mouseSpring();
    cursors = this.input.keyboard.createCursorKeys();
    //    update coll
    console.log(lasers_arr);

    //    this.matterCollision.addOnCollideStart({
    //        objectA: body_bits_arr,
    //        objectB: laser,
    //        //objectB: lasers_arr,// only works for one of the lasers the one from the start basically somethings need to b in the array fot it to werk idk 
    //        callback: eventData => {
    //          //   console.log("Something Else"); //<------- this is okay tho like huh  
    //            //
    //            //console.log(eventData.gameObjectA.texture.key); //<----- not likeing this like whyyyyyyy
    //            //console.log(gameObjectB.texture.key);
    ////                 if(eventData.gameObjectB  === 'laser')
    ////                 {    
    ////                  console.log("--------------LASER HERE-----------------")
    ////                 }
    //            //   console.log(gameObjectA);
    //
    //        }
    //    });
    this.matterCollision.addOnCollideActive({
        objectA: head,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            //console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------GAME OVER--------------");
                this.matter.world.removeConstraint(crit);
                text1 = this.add.text(150, 250, 'GAME OVER!', {
                    font: "64px Arial Black",
                    fill: '#ff0000'
                });
                music.play();
            };

        }

    });
    this.matterCollision.addOnCollideActive({
        objectA: arm,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY ARM--------------");
                this.matter.world.removeConstraint(arm_to_body);
                this.sound.play('plop');
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: arm2,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY ARM 2 --------------");
                this.matter.world.removeConstraint(arm2_to_body);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: larm,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LOWER ARM --------------");
                this.matter.world.removeConstraint(arm_to_lower);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: larm2,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LOWER ARM 2 --------------");
                this.matter.world.removeConstraint(arm2_to_lower2);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: lowb,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LOWER BODY --------------");
                this.matter.world.removeConstraint(body_to_lower);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: leg,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LEG --------------");
                this.matter.world.removeConstraint(leg_to_lowbody);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: leg2,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LEG 2 --------------");
                this.matter.world.removeConstraint(leg2_to_lowbody);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: lowleg,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LOWER LEG --------------");
                this.matter.world.removeConstraint(leg_to_lowleg);
                music.play();
            }
        }
    });
    this.matterCollision.addOnCollideActive({
        objectA: lowleg2,
        objectB: laser,
        callback: ({
            gameObjectA,
            gameObjectB
        }) => {
            // console.log(gameObjectA.texture.key);
            // console.log(gameObjectB.texture.key);
            if (gameObjectB.texture.key === 'laser') {
                console.log("---------------OW MY LOWER LEG 2 --------------");
                this.matter.world.removeConstraint(leg2_to_lowleg2);
                music.play();
            }
        }
    });




}

function update() // need to access lasers and look at every laser and see postion is at the bottom
{
    info.setText('\nTime: ' + Math.floor(0 + timer.getElapsed().toString().substr(0, 4)));

    if (cursors.left.isDown) {
        head.setVelocityX(-20);
    } else if (cursors.right.isDown) {
        head.setVelocityX(20);
    } else {
        head.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        head.setVelocityY(-20);
    } else if (cursors.down.isDown) {
        head.setVelocityY(20);
    } else {
        head.setVelocityY(0);
    }

    var coords = {}; //empty object
    if (this.time.now > nextlaserspawn) {
        console.log("next laser spawn");
        for (var i = 0; i < 5; i++) { // create new laser
            //  var coords = {}; //empty object
            var laser = this.matter.add.image(Phaser.Math.Between(0, 800), 0, 'laser', null, {
                name: 'laser',
                shape: 'circle',
                mass: 1
            });
            laser.setVelocityY(20);
            lasers_arr.push(laser);
            // console.log(lasers_arr[i].getBottomCenter(coords));
            lasers_arr[i].getBottomCenter(coords);
            console.log(lasers_arr.length);
        };
        nextlaserspawn = this.time.now + 4000;


    }
    //   new for loop for checking the coords
    for (var i = 0; i <= lasers_arr.length; i++) {
        //        /* when laser hits the bottom of the screen between 800  AND 1000 then destroy itself?  i dunno */

        if (coords.y >= 800) {
            var bad_laser = lasers_arr.splice(0, lasers_arr.length);
            console.log(bad_laser);
            //this.bad_laser.destroy(true);
            console.log("--------------LASERS DESTROY------------");
            console.log(lasers_arr.length);
        };

    }


    //updateColl();       
}

function gameOver() {
    text1 = this.add.text(250, 350, 'TIMES UP!', {
        font: "64px Arial Black",
        fill: '#00ffff'
    });
    //    text2 = this.add.text(450, 450, 'press r to restart', {
    //        font: "10px Arial Black",
    //        fill: '#00ffff'
    //    });

    cursors.enabled = false;
}

//function updateColl() {
//    body_bits_arr.forEach(function (element) { // console.log(element);
//        for (let i = 0; i < body_bits_arr.length; i++) {
//            //console.log("YASSS");
//            // switch staement
//            // console.log(body_bits_arr[i]);
//            var x = body_bits_arr[i].texture.key;
//            console.log(x);
//            switch (x) {
//                case "body":
//                    console.log("YASSS");
//                    break;
//                case "arm":
//                    console.log("YASSSSSS QUEEEEEN");
//                    break;
//                default:
//                    console.log("other");
//            }
//        }
//    })
//}
//       this.scene.restart();
//eventData.gameObjectA.part
//https://freesound.org/people/MiSchy/sounds/369952/ <---- where the sound is from
//https://www.joshmorony.com/how-to-create-an-accurate-timer-for-phaser-games/ <--- timer?? dunno if p2 or p3
//<--- change list of items = change collision list = stop listening and now listen to current list happens when i change lasers
//body_bits_arr.forEach() <---- maybe try this for list 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach <----- for each array func??
// https://www.emanueleferonato.com/2019/03/05/understanding-how-matter-js-constraints-work-with-phaser/ <--- removing constraints :P
//https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Factory.html <--- matter doc on phaser 
//https://github.com/mikewesthad/phaser-matter-collision-plugin <--- phaser collision plugin
//https://photonstorm.github.io/phaser3-docs/Phaser.Utils.Array.html#.Remove__anchor <--- removing objects from the array
