import type { CactusStudyData } from '$lib/interfaces';
import type { Map } from 'maplibre-gl';
import { writable } from 'svelte/store';

// map store for maplibre-gl object
export const map = writable<Map>(undefined);

// the data from CACTUS API
export const cactusStudyData = writable<CactusStudyData[]>(undefined);
