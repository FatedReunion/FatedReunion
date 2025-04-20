class StickFigure {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color || '#000';
        this.scale = 1;
        this.speed = 2;
        this.angle = 0;
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.angle * Math.PI / 180);

        // 头部
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.stroke();

        // 身体
        ctx.moveTo(0, 10);
        ctx.lineTo(0, 40);

        // 手臂
        ctx.moveTo(-15, 15);
        ctx.lineTo(15, 15);

        // 腿
        ctx.moveTo(0, 40);
        ctx.lineTo(-15, 60);
        ctx.moveTo(0, 40);
        ctx.lineTo(15, 60);

        ctx.stroke();
        ctx.restore();
    }

    move(targetX, targetY) {
        if (this.x < targetX) this.x += this.speed;
        if (this.x > targetX) this.x -= this.speed;
        if (this.y < targetY) this.y += this.speed;
        if (this.y > targetY) this.y -= this.speed;
    }
}

class StickFigureAnimation {
    constructor(ctx, targetX, targetY) {
        this.ctx = ctx;
        this.figures = [
            new StickFigure(ctx, -100, 0, '#FF0000'),
            new StickFigure(ctx, ctx.canvas.width + 100, 490, '#0000FF')
        ];
        this.playing = false;
        this.startTime = null;
        this.targetX = targetX;
        this.targetY = targetY;
        this.phase = 'meeting'; // 当前阶段：meeting（相遇）、playing（玩耍）、moving（移动）、arrived（到达）
        this.playStartTime = null;
    }

    start() {
        this.playing = true;
        this.startTime = Date.now();
        this.animate();
    }

    animate() {
        if (!this.playing) return;

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const elapsed = Date.now() - this.startTime;
        const centerX = this.ctx.canvas.width / 2;
        const centerY = 490;

        switch (this.phase) {
            case 'meeting':
                // 向中心移动
                this.figures[0].move(centerX - 50, centerY);
                this.figures[1].move(centerX + 50, centerY);

                // 检查是否相遇
                if (Math.abs(this.figures[0].x - (centerX - 50)) < 1 &&
                    Math.abs(this.figures[1].x - (centerX + 50)) < 1) {
                    this.phase = 'playing';
                    this.playStartTime = Date.now();
                }
                break;

            case 'playing':
                // 在中心位置玩耍
                const playTime = Date.now() - this.playStartTime;
                if (playTime > 3000) { // 玩耍3秒
                    this.phase = 'moving';
                    break;
                }

                const angle = Math.sin(elapsed / 300) * 15;
                const offsetX = Math.sin(elapsed / 200) * 20;
                const offsetY = Math.cos(elapsed / 150) * 10;

                this.figures[0].x = centerX - 50 + offsetX;
                this.figures[1].x = centerX + 50 - offsetX;
                this.figures[0].y = centerY ;
                this.figures[1].y = centerY ;
                this.figures[0].angle = angle;
                this.figures[1].angle = -angle;
                break;

            case 'moving':
                // 向目标位置移动
                this.figures[0].move(this.targetX - 50, this.targetY);
                this.figures[1].move(this.targetX + 50, this.targetY);

                // 直接进入玩耍状态，不再判断距离
                this.phase = 'arrived';
                this.playStartTime = Date.now();
                break;

            case 'arrived':
                // 在目标位置附近玩耍
                const playElapsed = Date.now() - this.playStartTime;
                const angle2 = Math.sin(playElapsed / 300) * 15;
                const offsetX2 = Math.sin(playElapsed / 200) * 20;
                const offsetY2 = Math.cos(playElapsed / 150) * 10;

                this.figures[0].x = this.targetX - 50 + offsetX2;
                this.figures[1].x = this.targetX + 50 - offsetX2;
                this.figures[0].y = this.targetY + offsetY2;
                this.figures[1].y = this.targetY - offsetY2;
                this.figures[0].angle = angle2;
                this.figures[1].angle = -angle2;
                break;
        }

        // 绘制
        this.figures.forEach(figure => figure.draw());

        requestAnimationFrame(() => this.animate());
    }
}

