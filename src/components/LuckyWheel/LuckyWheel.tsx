import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./LuckyWheel.module.css";
import { BetWheel } from "./BetWheel/BetWheel";
import { BetControls } from "./BetControls/BetControls";
import { BetsList } from "./BetsList/BetsList";
import type { BetType } from "../../pages/PageLuckyWheel/PageLuckyWheel.tsx";

interface LuckyWheelProps {
  bets: BetType[];
  setBets: (bets: BetType[]) => void;
  size?: number;
  onSpinEnd?: (sector: number) => void;
  targetSector?: number;
  onSpinClick?: () => void;
}

const transformTargetSector = [0, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export const LuckyWheel: React.FC<LuckyWheelProps> = ({
                                                        bets,
                                                        setBets,
                                                        size = 400,
                                                        onSpinEnd,
                                                        targetSector,
                                                        onSpinClick,
                                                      }) => {
  const sectors = 17;
  const anglePerSector = (2 * Math.PI) / sectors;

  const initialRotation = -Math.PI / 2 - anglePerSector / 2;

  const [rotation, setRotation] = useState(initialRotation);
  const [spinning, setSpinning] = useState(false);
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(1);

  const animationRef = useRef<number | null>(null);
  const currentRotationRef = useRef(initialRotation);
  const lastTimeRef = useRef(performance.now());

  // Единая скорость вращения (радианы в секунду)
  const spinSpeed = 2.5 * Math.PI;

  const placeBet = () => {
    if (selectedSector === null) return;
    setBets([...bets, { sector: selectedSector, amount: selectedBetAmount }]);
    setSelectedSector(null);
  };

  const removeBet = (index: number) =>
    setBets(bets.filter((_, i) => i !== index));

  // Бесконечное вращение
  const animateInfinite = useCallback(
    (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      const deltaRotation = (spinSpeed * delta) / 1000;
      currentRotationRef.current += deltaRotation;
      setRotation(currentRotationRef.current);
      animationRef.current = requestAnimationFrame(animateInfinite);
    },
    [spinSpeed]
  );

  const spin = () => {
    if (spinning) return;
    onSpinClick?.();
    setSpinning(true);
    setSelectedSector(null);

    lastTimeRef.current = performance.now();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animateInfinite);
  };

  // Плавная остановка на targetSector
  useEffect(() => {
    if (!spinning || targetSector === undefined) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const spins = 5; // Дополнительные обороты

    // Угол целевого сектора
    const sectorAngle = transformTargetSector[targetSector] * anglePerSector;

    const normalizedCurrent = currentRotationRef.current - initialRotation;
    let deltaAngle = sectorAngle - (normalizedCurrent % (2 * Math.PI));
    if (deltaAngle < 0) deltaAngle += 2 * Math.PI;

    const targetRotation = currentRotationRef.current + deltaAngle + spins * 2 * Math.PI;
    const startRotation = currentRotationRef.current;

    // Длительность остановки вычисляется по spinSpeed, чтобы совпадала с бесконечным вращением
    const duration = ((targetRotation - startRotation) / spinSpeed) * 1000;
    const startTime = performance.now();

    const animateToTarget = (time: number) => {
      const elapsed = time - startTime;
      if (elapsed < duration) {
        const easeOut = 1 - Math.pow(1 - elapsed / duration, 3);
        currentRotationRef.current =
          startRotation + (targetRotation - startRotation) * easeOut;
        setRotation(currentRotationRef.current);
        animationRef.current = requestAnimationFrame(animateToTarget);
      } else {
        currentRotationRef.current = targetRotation;
        setRotation(targetRotation);
        setSpinning(false);
        onSpinEnd?.(targetSector);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animateToTarget);
  }, [targetSector, spinning, onSpinEnd, anglePerSector, initialRotation, spinSpeed]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className={styles.container}>
      <BetWheel
        size={size}
        rotation={rotation}
        selectedBet={selectedSector}
        bets={bets}
        onClickSector={(sector) => {
          if (spinning) return;
          setSelectedSector(sector);
        }}
      />
      <BetControls
        bets={bets}
        selectedBetAmount={selectedBetAmount}
        setSelectedBetAmount={setSelectedBetAmount}
        selectedSector={selectedSector}
        placeBet={placeBet}
        spin={spin}
        spinning={spinning}
      />
      <BetsList bets={bets} removeBet={removeBet} />
    </div>
  );
};
