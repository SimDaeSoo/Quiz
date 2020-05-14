export default interface Quiz {
    id: string;
    title: string;
    questions: Array<Question>;
}

interface Question {
    score: number;
    content: string;
    Answer: boolean;
    explain: string;
}