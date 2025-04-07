


const animateDrawCard = async (refs, index)=> {
    const cardEl = refs.get(`${index}--1--1`);
    if (cardEl) {
        console.log("animate cards 2")
        cardEl.style.zIndex = 2;
        cardEl.style.transition = "transform 0.5s ease-in-out";
        cardEl.style.transform = "scale(1.2)";
        await new Promise(resolve => {
            cardEl.addEventListener('transitionend', resolve, { once: true });
        });
        //cardEl.style.zIndex = 1;
        cardEl.style.transition = "transform";
    }
}





/**
 * 
 * @param {*} refs - a map of refernces to game components - allowing us to access them and manipulate them 
 * @param {*} pileCard - card object for the pile that the user selected
 * @param {*} discardedCard - card object for the card the user is discarding
 * (the discarded card can either be from the pile (index 0 / 1) or from the hand, hence cannot use provided playerIndex) 
 * @param {*} angle 
 * @param {*} trigger 
 * @param {*} triggerVar 
 */
const animateDiscardCard = async (refs, pileCard, discardedCard, angle, radius, trigger, triggerVar) =>{
    console.log("ekfjgrbugjklm: ", pileCard.player)
    const pileCardEl = refs.get(`${pileCard.player}-${pileCard.row}-${pileCard.col}`);
    const discardedCardEl = refs.get(`${discardedCard.player}-${discardedCard.row}-${discardedCard.col}`);
    if (pileCardEl && discardedCardEl) {
        pileCardEl.style.transition = "transform 0.5s ease-in-out"
        const card1X = pileCardEl.getBoundingClientRect().x + pileCardEl.getBoundingClientRect().width/2
        const card1Y = pileCardEl.getBoundingClientRect().y + pileCardEl.getBoundingClientRect().height/2
        
        const discardPileCard = refs.get(`1--1--1`)
        const discardPileCardX = discardPileCard.getBoundingClientRect().x + discardPileCard.getBoundingClientRect().width/2
        const discardPileCardY = discardPileCard.getBoundingClientRect().y + discardPileCard.getBoundingClientRect().height/2

        // if the newly drawn card is discarded
        if (pileCard.player === discardedCard.player){
            // if the user drew a card from the discard pile
            if (pileCard.player === 1){
                pileCardEl.style.transform = "scale(1)"
            }
            // if the user drew a card from the draw pile
            else{
                const discardDifferenceX =  card1X - discardPileCardX;
                const discardDifferenceY = card1Y - discardPileCardY;

                pileCardEl.style.zIndex = 2;
                pileCardEl.style.transform = `translate(${-discardDifferenceX/2}px, ${-discardDifferenceY}px)`
            }
            await new Promise(resolve => {
                pileCardEl.addEventListener('transitionend', resolve, { once: true });
            });
        }
        // if a card from the hand is discarded
        else{
            const card2X = discardedCardEl.getBoundingClientRect().x + discardedCardEl.getBoundingClientRect().width/2
            const card2Y = discardedCardEl.getBoundingClientRect().y + discardedCardEl.getBoundingClientRect().height/2
            const dx = card1X - card2X;
            const dy = card1Y - card2Y;
            const discardDifferenceX =  card2X - discardPileCardX;
            const discardDifferenceY = card2Y - discardPileCardY;
            const discardedCardElRadius = radius/520
            const pileCardElRadius = radius/375
            const scaleConverter = 1/1.4;
            discardedCard.card.visible = true;
            trigger(triggerVar+1);
            pileCardEl.style.transition = "transform 1s ease-in-out"
            discardedCardEl.style.transition = "transform 1s ease-in-out"
            discardedCardEl.style.transform = `rotate(${angle}deg) scale(${1/scaleConverter}) translate(${-discardDifferenceX*discardedCardElRadius}px, ${-discardDifferenceY*discardedCardElRadius}px)`
            pileCardEl.style.transform = `scale(${scaleConverter}) translate(${-dx*pileCardElRadius}px, ${-dy*pileCardElRadius}px) rotate(${-angle}deg)`
            await Promise.all([
                new Promise(resolve => {
                    discardedCardEl.addEventListener('transitionend', resolve, { once: true });
                }),
                 new Promise(resolve => {
                    pileCardEl.addEventListener('transitionend', resolve, { once: true });
                })
            ])
        }
        pileCard.card.visible = false;
        discardedCard.card.visible = false;
        await new Promise(resolve => setTimeout(resolve, 10));
        trigger(triggerVar+1)

        pileCardEl.style.transition= "transform"
        pileCardEl.style.transform = "";
        pileCardEl.style.zIndex = 1;
        discardedCardEl.style.transition = "transform"
        discardedCardEl.style.transform = "";
        discardedCardEl.zIndex = 1;
    }
}






