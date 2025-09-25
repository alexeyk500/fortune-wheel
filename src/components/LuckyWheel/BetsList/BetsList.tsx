import React from "react";
import styles from "./BetsList.module.css";
import {SINGLE_NUMBER_PAYOUT} from "../../../pages/PageLuckyWheel/PageLuckyWheel.tsx";

interface BetsListProps {
  bets: { sector: number; amount: number }[];
  removeBet: (index: number) => void;
}

export const BetsList: React.FC<BetsListProps> = ({ bets, removeBet }) => {

  if (!bets.length) {
    return (
      <div className={styles.noBetsContainer}>
        <div className={styles.noBetsInstr}>Инструкция:</div>
        <div className={styles.noBetsTitle}>{`1. Кликом на барабане выбери сектор для ставки`}</div>
        <div className={styles.noBetsTitle}>{`2. Кликом на фишке выбери размер ставки`}</div>
        <div className={styles.noBetsTitle}>{`3. Кликом по кнопке "Поставить" выбери размер ставки`}</div>
        <div className={styles.noBetsTitle}>{`4. Можешь сделать несколько ставок на разные сектора`}</div>
        <div className={styles.noBetsTitle}>{`5. Запусти Колесо Удачи кнопкой "Крутить"`}</div>
      </div>
    );
  }

  return (
    <div className={styles.betsList}>
      <div className={styles.title}>Сделанные ставки:</div>
      <ul>
        {bets.map((b, i) => (
          <li key={i} className={styles.betItem}>
            Сектор {b.sector}&nbsp;{"→"}&nbsp;🎟️&nbsp;{b.amount}  {"×"}&nbsp;{SINGLE_NUMBER_PAYOUT} = 🎟&nbsp;{SINGLE_NUMBER_PAYOUT * b.amount}
            <button className={styles.removeBetButton} onClick={() => removeBet(i)}><div className={styles.remove}>✖</div></button>
          </li>
        ))}
      </ul>
    </div>
  );
};
