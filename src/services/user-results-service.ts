import { v4 as uuidv4 } from "uuid";
import { userResult } from "./types";

const UserResultsService = {
  saveUserResults(results: userResult[]) {
    localStorage.setItem("userResults", JSON.stringify(results));
  },
  getUserResults() {
    const results = localStorage.getItem("userResults");
    return results ? JSON.parse(results) : [];
  }
};


export function addUserResult(newResult: Omit<userResult, "id">): userResult {
  const currentResults = UserResultsService.getUserResults();

  const resultWithId = {
    ...newResult,
    id: uuidv4()
  };

  const updatedResults = [...currentResults, resultWithId];
  UserResultsService.saveUserResults(updatedResults);
  
  return resultWithId;
}


export function getUserResults(): userResult[] {
  return UserResultsService.getUserResults();
}


export function updateUserResult(id: string, updatedData: Partial<Omit<userResult, "id">>): userResult | null {
  const currentResults = UserResultsService.getUserResults();
  
  const resultIndex = currentResults.findIndex((result: userResult) => result.id === id);
  
  if (resultIndex === -1) {
    return null;
  }
  
  const updatedResult = {
    ...currentResults[resultIndex],
    ...updatedData
  };
  
  currentResults[resultIndex] = updatedResult;
  UserResultsService.saveUserResults(currentResults);
  
  return updatedResult;
}

export function getUserResultById(id: string): userResult | null {
  const currentResults = UserResultsService.getUserResults();
  return currentResults.find((result: userResult) => result.id === id) || null;
}


export function removeUserResult(id: string): boolean {
  const currentResults = UserResultsService.getUserResults();
  
  const resultIndex = currentResults.findIndex((result: userResult) => result.id === id);
  
  if (resultIndex === -1) {
    return false;
  }
  
  currentResults.splice(resultIndex, 1);
  UserResultsService.saveUserResults(currentResults);
  
  return true;
} 