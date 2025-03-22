import { useState } from "react";





const animateDrawCard = async (refs, index, row, col)=> {
    console.log("refs", refs)
    const cardEl = refs.get(`${index}-${row}-${col}`);
    if (cardEl) {
        console.log("animate cards 2")
        cardEl.style.zIndex = 2;
        cardEl.style.transition = "transform 0.5s ease-in-out";
        cardEl.style.transform = "scale(1.2)";
        await new Promise(resolve => {
            cardEl.addEventListener('transitionend', resolve, { once: true });
        });
        cardEl.style.zIndex = 1;
    }
}






const animateDiscardCard = async (refs, pileCard, discardedCard, pileCardIndex, discardedCardIndex, angle) =>{
    const card1 = refs.get(`${pileCardIndex}-${pileCard.row}-${pileCard.col}`);
    const card2 = refs.get(`${discardedCardIndex}-${discardedCard.row}-${discardedCard.col}`);
    if (card1 && card2) {
        card1.style.transition = "transform 0.5s ease-in-out"
        const card1X = card1.getBoundingClientRect().x + card1.getBoundingClientRect().width/2
        const card1Y = card1.getBoundingClientRect().y + card1.getBoundingClientRect().height/2
        
        const discardPileCard = refs.get(`1--1--1`)
        const discardPileCardX = discardPileCard.getBoundingClientRect().x + discardPileCard.getBoundingClientRect().width/2
        const discardPileCardY = discardPileCard.getBoundingClientRect().y + discardPileCard.getBoundingClientRect().height/2

        // if the newly drawn card is discarded
        if (pileCardIndex === discardedCardIndex){
            // if the user drew a card from the discard pile
            if (pileCardIndex === 1){
                card1.style.transform = "scale(1)"
            }
            // if the user drew a card from the draw pile
            else{
                const discardDifferenceX =  card1X - discardPileCardX;
                const discardDifferenceY = card1Y - discardPileCardY;

                card1.style.zIndex = 2;
                card1.style.transform = `translate(${-discardDifferenceX/2}px, ${-discardDifferenceY}px)`
            }
        }
        else{
            const card2X = card2.getBoundingClientRect().x + card2.getBoundingClientRect().width/2
            const card2Y = card2.getBoundingClientRect().y + card2.getBoundingClientRect().height/2
            const dx = card1X - card2X;
            const dy = card1Y - card2Y;
            const discardDifferenceX =  card2X - discardPileCardX;
            const discardDifferenceY = card2Y - discardPileCardY;
            
            const scaleConverter = 1/1.4;
            card2.style.transition = "transform 0.5s ease-in-out"
            card2.style.transform = `rotate(${angle}deg) scale(${1/scaleConverter}) translate(${-discardDifferenceX/1.9}px, ${-discardDifferenceY/1.9}px)`
            await new Promise(resolve => {
                card2.addEventListener('transitionend', resolve, { once: true });
            });
            card1.style.transform = `scale(${scaleConverter}) translate(${-dx/1.35}px, ${-dy/1.35}px)`
        }
        await new Promise(resolve => {
            card1.addEventListener('transitionend', resolve, { once: true });
        });
        card1.style.transition= "transform"
        card2.style.transition = "transform"
        card1.style.transform = "";
        card2.style.transform = "";
        card1.style.zIndex = 1;
    }
}






const animateLookCard = async (refs, card, trigger, triggerVar, isLooking) =>{
    const cardEl = refs.get(`${card.player+2}-${card.row}-${card.col}`);
    if (cardEl) {
        // if its the current users turn, make the card visible
        if (isLooking){
            card.card.visible = true;
            trigger(triggerVar+1)
        }
        // move the card to the front and animate it getting bigger
        // signals to players what card is being looked at
        cardEl.style.zIndex = 2;
        cardEl.style.transition = "transform 0.5s ease-in-out";
        cardEl.style.transform = "scale(1.2)";

        // wait 1.5 seconds so the player can view the card
        await new Promise(resolve => setTimeout(resolve, 1500));
        // return the card to its pre-animated state
        cardEl.style.transform = "scale(1)"
        // if it is the current users turn, turn the card back to not visible
        await new Promise(resolve => {
            cardEl.addEventListener('transitionend', resolve, { once: true });
        });
        if (isLooking){
            card.card.visible = false;
            trigger(triggerVar+1)
        }
        cardEl.style.zIndex = 1;
    }
}






const animateSwapCard = () => {

}






const animateFlipCard = () => {

}






export {animateDrawCard, animateDiscardCard, animateLookCard, animateSwapCard, animateFlipCard}