const animateLookCard = async (refs, card, trigger, triggerVar, isLooking) =>{
    const cardEl = refs.get(`${card.player}-${card.row}-${card.col}`);
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






const animateSwapCard = async (refs, card1, card2, card1Angle, card2Angle, radius) => {
    const card1El = refs.get(`${card1.player}-${card1.row}-${card1.col}`);
    const card2El = refs.get(`${card2.player}-${card2.row}-${card2.col}`);
    if (card1El && card2El){
        const card1X = card1El.getBoundingClientRect().x + card1El.getBoundingClientRect().width
        const card1Y = card1El.getBoundingClientRect().y + card1El.getBoundingClientRect().height
        const card2X = card2El.getBoundingClientRect().x + card2El.getBoundingClientRect().width
        const card2Y = card2El.getBoundingClientRect().y + card2El.getBoundingClientRect().height
        const dX = card1X - card2X
        const dY = card1Y - card2Y
        const cardRadius = radius / 375
        let card1RadiusNeg = ``;
        let card2RadiusNeg = ``;
        card1El.style.transition = "transform 1s ease-in-out"
        card2El.style.transition = "transform 1s ease-in-out"
        
            card1El.style.transform = `
            ${card1Angle % 360 === 0 ? `` : `rotate(${card1Angle}deg)`} 
            translate(${card1RadiusNeg}${-dX*cardRadius}px, ${card1RadiusNeg}${-dY*cardRadius}px) 
            ${card2Angle % 360 === 0 ? `` : `rotate(${card2Angle}deg)`}`
            
            card2El.style.transform = `
            ${card2Angle % 360 === 0 ? `` : `rotate(${card2Angle}deg)`} 
            translate(${card2RadiusNeg}${dX*cardRadius}px, ${card2RadiusNeg}${dY*cardRadius}px) 
            ${card1Angle % 360 === 0 ? `` : `rotate(${card1Angle}deg)`}`
            await Promise.all([
                new Promise(resolve => {
                    card1El.addEventListener('transitionend', resolve, { once: true });
                }),
                new Promise(resolve => {
                    card2El.addEventListener('transitionend', resolve, { once: true });
                })
            ])   
            
            
            card1El.style.transition = "transform"
            card2El.style.transition = "transform"
            card1El.style.transform = ""
            card2El.style.transform = ""
    }
}






const animateFlipCardSuccess = async (refs, card, angle, radius, trigger, triggerVar) => {
    const cardEl = refs.get(`${card.player}-${card.row}-${card.col}`);
    const discardPileEl = refs.get(`1--1--1`);
    if (cardEl){
        card.card.visible = true;
        trigger(triggerVar+1)
        cardEl.style.transition = "transform 1s ease-in-out";
        const cardElX = cardEl.getBoundingClientRect().x + cardEl.getBoundingClientRect().width/2;
        const cardElY = cardEl.getBoundingClientRect().y + cardEl.getBoundingClientRect().height/2;
        const discardPileElX = discardPileEl.getBoundingClientRect().x + discardPileEl.getBoundingClientRect().width/2;
        const discardPileElY = discardPileEl.getBoundingClientRect().y + discardPileEl.getBoundingClientRect().height/2;
        const dX = cardElX - discardPileElX;
        const dY = cardElY - discardPileElY;
        const cardRadius = radius / 520;
        cardEl.style.transform = `rotate(${angle}deg) scale(1.4) translate(${-dX*cardRadius}px, ${-dY*cardRadius}px)`
        await new Promise(resolve => {
            cardEl.addEventListener('transitionend', resolve, { once: true });
        });
    }

}

const animateFlipCardFail = async (refs, givenCard, flippedCard,  angle, radius, trigger, triggerVar) => {
    const givenCardEl = refs.get(`${givenCard.player}-${givenCard.row}-${givenCard.col}`);
    const flippedCardEl = refs.get(`${flippedCard.player}-${flippedCard.row}-${flippedCard.col}`)
    const drawPileEl = refs.get(`0--1--1`)
    const scaleConverter = 1/1.4;
    if (givenCardEl && drawPileEl && flippedCardEl){
        flippedCard.card.visible = true;
        trigger(triggerVar+1)
        flippedCardEl.style.transition = "transform 1s ease-in-out";
        flippedCardEl.style.transform = "scale(1.2)"
        await new Promise(resolve => setTimeout(resolve, 1500));

        flippedCard.card.visible = false;
        trigger(triggerVar+1)
        flippedCardEl.style.transform = "scale(1)";
        await new Promise(resolve => {
            flippedCardEl.addEventListener('transitionend', resolve, { once: true });
        });
        flippedCardEl.style.transition = "transform";


        const givenCardElX = givenCardEl.getBoundingClientRect().x + givenCardEl.getBoundingClientRect().width/2;
        const givenCardElY = givenCardEl.getBoundingClientRect().y + givenCardEl.getBoundingClientRect().height/2;
        const drawPileElX = drawPileEl.getBoundingClientRect().x + drawPileEl.getBoundingClientRect().width/2;
        const drawPileElY = drawPileEl.getBoundingClientRect().y + drawPileEl.getBoundingClientRect().height/2;
        const dX = givenCardElX - drawPileElX
        const dY = givenCardElY - drawPileElY
        const cardRadius = radius / 375

        drawPileEl.style.transition = "transform 1s ease-in-out";
        drawPileEl.style.transform = 
                `scale(${scaleConverter}) 
                translate(${dX*cardRadius}px, ${dY*cardRadius}px) 
                ${angle % 360 === 0 ? "" : `rotate(${angle}deg)`}`;
        await new Promise(resolve => {
            drawPileEl.addEventListener('transitionend', resolve, { once: true });
        });        

        drawPileEl.style.transition = "transform";
        drawPileEl.style.transform = "";

    }
}






const animateGiveCard = async () => {

}






export {animateDrawCard, animateDiscardCard, animateLookCard, animateSwapCard, animateFlipCardSuccess, animateFlipCardFail, animateGiveCard}