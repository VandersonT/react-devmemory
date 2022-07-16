/*--------------------------IMPORTS------------------------*/
import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import RestartIcon from './svgs/restart.svg';
import { useEffect, useInsertionEffect, useState } from 'react';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatsTimeElapsed';
/*---------------------------------------------------------*/

const App = () => {

  /*--------------------------States------------------------*/
  const [ playing, setPlaying ] = useState<boolean>(false);
  const [ timeElapsed, setTimeElapsed ] = useState<number>(0);
  const [ moveCount, setMoveCount ] = useState<number>(0);
  const [ shownCount, setShownCount ] = useState<number>(0);
  const [ gridItems, setGridItems ] = useState<GridItemType[]>([]);
  /*---------------------------------------------------------*/


  /*-----------------------useEffects------------------------*/
  useEffect(() => resetAndCreateGrid(), []);

  useEffect(()=>{

    const timer = setInterval(()=>{
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);

    return () => clearInterval(timer);
  },[playing, timeElapsed]);

  /*Verify if opened are equal*/
  useEffect(()=>{
    if(shownCount === 2){
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2){

        //step 1: if both are equal, make every "shown" permanent
          let tmpGrid = [...gridItems];
        if(opened[0].item === opened[1].item){
          for(let i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        }else{//if they are not equal, close all "shown"
          setTimeout(()=>{
            for(let i in tmpGrid)
              tmpGrid[i].shown = false;
              setGridItems(tmpGrid);
              setShownCount(0);
          }, 300);
        }
        setMoveCount(moveCount => moveCount + 1)
      }
    }
  }, [shownCount, gridItems]);

  /*Verify if game is over*/
  useEffect(()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShown == true)){
      setPlaying(false);
      alert('PARABÉNS!!! Você finalizou o jogo com '+moveCount+' tentativas.');
    }
  }, [moveCount, gridItems]);

  /*---------------------------------------------------------*/



  /*------------------------Functions------------------------*/
  const resetAndCreateGrid = () => {
    //Step 1: Reset the game
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    /**Step 2: Create the grid**/
      //Steps 2.1: Create a empty grid
      let tmpGrid: GridItemType[] = [];
      for(let i = 0; i < (items.length * 2) ; i++)
        tmpGrid.push({item: null, shown: false, permanentShown: false});
      
      //Step 2.2 fill the grid
      for(let w = 0; w < 2; w++){
        for(let i = 0; i < items.length; i++){
          let pos = -1;
          while(pos < 0 || tmpGrid[pos].item !== null){
            pos = Math.floor(Math.random() * (items.length * 2));
          }
          tmpGrid[pos].item = i;
        }
      }

      //Step 2.3 include on state
      setGridItems(tmpGrid);

    /**Step 3: Start the game**/
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2){
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown == false && tmpGrid[index].shown === false){
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    }
  }
  /*---------------------------------------------------------*/

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink>
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label='Movimentos' value={moveCount.toString()} />
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
            <GridItem
              key={index}
              item={item}
              onClick={()=> handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App
