export interface SentenceItem {
  id: string;
  sentence: string;
  blank: string; // the word removed
  hint: string;
  options?: string[];
  category: 'grammar' | 'vocabulary' | 'idioms' | 'banking' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export const sentenceItems: SentenceItem[] = [
  { id: 's1', sentence: 'The committee decided to _____ the meeting until next week.', blank: 'postpone', hint: 'To delay or reschedule', category: 'vocabulary', difficulty: 'easy', explanation: '"Postpone" means to arrange for something to take place at a later time.' },
  { id: 's2', sentence: 'She has a _____ for solving complex mathematical problems.', blank: 'knack', hint: 'A natural ability or skill', category: 'vocabulary', difficulty: 'medium', explanation: '"Knack" means a special skill or talent for doing something.' },
  { id: 's3', sentence: 'The bank offered a _____ interest rate on fixed deposits.', blank: 'lucrative', hint: 'Producing a great deal of profit', category: 'banking', difficulty: 'medium', explanation: '"Lucrative" means producing a significant amount of profit or income.' },
  { id: 's4', sentence: 'The project was _____ due to lack of funding from the government.', blank: 'abandoned', hint: 'To give up or discontinue', category: 'grammar', difficulty: 'easy', explanation: '"Abandoned" means deserted or given up completely.' },
  { id: 's5', sentence: 'He decided to _____ the terms of the contract before signing.', blank: 'scrutinize', hint: 'To examine very carefully', category: 'vocabulary', difficulty: 'hard', explanation: '"Scrutinize" means to examine or inspect closely and thoroughly.' },
  { id: 's6', sentence: 'The inflation rate has been _____ over the past six months.', blank: 'fluctuating', hint: 'Rising and falling irregularly', category: 'banking', difficulty: 'medium', explanation: '"Fluctuating" means rising and falling irregularly in number or amount.' },
  { id: 's7', sentence: 'The CEO gave an _____ speech that inspired all the employees.', blank: 'eloquent', hint: 'Fluent and persuasive in speaking', category: 'vocabulary', difficulty: 'hard', explanation: '"Eloquent" means fluent or persuasive in speaking or writing.' },
  { id: 's8', sentence: 'She had to _____ between two attractive job offers.', blank: 'choose', hint: 'To pick or select', category: 'grammar', difficulty: 'easy', explanation: '"Choose" means to pick out or select as being the best or most appropriate.' },
  { id: 's9', sentence: 'The new policy aims to _____ corruption in public institutions.', blank: 'eradicate', hint: 'To completely destroy or eliminate', category: 'general', difficulty: 'hard', explanation: '"Eradicate" means to destroy completely; put an end to.' },
  { id: 's10', sentence: 'The manager decided to _____ the deadline by one week.', blank: 'extend', hint: 'To make longer or greater', category: 'grammar', difficulty: 'easy', explanation: '"Extend" means to make something longer or larger.' },
  { id: 's11', sentence: 'It was raining cats and _____; we could barely see the road.', blank: 'dogs', hint: 'Part of a common idiom for heavy rain', category: 'idioms', difficulty: 'easy', explanation: '"Raining cats and dogs" is an idiom meaning raining very heavily.' },
  { id: 's12', sentence: 'The company\'s _____ assets were valued at ten crore rupees.', blank: 'tangible', hint: 'Real, physical, or concrete', category: 'banking', difficulty: 'hard', explanation: '"Tangible" assets are physical assets like buildings, machinery, and equipment.' },
  { id: 's13', sentence: 'She took the _____ by the horns and confronted the problem directly.', blank: 'bull', hint: 'Part of an idiom meaning to tackle a problem directly', category: 'idioms', difficulty: 'medium', explanation: '"Take the bull by the horns" means to tackle a difficult situation directly.' },
  { id: 's14', sentence: 'The bank decided to _____ the loan application of the startup.', blank: 'approve', hint: 'To officially agree or accept', category: 'banking', difficulty: 'easy', explanation: '"Approve" means to officially agree to or accept something.' },
  { id: 's15', sentence: 'His _____ behavior in the meeting left everyone impressed.', blank: 'impeccable', hint: 'In accordance with the highest standards', category: 'vocabulary', difficulty: 'hard', explanation: '"Impeccable" means in accordance with the highest standards; faultless.' },
  { id: 's16', sentence: 'The government plans to _____ the infrastructure in rural areas.', blank: 'revamp', hint: 'To renovate or improve', category: 'general', difficulty: 'medium', explanation: '"Revamp" means to give new and improved form, structure, or appearance to.' },
  { id: 's17', sentence: 'Every cloud has a silver _____; there is opportunity even in difficulty.', blank: 'lining', hint: 'Part of a common optimistic idiom', category: 'idioms', difficulty: 'easy', explanation: '"Every cloud has a silver lining" means every negative situation has a positive aspect.' },
  { id: 's18', sentence: 'The financial report revealed a significant _____ in revenue this quarter.', blank: 'decline', hint: 'A gradual decrease', category: 'banking', difficulty: 'medium', explanation: '"Decline" refers to a gradual and continuous loss of strength, numbers, or quality.' },
  { id: 's19', sentence: 'She was known for her _____ attention to even the smallest details.', blank: 'meticulous', hint: 'Showing great attention to detail', category: 'vocabulary', difficulty: 'hard', explanation: '"Meticulous" means showing great attention to detail or being very careful and precise.' },
  { id: 's20', sentence: 'The new startup was able to _____ a significant amount of funding.', blank: 'secure', hint: 'To obtain or protect', category: 'general', difficulty: 'medium', explanation: '"Secure" in this context means to successfully obtain something.' }
];
