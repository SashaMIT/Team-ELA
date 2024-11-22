import React, { useEffect, useRef } from 'react';

const NetworkSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = Math.min(400, container.offsetWidth);
      canvas.height = Math.min(400, container.offsetWidth);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const points: any[] = [];
    const numPoints = 2400;
    const radius = 150;
    const connectionThreshold = radius * 0.45;

    function createPoint() {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radiusVariation = radius * (0.6 + Math.random() * 0.6);
      
      const x = radiusVariation * Math.sin(phi) * Math.cos(theta);
      const y = radiusVariation * Math.sin(phi) * Math.sin(theta);
      const z = radiusVariation * Math.cos(phi);
      
      return {
        x, y, z,
        baseX: x, baseY: y, baseZ: z,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        vz: (Math.random() - 0.5) * 1,
        opacity: 0.3 + Math.random() * 0.7,
        opacitySpeed: 0.001 + Math.random() * 0.003,
        opacityDirection: Math.random() < 0.5 ? 1 : -1,
        size: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 4,
        breatheSpeed: 0.002 + Math.random() * 0.004,
        breatheAmount: 0.02 + Math.random() * 0.08,
        moveSpeed: 0.004 + Math.random() * 0.008,
        connectionStrength: 0.4 + Math.random() * 0.6,
        activeState: Math.random() > 0.3,
        connectedPoints: new Set(),
        preferredConnections: [],
        maxConnections: Math.floor(5 + Math.random() * 15)
      };
    }

    // Initialize points
    for (let i = 0; i < numPoints; i++) {
      points.push(createPoint());
    }

    // Establish initial connections
    points.forEach((point1, i) => {
      const connections = [];
      points.forEach((point2, j) => {
        if (i !== j) {
          const dx = point1.baseX - point2.baseX;
          const dy = point1.baseY - point2.baseY;
          const dz = point1.baseZ - point2.baseZ;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (distance < connectionThreshold) {
            connections.push({
              index: j,
              strength: 1 - (distance / connectionThreshold)
            });
          }
        }
      });
      connections.sort((a, b) => b.strength - a.strength);
      point1.preferredConnections = connections.slice(0, point1.maxConnections);
    });

    let rotation = 0;
    let time = 0;
    let globalBreathing = 0;
    let animationFrameId: number;

    function drawSphere() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      globalBreathing += 0.004;
      const globalBreatheFactor = Math.sin(globalBreathing) * 0.08;
      
      // Update points
      points.forEach(point => {
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
          
          if (point.opacity > 0.9) {
            point.opacityDirection = -1;
          } else if (point.opacity < 0.3) {
            point.opacityDirection = 1;
          }
        } else {
          point.opacity = Math.max(0.2, point.opacity - 0.003);
        }
        
        // Elastic boundary
        const dist = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
        if (dist > radius) {
          const scale = radius / dist;
          point.x *= scale;
          point.y *= scale;
          point.z *= scale;
          point.vx *= -0.5;
          point.vy *= -0.5;
          point.vz *= -0.5;
        }
      });
      
      const rotatedPoints = points.map(point => ({
        ...point,
        screenX: point.x * Math.cos(rotation) - point.z * Math.sin(rotation),
        screenY: point.y,
        screenZ: point.x * Math.sin(rotation) + point.z * Math.cos(rotation)
      }));
      
      // Draw connections
      ctx.lineWidth = 0.5;
      rotatedPoints.forEach((point1) => {
        point1.preferredConnections.forEach((conn: any) => {
          const point2 = rotatedPoints[conn.index];
          const dx = point1.x - point2.x;
          const dy = point1.y - point2.y;
          const dz = point1.z - point2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < connectionThreshold) {
            const distanceFactor = 1 - (distance / connectionThreshold);
            const combinedStrength = point1.connectionStrength * point2.connectionStrength * conn.strength;
            const opacity = Math.min(point1.opacity, point2.opacity) * 0.15 * distanceFactor * combinedStrength;
            
            if (opacity > 0.01) {
              ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(point1.screenX, point1.screenY);
              ctx.lineTo(point2.screenX, point2.screenY);
              ctx.stroke();
              
              ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.3})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(point1.screenX, point1.screenY);
              ctx.lineTo(point2.screenX, point2.screenY);
              ctx.stroke();
            }
          }
        });
      });
      
      // Draw points
      rotatedPoints.forEach(point => {
        if (point.opacity > 0.05) {
          const size = point.size * (1 + globalBreatheFactor);
          
          const gradient = ctx.createRadialGradient(
            point.screenX, point.screenY, 0,
            point.screenX, point.screenY, size * 2
          );
          gradient.addColorStop(0, `rgba(0, 0, 0, ${point.opacity * 0.4})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.screenX, point.screenY, size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = `rgba(0, 0, 0, ${point.opacity})`;
          ctx.beginPath();
          ctx.arc(point.screenX, point.screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      ctx.restore();
      
      rotation += 0.0006;
      time += 0.5;
      
      animationFrameId = requestAnimationFrame(drawSphere);
    }
    
    drawSphere();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full max-w-[400px] aspect-square">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default NetworkSphere;
