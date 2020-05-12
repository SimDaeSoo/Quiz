export default class Camera {
    constructor() {
        this.targetZoom = 1;
        this.currentZoom = 1;
        this.position = {
            x: 0,
            y: 0
        };
        this.stage = undefined;
        this.targetObject = undefined;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.resize = this._resize.bind(this);
        window.addEventListener('resize', this.resize);
    }

    update() {
        const FOLLOW_COEIFFICIENT = 1.004 ** 16 - 1;
        const ZOOM_COEIFFICIENT = 1.003 ** 16 - 1;
        this.updateFollowObj(FOLLOW_COEIFFICIENT);
        this.updateFollowZoom(ZOOM_COEIFFICIENT);
        this.updateStage();
    }

    setStage(stage) {
        this.stage = stage;
    }

    setObject(targetObject) {
        this.targetObject = targetObject;
    }

    setZoom(value) {
        this.targetZoom = value;
    }

    destroy() {
        window.removeEventListener('resize', this.resize);
    }

    _resize() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    updateStage() {
        if (this.stage === undefined) return;
        this.stage.scale.x = this.currentZoom;
        this.stage.scale.y = this.currentZoom;
        this.stage.position.x = this.position.x;
        this.stage.position.y = this.position.y;
    }

    updateFollowObj(coeifficient) {
        if (this.targetObject === undefined) return;

        const targetPosition = {
            x: ((-this.targetObject.position.x - this.targetObject.width / 2) * this.currentZoom + this.screenWidth / 2),
            y: ((-this.targetObject.position.y - this.targetObject.height / 2) * this.currentZoom + this.screenHeight / 2)
        };

        this.position.x += (targetPosition.x - this.position.x) * coeifficient;
        this.position.y += (targetPosition.y - this.position.y) * coeifficient;
    }

    updateFollowZoom(coeifficient) {
        const zoom = this.currentZoom + (this.targetZoom - this.currentZoom) * coeifficient;
        const centerPos = {
            x: (this.position.x - this.screenWidth / 2) / this.currentZoom,
            y: (this.position.y - this.screenHeight / 2) / this.currentZoom
        };

        this.currentZoom = zoom;
        this.position.x = (centerPos.x * this.currentZoom) + this.screenWidth / 2;
        this.position.y = (centerPos.y * this.currentZoom) + this.screenHeight / 2;
    }
}