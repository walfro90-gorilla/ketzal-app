import { supabase } from "@/lib/supabaseClient";

export async function fetchStatesCitiesData() {
  const { data, error } = await supabase
    .from("global_locations")
    .select("state, city")
    .eq("country", "Mexico");

  if (error) {
    // Fallback temporal: datos mock
    return {
      "CDMX": ["Ciudad de México"],
      "Jalisco": ["Guadalajara", "Puerto Vallarta"],
      "Nuevo León": ["Monterrey"],
      "Yucatán": ["Mérida"],
      "Puebla": ["Puebla"],
    };
  }

  // Transformar a formato { [state]: [ciudades] }
  const result: Record<string, string[]> = {};
  data?.forEach(({ state, city }) => {
    if (!result[state]) result[state] = [];
    if (!result[state].includes(city)) result[state].push(city);
  });
  return result;
}
