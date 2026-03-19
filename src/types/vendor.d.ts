declare module 'vader-sentiment' {
  export class SentimentIntensityAnalyzer {
    polarity_scores(text: string): {
      pos: number
      neg: number
      neu: number
      compound: number // -1 to 1
    }
  }
}

declare module 'wink-sentiment' {
  interface WinkResult {
    score: number
    normalizedScore: number
    tokenizedPhrase: { value: string; tag: string; score?: number }[]
  }
  function winkSentiment(text: string): WinkResult
  export = winkSentiment
}
