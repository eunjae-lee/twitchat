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

export { getter };
