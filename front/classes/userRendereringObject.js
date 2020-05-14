const PIXI = typeof window !== 'undefined' ? require('pixi.js') : {};

const EasingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInQuint: t => t * t * t * t * t,
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
};

export default class UserRenderingObject {
    constructor(data) {
        this.position = data.position;
        this.width = 0;
        this.height = 0;
        this.easingValue = Math.round(Math.random() * 1000);
        this.container = new PIXI.Container();

        const texture = PIXI.Texture.from(`/game/${data.character}.png`);
        this.character = new PIXI.Sprite(texture);
        this.character.width = 50;
        this.character.height = 50;
        this.character.x = -25;
        this.character.y = -50;

        this.shadow = new PIXI.Graphics();
        this.shadow.beginFill(0x000000);
        this.shadow.drawEllipse(0, -3, 22, 4);
        this.shadow.endFill();
        this.shadow.alpha = 0.5;

        this.nametagContainer = new PIXI.Container();
        this.nametag = new PIXI.Text(data.name, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.nametag.anchor.x = 0.5;
        this.nametagContainer.y = this.character.y - 20;

        const nametagBackground = new PIXI.Graphics();
        nametagBackground.beginFill(0x000000);
        nametagBackground.drawRect(-(this.nametag.width + 4) / 2, -1, this.nametag.width + 4, this.nametag.height + 2);
        nametagBackground.endFill();
        nametagBackground.alpha = 0.5;

        this.nametagContainer.addChild(nametagBackground);
        this.nametagContainer.addChild(this.nametag);

        this.container.addChild(this.shadow);
        this.container.addChild(this.character);
        this.container.addChild(this.nametagContainer);


        const effectImages = [];
        for (let i = 1; i <= 27; i++) {
            effectImages.push(`/game/effects/correct/sprite_${i}.png`);
        }
        const effectTextures = effectImages.map(image => PIXI.Texture.from(image));
        this.effectSprite = new PIXI.AnimatedSprite(effectTextures);
        this.effectSprite.blendMode = PIXI.BLEND_MODES.ADD;
        this.effectSprite.scale.x = 2;
        this.effectSprite.scale.y = 2;
        this.effectSprite.loop = false;
        this.effectSprite.visible = false;
        this.effectSprite.animationSpeed = 0.5;
        this.container.addChild(this.effectSprite);
        this.lastScore = data.score;
    }

    render(data) {
        const JUMP_HEIGHT = 50;
        this.position = data.renderPosition;
        this.container.x = this.position.x;
        this.container.y = this.position.y;

        this.easingValue += 34;
        if (this.easingValue >= 2000) {
            this.easingValue = this.easingValue % 2000;
        }

        const t = (this.easingValue >= 1000 ? 2000 - this.easingValue : this.easingValue) / 1000;
        this.character.y = -50 + (-JUMP_HEIGHT * EasingFunctions.easeOutQuad(t));
        this.nametagContainer.y = this.character.y - 22;
        this.container.zIndex = Math.round(this.position.y);
        this.effectSprite.x = this.character.x - 56;
        this.effectSprite.y = this.character.y - 34;

        if (this.lastScore !== data.score) {
            this.lastScore = data.score;
            this.effectSprite.visible = true;
            this.effectSprite.gotoAndPlay(1);
        }
    }
}