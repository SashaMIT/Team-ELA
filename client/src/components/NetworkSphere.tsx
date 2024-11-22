import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  opacity: number;
  opacitySpeed: number;
  opacityDirection: number;
  size: number;
  phase: number;
  breatheSpeed: number;
  breatheAmount: number;
  moveSpeed: number;
  connectionStrength: number;
  activeState: boolean;
  maxConnections: number;
  preferredConnections: Connection[];
}

interface Connection {
  index: number;
  strength: number;
}

interface RotatedPoint extends Point {
  screenX: number;
  screenY: number;
  screenZ: number;
}

class NetworkSphereClass {
  private points: Point[] = [];
  private centerX: number;
  private color: string;
  private baseRadius: number;
  private connectionThreshold: number;
  private rotation: number = 0;

  constructor(centerX: number, color: string, size: number, numPoints: number) {
    this.centerX = centerX;
    this.color = color;
    this.baseRadius = size;
    this.connectionThreshold = size * 0.45;

    for (let i = 0; i < numPoints; i++) {
      this.points.push(this.createPoint());
    }

    this.establishConnections();
  }

  private createPoint(): Point {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const radiusVariation = this.baseRadius * (0.6 + Math.random() * 0.6);

    const x = radiusVariation * Math.sin(phi) * Math.cos(theta);
    const y = radiusVariation * Math.sin(phi) * Math.sin(theta);
    const z = radiusVariation * Math.cos(phi);

    return {
      x, y, z,
      baseX: x,
      baseY: y,
      baseZ: z,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      vz: (Math.random() - 0.5) * 1,
      opacity: 0.3 + Math.random() * 0.7,
      opacitySpeed: 0.001 + Math.random() * 0.003,
      opacityDirection: Math.random() < 0.5 ? 1 : -1,
      size: 0.5 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 4,
      breatheSpeed: 0.002 + Math.random() * 0.004,
      breatheAmount: 0.02 + Math.random() * 0.08,
      moveSpeed: 0.004 + Math.random() * 0.008,
      connectionStrength: 0.4 + Math.random() * 0.6,
      activeState: Math.random() > 0.3,
      maxConnections: Math.floor(5 + Math.random() * 15),
      preferredConnections: []
    };
  }

  private establishConnections(): void {
    this.points.forEach((point1, i) => {
      const connections: Connection[] = [];
      this.points.forEach((point2, j) => {
        if (i !== j) {
          const dx = point1.baseX - point2.baseX;
          const dy = point1.baseY - point2.baseY;
          const dz = point1.baseZ - point2.baseZ;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (distance < this.connectionThreshold) {
            connections.push({
              index: j,
              strength: 1 - (distance / this.connectionThreshold)
            });
          }
        }
      });
      connections.sort((a, b) => b.strength - a.strength);
      point1.preferredConnections = connections.slice(0, point1.maxConnections);
    });
  }

  public update(time: number, globalBreathing: number): void {
    const globalBreatheFactor = Math.sin(globalBreathing) * 0.08;

    this.points.forEach(point => {
      if (Math.random() < 0.0003) {
        point.activeState = !point.activeState;
      }

      if (point.activeState) {
        const individualBreathing = Math.sin(time * point.breatheSpeed + point.phase);
        const breatheFactor = (globalBreatheFactor + individualBreathing * point.breatheAmount);

        point.x = point.baseX * (1 + breatheFactor);
        point.y = point.baseY * (1 + breatheFactor);
        point.z = point.baseZ * (1 + breatheFactor);

        point.x += point.vx * Math.sin(time * point.moveSpeed) * 0.15;
        point.y += point.vy * Math.cos(time * point.moveSpeed * 0.8) * 0.15;
        point.z += point.vz * Math.sin(time * point.moveSpeed * 1.2) * 0.15;

        point.opacity = Math.min(1, point.opacity + point.opacitySpeed * point.opacityDirection);

        if (point.opacity > 0.9) point.opacityDirection = -1;
        if (point.opacity < 0.3) point.opacityDirection = 1;
      } else {
        point.opacity = Math.max(0.2, point.opacity - 0.003);
      }

      const dist = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
      if (dist > this.baseRadius) {
        const scale = this.baseRadius / dist;
        point.x *= scale;
        point.y *= scale;
        point.z *= scale;
        point.vx *= -0.5;
        point.vy *= -0.5;
        point.vz *= -0.5;
      }
    });

    this.rotation += 0.0006;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!ctx) return;

