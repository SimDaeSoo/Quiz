class User {
    constructor(data) {
        this.token = data.token;
        this.name = data.name;
        this.character = data.character;
        this.position = data.position;
        this.vector = data.vector;
        this.score = data.score;

        this.renderPosition = data.position;
    }

    update(dt) {
        this.position.x += dt * this.vector.x;
        this.position.y += dt * this.vector.y;
        this.renderPosition.x += (this.position.x - this.renderPosition.x) * 0.1;
        this.renderPosition.y += (this.position.y - this.renderPosition.y) * 0.1;
    }

    setState(data) {
        this.token = data.token;
        this.name = data.name;
        this.character = data.character;
        this.position = data.position;
        this.vector = data.vector;
        this.score = data.score;
    }
}

export default User;