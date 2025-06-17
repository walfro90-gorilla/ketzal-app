export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface GlobalLocation {
  id: number;
  country: string;
  state: string;
  city: string;
}

// CREATE global location
export async function createGlobalLocation(locationData: Omit<GlobalLocation, 'id'>) {
  const res = await fetch(`${BACKEND_URL}/api/global_locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locationData),
  });
  return await res.json();
}

// READ all global locations
export async function getGlobalLocations(): Promise<GlobalLocation[]> {
  const res = await fetch(`${BACKEND_URL}/api/global_locations`);
  return await res.json();
}

// READ one global location
export async function getGlobalLocation(id: number): Promise<GlobalLocation> {
  const res = await fetch(`${BACKEND_URL}/api/global_locations/${id}`);
  return await res.json();
}

// UPDATE global location
export async function updateGlobalLocation(id: number, locationData: Partial<Omit<GlobalLocation, 'id'>>) {
  const res = await fetch(`${BACKEND_URL}/api/global_locations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locationData),
  });
  return await res.json();
}

// DELETE global location
export async function deleteGlobalLocation(id: number) {
  const res = await fetch(`${BACKEND_URL}/api/global_locations/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}
