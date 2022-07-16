export const formatTimeElapsed = (seconds: number) => {

    let minutes:number = 0;

    if(seconds >= 60){
        minutes = 0;
        while(seconds > 60){
            minutes = minutes + 1;
            seconds = seconds -61;
        }
    }

    let secString = `${seconds < 10 ? '0'+seconds : seconds }`;
    let minString = `${minutes < 10 ? '0'+minutes : minutes }`;
    return `${minString}:${secString}`;
}