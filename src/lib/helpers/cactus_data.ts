import type { CactusData, CactusStudyData } from '$lib/interfaces';
import { config } from '../../config';

export const getCactusStudyData = async () => {
	const res = await fetch(config.cactus_api);
	const json: CactusData = await res.json();
	const study_data: CactusStudyData[] = json.study_data;
	return study_data;
};
