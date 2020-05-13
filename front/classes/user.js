class User {
    constructor(data) {
        this.token = data.token;
        this.name = data.name;
        this.character = data.character;
        this.position = data.position;
        this.vector = data.vector;
        this.score = data.score;
        this.targetPosition = data.targetPosition;

        this.renderPosition = data.position;
    }

    update(dt) {
        this.position.x += dt * this.vector.x;
        this.position.y += dt * this.vector.y;
        if (Math.abs(this.targetPosition.x - this.position.x) <= Math.abs(dt * this.vector.x) && this.position.x !== this.targetPosition.x) {
            this.position.x = this.targetPosition.x;
            this.vector.x = 0;
        } else {
            this.position.x += dt * this.vector.x;
        }

        if (Math.abs(this.targetPosition.y - this.position.y) <= Math.abs(dt * this.vector.y) && this.position.y !== this.targetPosition.y) {
            this.position.y = this.targetPosition.y;
            this.vector.y = 0;
        } else {
            this.position.y += dt * this.vector.y;
        }
        this.renderPosition.x += (this.position.x - this.renderPosition.x) * 0.02;
        this.renderPosition.y += (this.position.y - this.renderPosition.y) * 0.02;
    }

    setState(data) {
        this.token = data.token;
        this.name = data.name;
        this.character = data.character;
        this.position = data.position;
        this.vector = data.vector;
        this.score = data.score;
        this.targetPosition = data.targetPosition;
        this.renderPosition.x += (this.position.x - this.renderPosition.x) * 0.1;
        this.renderPosition.y += (this.position.y - this.renderPosition.y) * 0.1;
    }
}

export default User;