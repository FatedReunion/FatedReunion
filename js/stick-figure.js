// 线框人绘制类
function StickFigure(ctx, startX, startY, color) {
    this.ctx = ctx;
    this.x = startX;
    this.y = startY;
    this.color = color || '#000';
    this.scale = 1;
    this.speed = 2;
}

StickFigure.prototype = {
    draw: function () {
        var ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.scale(this.scale, this.scale);

        // 头部
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.stroke();

        // 身体
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x, this.y + 40);

        // 手臂
        ctx.moveTo(this.x - 15, this.y + 15);
        ctx.lineTo(this.x + 15, this.y + 15);

        // 腿
        ctx.moveTo(this.x, this.y + 40);
        ctx.lineTo(this.x - 15, this.y + 60);
        ctx.moveTo(this.x, this.y + 40);
        ctx.lineTo(this.x + 15, this.y + 60);

        ctx.stroke();
        ctx.restore();
    },
    move: function (targetX, targetY) {
        if (this.x < targetX) this.x += this.speed;
        if (this.x > targetX) this.x -= this.speed;
        if (this.y < targetY) this.y += this.speed;
        if (this.y > targetY) this.y -= this.speed;
    }
};

// 独立的线框人控制器
function StickFigureController(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;

    // 调整初始位置，让小人从屏幕外开始移动
    this.figure1 = new StickFigure(this.ctx, -100, this.height- 185);
    this.figure2 = new StickFigure(this.ctx, this.width + 100, this.height- 185);
    this.figuresStopped = false;
}

StickFigureController.prototype = {
    draw: function () {
        // 只绘制小人，不清除任何背景
        this.figure1.draw();
        this.figure2.draw();
    },
    move: function () {
        var centerX = this.width / 2;
        var centerY = this.height - 185;
        var targetX = this.width - 480;
        var targetY = centerY-95;

        // 移除所有clearRect调用

        if (!this.figuresStopped) {
            if (Math.abs(this.figure1.x - (centerX - 50)) <= 1 &&
                Math.abs(this.figure2.x - (centerX + 50)) <= 1 &&
                Math.abs(this.figure1.y - centerY) <= 1 &&
                Math.abs(this.figure2.y - centerY) <= 1) {

                this.figure1.x = centerX - 50;
                this.figure1.y = targetY;
                this.figure2.x = centerX + 50;
                this.figure2.y = targetY;

                this.figuresStopped = true;
                this.figure1.scale = 1.2;
                this.figure2.scale = 1.2;
            } else {
                this.figure1.move(centerX - 50, centerY);
                this.figure2.move(centerX + 50, centerY);
            }
        } else {
            // 添加平滑移动逻辑，避免直接改变位置
            if (Math.abs(this.figure1.x - targetX) > 1 || Math.abs(this.figure1.y - targetY) > 1) {
                this.figure1.move(targetX, targetY);
                this.figure2.move(targetX + 90, targetY);
            } else {
                this.figure1.x = targetX;
                this.figure2.x = targetX + 90;
                this.figure1.y = targetY;
                this.figure2.y = targetY;
            }
        }

        // 重新绘制
        this.draw();
    },
};
