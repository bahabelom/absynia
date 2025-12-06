export interface AskAiDto {
  text: string;
  language?: string;
}

export interface AskAiResponseDto {
  inputText: string;
  aiReply: string;
}

