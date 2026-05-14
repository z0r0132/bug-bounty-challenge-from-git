import { STORAGE_KEYS } from "./constants";

export interface MockOrganization {
  name: string;
}

export const DEFAULT_ORGANIZATION: MockOrganization = {
  name: "Demo Organization"
};

export function readStoredOrganization(): MockOrganization {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.organization);
    if (!raw) return { ...DEFAULT_ORGANIZATION };
    const parsed = JSON.parse(raw) as MockOrganization;
    if (!parsed?.name?.trim()) return { ...DEFAULT_ORGANIZATION };
    return { name: parsed.name.trim() };
  } catch {
    return { ...DEFAULT_ORGANIZATION };
  }
}

export function writeStoredOrganization(org: MockOrganization): void {
  localStorage.setItem(STORAGE_KEYS.organization, JSON.stringify(org));
}
