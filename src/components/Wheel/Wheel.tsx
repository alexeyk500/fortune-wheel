import React, { useRef, useEffect, useState } from "react";

interface WheelProps {
    size?: number;        // Диаметр колеса
    onSpinEnd?: (sector: number) => void; // Коллбек после окончания вращения
}

const Wheel: React.FC<WheelProps> = ({ size = 400, onSpinEnd }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rotation, setRotation] = useState(0); // угол вращения в радиан
    const [spinning, setSpinning] = useState(false);

    const sectors = 17; // 0 + 1–16
    const radius = size / 2;

    const drawWheel = (ctx: CanvasRenderingContext2D, rotationOffset: number) => {
        ctx.clearRect(0, 0, size, size);
        const center = { x: radius, y: radius };
        const anglePerSector = (2 * Math.PI) / sectors;

        for (let i = 0; i < sectors; i++) {
            const startAngle = i * anglePerSector + rotationOffset;
            const endAngle = startAngle + anglePerSector;

            // Цвет сектора
            let fillColor = "#808080"; // серый для Zero
            if (i !== 0) fillColor = i % 2 === 0 ? "#000000" : "#c0392b";

            // Сектор
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.arc(center.x, center.y, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

            // Числа на секторах, повернуты на 90° вправо
            const textAngle = startAngle + anglePerSector / 2;
            ctx.save();
            ctx.translate(center.x, center.y);       // центр колеса
            ctx.rotate(textAngle);                   // повернуть контекст на сектор
            ctx.translate(radius * 0.65, 0);         // сдвинуть текст вдоль радиуса
            ctx.rotate(Math.PI / 2);                 // повернуть текст на 90° вправо
            ctx.fillStyle = "#fff";
            ctx.font = `${radius / 8}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${i}`, 0, 0);
            ctx.restore();
        }

        // Стрелка сверху
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - radius - 10);
        ctx.lineTo(center.x - 10, center.y - radius + 20);
        ctx.lineTo(center.x + 10, center.y - radius + 20);
        ctx.closePath();
        ctx.fillStyle = "#e74c3c";
        ctx.fill();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawWheel(ctx, rotation);
    }, [rotation]);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);

        const randomSector = Math.floor(Math.random() * sectors);
        const anglePerSector = 360 / sectors;

        // Полные обороты + позиция сектора в градусах
        const spins = 5;
        const targetRotation =
            (360 * spins + randomSector * anglePerSector + anglePerSector / 2) *
            (Math.PI / 180);

        const duration = 4000; // 4 секунды
        const start = performance.now();

        const animate = (time: number) => {
            const elapsed = time - start;
            if (elapsed < duration) {
                const easeOut = 1 - Math.pow(1 - elapsed / duration, 3); // плавное замедление
                setRotation(targetRotation * easeOut);
                requestAnimationFrame(animate);
            } else {
                setRotation(targetRotation);
                setSpinning(false);
                onSpinEnd?.(randomSector);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{ display: "block", margin: "0 auto" }}
            />
            <button
                onClick={spin}
                disabled={spinning}
                style={{ marginTop: 20, padding: "10px 20px" }}
            >
                {spinning ? "Spinning..." : "Spin"}
            </button>
        </div>
    );
};

export default Wheel;
