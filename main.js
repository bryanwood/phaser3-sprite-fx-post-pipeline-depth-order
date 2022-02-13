import { SwirlSpriteFX } from "./swirl.js";
import { HueRotatePostFX } from "./hue.js";

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("player", "./player.png");
    this.load.image("frame", "./frame.png");
  }

  create() {
    this.swirlSpriteFX = this.renderer.pipelines.add(
      "swirlSpriteFX",
      new SwirlSpriteFX(this.game)
    );

    this.frame = this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "frame")
      .setDepth(1);

    this.player = this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "player")
      .setFXPadding(32)
      .setDepth(2);

    this.cameras.main.setPostPipeline(HueRotatePostFX);

    this.input.on(Phaser.Input.Events.POINTER_UP, this.toggle, this);

    this.text = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY - 128, "_", {
        align: "center",
      })
      .setOrigin(0.5);

    this.toggle();

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 256,
        "The player is set to depth 2 and the frame is set to depth 1\nWhen SpriteFX and Camera PostFX are used together the rendering order changes.\nClick to toggle between the different states",
        { align: "center" }
      )
      .setOrigin(0.5);
  }

  enterA() {
    this.state = "a";
    this.cameras.main.resetPostPipeline();
    this.player.resetPipeline();
    this.text.text = "No SpriteFX & No Camera PostFX";
  }

  enterB() {
    this.state = "b";
    this.player.setPipeline(this.swirlSpriteFX);
    this.text.text = "Has SpriteFX & No Camera PostFX";
  }
  enterC() {
    this.state = "c";
    this.player.setPipeline(this.swirlSpriteFX);
    this.cameras.main.setPostPipeline(HueRotatePostFX);
    this.text.text = "Has SpriteFX & Has Camera PostFX";
  }

  enterD() {
    this.state = "d";
    this.player.resetPipeline(this.swirlSpriteFX);
    this.cameras.main.setPostPipeline(HueRotatePostFX);
    this.text.text = "No SpriteFX & Has Camera PostFX";
  }

  toggle() {
    switch (this.state) {
      case "a":
        this.enterB();
        break;
      case "b":
        this.enterC();
        break;
      case "c":
        this.enterD();
        break;
      case "d":
        this.enterA();
        break;
      default:
        this.enterA();
        break;
    }
  }
}

new Phaser.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: false,

  scene: [MainScene],
  pipeline: [HueRotatePostFX],
});
