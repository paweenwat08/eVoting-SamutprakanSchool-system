import { PartiesList } from "../data/parties";

export function getParties() {
  return PartiesList;
}

export function getPartyById(id: number) {
  return PartiesList.find(p => p.id === id);
}