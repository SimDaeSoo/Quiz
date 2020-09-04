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

        const isCustomCharacter = Number.isNaN(Number(data.character));
        const texture = isCustomCharacter ? PIXI.Texture.from(`${data.character}`) : PIXI.Texture.from(`/game/${data.character}.png`);
        const sprite = new PIXI.Sprite(texture);
        sprite.width = 50;
        sprite.height = 50;
        sprite.x = -25;
        sprite.y = 0;

        this.character = new PIXI.Container();
        this.character.addChild(sprite);

        this.shadow = new PIXI.Graphics();
        this.shadow.beginFill(0x000000);
        this.shadow.drawEllipse(0, -3, 22, 4);
        this.shadow.endFill();
        this.shadow.alpha = 0.5;

        this.messageContainer = new PIXI.Container();

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
        this.character.addChild(this.messageContainer);
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
        this.name = data.name;
        this.chatID = 0;
    }

    setTarget() {
        if (!this.myArrow) {
            this.myArrow = new PIXI.Sprite(PIXI.Texture.from('/game/arrow-me.png'));
            this.myArrow.width = 65;
            this.myArrow.height = 93;
            this.myArrow.x = -20;
            this.myArrow.y = -70;
            this.character.addChild(this.myArrow);
        }
    }

    chat(messageText) {
        const chatID = ++this.chatID;
        this.messageContainer.removeChild(this.lastMessageContainer);
        this.lastMessageContainer = new PIXI.Container();
        const message = new PIXI.Text(`${this.name} : ${messageText}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            align: 'center'
        });
        message.anchor.x = 0.5;
        this.lastMessageContainer.y = -80;

        const triangle = new PIXI.Graphics();
        triangle.beginFill(0x000000);
        triangle.moveTo(-10, message.height + 1);
        triangle.lineTo(10, message.height + 1);
        triangle.lineTo(0, message.height + 20);
        triangle.lineTo(-10, message.height + 1);
        triangle.alpha = 0.5;
        this.lastMessageContainer.addChild(triangle);

        const messageBackground = new PIXI.Graphics();
        messageBackground.beginFill(0x000000);
        messageBackground.drawRect(-(message.width + 4) / 2, -1, message.width + 4, message.height + 2);
        messageBackground.endFill();
        messageBackground.alpha = 0.5;

        this.lastMessageContainer.addChild(messageBackground);
        this.lastMessageContainer.addChild(message);

        this.messageContainer.addChild(this.lastMessageContainer);
        setTimeout(() => {
            if (chatID === this.chatID) {
                this.messageContainer.removeChild(this.lastMessageContainer);
            }
        }, 5000);
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