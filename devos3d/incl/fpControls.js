function fpControls(camera) {
    this.camera = camera;
    this.moveForward = true;
    this.moveBackward = true;
    this.moveLeft = true;
    this.moveRight = true;

    this.autoSpeedFactor = 0;
    this.phi = 0;
    this.theta = 0;
    this.lon = 0;
    this.lat = 0;

    this.verticalMin = 0;
    this.verticalMax = 0;

    this.mouseMovementX = 0;
    this.mouseMovementY = 0;

    this.target = 0;

    this.update = function (delta) {
        if (this.freeze) {
            return;
        }

        //movement
        if (this.moveForward) this.camera.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
        if (this.moveBackward) this.camera.translateZ(actualMoveSpeed);

        if (this.moveLeft) this.camera.translateX(-actualMoveSpeed);
        if (this.moveRight) this.camera.translateX(actualMoveSpeed);

        //look movement
        this.lon += this.mouseMovementX;
        this.lat -= this.mouseMovementY;

        this.mouseMovementX = 0; //reset mouse deltas to 0 each rendered frame
        this.mouseMovementY = 0;

        this.phi = (90 - this.lat) * Math.PI / 180;
        this.theta = this.lon * Math.PI / 180;

        if (this.constrainVertical) {
            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        }

        this.target.x = this.camera.position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        this.target.y = this.camera.position.y + 100 * Math.cos(this.phi);
        this.target.z = this.camera.position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.camera.lookAt(this.target);
    };
};