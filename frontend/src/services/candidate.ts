import { CandidatesList } from "../data/candidates";

export function getCandidates() {
    return CandidatesList;
}

export function getCandidateById(id: number) {
    return CandidatesList.find(c => c.id === id);
}

export function getCandidatesByDistrict(district: number) {
    return CandidatesList.filter(c => c.district === district);
}

export function getCandidatesByParty(partyId: number) {
    return CandidatesList.filter(c => c.partyId === partyId);
}

export function getDistricts() {
  return [...new Set(CandidatesList.map(c => c.district))];
}