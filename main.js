const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return (
    "rgb(" +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ")"
  );
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }
  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

let balls = [];

while (balls.length < 50) {
  let size = random(10, 30);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
  );
  balls.push(ball);
}

// 添加恶魔圈
function DevilCircle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

DevilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.stroke();
};

DevilCircle.prototype.move = function (dx, dy) {
  this.x += dx;
  this.y += dy;

  // 确保恶魔圈不超出画布边界
  if (this.x - this.radius < 0) this.x = this.radius;
  if (this.x + this.radius > width) this.x = width - this.radius;
  if (this.y - this.radius < 0) this.y = this.radius;
  if (this.y + this.radius > height) this.y = height - this.radius;
};

const devilCircle = new DevilCircle(width / 2, height / 2, 50);

function checkDevilCircleCollision() {
  for (let i = 0; i < balls.length; i++) {
    const dx = devilCircle.x - balls[i].x;
    const dy = devilCircle.y - balls[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < devilCircle.radius + balls[i].size) {
      // 如果碰撞，移除弹球
      balls.splice(i, 1);
      i--; // 确保不跳过下一个弹球
    }
  }
}

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  // 绘制恶魔圈
  devilCircle.draw();

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  checkDevilCircleCollision();

  requestAnimationFrame(loop);
}

// 监听键盘事件以控制恶魔圈
window.addEventListener('keydown', function(event) {
  const step = 10; // 移动步幅
  if (event.key === 'ArrowLeft') {
    devilCircle.move(-step, 0);
  } else if (event.key === 'ArrowRight') {
    devilCircle.move(step, 0);
  } else if (event.key === 'ArrowUp') {
    devilCircle.move(0, -step);
  } else if (event.key === 'ArrowDown') {
    devilCircle.move(0, step);
  }
});

loop();
document.getElementById('background-music').play();
