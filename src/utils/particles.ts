/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'circle' | 'star' | 'sparkle';
}

export class ParticleSystem {
  particles: Particle[] = [];

  emit(x: number, y: number, count: number, type: 'collect' | 'powerup' | 'hurt' | 'trail') {
    const colors = {
      collect: ['#fbbf24', '#f59e0b', '#fcd34d'],
      powerup: ['#a78bfa', '#8b5cf6', '#c084fc'],
      hurt: ['#ef4444', '#dc2626', '#f87171'],
      trail: ['#ec4899', '#db2777', '#f9a8d4']
    };

    const particleColors = colors[type];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        size: 3 + Math.random() * 4,
        type: type === 'trail' ? 'circle' : Math.random() > 0.5 ? 'star' : 'sparkle'
      });
    }
  }

  update(deltaTime: number) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity
      p.life -= deltaTime;
      return p.life > 0;
    });
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number) {
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      
      if (p.type === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        this.drawStar(ctx, p.x - cameraX, p.y, p.size);
      } else {
        ctx.fillRect(p.x - cameraX - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      
      ctx.restore();
    });
  }

  private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  clear() {
    this.particles = [];
  }
}
