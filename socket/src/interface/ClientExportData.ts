export default interface ClientExportData {
    token: string;
    name: string;
    character: string;
    position: {
        x: number;
        y: number;
    };
    vector: {
        x: number;
        y: number;
    };
    score: number;
};