import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./BetWheel.module.css";

interface BetWheelProps {
  size: number;
  rotation: number;
  selectedBet: number | null;
  bets: { sector: number; amount: number }[];
  onClickSector: (sector: number) => void;
}

const transformSector = [12, 13, 14, 15, 16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const BetWheel: React.FC<BetWheelProps> = ({
                                                    size,
                                                    rotation,
                                                    selectedBet,
                                                    bets,
                                                    onClickSector,
                                                  }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [highlightPhase, setHighlightPhase] = useState(0);

  const sectors = 17;
  const radius = size / 2;
  const anglePerSector = (2 * Math.PI) / sectors;
  const initialRotation = -Math.PI / 2 - anglePerSector / 2;

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setHighlightPhase((prev) => (prev + delta * 1.05) % 1);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, []);

  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, size, size);
      const center = { x: radius, y: radius };

      // Предвычисляем сумму ставок на каждый сектор
      const sectorSums = Array(sectors).fill(0);
      bets.forEach((b) => {
        if (b.sector >= 0 && b.sector < sectors) {
          sectorSums[b.sector] += b.amount;
        }
      });


      for (let i = 0; i < sectors; i++) {
        const startAngle = i * anglePerSector + rotation;
        const endAngle = startAngle + anglePerSector;
        const fillColor = i === 0 ? "#707070" : i % 2 === 0 ? "#000000" : "#c0392b";

        if (selectedBet === i) {
          const alpha = 0.3 + 0.7 * Math.abs(Math.sin(highlightPhase * Math.PI));
          ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        } else {
          ctx.fillStyle = fillColor;
        }

        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.arc(center.x, center.y, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        const textAngle = startAngle + anglePerSector / 2;
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(textAngle);
        ctx.translate(radius * 0.8, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#fff";
        ctx.font = `${radius / 8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${i}`, 0, 0);
        ctx.restore();

        // отрисовка суммы ставок
        if (sectorSums[i] > 0) {
          ctx.save();
          ctx.translate(center.x, center.y);
          ctx.rotate(textAngle);
          ctx.translate(radius * 0.55, 0);
          ctx.rotate(Math.PI / 2);
          ctx.fillStyle = "#f1c40f";
          ctx.font = `bold ${radius / 9}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${sectorSums[i]}`, 0, 0);
          ctx.restore();
        }
      }

      ctx.beginPath();
// нижняя точка (острие вниз)
      ctx.moveTo(center.x, center.y - radius + 20 + 5);
// левая верхняя точка
      ctx.lineTo(center.x - 7, center.y - radius + 5);
// правая верхняя точка
      ctx.lineTo(center.x + 7, center.y - radius + 5);
      ctx.closePath();
      ctx.fillStyle = "#fdcb01";                       // желтый цвет
      ctx.fill();
    },
    [bets, highlightPhase, radius, rotation, selectedBet, size, anglePerSector]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawWheel(ctx);
  }, [rotation, bets, selectedBet, highlightPhase, drawWheel]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;
    const angle = Math.atan2(y, x);

    // Вычисляем сектор с учётом rotation и initialRotation
    let relativeAngle = angle - rotation - initialRotation;
    relativeAngle = (2 * Math.PI + (relativeAngle % (2 * Math.PI))) % (2 * Math.PI);

    const sector = Math.floor(relativeAngle / anglePerSector) % sectors;
    onClickSector(transformSector[sector]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={styles.wheel}
      onClick={handleClick}
    />
  );
};
