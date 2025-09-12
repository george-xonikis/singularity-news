/**
 * Greek to Latin transliteration map for URL-friendly slugs
 */
const GREEK_TO_LATIN_MAP: Record<string, string> = {
  'α': 'a', 'ά': 'a', 'Α': 'a', 'Ά': 'a',
  'β': 'v', 'Β': 'v',
  'γ': 'g', 'Γ': 'g',
  'δ': 'd', 'Δ': 'd',
  'ε': 'e', 'έ': 'e', 'Ε': 'e', 'Έ': 'e',
  'ζ': 'z', 'Ζ': 'z',
  'η': 'i', 'ή': 'i', 'Η': 'i', 'Ή': 'i',
  'θ': 'th', 'Θ': 'th',
  'ι': 'i', 'ί': 'i', 'ϊ': 'i', 'ΐ': 'i', 'Ι': 'i', 'Ί': 'i', 'Ϊ': 'i',
  'κ': 'k', 'Κ': 'k',
  'λ': 'l', 'Λ': 'l',
  'μ': 'm', 'Μ': 'm',
  'ν': 'n', 'Ν': 'n',
  'ξ': 'x', 'Ξ': 'x',
  'ο': 'o', 'ό': 'o', 'Ο': 'o', 'Ό': 'o',
  'π': 'p', 'Π': 'p',
  'ρ': 'r', 'Ρ': 'r',
  'σ': 's', 'ς': 's', 'Σ': 's',
  'τ': 't', 'Τ': 't',
  'υ': 'y', 'ύ': 'y', 'ϋ': 'y', 'ΰ': 'y', 'Υ': 'y', 'Ύ': 'y', 'Ϋ': 'y',
  'φ': 'f', 'Φ': 'f',
  'χ': 'ch', 'Χ': 'ch',
  'ψ': 'ps', 'Ψ': 'ps',
  'ω': 'o', 'ώ': 'o', 'Ω': 'o', 'Ώ': 'o'
};

/**
 * Transliterate Greek text to Latin characters
 */
function transliterateGreek(text: string): string {
  return text.replace(/[α-ωΑ-ΩάέήίόύώΐΰϊϋΆΈΉΊΌΎΏΪΫ]/g, (match) => {
    return GREEK_TO_LATIN_MAP[match] || match;
  });
}

/**
 * Generate a URL-friendly slug from a string with Greek language support
 */
export function generateSlug(text: string): string {
  return transliterateGreek(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters (now safe after transliteration)
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')          // Trim hyphens from start
    .replace(/-+$/, '');         // Trim hyphens from end
}

/**
 * Validate if a string is a valid slug (Latin characters, numbers, hyphens only)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && !slug.startsWith('-') && !slug.endsWith('-');
}

/**
 * Generate slug with uniqueness check function
 */
export async function generateUniqueSlug(
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(text);
  let finalSlug = baseSlug;
  let counter = 1;

  while (await checkExists(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}