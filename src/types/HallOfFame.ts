export type PinLevel =
  | "Presidential Executive"
  | "Diamond Executive"
  | "Emerald Executive"
  | "Pearl Executive"
  | "Team Elite"
  | "Team Director"
  | "Team Manager"
  | "Team Leader"
  | "Silver"
  | "Gold";

export interface HallOfFameMember {
  id: string;
  name: string;
  photo: string;
  pinLevel: PinLevel;
  pinImage: string;
  country: string;
  recognition?: string;
}

export const pinLevelOrder: PinLevel[] = [
  "Presidential Executive",
  "Diamond Executive",
  "Emerald Executive",
  "Pearl Executive",
  "Team Elite",
  "Team Director",
  "Team Manager",
  "Team Leader",
  "Silver",
  "Gold"
];