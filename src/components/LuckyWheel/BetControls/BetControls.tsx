import React from "react";
import styles from "./BetControls.module.css";
import type {BetType} from "../../../pages/PageLuckyWheel/PageLuckyWheel.tsx";

interface BetControlsProps {
  bets: BetType[]
  selectedBetAmount: number | null;
  setSelectedBetAmount: (amount: number) => void;
  selectedSector: number | null;
  placeBet: () => void;
  spin: () => void;
  spinning: boolean;
}

const betOptions = [1, 3, 5, 10, 25];

export const BetControls: React.FC<BetControlsProps> = ({ bets,
                                                          selectedBetAmount,
                                                          setSelectedBetAmount,
                                                          selectedSector,
                                                          placeBet,
                                                          spin,
                                                          spinning
                                                        }) => {
  return (
    <div className={styles.controls}>
      <div className={styles.infoRow}>
        { selectedSector === null
          ?' ☝️- Выбери сектор для ставки️'
          : !selectedBetAmount
          ? ' 👇️- Выбери размер ставки️'
          :''
        }
        { selectedSector !== null && selectedBetAmount && ' Можно делать ставку️ - 👍'

        }
      </div>
      <div className={styles.betChips}>
        {betOptions.map(option => (
          <button
            key={option}
            className={`${styles.chip} ${styles[`chip${option}`]} ${selectedBetAmount === option ? styles.activeChip : ""}`}
            onClick={() => setSelectedBetAmount(option)}
          >
            <span className={styles.ticketIcon}>🎟️</span>
            {option}
          </button>
        ))}

      </div>

      <div className={styles.actions}>
        <button
          className={styles.buttonBet}
          onClick={placeBet}
          disabled={selectedSector === null || selectedBetAmount === null}
        >
            <div className={styles.buttonText}>
              <div className={styles.firstRow}>
                Поставить
              </div>
              <div className={styles.secondRow}>
                {selectedBetAmount && <div className={styles.ticketIcon}>
                  🎟️
                  <div className={styles.amount}>
                    &nbsp;{selectedBetAmount}
                  </div>
                </div>}
                { selectedSector !== null &&
                  <div>
                    &nbsp;{"→"}&nbsp;сектор {selectedSector}
                  </div>
                }
              </div>
            </div>
        </button>

        <button className={styles.buttonSpin} onClick={spin} disabled={spinning || !bets.length}>
          {spinning ? "Крутится..." : "Крутить"}
        </button>
      </div>
    </div>
  );
};
