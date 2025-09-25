import React, {useState} from 'react';

import classes from './PageLuckyWheel.module.css';
import {LuckyWheel} from "../../components/LuckyWheel/LuckyWheel.tsx";

export type BetType = {
  sector: number
  amount: number
};

export const SINGLE_NUMBER_PAYOUT = 16; // коэффициент выплаты за ставку на одно число

const PageLuckyWheel: React.FC = () => {

  const [bets, setBets] = useState<BetType[]>([]);
  const [targetSector, setTargetSector] = useState<number | undefined>();

  const onSpinClick = () => {
    setTimeout(()=>{
      setTargetSector(3);
    }, 2000)
  }

  const onSpinEnd = () => {
    setTargetSector(undefined)
  }

  return (
    <div className={classes.container}>
      < LuckyWheel bets={bets} setBets={setBets} targetSector={targetSector} onSpinClick={onSpinClick}  onSpinEnd={onSpinEnd}/>
    </div>
  )
};

export default PageLuckyWheel;