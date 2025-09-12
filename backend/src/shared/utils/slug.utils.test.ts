import { generateSlug, isValidSlug, generateUniqueSlug } from './slug.utils';

describe('Slug Utils', () => {
  describe('generateSlug', () => {
    it('should generate basic slugs from English text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Technology News')).toBe('technology-news');
      expect(generateSlug('AI and Machine Learning')).toBe('ai-and-machine-learning');
    });

    it('should handle Greek text with proper transliteration', () => {
      expect(generateSlug('Πολιτική')).toBe('politiki');
      expect(generateSlug('Τεχνολογία')).toBe('technologia');
      expect(generateSlug('Οικονομία')).toBe('oikonomia');
      expect(generateSlug('Περιβάλλον')).toBe('perivallon');
      expect(generateSlug('Υγεία')).toBe('ygeia');
    });

    it('should handle Greek text with accents and special characters', () => {
      expect(generateSlug('Η πυροσφαίρα στα Τέμπη')).toBe('i-pirosfaira-sta-tempi');
      expect(generateSlug('Τα νέα της ημέρας')).toBe('ta-nea-tis-imeras');
      expect(generateSlug('Ψηφιακή τεχνολογία')).toBe('psifiaki-technologia');
    });

    it('should handle mixed Greek and English text', () => {
      expect(generateSlug('AI στην Ελλάδα')).toBe('ai-stin-ellada');
      expect(generateSlug('ChatGPT και τεχνητή νοημοσύνη')).toBe('chatgpt-kai-techniti-noimosyri');
    });

    it('should remove special characters and normalize spacing', () => {
      expect(generateSlug('Hello@World!')).toBe('helloworld');
      expect(generateSlug('Test   Multiple    Spaces')).toBe('test-multiple-spaces');
      expect(generateSlug('  Leading and trailing spaces  ')).toBe('leading-and-trailing-spaces');
    });

    it('should handle edge cases', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug('   ')).toBe('');
      expect(generateSlug('---')).toBe('');
      expect(generateSlug('123')).toBe('123');
      expect(generateSlug('a')).toBe('a');
    });

    it('should handle special Greek combinations', () => {
      expect(generateSlug('θάλασσα')).toBe('thalassa');
      expect(generateSlug('χρυσός')).toBe('chrysos');
      expect(generateSlug('ψυχολογία')).toBe('psychologia');
    });
  });

  describe('isValidSlug', () => {
    it('should validate correct slugs', () => {
      expect(isValidSlug('hello-world')).toBe(true);
      expect(isValidSlug('technology-news')).toBe(true);
      expect(isValidSlug('politiki')).toBe(true);
      expect(isValidSlug('test123')).toBe(true);
      expect(isValidSlug('a')).toBe(true);
      expect(isValidSlug('123')).toBe(true);
      expect(isValidSlug('multi-word-slug')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(isValidSlug('')).toBe(false);
      expect(isValidSlug('Hello World')).toBe(false); // spaces not allowed
      expect(isValidSlug('UPPERCASE')).toBe(false); // uppercase not allowed
      expect(isValidSlug('special@chars')).toBe(false); // special chars not allowed
      expect(isValidSlug('-leading-dash')).toBe(false); // leading dash not allowed
      expect(isValidSlug('trailing-dash-')).toBe(false); // trailing dash not allowed
      expect(isValidSlug('under_score')).toBe(false); // underscore not allowed
      expect(isValidSlug('πολιτική')).toBe(false); // Greek chars should be transliterated first
    });

    it('should handle edge cases', () => {
      expect(isValidSlug('a-b-c-d-e-f-g')).toBe(true);
      expect(isValidSlug('very-long-slug-with-many-words-that-should-still-be-valid')).toBe(true);
      expect(isValidSlug('123-456-789')).toBe(true);
    });
  });

  describe('generateUniqueSlug', () => {
    it('should return the original slug if it does not exist', async () => {
      const checkExists = jest.fn().mockResolvedValue(false);
      const result = await generateUniqueSlug('Test Title', checkExists);
      
      expect(result).toBe('test-title');
      expect(checkExists).toHaveBeenCalledWith('test-title');
      expect(checkExists).toHaveBeenCalledTimes(1);
    });

    it('should append numbers if slug already exists', async () => {
      const checkExists = jest.fn()
        .mockResolvedValueOnce(true)  // 'test-title' exists
        .mockResolvedValueOnce(true)  // 'test-title-1' exists  
        .mockResolvedValueOnce(false); // 'test-title-2' does not exist
      
      const result = await generateUniqueSlug('Test Title', checkExists);
      
      expect(result).toBe('test-title-2');
      expect(checkExists).toHaveBeenCalledWith('test-title');
      expect(checkExists).toHaveBeenCalledWith('test-title-1');
      expect(checkExists).toHaveBeenCalledWith('test-title-2');
      expect(checkExists).toHaveBeenCalledTimes(3);
    });

    it('should work with Greek text', async () => {
      const checkExists = jest.fn()
        .mockResolvedValueOnce(true)  // 'politiki' exists
        .mockResolvedValueOnce(false); // 'politiki-1' does not exist
      
      const result = await generateUniqueSlug('Πολιτική', checkExists);
      
      expect(result).toBe('politiki-1');
      expect(checkExists).toHaveBeenCalledWith('politiki');
      expect(checkExists).toHaveBeenCalledWith('politiki-1');
      expect(checkExists).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple conflicts', async () => {
      const checkExists = jest.fn()
        .mockResolvedValueOnce(true)  // original exists
        .mockResolvedValueOnce(true)  // -1 exists
        .mockResolvedValueOnce(true)  // -2 exists
        .mockResolvedValueOnce(true)  // -3 exists
        .mockResolvedValueOnce(false); // -4 does not exist
      
      const result = await generateUniqueSlug('Popular Topic', checkExists);
      
      expect(result).toBe('popular-topic-4');
      expect(checkExists).toHaveBeenCalledTimes(5);
    });
  });

  describe('Greek transliteration accuracy', () => {
    it('should handle all Greek vowels correctly', () => {
      expect(generateSlug('Αα Εε Ηη Ιι Οο Υυ Ωω')).toBe('aa-ee-ii-ii-oo-yy-oo');
      expect(generateSlug('άέήίόύώ')).toBe('aeiioyo');
    });

    it('should handle Greek consonants correctly', () => {
      expect(generateSlug('Ββ Γγ Δδ Ζζ Θθ Κκ Λλ')).toBe('vv-gg-dd-zz-thth-kk-ll');
      expect(generateSlug('Μμ Νν Ξξ Ππ Ρρ Σσς Ττ')).toBe('mm-nn-xx-pp-rr-sss-tt');
      expect(generateSlug('Φφ Χχ Ψψ')).toBe('ff-chch-psps');
    });

    it('should handle Greek diphthongs and combinations', () => {
      expect(generateSlug('θεός')).toBe('theos');
      expect(generateSlug('χρόνος')).toBe('chronos');
      expect(generateSlug('ψυχή')).toBe('psychi');
      expect(generateSlug('φιλοσοφία')).toBe('filosofia');
    });

    it('should preserve word boundaries in Greek text', () => {
      expect(generateSlug('Καλημέρα κόσμος')).toBe('kalimera-kosmos');
      expect(generateSlug('Ελληνική γλώσσα')).toBe('elliniki-glossa');
    });
  });
});