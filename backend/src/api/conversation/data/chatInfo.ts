export type Emotion = {
    name: string;
    probability: number;
}

export type ChatInfo = {
    message: string;
    emotions: Emotion[];
    age : number;
    gender : string; 
}

