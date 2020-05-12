export default class GameRenderer {
    initialize(options) {
        const PIXI = require('pixi.js');
        if (this.app) this.destroy();

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ROUND_PIXELS = true;

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
            autoStart: false,
            antialias: false,
            sharedLoader: true,
            powerPreference: 'high-performance',
            resizeTo: options.el
        });

        this.stage = new PIXI.Container();

        this.playerLayer = new PIXI.Container();
        this.effectLayer = new PIXI.Container();
        this.stage.addChild(this.playerLayer);
        this.stage.addChild(this.effectLayer);

        this.app.stage.addChild(this.stage);
        options.el.appendChild(this.app.view);
    }

    render() {
        this.app.render();
    }

    setLogic(logic) {
        this.logic = logic;
    }

    destroy() {
        if (this.stage) this.stage.destroy();
        if (this.app) this.app.destroy(true);
        this.app = this.stage = undefined;
    }
}