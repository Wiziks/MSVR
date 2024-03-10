class StereoCamera {
    constructor(
        Convergence,
        EyeSeparation,
        AspectRatio,
        FOV,
        NearClippingDistance,
        FarClippingDistance
    ) {
        this.mConvergence = Convergence;
        this.mEyeSeparation = EyeSeparation;
        this.mAspectRatio = AspectRatio;
        this.mFOV = FOV * Math.PI / 180.0;
        this.mNearClippingDistance = NearClippingDistance;
        this.mFarClippingDistance = FarClippingDistance;
        this.currentMatrixMode = gl.PROJECTION; // Start with projection matrix mode
    }

    applyLeftFrustum(gl, modelMatrix, u_Mmatrix, projMatrix, u_Pmatrix) {
        let top, bottom, left, right;

        top = this.mNearClippingDistance * Math.tan(this.mFOV / 2);
        bottom = -top;

        let a = this.mAspectRatio * Math.tan(this.mFOV / 2) * this.mConvergence;
        let b = a - this.mEyeSeparation / 2;
        let c = a + this.mEyeSeparation / 2;
        left = -b * this.mNearClippingDistance / this.mConvergence;
        right = c * this.mNearClippingDistance / this.mConvergence;

        mat4.frustum(left, right, bottom, top, this.mNearClippingDistance, this.mFarClippingDistance, projMatrix);
        modelMatrix = mat4.translate(modelMatrix, [this.mEyeSeparation / 2, 0.0, 0.0]);

        gl.uniformMatrix4fv(u_Pmatrix, false, projMatrix);
        gl.uniformMatrix4fv(u_Mmatrix, false, modelMatrix);
    }

    applyRightFrustum(gl, modelMatrix, u_Mmatrix, projMatrix, u_Pmatrix) {
        let top, bottom, left, right;

        top = this.mNearClippingDistance * Math.tan(this.mFOV / 2);
        bottom = -top;

        let a = this.mAspectRatio * Math.tan(this.mFOV / 2) * this.mConvergence;
        let b = a - this.mEyeSeparation / 2;
        let c = a + this.mEyeSeparation / 2;

        left = -c * this.mNearClippingDistance / this.mConvergence;
        right = b * this.mNearClippingDistance / this.mConvergence;

        mat4.frustum(left, right, bottom, top, this.mNearClippingDistance, this.mFarClippingDistance, projMatrix);
        modelMatrix = mat4.translate(modelMatrix, [-this.mEyeSeparation, 0.0, 0.0]);

        gl.uniformMatrix4fv(u_Pmatrix, false, projMatrix);
        gl.uniformMatrix4fv(u_Mmatrix, false, modelMatrix);
    }
}