    const rotatedPoints: RotatedPoint[] = this.points.map(point => ({
      ...point,
      screenX: this.centerX + (point.x * Math.cos(this.rotation) - point.z * Math.sin(this.rotation)),
      screenY: point.y,
      screenZ: point.x * Math.sin(this.rotation) + point.z * Math.cos(this.rotation)
    }));

    ctx.lineWidth = 0.5;
    rotatedPoints.forEach((point1) => {
      point1.preferredConnections.forEach(conn => {
        const point2 = rotatedPoints[conn.index];
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = point1.z - point2.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < this.connectionThreshold) {
          const distanceFactor = 1 - (distance / this.connectionThreshold);
          const combinedStrength = point1.connectionStrength * point2.connectionStrength * conn.strength;
          const opacity = Math.min(point1.opacity, point2.opacity) * 0.15 * distanceFactor * combinedStrength;

          if (opacity > 0.01) {
            ctx.strokeStyle = `${this.color.replace('1)', opacity + ')')}`;
            ctx.beginPath();
            ctx.moveTo(point1.screenX, point1.screenY);
            ctx.lineTo(point2.screenX, point2.screenY);
            ctx.stroke();

            ctx.strokeStyle = `${this.color.replace('1)', opacity * 0.3 + ')')}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(point1.screenX, point1.screenY);
            ctx.lineTo(point2.screenX, point2.screenY);
            ctx.stroke();
          }
        }
      });
    });

    rotatedPoints.forEach(point => {
      if (point.opacity > 0.05) {
        const size = point.size;
        const gradient = ctx.createRadialGradient(
          point.screenX, point.screenY, 0,
          point.screenX, point.screenY, size * 2
        );
        gradient.addColorStop(0, `${this.color.replace('1)', point.opacity * 0.4 + ')')}`);
        gradient.addColorStop(1, `${this.color.replace('1)', '0)')}`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.screenX, point.screenY, size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `${this.color.replace('1)', point.opacity + ')')}`;
        ctx.beginPath();
        ctx.arc(point.screenX, point.screenY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

const NetworkSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const orangeSphereRef = useRef<NetworkSphereClass | null>(null);
  const blackSphereRef = useRef<NetworkSphereClass | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = Math.min(800, container.offsetWidth);
      canvas.height = Math.min(400, container.offsetWidth * 0.5);

      // Re-initialize spheres with new dimensions
      const centerX = canvas.width * 0.35;
      const centerX2 = canvas.width * 0.65;
      orangeSphereRef.current = new NetworkSphereClass(centerX, 'rgba(204, 85, 0, 1)', canvas.width * 0.15, 2400);
      blackSphereRef.current = new NetworkSphereClass(centerX2, 'rgba(0, 0, 0, 1)', canvas.width * 0.12, 2000);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize spheres
    orangeSphereRef.current = new NetworkSphereClass(280, 'rgba(204, 85, 0, 1)', 150, 2400);
    blackSphereRef.current = new NetworkSphereClass(520, 'rgba(0, 0, 0, 1)', 120, 2000);

    let time = 0;
    let globalBreathing = 0;

    function animate() {
      if (!ctx || !canvas) return;
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.save();
      ctx.translate(0, canvasHeight / 2);
      
      globalBreathing += 0.004;
      
      const orangeSphere = orangeSphereRef.current;
      const blackSphere = blackSphereRef.current;

      if (orangeSphere && blackSphere) {
        orangeSphere.update(time, globalBreathing);
        blackSphere.update(time, globalBreathing);
        
        orangeSphere.draw(ctx);
        blackSphere.draw(ctx);
      }
      
      ctx.restore();
      
      time += 0.5;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full aspect-[2/1]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default NetworkSphere;