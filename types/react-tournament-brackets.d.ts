// types/react-tournament-brackets.d.ts
declare module "@g-loot/react-tournament-brackets" {
  import * as React from "react";

  export interface Participant {
    id: string;
    name: string;
    score?: number;
  }

  export interface Match {
    id: string;
    participants: Participant[];
    state?: "SCORE_DONE" | "SCORE_PENDING" | string;
  }

  export interface SingleEliminationBracketProps {
    matches: Match[];
    matchComponent?: React.ComponentType<{ match: Match }>;
  }

  export class SingleEliminationBracket extends React.Component<SingleEliminationBracketProps> {}
  export class Match extends React.Component<{ match: Match }> {}
  export class SVGViewer extends React.Component<{ width: number; height: number; children: React.ReactNode }> {}
}
