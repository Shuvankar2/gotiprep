export interface TypingPassage {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'tech' | 'nature' | 'history' | 'science' | 'banking';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const typingPassages: TypingPassage[] = [
  {
    id: 't1',
    title: 'The Art of Typing',
    category: 'general',
    difficulty: 'easy',
    content: `Typing is a fundamental skill in the modern world. Every day, millions of people use keyboards to communicate, create, and connect with others. Whether you are writing an email, composing a document, or chatting with friends, typing speed and accuracy can make a significant difference in your productivity. With regular practice, anyone can improve their words per minute count and reduce errors. The key is consistency and patience. Begin with proper finger placement on the home row keys and gradually build speed without sacrificing accuracy.`
  },
  {
    id: 't2',
    title: 'Rivers of India',
    category: 'nature',
    difficulty: 'easy',
    content: `India is blessed with a vast network of rivers that have nurtured civilizations for thousands of years. The Ganges, considered sacred by millions of Hindus, flows from the Himalayas through the fertile plains of northern India before emptying into the Bay of Bengal. The Brahmaputra, one of the major rivers of Asia, traverses through China, India, and Bangladesh. The Godavari and Krishna rivers support agriculture across the Deccan plateau, while the Cauvery brings life to the southern states of Tamil Nadu and Karnataka. These rivers are not merely water bodies but lifelines that sustain ecosystems, agriculture, and human settlements across the subcontinent.`
  },
  {
    id: 't3',
    title: 'The Indian IT Industry',
    category: 'tech',
    difficulty: 'medium',
    content: `India has emerged as one of the world's foremost information technology powerhouses. Cities like Bengaluru, Hyderabad, Pune, and Chennai are home to thousands of technology companies ranging from global giants to innovative startups. The Indian IT sector employs millions of skilled professionals and contributes significantly to the country's gross domestic product and foreign exchange earnings. Companies like Infosys, Wipro, Tata Consultancy Services, and HCL Technologies are recognized internationally for delivering high quality software services and solutions. The growth of the IT industry has also fueled the development of supporting ecosystems including venture capital funding, co-working spaces, and world-class educational institutions focused on computer science and engineering.`
  },
  {
    id: 't4',
    title: 'The Mughal Empire',
    category: 'history',
    difficulty: 'medium',
    content: `The Mughal Empire, which flourished in the Indian subcontinent from the early sixteenth century to the mid-nineteenth century, stands as one of the most magnificent and influential empires in world history. Founded by Babur after his victory at the First Battle of Panipat in 1526, the empire reached its zenith under the reign of Emperor Akbar, who was renowned for his religious tolerance, administrative genius, and patronage of the arts. The Mughals left an indelible mark on Indian culture through their distinctive architecture, as exemplified by the iconic Taj Mahal built by Emperor Shah Jahan, their rich culinary traditions, and their synthesis of Persian and Indian artistic styles that gave rise to a unique and enduring cultural heritage.`
  },
  {
    id: 't5',
    title: 'Quantum Computing Fundamentals',
    category: 'science',
    difficulty: 'hard',
    content: `Quantum computing represents a fundamentally different paradigm for information processing, exploiting the principles of quantum mechanics to perform computations that would be intractable for classical computers. Unlike classical bits, which exist in either a zero or one state, quantum bits or qubits can exist in superpositions of both states simultaneously, enabling quantum computers to explore vast solution spaces in parallel. Entanglement, another quantum phenomenon, allows qubits to be correlated in ways that have no classical analogue, enabling powerful algorithms for problems such as integer factorization, optimization, and simulation of molecular and chemical systems. While practical large-scale quantum computers remain a significant engineering challenge, progress is accelerating rapidly, with potential implications for cryptography, drug discovery, materials science, and financial modelling.`
  },
  {
    id: 't6',
    title: 'Workplace Communication',
    category: 'general',
    difficulty: 'easy',
    content: `Effective communication is the cornerstone of a productive and harmonious workplace. Clear and concise communication helps teams align on goals, resolve conflicts, and build stronger working relationships. Whether through written messages, verbal discussions, or formal presentations, the ability to convey ideas with clarity and empathy is a skill that professionals at all levels must cultivate. Active listening, which involves paying full attention to the speaker and responding thoughtfully, is equally important as the ability to articulate one's own thoughts. Organizations that prioritize open and transparent communication tend to enjoy higher employee engagement, lower turnover rates, and greater overall performance.`
  },
  {
    id: 't7',
    title: 'IBPS Bank Clerk Examination',
    category: 'banking',
    difficulty: 'easy',
    content: `The Institute of Banking Personnel Selection, commonly known as IBPS, conducts recruitment examinations for clerical cadre and probationary officer posts in various public sector banks across India. The preliminary examination tests candidates on English language, numerical ability, and reasoning ability. Candidates who qualify the preliminary examination are called for the main examination which includes additional sections on general awareness and computer aptitude. The final selection is based on the combined marks obtained in the main examination and the provisional allotment is done according to the merit list, category, and vacancies available in each participating bank.`
  },
  {
    id: 't8',
    title: 'Reserve Bank of India and Monetary Policy',
    category: 'banking',
    difficulty: 'medium',
    content: `The Reserve Bank of India, established in 1935 under the Reserve Bank of India Act, serves as the central banking institution of the country and plays a pivotal role in maintaining financial stability and controlling inflation. The Monetary Policy Committee, constituted in 2016, is responsible for fixing the benchmark policy interest rate known as the repo rate, which is used to control liquidity and inflation in the economy. The repo rate, reverse repo rate, cash reserve ratio, and statutory liquidity ratio are among the key instruments that the Reserve Bank employs to regulate the money supply and credit flow in the banking system. Changes in these rates have a direct impact on the lending rates offered by commercial banks to their borrowers, thereby influencing consumer spending, investment, and overall economic growth.`
  },
  {
    id: 't9',
    title: 'SSC Alphanumeric Typing Challenge',
    category: 'banking',
    difficulty: 'hard',
    content: `The Staff Selection Commission conducts the Combined Graduate Level Examination, commonly referred to as SSC CGL, for recruitment to Group B and Group C posts in various central government ministries and departments. Applicants must secure a minimum of 45 words per minute in English or 35 words per minute in Hindi on a computer keyboard to qualify for posts requiring data entry or typing proficiency. The typing skill test is qualifying in nature and candidates are evaluated on net speed after deducting penalty for uncorrected errors at the rate of 10 words per full error. Account numbers such as IN98765432100, transaction codes like TXN2024IBPS001, and reference IDs such as REF20240789SSC are commonly encountered in government data entry roles requiring accurate and fast keyboard input.`
  }
];
