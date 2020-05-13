import Camera from './camera';
import UserRenderingObject from './userRendereringObject';
const PIXI = typeof window !== 'undefined' ? require('pixi.js') : {};

export default class GameRenderer {
    initialize(options) {
        if (this.app) this.destroy();

        // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        // PIXI.settings.ROUND_PIXELS = true;

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xFFFFFF,
            autoStart: false,
            antialias: true,
            sharedLoader: true,
            powerPreference: 'high-performance',
            resizeTo: options.el
        });

        this.stage = new PIXI.Container();

        this.groundLayer = new PIXI.Container();
        this.playerLayer = new PIXI.Container();
        this.effectLayer = new PIXI.Container();
        this.playerLayer.sortableChildren = true;
        this.stage.addChild(this.groundLayer);
        this.stage.addChild(this.playerLayer);
        this.stage.addChild(this.effectLayer);

        this.app.stage.addChild(this.stage);
        this.app.stage.interactive = true;
        options.el.appendChild(this.app.view);

        this.objs = {};

        this.generateMap();

        this.camera = new Camera();
        this.camera.setStage(this.stage);
        this.camera.setZoom(0.7);

        this.canTouch = true;
        this.app.stage.on('pointerdown', (e) => {
            if (this.canTouch) {
                this.canTouch = false;
                const diffX = (-this.stage.x + e.data.global.x) / this.camera.currentZoom;
                const diffY = (-this.stage.y + e.data.global.y) / this.camera.currentZoom;
                this.logic.socket.emit('touch', {
                    x: diffX,
                    y: diffY
                });

                setTimeout(() => {
                    this.canTouch = true;
                }, 250);
            }
        });
    }

    generateMap() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(this.logic.map.sx, this.logic.map.sy, this.logic.map.ex, this.logic.map.ey);
        graphics.endFill();
        this.groundLayer.addChild(graphics);
    }

    render() {
        if (this.lastRendered === undefined) {
            this.frame = 0;
            this.lastRendered = Date.now();
        }
        this.generateOBJ();
        this.destroyOBJ();
        this.updateOBJ();
        if (this.target && !this.camera.targetObject && this.objs[this.target]) {
            this.camera.setObject(this.objs[this.target]);
        }
        this.camera.update();
        this.app.render();

        if (Date.now() > this.lastRendered + 1000) {
            this.fps = this.frame;
            this.frame = 0;
            this.lastRendered = Date.now();
        } else {
            this.frame++;
        }
    }

    generateOBJ() {
        for (let key in this.logic.users) {
            if (!this.objs[key]) {
                this.objs[key] = new UserRenderingObject(this.logic.users[key]);
                this.playerLayer.addChild(this.objs[key].container);
            }
        }
    }

    destroyOBJ() {
        for (let key in this.objs) {
            if (!this.logic.users[key]) {
                this.objs[key].container.parent.removeChild(this.objs[key].container);
                delete this.objs[key];
            }
        }
    }

    updateOBJ() {
        for (let key in this.objs) {
            this.objs[key].render(this.logic.users[key]);
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