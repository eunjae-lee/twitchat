import { getContext } from 'svelte';

type Lang = 'ko' | 'en';
type Dictionary<TKey extends string> = {
	ko: Record<TKey, string>;
	en: Record<TKey, string>;
};

const getText = <TKey extends string>(dictionary: Dictionary<TKey>, key: TKey) => {
	const lang = getContext('lang') as Lang;
	return dictionary[lang][key];
};

const getter = <TKey extends string>(dictionary: Dictionary<TKey>) => {
	return (key: TKey) => getText(dictionary, key);
};

const merge = <TKey1 extends string, TKey2 extends string>(
	dic1: Dictionary<TKey1>,
	dic2: Dictionary<TKey2>
) => {
	return {
		en: {
			...dic1.en,
			...dic2.en,
		},
		ko: {
			...dic1.ko,
			...dic2.ko,
		},
	};
};

export { getter, merge };
