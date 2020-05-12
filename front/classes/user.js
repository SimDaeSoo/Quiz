class User {
    constructor(data) {
        this.token = data.token;
        this.name = data.name;
        this.character = data.character;
        this.position = data.position;
        this.vector = data.vector;
        this.score = data.score;
    }

    update(dt) {
        this.position.x += dt * this.vector.x;
        this.position.y += dt * this.vector.y;
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