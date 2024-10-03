export type OptionalLang =
  | 'zh'
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'ru' // Russian
  | 'ar' // Arabic
  | 'pt' // Portuguese
  | 'it' // Italian
  | 'nl' // Dutch
  | 'hi' // Hindi
  | 'sv' // Swedish
  | 'da' // Danish
  | 'no' // Norwegian
  | 'fi' // Finnish
  | 'pl' // Polish
  | 'tr' // Turkish
  | 'vi' // Vietnamese
  | 'th' // Thai
  | 'id' // Indonesian
  | 'ms' // Malay
  | 'he' // Hebrew
  | 'el' // Greek
  | 'cs' // Czech
  | 'hu' // Hungarian
  | 'ro' // Romanian
  | 'sk' // Slovak
  | 'bg' // Bulgarian
  | 'uk' // Ukrainian
  | 'sr' // Serbian
  | 'hr' // Croatian
  | 'lt' // Lithuanian
  | 'lv' // Latvian
  | 'et' // Estonian
  | 'sl' // Slovenian
  | 'mt' // Maltese
  | 'ga' // Irish
  | 'is' // Icelandic
  | 'fa' // Persian
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'ur' // Urdu
  | 'am' // Amharic
  | 'sw'; // Swahili

type PartialLang = Partial<Record<OptionalLang, string>>;

export type LangRecord = Record<'en', string> & PartialLang;

export type Bl = Record<string, Record<string, LangRecord>>;

export type BlMethod<L> = keyof L;
export type BlStack<L> = { method: BlMethod<L>; message: string }[];
export type Layer = 'controller' | 'service';

// The writing of M extends any here forces TypeScript to apply the conditional type individually to each member of the union type, thereby obtaining the keys of each service and union them
export type BlCode<L, M extends BlMethod<L>> = M extends any
  ? keyof L[M]
  : never;
export type ResponseProto<M extends BlMethod<L> | BlMethod<L>[], D, L> = {
  success: boolean;
  layer: string;
  code: M extends keyof L ? keyof L[M] : never;
  blStack: BlStack<L>;
  data?: D;
};
