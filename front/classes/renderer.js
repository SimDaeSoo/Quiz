export default class GameRenderer {
    initialize(options) {
        this.PIXI = require('pixi.js');
        if (this.app) this.destroy();

        this.PIXI.settings.SCALE_MODE = this.PIXI.SCALE_MODES.NEAREST;
        this.PIXI.settings.ROUND_PIXELS = true;

        this.app = new this.PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
            autoStart: false,
            antialias: false,
            sharedLoader: true,
            powerPreference: 'high-performance',
            resizeTo: options.el
        });

        this.stage = new this.PIXI.Container();

        this.groundLayer = new this.PIXI.Container();
        this.playerLayer = new this.PIXI.Container();
        this.effectLayer = new this.PIXI.Container();
        this.stage.addChild(this.groundLayer);
        this.stage.addChild(this.playerLayer);
        this.stage.addChild(this.effectLayer);

        this.app.stage.addChild(this.stage);
        this.app.stage.interactive = true;
        options.el.appendChild(this.app.view);

        this.objs = {};

        this.generateMap();

        this.app.stage.on('click', (e) => {
            this.logic.socket.emit('touch', {
                x: e.data.global.x,
                y: e.data.global.y
            });
        });
    }

    generateMap() {
        const graphics = new this.PIXI.Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(this.logic.map.sx, this.logic.map.sy, this.logic.map.ex, this.logic.map.ey);
        graphics.endFill();
        this.groundLayer.addChild(graphics);
    }

    render() {
        this.generateOBJ();
        this.destroyOBJ();
        this.updateOBJ();
        this.app.render();
    }

    generateOBJ() {
        for (let key in this.logic.users) {
            if (!this.objs[key]) {
                this.objs[key] = new this.PIXI.Container();
                const graphics = new this.PIXI.Graphics();
                graphics.beginFill(0x0000FF);
                graphics.drawRect(0, 0, 50, 50);
                graphics.endFill();
                this.objs[key].addChild(graphics);
                this.playerLayer.addChild(this.objs[key]);
            }
        }
    }

    destroyOBJ() {
        for (let key in this.objs) {
            if (!this.logic.users[key]) {
                // 제거 추가한다.
                console.log('destroy');
                delete this.objs[key];
            }
        }
    }

    updateOBJ() {
        for (let key in this.objs) {
            this.objs[key].x = this.logic.users[key].position.x;
            this.objs[key].y = this.logic.users[key].position.y;
        }
    }

    setLogic(logic) {
        this.logic = logic;
    }

    setTarget(token) {
        this.target = token;
    }

    destroy() {
        if (this.stage) this.stage.destroy();
        if (this.app) this.app.destroy(true);
        this.app = this.stage = undefined;
    }
}